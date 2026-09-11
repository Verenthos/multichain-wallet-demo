import { useState } from 'react'
import { useWalletSession, type Chain } from './wallet'
import { Sidebar } from './Sidebar'
import { WalletCard } from './WalletCard'
import { NetworkCard } from './NetworkCard'
import { ActivityLog, type Activity } from './ActivityLog'
import { CubeIcon } from './icons'

const IDEAS = [
  { title: 'Choose a chain', text: 'Switch between Solana devnet and Sui testnet.' },
  { title: 'Connect your wallet', text: 'Phantom for Solana, Slush for Sui, discovered through the Wallet Standard.' },
  { title: 'Build and explore', text: 'Check the balance and sign a message through the same four methods on both chains.' },
]

function App() {
  const [chain, setChain] = useState<Chain>('solana')
  const session = useWalletSession(chain)
  const [error, setError] = useState<string | null>(null)
  const [activity, setActivity] = useState<Activity[]>([])

  function log(text: string) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setActivity((prev) => [{ id: Date.now() + prev.length, time, text }, ...prev].slice(0, 8))
  }

  async function handleConnect() {
    setError(null)
    try {
      await session.connect()
      log(`Connected to ${chain}`)
    } catch (e) {
      setError((e as Error).message)
      log(`Connect failed: ${(e as Error).message}`)
    }
  }

  async function handleDisconnect() {
    setError(null)
    await session.disconnect()
    log(`Disconnected from ${chain}`)
  }

  async function handleChainChange(next: Chain) {
    if (next === chain) return
    setError(null)
    // Leave the current chain cleanly before showing the next one. disconnect() is safe in any
    // status: it ends a live connection and clears an error. The switch is disabled while
    // connecting, so it can never race an in-flight wallet prompt.
    if (session.status !== 'disconnected') await session.disconnect()
    setChain(next)
    log(`Switched to ${next}`)
  }

  return (
    <div id="top" className="mx-auto grid max-w-[1600px] gap-6 p-4 sm:p-6 lg:grid-cols-[15rem_1fr] lg:p-8 xl:grid-cols-[15rem_1fr_22rem]">
      <Sidebar />

      <main className="space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-muted">UNIFIED WEB3 EXPERIENCE</p>
            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Multi-chain wallet demo</h1>
            <p className="mt-1 text-muted">Solana devnet and Sui testnet behind one interface.</p>
          </div>
          <span className="flex items-center gap-2 rounded-xl border border-line bg-panel px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-semibold">Demo</span>
          </span>
        </header>

        <div id="wallet" className="scroll-mt-6">
          <WalletCard
            chain={chain}
            session={session}
            error={error}
            onChainChange={handleChainChange}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onLog={log}
          />
        </div>

        <section id="about" className="scroll-mt-6 rounded-2xl border border-line bg-panel p-5 sm:p-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-sui/15 text-sui">
                <CubeIcon />
              </span>
              <div>
                <h2 className="text-lg font-bold">Built on a simple idea</h2>
                <p className="text-sm text-muted">Two ecosystems. One interface the UI can rely on.</p>
              </div>
            </div>
            <span className="rounded-lg border border-sui/40 bg-sui/10 px-3 py-1 text-xs font-semibold text-sui">
              Solana + Sui = one WalletSession
            </span>
          </header>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {IDEAS.map((idea) => (
              <li key={idea.title} className="border-line sm:border-l sm:pl-4 sm:first:border-0 sm:first:pl-0">
                <p className="font-semibold">{idea.title}</p>
                <p className="mt-1 text-sm text-muted">{idea.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <div className="space-y-6 lg:col-start-2 xl:col-start-3">
        <NetworkCard />
        <ActivityLog entries={activity} />
      </div>
    </div>
  )
}

export default App
