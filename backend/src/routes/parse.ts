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
import { HeaderMatcher } from "../services/matcher.service.js";
import { HeaderLookup } from "../utils/header.lookup.js";

const router = Router();

const normalizerService = new NormalizerService();
const cacheService = new CacheService();
const fingerprintService = new FingerprintService();
const aiService = new AIService();
const mappingService = new MappingService();
const validator = new CRMValidator();
const crmNomalizer = new CRMRecordNormalizer();
const headerLookup = new HeaderLookup();
const headerMatcher = new HeaderMatcher(headerLookup);

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
    console.log("Raw rows: ", rows);
    const normalizedRows = normalizerService.normalize(rows);
    console.log("Normalized Rows: ", normalizedRows);

    if (normalizedRows.length === 0) {
      console.log("Failed during normalization");
      return res.status(400).json({
        success: false,
        message: "No rows found.",
      });
    }

    const headers = Object.keys(normalizedRows[0]);
    console.log("headers: ", headers);

    const { mapping: directMapping, unmatched } = headerMatcher.match(headers);
    console.log("Mapping: ", directMapping);
    console.log("Unmatched:", unmatched);

    let aiMapping: Record<string, string> = {};
    let cacheHit = false;

    if (unmatched.length > 0) {
      const key = fingerprintService.generate(unmatched);

      console.log("GET:", key);

      const cached = await cacheService.get(key);

      console.log("Cached: ", cached);

      if (cached) {
        aiMapping = cached;
        cacheHit = true;
      } else {
        console.log("No mapping found");

        aiMapping = await aiService.inferMapping(
          unmatched,
          normalizedRows.slice(0, 5),
        );

        console.log("AI returned:", aiMapping);

        await cacheService.set(key, aiMapping);

        Object.entries(aiMapping).forEach(([header, target]) => {
          headerLookup.learn(header, target);
        });
      }
    }

    const mapping = {
      ...directMapping,
      ...aiMapping,
    };

    console.log("Mapping: ", mapping);

    const crmRows = mappingService.apply(normalizedRows, mapping!);

    console.log("CRMRows: ", crmRows);

    const normalizedCRMRows = crmNomalizer.normalize(crmRows);

    const validRows = normalizedCRMRows.filter((row) => validator.isValid(row));

    console.log("Result: ", {
      success: true,
      mapping,
      rows: validRows,
      cacheHit: cacheHit,
    });

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
