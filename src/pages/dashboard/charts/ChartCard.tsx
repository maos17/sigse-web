import type { ReactNode } from 'react'

/** Carte conteneur d'un graphique avec titre. */
export function ChartCard({
  titre,
  children,
}: {
  titre: string
  children: ReactNode
}) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <h2>{titre}</h2>
      {children}
    </div>
  )
}

/** Palette cohérente pour les graphiques. */
export const PALETTE = [
  '#1f5f8b',
  '#2e7d4f',
  '#b9770e',
  '#7d5ba6',
  '#c0392b',
  '#16a085',
  '#8e7c4b',
]
