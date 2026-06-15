import { useIndicateurs } from './useIndicateurs'
import { IndicateurCard } from './IndicateurCard'
import { Spinner } from '../../components/Spinner'
import { EmptyState } from '../../components/EmptyState'

export function IndicateursPage() {
  const { items, loading, error } = useIndicateurs()

  return (
    <div>
      <header style={{ marginBottom: 20 }}>
        <h1>Indicateurs</h1>
        <p className="text-muted" style={{ margin: 0 }}>
          Cadre logique : valeurs atteintes calculées sur les soumissions non
          rejetées.
        </p>
      </header>

      {loading && <Spinner label="Calcul des indicateurs…" />}
      {error && <p className="error-text">Erreur : {error}</p>}

      {!loading && !error && items.length === 0 && (
        <EmptyState titre="Aucun indicateur défini" />
      )}

      {!loading && !error && items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map((item) => (
            <IndicateurCard key={item.indicateur.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
