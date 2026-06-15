import { useDashboardData } from './useDashboardData'
import { StatCard } from '../../components/StatCard'
import { Spinner } from '../../components/Spinner'
import { EmptyState } from '../../components/EmptyState'
import { SexeChart } from './charts/SexeChart'
import { AgeChart } from './charts/AgeChart'
import { AbriChart } from './charts/AbriChart'
import { SiteChart } from './charts/SiteChart'
import { SoumissionsParJour } from './charts/SoumissionsParJour'
import { formatNombre } from '../../lib/format'

export function DashboardPage() {
  const { data, loading, error } = useDashboardData()

  return (
    <div>
      <header style={{ marginBottom: 20 }}>
        <h1>Dashboard</h1>
        <p className="text-muted" style={{ margin: 0 }}>
          Vue d'ensemble des collectes. Les graphiques excluent les soumissions
          rejetées.
        </p>
      </header>

      {loading && <Spinner label="Calcul des indicateurs…" />}
      {error && <p className="error-text">Erreur : {error}</p>}

      {data && !loading && (
        <>
          {/* Cartes de synthèse */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <StatCard label="Total soumissions" valeur={formatNombre(data.total)} />
            <StatCard
              label="Validées"
              valeur={formatNombre(data.validees)}
              accent="green"
            />
            <StatCard
              label="En attente"
              valeur={formatNombre(data.enAttente)}
              accent="orange"
            />
            <StatCard
              label="Rejetées"
              valeur={formatNombre(data.rejetees)}
              accent="red"
            />
            <StatCard
              label="Taux d'anomalies"
              valeur={`${data.tauxAnomalies.toFixed(1)} %`}
              accent="blue"
            />
          </div>

          {data.total === 0 ? (
            <EmptyState titre="Aucune donnée à représenter">
              Les graphiques apparaîtront dès la première soumission.
            </EmptyState>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                gap: 16,
              }}
            >
              <SexeChart data={data.parSexe} />
              <AgeChart data={data.parAge} />
              <AbriChart data={data.parAbri} />
              <SiteChart data={data.parSite} />
              <div style={{ gridColumn: '1 / -1' }}>
                <SoumissionsParJour data={data.parJour} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
