import { SignalIcon, SolanaMark, SuiMark } from './icons'

// Static by design. Live block heights would need chain specific RPC calls in the UI,
// which is exactly what the WalletSession interface exists to keep out of it.
const NETWORKS = [
  { name: 'Solana', network: 'Devnet', explorer: 'https://explorer.solana.com/?cluster=devnet', Mark: SolanaMark },
  { name: 'Sui', network: 'Testnet', explorer: 'https://suiscan.xyz/testnet', Mark: SuiMark },
]

export function NetworkCard() {
  return (
    <section className="rounded-2xl border border-line bg-panel p-5">
      <header className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400/15 text-emerald-400">
          <SignalIcon />
        </span>
        <div>
          <h2 className="font-bold">Networks</h2>
          <p className="text-sm text-muted">Test networks only. No mainnet anywhere.</p>
        </div>
      </header>
      <ul className="mt-4 grid gap-2">
        {NETWORKS.map(({ name, network, explorer, Mark }) => (
          <li key={name} className="flex items-center gap-3 rounded-xl border border-line bg-panel-2 px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-bg">
              <Mark />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {name} <span className="text-muted">{network}</span>
              </p>
            </div>
            <a href={explorer} target="_blank" rel="noreferrer" className="text-xs font-semibold text-sui hover:underline">
              Explorer
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
