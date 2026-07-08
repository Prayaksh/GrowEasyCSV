import { Router } from "express";
import multer from "multer";

import { ParserFactory } from "../parsers/parser.factory.js";

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

    const rows = await parser.parse(req.file.buffer);

    return res.json({
      success: true,
      rows,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
