import type { ReactNode } from 'react'

export function EmptyState({
  titre,
  children,
}: {
  titre: string
  children?: ReactNode
}) {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{titre}</p>
      {children}
    </div>
  )
}
