import { useState } from 'react'
import type { WalletSession } from './wallet'
import { secondaryButtonClass } from './buttonClass'

const MESSAGE = 'Hello from the multi-chain wallet demo'

type Props = {
  session: WalletSession
  onLog: (text: string) => void
}

// Always rendered, enabled only while connected. App keys this component on the address, so
// balance and signature state reset whenever the connected account changes or disconnects.
export function SessionActions({ session, onLog }: Props) {
  const [balance, setBalance] = useState<string | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const connected = session.status === 'connected'

  async function handleBalance() {
    setError(null)
    try {
      const value = await session.getBalance()
      setBalance(value)
      onLog(`Balance: ${value}`)
    } catch (e) {
      setError((e as Error).message)
      onLog(`Balance failed: ${(e as Error).message}`)
    }
  }

  async function handleSign() {
    setError(null)
    try {
      const value = await session.signMessage(MESSAGE)
      setSignature(value)
      onLog('Message signed')
    } catch (e) {
      setError((e as Error).message)
      onLog(`Signing failed: ${(e as Error).message}`)
    }
  }

  return (
    <>
      <button className={secondaryButtonClass} onClick={handleBalance} disabled={!connected}>
        Get balance
      </button>
      <button className={secondaryButtonClass} onClick={handleSign} disabled={!connected}>
        Sign message
      </button>

      {(balance || signature || error) && (
        <div className="col-span-full mt-2 space-y-2 rounded-xl border border-line bg-bg/60 p-4 text-sm">
          {balance && (
            <p>
              <span className="text-muted">Balance </span>
              <span data-testid="balance" className="font-mono">
                {balance}
              </span>
            </p>
          )}
          {signature && (
            <div>
              <p className="text-muted">
                Signature for <span className="text-text">"{MESSAGE}"</span>
              </p>
              <p data-testid="signature" className="mt-1 break-all font-mono text-xs text-text/90">
                {signature}
              </p>
            </div>
          )}
          {error && <p className="text-red-400">{error}</p>}
        </div>
      )}
    </>
  )
}
