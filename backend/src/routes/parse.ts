import { Router } from "express";
import multer from "multer";

import { ParserFactory } from "../parsers/parser.factory.js";
import { NormalizerService } from "../services/normalizer.service.js";
import { CacheService } from "../services/cache/cache.service.js";
import { FingerprintService } from "../services/cache/fingerprint.service.js";
import { AIService } from "../services/ai/ai.service.js";
import { MappingService } from "../services/mapping.service.js";

const router = Router();

const normalizerService = new NormalizerService();
const cacheService = new CacheService();
const fingerprintService = new FingerprintService();
const aiService = new AIService();
const mappingService = new MappingService();

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

    let mapping = await cacheService.get(key);

    let cacheHit = true;

    if (!mapping) {
      console.log("No mapping found");
      cacheHit = false;

      mapping = await aiService.inferMapping(
        headers,
        normalizedRows.slice(0, 5),
      );

      await cacheService.set(key, mapping);
    }

    const crmRows = mappingService.apply(normalizedRows, mapping!);

    return res.json({
      success: true,
      mapping,
      rows: crmRows,
      cacheHit: !!mapping,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
