import express from "express";
import dotenv from "dotenv";
// import logger from "./utils/logger";
dotenv.config();

import scanRoutes from "./routes/scanRoutes";
import ethRoutes from "./routes/ethService";

const app = express();
app.use(express.json()); // for making the server able to understand json in body request

app.use("/scan", scanRoutes);
app.use("/contracts", ethRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));
