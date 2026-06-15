import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { SoumissionQualite } from '../../types/database'

interface State {
  lignes: SoumissionQualite[]
  loading: boolean
  error: string | null
}

/**
 * Charge la vue v_soumissions_qualite, triée par anomalies ouvertes
 * décroissantes (les soumissions les plus problématiques en tête).
 * Expose `recharger` pour rafraîchir après une validation/rejet.
 */
export function useSubmissionsQualite() {
  const [state, setState] = useState<State>({
    lignes: [],
    loading: true,
    error: null,
  })

  const recharger = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))

    const { data, error } = await supabase
      .from('v_soumissions_qualite')
      .select('*')
      .order('anomalies_ouvertes', { ascending: false })
      .order('synced_at', { ascending: false })

    if (error) {
      setState({ lignes: [], loading: false, error: error.message })
    } else {
      setState({
        lignes: (data ?? []) as SoumissionQualite[],
        loading: false,
        error: null,
      })
    }
  }, [])

  useEffect(() => {
    recharger()
  }, [recharger])

  return { ...state, recharger }
}
