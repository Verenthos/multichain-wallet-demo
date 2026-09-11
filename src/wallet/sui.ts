import { useState } from 'react'
import { useCurrentClient, useDAppKit, useWalletConnection, useWallets } from '@mysten/dapp-kit-react'
import { MIST_PER_SUI } from '@mysten/sui/utils'
import type { WalletSession, WalletStatus } from './types'

// Wallet Standard name that the Slush extension registers itself under.
const SLUSH = 'Slush'

export function useSuiSession(): WalletSession {
  const dAppKit = useDAppKit()
  const wallets = useWallets()
  const connection = useWalletConnection()
  const client = useCurrentClient()
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
      // disconnectWallet throws WalletNotConnectedError when nothing is connected, so guard it.
      // That makes disconnect() safe to call from any status, which the chain switch relies on.
      if (connection.status === 'connected') await dAppKit.disconnectWallet()
    },

    async getBalance() {
      if (!connection.account) throw new Error('Not connected')
      // coinType defaults to 0x2::sui::SUI. The balance comes back as a decimal string of MIST.
      // 1 SUI = 1_000_000_000 MIST. MIST_PER_SUI is a bigint, hence the Number() conversions.
      const { balance } = await client.core.getBalance({ owner: connection.account.address })
      return `${Number(balance.balance) / Number(MIST_PER_SUI)} SUI`
    },

    async signMessage(msg) {
      // The wallet wraps the bytes in a PersonalMessage intent before signing. The result is already a
      // base64 string that serializes the signature scheme flag, the signature, and the public key.
      const { signature } = await dAppKit.signPersonalMessage({ message: new TextEncoder().encode(msg) })
      return signature
    },
  }
}
