import type { StatutSoumission } from '../types/database'
import { libelleStatut } from '../lib/format'

const COULEURS: Record<StatutSoumission, string> = {
  en_attente: 'badge-orange',
  validee: 'badge-green',
  rejetee: 'badge-red',
}

export function StatutBadge({ statut }: { statut: StatutSoumission }) {
  return <span className={`badge ${COULEURS[statut]}`}>{libelleStatut(statut)}</span>
}
