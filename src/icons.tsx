// Small inline SVGs so the UI has no icon dependency. Chain marks are simplified, not official logos.

export function SolanaMark({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sol" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#9945ff" />
          <stop offset="1" stopColor="#14f195" />
        </linearGradient>
      </defs>
      <path fill="url(#sol)" d="M6 5h14l-3 3H3zM3 11h14l3 3H6zM6 17h14l-3 3H3z" />
    </svg>
  )
}

export function SuiMark({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4da2ff"
        d="M12 2c3.5 4.2 7 7.6 7 12a7 7 0 0 1-14 0c0-4.4 3.5-7.8 7-12zm0 5.4c-2 2.6-4.2 4.6-4.2 7.2a4.2 4.2 0 0 0 8.4 0c0-2.6-2.2-4.6-4.2-7.2z"
      />
    </svg>
  )
}

export function WalletIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M16 14.5h2" strokeLinecap="round" />
    </svg>
  )
}

export function CubeIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5M12 12v9" strokeLinejoin="round" />
    </svg>
  )
}

export function SignalIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M5 19v-4M10 19V9M15 19v-7M20 19V5" />
    </svg>
  )
}

export function ClockIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4.5l3 1.5" />
    </svg>
  )
}
