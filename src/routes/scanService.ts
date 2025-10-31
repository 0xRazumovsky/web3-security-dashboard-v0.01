import { ethers } from "ethers";
import getProvider from "../utils/provider";

const provider = getProvider();

const OPCODES = {
  DELEGATECALL: "f4",
  SELFDESTRUCT: "ff",
  CALLCODE: "fa",
};

const adminKeywords = [
  "owner",
  "admin",
  "setAdmin",
  "setOwner",
  "pause",
  "unpause",
];

const financialKeywords = ["withdraw", "deposit", "transfer", "mint", "burn"];

export function isAdminFunction(funcName: string): boolean {
  const lower = funcName.toLowerCase();
  return adminKeywords.some((keyword) => lower.includes(keyword));
}

export function isFinancialFunction(funcName: string): boolean {
  const lower = funcName.toLowerCase();
  return financialKeywords.some((keyword) => lower.includes(keyword));
}

export async function scanAddress(address: string) {
  const code = await provider.getCode(address);
  const findings: Record<string, boolean> = {};

  for (const [name, opcode] of Object.entries(OPCODES)) {
    findings[name] = code.includes(opcode);
  }

  return { address, findings };
}

export async function analyzeContract(
  address: string,
  abi: ethers.InterfaceAbi
) {
  const contract = new ethers.Contract(address, abi, provider);

  const report: any = { address, score: 0, issues: [] };

  const functionNames = contract.interface.fragments
    .filter((f: any) => f.type === "function" && typeof f.name === "string")
    .map((f: any) => f.name);

  for (const func of functionNames) {
    if (isAdminFunction(func)) {
      report.score += 3;
      report.issues.push(`Admin function detected: ${func}`);
    }
    if (isFinancialFunction(func)) {
      report.score += 2;
      report.issues.push(`Financial function detected: ${func}`);
    }
  }

  return report;
}
