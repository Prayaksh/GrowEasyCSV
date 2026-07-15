import express from "express";
import parseRouter from "../../src/routes/parse.js";

const app = express();

app.use(express.json());
app.use("/parse", parseRouter);

export default app;
