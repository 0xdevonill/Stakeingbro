export type AppErrorCode =
  | "WALLET_REJECTED"
  | "INSUFFICIENT_BALANCE"
  | "INSUFFICIENT_GAS"
  | "TRANSACTION_FAILED"
  | "WRONG_NETWORK"
  | "CONTRACT_UNAVAILABLE"
  | "RPC_FAILURE"
  | "API_FAILURE"
  | "SLIPPAGE_EXCEEDED"
  | "APPROVAL_FAILED"
  | "NOT_CONNECTED"
  | "UNKNOWN";

const messages: Record<AppErrorCode, { title: string; body: string }> = {
  WALLET_REJECTED: {
    title: "Request rejected",
    body: "The request was rejected in your wallet. No transaction was sent.",
  },
  INSUFFICIENT_BALANCE: {
    title: "Insufficient balance",
    body: "Your wallet does not have enough tokens to complete this transaction.",
  },
  INSUFFICIENT_GAS: {
    title: "Not enough ETH for gas",
    body: "Robinhood Chain uses ETH for network fees. Add ETH and try again.",
  },
  TRANSACTION_FAILED: {
    title: "Transaction failed",
    body: "Your transaction could not be completed. Check your wallet balance and network settings and try again.",
  },
  WRONG_NETWORK: {
    title: "Wrong network",
    body: "Please switch to the Robinhood network to continue.",
  },
  CONTRACT_UNAVAILABLE: {
    title: "Contracts not configured",
    body: "This action needs a configured StakeBro contract address. No blockchain transaction was sent.",
  },
  RPC_FAILURE: {
    title: "Network unavailable",
    body: "The Robinhood Chain RPC did not respond. Try again in a moment.",
  },
  API_FAILURE: {
    title: "Data unavailable",
    body: "Indexed market data could not be loaded. Blockchain state remains the source of truth.",
  },
  SLIPPAGE_EXCEEDED: {
    title: "Price moved",
    body: "The quote moved beyond your slippage limit. Refresh the quote and try again.",
  },
  APPROVAL_FAILED: {
    title: "Approval failed",
    body: "The token approval did not complete. You can try the approval again before staking or selling.",
  },
  NOT_CONNECTED: {
    title: "Wallet not connected",
    body: "Connect a wallet to continue. StakeBro never asks for your private key or seed phrase.",
  },
  UNKNOWN: {
    title: "Something went wrong",
    body: "Please try again. If the issue continues, check your wallet and network connection.",
  },
};

export function errorMessage(code: AppErrorCode) {
  return messages[code];
}

export function classifyWalletError(error: unknown): AppErrorCode {
  const text = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  if (text.includes("user rejected") || text.includes("denied") || text.includes("rejected")) {
    return "WALLET_REJECTED";
  }
  if (text.includes("insufficient funds") || text.includes("gas")) {
    return "INSUFFICIENT_GAS";
  }
  if (text.includes("slippage")) return "SLIPPAGE_EXCEEDED";
  if (text.includes("network") || text.includes("chain")) return "WRONG_NETWORK";
  if (text.includes("allowance") || text.includes("approve")) return "APPROVAL_FAILED";
  return "UNKNOWN";
}
