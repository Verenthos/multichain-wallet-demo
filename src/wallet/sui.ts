import { useState } from 'react'
import { useDAppKit, useWalletConnection, useWallets } from '@mysten/dapp-kit-react'
import type { WalletSession, WalletStatus } from './types'

// Wallet Standard name that the Slush extension registers itself under.
const SLUSH = 'Slush'

export function useSuiSession(): WalletSession {
  const dAppKit = useDAppKit()
  const wallets = useWallets()
  const connection = useWalletConnection()
  const [error, setError] = useState<Error | null>(null)

  let status: WalletStatus = 'disconnected'
  if (error) status = 'error'
  else if (connection.status === 'connecting' || connection.status === 'reconnecting') status = 'connecting'
  else if (connection.status === 'connected') status = 'connected'

  return {
    chain: 'sui',
    address: connection.account?.address ?? null,
    status,

    async connect() {
      setError(null)
      const slush = wallets.find((w) => w.name === SLUSH)
      if (!slush) {
        const e = new Error('Slush is not installed')
        setError(e)
        throw e
      }
      try {
        await dAppKit.connectWallet({ wallet: slush })
      } catch (e) {
        setError(e as Error)
        throw e
      }
    },

    async disconnect() {
      setError(null)
      await dAppKit.disconnectWallet()
    },

    async getBalance() {
      throw new Error('not implemented')
    },

    async signMessage() {
      throw new Error('not implemented')
    },
  }
}
