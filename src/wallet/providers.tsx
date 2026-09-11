import type { ReactNode } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import { createDAppKit, DAppKitProvider } from '@mysten/dapp-kit-react'
import { SuiGrpcClient } from '@mysten/sui/grpc'

// Resolves to https://api.devnet.solana.com. Devnet only, never mainnet.
const SOLANA_DEVNET_RPC = clusterApiUrl('devnet')

// Testnet only, never mainnet.
const SUI_TESTNET_RPC = 'https://fullnode.testnet.sui.io:443'

// createDAppKit registers wallet listeners and state stores, so it runs once at module load, not per render.
const suiDAppKit = createDAppKit({
  networks: ['testnet'],
  createClient: (network) => new SuiGrpcClient({ network, baseUrl: SUI_TESTNET_RPC }),
  // Do not silently restore the last session on page load. Connecting is always an explicit user action here.
  autoConnect: false,
  // Only the browser extension, discovered through the Wallet Standard like Phantom is. null disables the
  // hosted Slush web wallet that dapp-kit would otherwise register (and fetch metadata for) on every page load.
  slushWalletConfig: null,
})

export function WalletProviders({ children }: { children: ReactNode }) {
  return (
    <ConnectionProvider endpoint={SOLANA_DEVNET_RPC}>
      {/* wallets={[]}: no hardcoded adapters. Wallets that implement the Wallet Standard
          (Phantom does) register themselves on window and are discovered at runtime. */}
      <WalletProvider wallets={[]}>
        <DAppKitProvider dAppKit={suiDAppKit}>{children}</DAppKitProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
