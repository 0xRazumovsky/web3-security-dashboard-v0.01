import dotenv from "dotenv";
import { JsonRpcProvider } from "ethers";

dotenv.config();

let provider: JsonRpcProvider | null = null;

export function getProvider(): JsonRpcProvider {
  if (provider) return provider;
  const url = process.env.RPC_URL;
  if (!url) throw new Error("RPC_URL not set in environment");
  provider = new JsonRpcProvider(url);

  provider
    .getNetwork()
    .then((net) =>
      console.log("Connected to RPC network:", net.name ?? net.chainId)
    )
    .catch((err) =>
      console.warn(
        "Warning: provider failed to detect network:",
        err?.message ?? err
      )
    );

  return provider;
}

export default getProvider;
