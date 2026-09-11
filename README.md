# Multi-chain wallet demo

A small React app that connects to a Solana wallet (Phantom, devnet) or a Sui wallet (Slush, testnet) behind one TypeScript interface, `WalletSession`. The UI only talks to that interface, so it never knows which chain implementation it is using.

## Run it

You need Node 24 and, for the chain you want to try, the Phantom or Slush browser extension with a devnet or testnet account.

```bash
npm install
npm run dev
```

Open http://localhost:5173, pick a chain, and click Connect. Once connected you can fetch the balance and sign a fixed message; the signature is shown on screen.

The app only uses Solana devnet and Sui testnet. There is no mainnet RPC URL anywhere in this repository. The RPC endpoints are constants in `src/wallet/providers.tsx`.

`npm run build` type checks the project and writes the production bundle to `dist/`.

## Run the tests

```bash
npx playwright install chromium
npm test
```

The tests are Playwright end to end tests in `tests/wallet.spec.ts`. Playwright starts the dev server with `VITE_WALLET_MOCK=true`, which makes the wallet factory return a mock adapter instead of the real ones, so no extension and no network access are needed. The suite covers the five UI states: disconnected, connecting, connected with an address, error after the wallet rejects, and switching chains. The same suite runs on GitHub Actions for every push and pull request (`.github/workflows/test.yml`).

## Where Solana and Sui actually differ

Addresses. A Solana address is the account's ed25519 public key itself, base58 encoded (32 bytes, 43 or 44 characters). A Sui address is a 32 byte blake2b hash of the signature scheme flag and the public key, written as `0x` followed by 64 hex characters.

Signatures. Phantom signs the exact bytes you hand it and returns the raw 64 byte ed25519 signature as a `Uint8Array`; the usual way to show it is base58, which is what this app does with the `bs58` package. Slush signs a "personal message": the bytes are wrapped in an intent prefix first, so a signed message can never be mistaken for a signed transaction, and the result is a base64 string that serializes the scheme flag, the 64 byte signature, and the 32 byte public key together. The app shows that string unchanged.

Rejection. With `@solana/wallet-adapter-react`, closing or rejecting the Phantom popup makes `connect()` reject with a `WalletConnectionError` and `signMessage()` with a `WalletSignMessageError`; the message inside is Phantom's ("User rejected the request."). After a failed connect the provider also deselects the wallet, so the next attempt has to select it again. With `@mysten/dapp-kit-react`, `connectWallet()` and `signPersonalMessage()` reject with whatever error the wallet threw, and after a failed connect dapp-kit puts its connection state back to `disconnected`. On both chains a rejected signature leaves the wallet connected.

There is also a difference in how connecting works. The Solana provider separates selecting a wallet from connecting to it, and the selection only takes effect on the next React render, so the Solana adapter has to finish the connect in an effect. dapp-kit's `connectWallet({ wallet })` does both in one call.

## How the adapter layer hides those differences

`src/wallet/types.ts` defines `WalletSession`: a chain name, an address, a status, and four methods (`connect`, `disconnect`, `getBalance`, `signMessage`). `src/wallet/solana.ts` and `src/wallet/sui.ts` each implement it as a React hook on top of the chain's SDK. `src/wallet/factory.ts` returns the adapter for the chosen chain (or the mock during tests), and `src/wallet/index.ts` is the only module the UI imports from.

Everything chain specific stays inside the adapters. `getBalance` returns a string that already includes the unit (`1.5 SOL`, `2 SUI`), so the UI does not need to know about lamports or MIST. `signMessage` returns the display encoding native to each chain. A failed `connect` sets `status` to `error` and rejects with an `Error` whose message the UI shows as is. `disconnect` is safe to call in any status, which is what the chain switch relies on: it disconnects the current session, then swaps the chain. The App renders a status, an address, a message, and a signature, and it is the same code for both chains.

## Deploy to Vercel

`vercel.json` sets the framework to Vite, the build command to `npm run build`, and the output directory to `dist`. Import the repository in Vercel and keep the defaults. No environment variables are needed.
