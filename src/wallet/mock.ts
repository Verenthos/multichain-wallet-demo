import { useState } from 'react'
import type { Chain, WalletSession, WalletStatus } from './types'

// Test-only adapter. The factory picks it when VITE_WALLET_MOCK=true. Playwright configures its
// behaviour through window.__walletMock before the page scripts run.
export type MockConfig = {
  rejectConnect?: boolean
  connectDelayMs?: number
}

declare global {
  interface Window {
    __walletMock?: MockConfig
  }
}

const ADDRESSES: Record<Chain, string> = {
  solana: 'MockSo1anaAddress1111111111111111111111111',
  sui: '0x' + '1234'.repeat(16),
}

export function useMockSession(chain: Chain): WalletSession {
  const [status, setStatus] = useState<WalletStatus>('disconnected')
  const [address, setAddress] = useState<string | null>(null)

  return {
    chain,
    address,
    status,

    async connect() {
      const config = window.__walletMock ?? {}
      setStatus('connecting')
      await new Promise((resolve) => setTimeout(resolve, config.connectDelayMs ?? 0))
      if (config.rejectConnect) {
        setStatus('error')
        throw new Error('User rejected the request.')
      }
      setAddress(ADDRESSES[chain])
      setStatus('connected')
    },

    async disconnect() {
      setAddress(null)
      setStatus('disconnected')
    },

    async getBalance() {
      return chain === 'solana' ? '1.5 SOL' : '2 SUI'
    },

    async signMessage(msg) {
      return `mock-signature(${msg})`
    },
  }
}
