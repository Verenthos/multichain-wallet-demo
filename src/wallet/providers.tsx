import type { ReactNode } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'

// Resolves to https://api.devnet.solana.com. Devnet only, never mainnet.
const SOLANA_DEVNET_RPC = clusterApiUrl('devnet')

export function WalletProviders({ children }: { children: ReactNode }) {
  return (
    <ConnectionProvider endpoint={SOLANA_DEVNET_RPC}>
      {/* wallets={[]}: no hardcoded adapters. Wallets that implement the Wallet Standard
          (Phantom does) register themselves on window and are discovered at runtime. */}
      <WalletProvider wallets={[]}>{children}</WalletProvider>
    </ConnectionProvider>
  )
}
