import type { IndicateurCalcule } from './useIndicateurs'
import { ProgressBar, couleurTaux } from '../../components/ProgressBar'
import { formatNombre } from '../../lib/format'

const LIBELLES_MODE: Record<string, string> = {
  manuel: 'Saisie manuelle',
  comptage_soumissions: 'Comptage de soumissions',
  somme_champ: 'Somme de champ',
  moyenne_champ: 'Moyenne de champ',
}

export function IndicateurCard({ item }: { item: IndicateurCalcule }) {
  const { indicateur: ind, valeurAtteinte, taux } = item
  const calculable = valeurAtteinte !== null
  const unite = ind.unite ? ` ${ind.unite}` : ''

  return (
    <div className="card" style={{ padding: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          marginBottom: 4,
        }}
      >
        <div>
          <span className="badge badge-blue" style={{ marginRight: 8 }}>
            {ind.code}
          </span>
          <span style={{ fontWeight: 600 }}>{ind.libelle}</span>
        </div>
        <span className="badge badge-gray">
          {LIBELLES_MODE[ind.mode_calcul] ?? ind.mode_calcul}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 28,
          margin: '16px 0 12px',
          flexWrap: 'wrap',
        }}
      >
        <Chiffre label="Baseline" valeur={`${formatNombre(ind.baseline ?? 0)}${unite}`} />
        <Chiffre
          label="Atteint"
          valeur={calculable ? `${formatNombre(valeurAtteinte)}${unite}` : '—'}
          accent
        />
        <Chiffre label="Cible" valeur={`${formatNombre(ind.cible)}${unite}`} />
      </div>

      {calculable ? (
        <>
          <ProgressBar taux={taux} />
          <div
            style={{
              marginTop: 6,
              fontWeight: 600,
              color: couleurTaux(taux),
              textAlign: 'right',
            }}
          >
            {taux.toFixed(1)} % de réalisation
          </div>
        </>
      ) : (
        <p className="text-muted" style={{ margin: 0 }}>
          Indicateur en saisie manuelle — pas de calcul automatique.
        </p>
      )}
    </div>
  )
}

function Chiffre({
  label,
  valeur,
  accent = false,
}: {
  label: string
  valeur: string
  accent?: boolean
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          color: 'var(--text-muted)',
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: accent ? 'var(--primary)' : 'var(--text)',
        }}
      >
        {valeur}
      </div>
    </div>
  )
}
