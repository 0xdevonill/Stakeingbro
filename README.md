# StakeBro

StakeBro is a token launch, discovery, trading, and staking interface for **Robinhood Chain**.

Discover → Buy → Hold → Stake → Earn → Claim → Compound

## Stack

- Next.js, React, TypeScript, Tailwind CSS
- Wagmi + Viem for wallet and contract calls
- Uniswap v3 addresses on Robinhood Chain for trading integration
- Indexed application data behind a replaceable adapter

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

All chain IDs, RPC URLs, explorer URLs, and contract addresses come from environment variables. See `.env.example`.

- `NEXT_PUBLIC_DATA_MODE=mock` uses a clearly labeled development catalog when no indexer is configured.
- `NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS` and `NEXT_PUBLIC_STAKING_FACTORY_ADDRESS` enable live factory and staking transactions.
- Uniswap router/quoter/WETH defaults are the public Robinhood Chain deployments.
- `NEXT_PUBLIC_ADMIN_ADDRESSES` allowlists wallets that can open `/admin`. There is no hidden backdoor.

Never put private keys, seed phrases, or secret API keys in frontend code.

## Networks

| Network | Chain ID | Native gas | Explorer |
| --- | --- | --- | --- |
| Robinhood Chain | 4663 | ETH | https://robinhoodchain.blockscout.com |
| Robinhood Chain Testnet | 46630 | ETH | https://explorer.testnet.chain.robinhood.com |

## Security

StakeBro does not custody funds and never asks for a private key or seed phrase. Listing a token is not a safety guarantee. Independently audit contracts before they handle meaningful user funds.
