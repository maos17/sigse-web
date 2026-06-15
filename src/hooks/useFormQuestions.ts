import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { FormQuestion } from '../types/database'

interface State {
  questions: FormQuestion[]
  loading: boolean
  error: string | null
}

/**
 * Charge les questions d'un formulaire (ordonnées), ou de tous les formulaires
 * si `formId` est omis. Sert au mapping code→libellé (détail, export).
 */
export function useFormQuestions(formId?: string): State {
  const [state, setState] = useState<State>({
    questions: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let annule = false

    async function charger() {
      setState((s) => ({ ...s, loading: true, error: null }))

      let req = supabase
        .from('form_questions')
        .select('*')
        .order('ordre', { ascending: true })

      if (formId) req = req.eq('form_id', formId)

      const { data, error } = await req
      if (annule) return

      if (error) {
        setState({ questions: [], loading: false, error: error.message })
      } else {
        setState({
          questions: (data ?? []) as FormQuestion[],
          loading: false,
          error: null,
        })
      }
    }

    charger()
    return () => {
      annule = true
    }
  }, [formId])

  return state
}
