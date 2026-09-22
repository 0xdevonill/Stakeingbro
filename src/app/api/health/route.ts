import { NextResponse } from "next/server";
import { env, hasIndexer, hasStakingFactory, hasTokenFactory, isMockMode } from "@/config/env";

export async function GET() {
  let rpc = "unknown";
  try {
    const response = await fetch(env.rpcUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] }),
    });
    const json = (await response.json()) as { result?: string };
    rpc = json.result ? String(Number.parseInt(json.result, 16)) : "error";
  } catch {
    rpc = "unreachable";
  }

  return NextResponse.json({
    app: "StakeBro",
    dataMode: isMockMode ? "mock" : "live",
    chainId: env.chainId,
    rpcChainId: rpc,
    indexer: hasIndexer,
    tokenFactory: hasTokenFactory,
    stakingFactory: hasStakingFactory,
  });
}
