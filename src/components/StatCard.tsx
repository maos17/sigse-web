interface StatCardProps {
  label: string
  valeur: string | number
  accent?: 'default' | 'green' | 'orange' | 'red' | 'blue'
}

const COULEURS: Record<NonNullable<StatCardProps['accent']>, string> = {
  default: 'var(--text)',
  green: 'var(--green)',
  orange: 'var(--orange)',
  red: 'var(--red)',
  blue: 'var(--primary)',
}

export function StatCard({ label, valeur, accent = 'default' }: StatCardProps) {
  return (
    <div className="card" style={{ padding: '18px 20px' }}>
      <div
        style={{
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          color: 'var(--text-muted)',
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: COULEURS[accent] }}>
        {valeur}
      </div>
    </div>
  )
}
