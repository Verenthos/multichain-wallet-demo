# Multi-chain wallet demo

Connects to Phantom on Solana devnet or Slush on Sui testnet through one TypeScript interface, `WalletSession`. The UI only talks to that interface and has no idea which chain is behind it.

## Run

Needs Node 24 and the Phantom or Slush browser extension.

```bash
npm install
npm run dev
```

Open http://localhost:5173, pick a chain and click Connect. Once connected you can read the balance and sign a message. Only devnet and testnet are used. There is no mainnet URL in this repo.

## Tests

```bash
npx playwright install chromium
npm test
```

Playwright starts the dev server with `VITE_WALLET_MOCK=true`, so the factory returns a mock adapter and no extension or network is needed. The suite covers disconnected, connecting, connected with an address, rejection, and chain switching. The same suite runs in GitHub Actions on every push.

## Where Solana and Sui differ

A Solana address is the ed25519 public key in base58. A Sui address is a blake2b hash of the key scheme flag plus the public key, shown as 0x followed by 64 hex characters. Phantom signs the raw bytes and returns a 64 byte ed25519 signature, shown here in base58. Slush wraps the bytes in a personal message intent and returns a base64 string that packs the scheme flag, the signature and the public key together. When the user rejects, the Solana adapter throws a `WalletConnectionError` or `WalletSignMessageError` and deselects the wallet after a failed connect, while dapp-kit throws the wallet's own error and goes back to `disconnected`. Solana also separates selecting a wallet from connecting to it, and the selection only lands on the next React render, so that adapter finishes the connect inside an effect.

## How the adapter layer hides that

`src/wallet/types.ts` defines the interface. `solana.ts` and `sui.ts` implement it as hooks over each SDK. `factory.ts` picks the adapter for the selected chain, or the mock during tests, and `index.ts` is the only module the UI imports. Balances come back as strings with the unit, signatures in each chain's usual encoding, and a failed connect sets the status to `error` and rejects with a plain `Error`. `disconnect` works from any status, which is what the chain switch relies on before swapping chains.

## Vercel

`vercel.json` sets the framework, build command and output directory. Import the repo and keep the defaults. No environment variables are needed.
