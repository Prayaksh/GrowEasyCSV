import { Router } from "express";
import multer from "multer";

import { ParserFactory } from "../parsers/parser.factory.js";
import { NormalizerService } from "../services/normalizer.service.js";
import { CacheService } from "../services/cache/cache.service.js";
import { FingerprintService } from "../services/cache/fingerprint.service.js";

const router = Router();

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

    const normalizerService = new NormalizerService();

    const rows = await parser.parse(req.file.buffer);
    const normalizedRows = normalizerService.normalize(rows);

    if (!normalizedRows) {
      return res.status(400).json({
        success: false,
        message: "Failed to normalize",
      });
    }

    const cacheService = new CacheService();
    const fingerprintService = new FingerprintService();

    const headers = Object.keys(normalizedRows[0]);
    const key = fingerprintService.generate(headers!);
    let mapping = cacheService.get(key);
    if (!mapping) {
      //Todo - make the LLM Call
      //Todo - generate the cache
    }
    //Todo - set the data according to the mapping provided

    return res.json({
      success: true,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
