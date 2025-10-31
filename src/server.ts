import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import { getBlockNumber, getAddressInfo } from "./routes/ethService";
import scanRoutes from "./routes/scanRoutes";

const app = express();
app.use(express.json());

app.use("/contracts", scanRoutes);

app.get("/health", (req: express.Request, res: express.Response) =>
  res.json({ ok: true })
);
app.get("/block", async (req: express.Request, res: express.Response) => {
  try {
    const bn = await getBlockNumber();
    res.json({ block: bn });
  } catch (e: unknown) {
    console.error("Error is:", e);
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
});

app.get(
  "/contracts/:address",
  async (req: express.Request, res: express.Response) => {
    const { address } = req.params;
    if (typeof address !== "string") {
      return res.status(400).json({ error: "Address parameter is required" });
    }
    try {
      const info = await getAddressInfo(address);
      res.json(info);
    } catch (e: unknown) {
      console.error("Error:", e);
      console.log(e);
      res.status(400).json({ error: "Invalid address" });
    }
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening ${port}`));
