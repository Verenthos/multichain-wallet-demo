import { useState } from 'react'
import type { WalletSession } from './wallet'
import { buttonClass } from './buttonClass'

const MESSAGE = 'Hello from the multi-chain wallet demo'

// Rendered only while a session is connected. Its state (balance, signature) unmounts with it,
// so nothing from a previous session can leak into the next one.
export function SessionActions({ session }: { session: WalletSession }) {
  const [balance, setBalance] = useState<string | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleBalance() {
    setError(null)
    try {
      setBalance(await session.getBalance())
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function handleSign() {
    setError(null)
    try {
      setSignature(await session.signMessage(MESSAGE))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="mt-6 space-y-4 border-t border-neutral-800 pt-6 text-sm">
      <div className="flex items-center gap-3">
        <button className={buttonClass} onClick={handleBalance}>
          Get balance
        </button>
        {balance && <span className="font-mono">{balance}</span>}
      </div>

      <div className="space-y-2">
        <p className="text-neutral-400">
          Message: <span className="text-neutral-100">{MESSAGE}</span>
        </p>
        <button className={buttonClass} onClick={handleSign}>
          Sign message
        </button>
        {signature && <p className="break-all font-mono text-neutral-300">{signature}</p>}
      </div>

      {error && <p className="text-red-400">{error}</p>}
    </div>
  )
}
