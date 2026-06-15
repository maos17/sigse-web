/** Badge coloré selon le nombre d'anomalies ouvertes : 0 vert, 1-2 orange, 3+ rouge. */
export function couleurAnomalies(n: number): 'green' | 'orange' | 'red' {
  if (n <= 0) return 'green'
  if (n <= 2) return 'orange'
  return 'red'
}

export function AnomalieBadge({ nombre }: { nombre: number }) {
  const couleur = couleurAnomalies(nombre)
  return <span className={`badge badge-${couleur}`}>{nombre}</span>
}
