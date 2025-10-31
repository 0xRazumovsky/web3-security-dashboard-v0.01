import { isAddress, formatEther } from "ethers";
import getProvider from "../utils/provider";

const provider = getProvider();

export async function getBlockNumber(): Promise<number> {
  return await provider.getBlockNumber();
}

export async function getAddressInfo(address: string) {
  const cleanAddress = address.trim();
  if (!isAddress(cleanAddress)) throw new Error("Invalid address");
  const balance = await provider.getBalance(cleanAddress);
  // works only on mainnet
  const code = await provider.getCode(cleanAddress);
  return {
    balance: formatEther(balance),
    bytecode: code,
  };
}

export async function getContractInfo(address: string) {
  const code = await provider.getCode(address);
  const balance = await provider.getBalance(address);
  return { balance: formatEther(balance), code };
}

export default getAddressInfo;
