import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type {
  FormQuestion,
  QualityFlag,
  Submission,
  SoumissionQualite,
} from '../../types/database'
import { Drawer } from '../../components/Drawer'
import { Spinner } from '../../components/Spinner'
import { StatutBadge } from '../../components/StatutBadge'
import { libelleAnomalie, valeurAffichable } from '../../lib/format'
import { useAuth } from '../../auth/useAuth'

interface Props {
  ligne: SoumissionQualite | null
  onClose: () => void
  /** Appelé après une validation/rejet réussi pour rafraîchir la liste. */
  onTraite: () => void
}

interface Detail {
  submission: Submission
  questions: FormQuestion[]
  flags: QualityFlag[]
}

export function SubmissionDetail({ ligne, onClose, onTraite }: Props) {
  const { profile } = useAuth()
  const [detail, setDetail] = useState<Detail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Saisie du rejet
  const [modeRejet, setModeRejet] = useState(false)
  const [commentaire, setCommentaire] = useState('')
  const [action, setAction] = useState<'valider' | 'rejeter' | null>(null)

  useEffect(() => {
    if (!ligne) return
    let annule = false

    async function charger(id: string) {
      setLoading(true)
      setError(null)
      setModeRejet(false)
      setCommentaire('')

      const [subRes, flagsRes] = await Promise.all([
        supabase.from('submissions').select('*').eq('id', id).single(),
        supabase
          .from('quality_flags')
          .select('*')
          .eq('submission_id', id)
          .order('created_at', { ascending: true }),
      ])

      if (annule) return

      if (subRes.error) {
        setError(subRes.error.message)
        setLoading(false)
        return
      }

      const sub = subRes.data as Submission

      const { data: questions, error: qErr } = await supabase
        .from('form_questions')
        .select('*')
        .eq('form_id', sub.form_id)
        .order('ordre', { ascending: true })

      if (annule) return

      if (qErr) {
        setError(qErr.message)
        setLoading(false)
        return
      }

      setDetail({
        submission: sub,
        questions: (questions ?? []) as FormQuestion[],
        flags: (flagsRes.data ?? []) as QualityFlag[],
      })
      setLoading(false)
    }

    charger(ligne.id)
    return () => {
      annule = true
    }
  }, [ligne])

  async function valider() {
    if (!detail) return
    setAction('valider')
    setError(null)

    const { error } = await supabase
      .from('submissions')
      .update({
        statut: 'validee',
        valide_par: profile?.id ?? null,
        commentaire_validation: null,
      })
      .eq('id', detail.submission.id)

    setAction(null)
    if (error) {
      setError(error.message)
    } else {
      onTraite()
      onClose()
    }
  }

  async function rejeter() {
    if (!detail) return
    if (commentaire.trim() === '') {
      setError('Un commentaire est obligatoire pour rejeter une soumission.')
      return
    }
    setAction('rejeter')
    setError(null)

    const { error } = await supabase
      .from('submissions')
      .update({
        statut: 'rejetee',
        valide_par: profile?.id ?? null,
        commentaire_validation: commentaire.trim(),
      })
      .eq('id', detail.submission.id)

    setAction(null)
    if (error) {
      setError(error.message)
    } else {
      onTraite()
      onClose()
    }
  }

  const pied = detail ? (
    modeRejet ? (
      <>
        <button
          className="btn"
          onClick={() => setModeRejet(false)}
          disabled={action !== null}
        >
          Annuler
        </button>
        <button
          className="btn btn-danger"
          onClick={rejeter}
          disabled={action !== null}
        >
          {action === 'rejeter' ? 'Rejet…' : 'Confirmer le rejet'}
        </button>
      </>
    ) : (
      <>
        <button
          className="btn btn-danger"
          onClick={() => setModeRejet(true)}
          disabled={action !== null}
        >
          Rejeter
        </button>
        <button
          className="btn btn-success"
          onClick={valider}
          disabled={action !== null}
        >
          {action === 'valider' ? 'Validation…' : 'Valider'}
        </button>
      </>
    )
  ) : undefined

  return (
    <Drawer
      ouvert={ligne !== null}
      titre={ligne?.nom_chef_menage || 'Détail de la soumission'}
      onClose={onClose}
      pied={pied}
    >
      {loading && <Spinner label="Chargement du détail…" />}
      {error && <p className="error-text">{error}</p>}

      {detail && !loading && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <StatutBadge statut={detail.submission.statut} />
            <span className="text-muted">
              {detail.questions.length} question(s) · {detail.flags.length}{' '}
              anomalie(s)
            </span>
          </div>

          {modeRejet && (
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="commentaire">Motif du rejet (obligatoire)</label>
              <textarea
                id="commentaire"
                rows={3}
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Expliquez la raison du rejet…"
              />
            </div>
          )}

          {/* Anomalies */}
          <section style={{ marginBottom: 28 }}>
            <h3>Anomalies détectées</h3>
            {detail.flags.length === 0 ? (
              <p className="text-muted">Aucune anomalie.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                {detail.flags.map((f) => (
                  <li
                    key={f.id}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      marginBottom: 8,
                      background: f.resolu ? '#fafbfc' : 'var(--red-bg)',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>
                      {libelleAnomalie(f.type)}
                      {f.resolu && (
                        <span
                          className="badge badge-green"
                          style={{ marginLeft: 8 }}
                        >
                          Résolue
                        </span>
                      )}
                    </div>
                    {f.detail && (
                      <div className="text-muted" style={{ fontSize: 13 }}>
                        {f.detail}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Réponses */}
          <section>
            <h3>Réponses</h3>
            <table className="table" style={{ fontSize: 13 }}>
              <tbody>
                {detail.questions.map((q) => (
                  <tr key={q.id} style={{ cursor: 'default' }}>
                    <td style={{ width: '45%', fontWeight: 500 }}>{q.libelle}</td>
                    <td>{valeurAffichable(detail.submission.donnees[q.code])}</td>
                  </tr>
                ))}
                {ReponsesHorsFormulaire(detail)}
              </tbody>
            </table>

            {detail.submission.commentaire_validation && (
              <p style={{ marginTop: 16 }}>
                <strong>Commentaire de validation :</strong>{' '}
                {detail.submission.commentaire_validation}
              </p>
            )}
          </section>
        </>
      )}
    </Drawer>
  )
}

/** Affiche les clés de `donnees` qui ne correspondent à aucune question connue. */
function ReponsesHorsFormulaire(detail: Detail) {
  const codesConnus = new Set(detail.questions.map((q) => q.code))
  const extra = Object.keys(detail.submission.donnees).filter(
    (k) => !codesConnus.has(k),
  )
  if (extra.length === 0) return null

  return extra.map((k) => (
    <tr key={`extra-${k}`} style={{ cursor: 'default' }}>
      <td style={{ width: '45%', fontWeight: 500 }} className="text-muted">
        {k}
      </td>
      <td>{valeurAffichable(detail.submission.donnees[k])}</td>
    </tr>
  ))
}
