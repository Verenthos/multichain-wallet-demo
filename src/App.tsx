import { useState } from 'react'
import { useWalletSession, type Chain } from './wallet'
import { SessionActions } from './SessionActions'
import { buttonClass } from './buttonClass'

function App() {
  const [chain, setChain] = useState<Chain>('solana')
  const session = useWalletSession(chain)
  const [error, setError] = useState<string | null>(null)

  async function handleConnect() {
    setError(null)
    try {
      await session.connect()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function handleDisconnect() {
    setError(null)
    await session.disconnect()
  }

  async function handleChainChange(next: Chain) {
    setError(null)
    // Leave the current chain cleanly before showing the next one. disconnect() is safe in any
    // status: it ends a live connection and clears an error. The select is disabled while
    // connecting, so a switch can never race an in-flight wallet prompt.
    if (session.status !== 'disconnected') await session.disconnect()
    setChain(next)
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-neutral-100">
      <h1 className="text-2xl font-semibold">Multi-chain wallet demo</h1>
      <p className="mt-2 text-neutral-400">Solana devnet and Sui testnet behind one interface.</p>

      <section className="mt-8 max-w-xl rounded-lg border border-neutral-800 p-6">
        <label className="flex items-center gap-3 text-sm">
          <span className="text-neutral-400">Chain</span>
          <select
            data-testid="chain"
            className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 disabled:opacity-50"
            value={chain}
            disabled={session.status === 'connecting'}
            onChange={(e) => handleChainChange(e.target.value as Chain)}
          >
            <option value="solana">Solana devnet</option>
            <option value="sui">Sui testnet</option>
          </select>
        </label>

        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          <dt className="text-neutral-400">Status</dt>
          <dd data-testid="status">{session.status}</dd>
          <dt className="text-neutral-400">Address</dt>
          <dd data-testid="address" className="break-all font-mono">
            {session.address ?? 'none'}
          </dd>
        </dl>

        <div className="mt-6">
          {session.status === 'connected' ? (
            <button data-testid="disconnect" className={buttonClass} onClick={handleDisconnect}>
              Disconnect
            </button>
          ) : (
            <button
              data-testid="connect"
              className={buttonClass}
              onClick={handleConnect}
              disabled={session.status === 'connecting'}
            >
              Connect
            </button>
          )}
        </div>

        {error && (
          <p data-testid="error" className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}

        {session.status === 'connected' && <SessionActions session={session} />}
      </section>
    </main>
  )
}

export default App
