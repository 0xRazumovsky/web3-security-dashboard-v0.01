import { scanAddress } from "./scanService";
import express from "express";

const router = express.Router();

router.get("/:address", async (req, res) => {
  const { address } = req.params;
  try {
    const result = await scanAddress(address);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: "Invalid address or requiest" });
  }
});

router.get("/:address/scan", async (req, res) => {
  const { address } = req.params;
  try {
    const result = await scanAddress(address);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: "Invalid address or request" });
  }
});

export default router;
