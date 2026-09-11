import type { WalletSession } from './types'

export function useSolanaSession(): WalletSession {
  return {
    chain: 'solana',
    address: null,
    status: 'disconnected',
    async connect() {
      throw new Error('not implemented')
    },
    async disconnect() {
      throw new Error('not implemented')
    },
    async getBalance() {
      throw new Error('not implemented')
    },
    async signMessage() {
      throw new Error('not implemented')
    },
  }
}
