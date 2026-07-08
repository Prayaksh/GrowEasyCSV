import { Router } from "express";
import multer from "multer";

import { ParserFactory } from "../parsers/parser.factory.js";
import { NormalizerService } from "../services/normalizer.service.js";
import { CacheService } from "../services/cache/cache.service.js";
import { FingerprintService } from "../services/cache/fingerprint.service.js";
import { AIService } from "../services/ai/ai.service.js";
import { MappingService } from "../services/mapping.service.js";
import { CRMValidator } from "../services/validator.service.js";
import { CRMRecordNormalizer } from "../normalizers/crm.normalizer.js";

const router = Router();

const normalizerService = new NormalizerService();
const cacheService = new CacheService();
const fingerprintService = new FingerprintService();
const aiService = new AIService();
const mappingService = new MappingService();
const validator = new CRMValidator();
const crmNomalizer = new CRMRecordNormalizer();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded.",
    });
  }

  try {
    const parser = ParserFactory.create(req.file.originalname);

    const rows = await parser.parse(req.file.buffer);
    const normalizedRows = normalizerService.normalize(rows);

    if (normalizedRows.length === 0) {
      console.log("Failed during normalization");
      return res.status(400).json({
        success: false,
        message: "No rows found.",
      });
    }

    const headers = Object.keys(normalizedRows[0]);
    const key = fingerprintService.generate(headers);

    console.log("GET:", key);
    let mapping = await cacheService.get(key);

    let cacheHit = true;

    if (!mapping) {
      console.log("No mapping found");
      cacheHit = false;

      mapping = await aiService.inferMapping(
        headers,
        normalizedRows.slice(0, 5),
      );

      console.log("AI returned:", mapping);
      console.log("Keys:", Object.keys(mapping));

      console.log("SET:", key);
      await cacheService.set(key, mapping);
    }

    const crmRows = mappingService.apply(normalizedRows, mapping!);

    const normalizedCRMRows = crmNomalizer.normalize(crmRows);

    const validRows = normalizedCRMRows.filter((row) => validator.isValid(row));

    return res.json({
      success: true,
      mapping,
      rows: validRows,
      cacheHit: cacheHit,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
