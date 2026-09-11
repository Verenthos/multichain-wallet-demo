import { useEffect, useRef, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import type { WalletName } from '@solana/wallet-adapter-base'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import bs58 from 'bs58'
import type { WalletSession, WalletStatus } from './types'

// Wallet Standard name that Phantom registers itself under. WalletName is a branded string type.
const PHANTOM = 'Phantom' as WalletName

type Pending = { resolve: () => void; reject: (error: Error) => void }

export function useSolanaSession(): WalletSession {
  const { wallets, wallet, publicKey, connecting, connected, select, connect, disconnect, signMessage } =
    useWallet()
  const { connection } = useConnection()
  const [error, setError] = useState<Error | null>(null)

  // select() only schedules a state update in WalletProvider. The wallet is not selected until the
  // next render, so the actual connect() call has to happen in an effect that runs after that render.
  // The promise returned from our connect() is kept here until that effect settles it.
  const pending = useRef<Pending | null>(null)

  useEffect(() => {
    if (!pending.current || wallet?.adapter.name !== PHANTOM) return
    const { resolve, reject } = pending.current
    pending.current = null
    connect().then(resolve, reject)
  }, [wallet, connect])

  let status: WalletStatus = 'disconnected'
  if (error) status = 'error'
  else if (connecting) status = 'connecting'
  else if (connected) status = 'connected'

  return {
    chain: 'solana',
    address: publicKey ? publicKey.toBase58() : null,
    status,

    connect() {
      return new Promise<void>((resolve, reject) => {
        setError(null)
        const fail = (e: Error) => {
          setError(e)
          reject(e)
        }
        const phantom = wallets.find((w) => w.adapter.name === PHANTOM)
        if (!phantom) {
          fail(new Error('Phantom is not installed'))
          return
        }
        if (wallet?.adapter.name === PHANTOM) {
          // Already selected (for example after a page reload), so connect directly.
          connect().then(resolve, fail)
          return
        }
        pending.current = { resolve, reject: fail }
        select(PHANTOM)
      })
    },

    async disconnect() {
      setError(null)
      await disconnect()
    },

    async getBalance() {
      if (!publicKey) throw new Error('Not connected')
      // The RPC returns an integer number of lamports. 1 SOL = 1_000_000_000 lamports.
      const lamports = await connection.getBalance(publicKey)
      return `${lamports / LAMPORTS_PER_SOL} SOL`
    },

    async signMessage(msg) {
      // signMessage is undefined when the selected wallet does not support the feature. Phantom does.
      if (!signMessage) throw new Error('Wallet does not support message signing')
      // Phantom returns the raw 64-byte ed25519 signature. Base58 is the Solana convention for showing it.
      const signature = await signMessage(new TextEncoder().encode(msg))
      return bs58.encode(signature)
    },
  }
}
