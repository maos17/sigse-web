import { useState } from 'react'
import { useSubmissionsQualite } from './useSubmissionsQualite'
import { SubmissionDetail } from './SubmissionDetail'
import { AnomalieBadge } from '../../components/AnomalieBadge'
import { InfoBadge } from '../../components/InfoBadge'
import { StatutBadge } from '../../components/StatutBadge'
import { Spinner } from '../../components/Spinner'
import { EmptyState } from '../../components/EmptyState'
import { formatDateTime, formatDuree, formatTypesListe } from '../../lib/format'
import type { SoumissionQualite } from '../../types/database'

export function ValidationPage() {
  const { lignes, loading, error, recharger } = useSubmissionsQualite()
  const [selection, setSelection] = useState<SoumissionQualite | null>(null)

  return (
    <div>
      <header style={{ marginBottom: 20 }}>
        <h1>File de validation</h1>
        <p className="text-muted" style={{ margin: 0 }}>
          Soumissions triées par nombre d'anomalies ouvertes. Cliquez sur une
          ligne pour examiner le détail.
        </p>
      </header>

      {loading && <Spinner label="Chargement des soumissions…" />}
      {error && <p className="error-text">Erreur : {error}</p>}

      {!loading && !error && lignes.length === 0 && (
        <EmptyState titre="Aucune soumission">
          La file de validation est vide pour le moment.
        </EmptyState>
      )}

      {!loading && !error && lignes.length > 0 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Anomalies</th>
                <th>Infos</th>
                <th>Chef de ménage</th>
                <th>Formulaire</th>
                <th>Enquêteur</th>
                <th>Statut</th>
                <th>Durée</th>
                <th>Synchronisé</th>
                <th>Types d'anomalies</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((l) => (
                <tr
                  key={l.id}
                  className={selection?.id === l.id ? 'selected' : ''}
                  onClick={() => setSelection(l)}
                >
                  <td>
                    <AnomalieBadge nombre={l.anomalies_ouvertes} />
                  </td>
                  <td>
                    <InfoBadge
                      nombre={l.infos_ouvertes}
                      titre={
                        l.types_infos && l.types_infos.length > 0
                          ? formatTypesListe(l.types_infos)
                          : undefined
                      }
                    />
                  </td>
                  <td style={{ fontWeight: 500 }}>{l.nom_chef_menage || '—'}</td>
                  <td>{l.formulaire || '—'}</td>
                  <td>{l.enqueteur || '—'}</td>
                  <td>
                    <StatutBadge statut={l.statut} />
                  </td>
                  <td>{formatDuree(l.duree_saisie_secondes)}</td>
                  <td className="text-muted">{formatDateTime(l.synced_at)}</td>
                  <td
                    className="text-muted"
                    style={{ fontSize: 12, maxWidth: 200 }}
                  >
                    {formatTypesListe(l.types_anomalies)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SubmissionDetail
        ligne={selection}
        onClose={() => setSelection(null)}
        onTraite={recharger}
      />
    </div>
  )
}
