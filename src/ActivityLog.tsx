import { ClockIcon } from './icons'

export type Activity = { id: number; time: string; text: string }

export function ActivityLog({ entries }: { entries: Activity[] }) {
  return (
    <section className="rounded-2xl border border-line bg-panel p-5">
      <header className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sui/15 text-sui">
          <ClockIcon />
        </span>
        <div>
          <h2 className="font-bold">Recent activity</h2>
        </div>
      </header>

      {entries.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-line px-4 py-8 text-center">
          <p className="font-semibold">No activity yet</p>
          <p className="mt-1 text-sm text-muted">Connect a wallet to start.</p>
        </div>
      ) : (
        <ol data-testid="activity" className="mt-4 grid gap-2 text-sm">
          {entries.map((e) => (
            <li key={e.id} className="flex gap-3 rounded-xl border border-line bg-panel-2 px-4 py-2.5">
              <span className="font-mono text-xs text-muted">{e.time}</span>
              <span className="break-all">{e.text}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
