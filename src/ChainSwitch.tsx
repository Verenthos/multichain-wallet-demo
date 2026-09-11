import type { Chain } from './wallet'
import { SolanaMark, SuiMark } from './icons'

const CHAINS: { id: Chain; label: string; Mark: typeof SolanaMark }[] = [
  { id: 'solana', label: 'Solana devnet', Mark: SolanaMark },
  { id: 'sui', label: 'Sui testnet', Mark: SuiMark },
]

type Props = {
  value: Chain
  disabled: boolean
  onChange: (chain: Chain) => void
}

export function ChainSwitch({ value, disabled, onChange }: Props) {
  return (
    <div className="grid gap-2 sm:grid-cols-[auto_1fr_1fr] sm:items-center">
      <span className="text-sm text-muted sm:pr-4">Chain</span>
      {CHAINS.map(({ id, label, Mark }) => {
        const active = id === value
        return (
          <button
            key={id}
            type="button"
            data-testid={`chain-${id}`}
            aria-pressed={active}
            disabled={disabled}
            onClick={() => onChange(id)}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              active ? 'border-primary bg-primary/10' : 'border-line bg-panel-2 hover:border-muted'
            }`}
          >
            <Mark />
            {label}
          </button>
        )
      })}
    </div>
  )
}
