import { Router } from "express";
import multer from "multer";

import { ParserFactory } from "../parsers/parser.factory.js";
import { NormalizerService } from "../services/normalizer.service.js";

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

    return res.json({
      success: true,
      raw: rows,
      normalized: normalizedRows,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
