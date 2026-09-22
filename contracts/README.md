# StakeBro contracts

This folder holds Solidity **interfaces** for the StakeBro token factory and staking system.

- The frontend talks to these contracts through `src/contracts/abis.ts`.
- Addresses are injected with environment variables. Nothing here contains private keys.
- Trading uses the official Uniswap deployments on Robinhood Chain when those addresses are configured.
- Independently audit any implementation before it handles user funds.
