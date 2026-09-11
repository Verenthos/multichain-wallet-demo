import type { Chain, WalletSession } from './types'
import { useSolanaSession } from './solana'
import { useSuiSession } from './sui'
import { useMockSession } from './mock'

function useRealSession(chain: Chain): WalletSession {
  // Hooks cannot be called conditionally, so both adapters run on every render
  // and the caller receives the one for the chosen chain.
  const solana = useSolanaSession()
  const sui = useSuiSession()
  return chain === 'solana' ? solana : sui
}

// Vite replaces import.meta.env.VITE_WALLET_MOCK at build time, so this choice is made once when the
// module loads. The component always calls the same hook, which keeps the rules of hooks intact.
export const useWalletSession: (chain: Chain) => WalletSession =
  import.meta.env.VITE_WALLET_MOCK === 'true' ? useMockSession : useRealSession
