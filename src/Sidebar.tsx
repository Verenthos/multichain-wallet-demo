import { CubeIcon, SolanaMark, SuiMark, WalletIcon } from './icons'

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-6 lg:min-h-[calc(100vh-4rem)]">
      <a href="#top" className="flex items-center gap-3 font-bold">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/20 text-primary">
          <CubeIcon />
        </span>
        Multi-chain wallet demo
      </a>

      <nav className="grid gap-1 text-sm font-semibold">
        <a href="#wallet" className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-primary">
          <WalletIcon className="h-4 w-4" />
          Wallet
        </a>
        <a href="#about" className="flex items-center gap-3 rounded-xl px-4 py-3 text-muted transition-colors hover:bg-panel-2 hover:text-text">
          <CubeIcon className="h-4 w-4" />
          About
        </a>
      </nav>

      <div className="mt-auto rounded-2xl border border-line bg-gradient-to-b from-panel-2 to-panel p-5">
        <p className="text-lg font-bold leading-tight">
          Two chains.
          <br />
          <span className="text-sui">One interface.</span>
        </p>
        <p className="mt-2 text-sm text-muted">
          Solana devnet and Sui testnet, unified behind a single TypeScript interface.
        </p>
        <div className="mt-5 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-line bg-bg">
            <SolanaMark className="h-6 w-6" />
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-sol/60 to-sui/60" />
          <span className="grid h-12 w-12 place-items-center rounded-full border border-line bg-bg">
            <SuiMark className="h-6 w-6" />
          </span>
        </div>
        <p className="mt-4 text-xs text-muted">Different chains. Same experience.</p>
      </div>
    </aside>
  )
}
