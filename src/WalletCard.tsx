import type { Chain, WalletSession, WalletStatus } from './wallet'
import { ChainSwitch } from './ChainSwitch'
import { SessionActions } from './SessionActions'
import { primaryButtonClass, secondaryButtonClass } from './buttonClass'
import { WalletIcon } from './icons'

type Props = {
  chain: Chain
  session: WalletSession
  error: string | null
  onChainChange: (chain: Chain) => void
  onConnect: () => void
  onDisconnect: () => void
  onLog: (text: string) => void
}

const STATUS: Record<WalletStatus, { dot: string; hint: string }> = {
  disconnected: { dot: 'bg-red-500', hint: 'Connect your wallet to get started' },
  connecting: { dot: 'bg-amber-400 animate-pulse', hint: 'Approve the request in your wallet' },
  connected: { dot: 'bg-emerald-400', hint: 'Wallet connected' },
  error: { dot: 'bg-red-500', hint: 'The wallet request did not complete' },
}

export function WalletCard({ chain, session, error, onChainChange, onConnect, onDisconnect, onLog }: Props) {
  const connecting = session.status === 'connecting'
  const connected = session.status === 'connected'

  return (
    <section className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <header className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
          <WalletIcon />
        </span>
        <div>
          <h2 className="text-xl font-bold">Wallet</h2>
          <p className="text-sm text-muted">Connect your wallet, check your balance, and sign a message.</p>
        </div>
      </header>

      <div className="mt-6 space-y-4 rounded-2xl border border-line bg-bg/40 p-4">
        <ChainSwitch value={chain} disabled={connecting} onChange={onChainChange} />

        <dl className="grid gap-x-8 gap-y-3 rounded-xl border border-line bg-panel-2 p-4 text-sm sm:grid-cols-[6rem_1fr]">
          <dt className="text-muted">Status</dt>
          <dd>
            <span className="flex items-center gap-2 font-semibold capitalize">
              <span className={`h-2 w-2 rounded-full ${STATUS[session.status].dot}`} />
              <span data-testid="status">{session.status}</span>
            </span>
            <span className="text-xs text-muted">{STATUS[session.status].hint}</span>
          </dd>
          <dt className="text-muted">Address</dt>
          <dd data-testid="address" className="break-all font-mono text-xs leading-5 sm:text-sm">
            {session.address ?? 'none'}
          </dd>
        </dl>

        <div className="grid gap-3 sm:grid-cols-3">
          {connected ? (
            <button data-testid="disconnect" className={secondaryButtonClass} onClick={onDisconnect}>
              Disconnect
            </button>
          ) : (
            <button data-testid="connect" className={primaryButtonClass} onClick={onConnect} disabled={connecting}>
              <WalletIcon className="h-4 w-4" />
              {connecting ? 'Connecting' : 'Connect'}
            </button>
          )}
          <SessionActions key={session.address ?? 'none'} session={session} onLog={onLog} />
        </div>

        {error && (
          <p data-testid="error" className="text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
