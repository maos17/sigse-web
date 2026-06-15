/** Couleur de la barre selon le taux de réalisation (%). */
function couleurTaux(taux: number): string {
  if (taux >= 100) return 'var(--green)'
  if (taux >= 50) return 'var(--orange)'
  return 'var(--red)'
}

export function ProgressBar({ taux }: { taux: number }) {
  const largeur = Math.max(0, Math.min(100, taux))
  return (
    <div
      style={{
        background: 'var(--border)',
        borderRadius: 999,
        height: 10,
        overflow: 'hidden',
      }}
      role="progressbar"
      aria-valuenow={Math.round(taux)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          width: `${largeur}%`,
          height: '100%',
          background: couleurTaux(taux),
          transition: 'width 0.3s',
        }}
      />
    </div>
  )
}

export { couleurTaux }
