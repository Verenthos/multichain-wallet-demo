import { useState } from 'react'
import { useWalletSession } from './wallet'

const buttonClass =
  'rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50'

function App() {
  const session = useWalletSession('solana')
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

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-neutral-100">
      <h1 className="text-2xl font-semibold">Multi-chain wallet demo</h1>
      <p className="mt-2 text-neutral-400">Solana devnet and Sui testnet behind one interface.</p>

      <section className="mt-8 max-w-xl rounded-lg border border-neutral-800 p-6">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          <dt className="text-neutral-400">Chain</dt>
          <dd>{session.chain}</dd>
          <dt className="text-neutral-400">Status</dt>
          <dd>{session.status}</dd>
          <dt className="text-neutral-400">Address</dt>
          <dd className="break-all font-mono">{session.address ?? 'none'}</dd>
        </dl>

        <div className="mt-6">
          {session.status === 'connected' ? (
            <button className={buttonClass} onClick={handleDisconnect}>
              Disconnect
            </button>
          ) : (
            <button className={buttonClass} onClick={handleConnect} disabled={session.status === 'connecting'}>
              Connect
            </button>
          )}
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </section>
    </main>
  )
}

export default App
