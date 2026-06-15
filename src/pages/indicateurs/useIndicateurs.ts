import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Indicator, Submission } from '../../types/database'

export interface IndicateurCalcule {
  indicateur: Indicator
  /** Valeur atteinte calculée (null si mode manuel / non calculable). */
  valeurAtteinte: number | null
  /** Taux de réalisation en % (atteinte / cible). */
  taux: number
}

interface State {
  items: IndicateurCalcule[]
  loading: boolean
  error: string | null
}

/** Une soumission compte si elle n'est pas rejetée. */
function estComptee(s: Submission): boolean {
  return s.statut !== 'rejetee'
}

/**
 * Charge les indicateurs et calcule leur valeur atteinte selon mode_calcul :
 *  - comptage_soumissions : nombre de soumissions non rejetées du form_id
 *  - somme_champ          : somme de donnees[champ_source] sur ces soumissions
 *  - autres (manuel…)     : non calculé automatiquement (null)
 */
export function useIndicateurs(): State {
  const [state, setState] = useState<State>({
    items: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let annule = false

    async function charger() {
      setState({ items: [], loading: true, error: null })

      const [indRes, subRes] = await Promise.all([
        supabase.from('indicators').select('*').order('code', { ascending: true }),
        supabase
          .from('submissions')
          .select('id, form_id, statut, donnees'),
      ])

      if (annule) return

      if (indRes.error) {
        setState({ items: [], loading: false, error: indRes.error.message })
        return
      }
      if (subRes.error) {
        setState({ items: [], loading: false, error: subRes.error.message })
        return
      }

      const indicateurs = (indRes.data ?? []) as Indicator[]
      const soumissions = ((subRes.data ?? []) as Submission[]).filter(estComptee)

      const items: IndicateurCalcule[] = indicateurs.map((ind) => {
        const valeurAtteinte = calculerValeur(ind, soumissions)
        const taux =
          valeurAtteinte !== null && ind.cible > 0
            ? (valeurAtteinte / ind.cible) * 100
            : 0
        return { indicateur: ind, valeurAtteinte, taux }
      })

      setState({ items, loading: false, error: null })
    }

    charger()
    return () => {
      annule = true
    }
  }, [])

  return state
}

function calculerValeur(ind: Indicator, soumissions: Submission[]): number | null {
  if (!ind.form_id) {
    return ind.mode_calcul === 'comptage_soumissions' ||
      ind.mode_calcul === 'somme_champ'
      ? 0
      : null
  }

  const duForm = soumissions.filter((s) => s.form_id === ind.form_id)

  switch (ind.mode_calcul) {
    case 'comptage_soumissions':
      return duForm.length

    case 'somme_champ': {
      if (!ind.champ_source) return null
      let somme = 0
      for (const s of duForm) {
        const v = Number(s.donnees[ind.champ_source])
        if (!Number.isNaN(v)) somme += v
      }
      return somme
    }

    default:
      // 'manuel', 'moyenne_champ' : non gérés en calcul auto ici.
      return null
  }
}
