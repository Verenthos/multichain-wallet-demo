import type { Chain, WalletSession } from './types'
import { useSolanaSession } from './solana'
import { useSuiSession } from './sui'

export function useWalletSession(chain: Chain): WalletSession {
  // Hooks cannot be called conditionally, so both adapters run on every render
  // and the caller receives the one for the chosen chain.
  const solana = useSolanaSession()
  const sui = useSuiSession()
  return chain === 'solana' ? solana : sui
}
