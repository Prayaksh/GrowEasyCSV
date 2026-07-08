import express from "express";
import cors from "cors";
import parseRouter from "./routes/parse.js";
import { redis } from "./services/cache/redis.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use("/parse", parseRouter);

app.get("/redis", async (req, res) => {
  try {
    await redis.set("test_key", "Redis is up and running!", { EX: 10 });

    const value = await redis.get("test_key");

    return res.status(200).json({
      status: "success",
      message: "Successfully connected to Redis!",
      data: value,
    });
  } catch (error: any) {
    console.error("Redis health check failed:", error);

    return res.status(500).json({
      status: "error",
      message: "Could not connect to Redis server.",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
