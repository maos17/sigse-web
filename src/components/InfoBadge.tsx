/**
 * Badge discret pour les signalements informatifs (non bloquants).
 * Style sobre (bleu clair) + icône d'information, à ne pas confondre avec
 * les badges d'anomalies (vert/orange/rouge).
 */
export function InfoBadge({
  nombre,
  titre,
}: {
  nombre: number
  /** Texte d'infobulle, ex. la liste des types d'infos. */
  titre?: string
}) {
  if (nombre <= 0) {
    return <span className="text-muted">—</span>
  }
  return (
    <span className="badge badge-blue" title={titre} style={{ gap: 4 }}>
      <span aria-hidden>ℹ</span>
      {nombre}
    </span>
  )
}
