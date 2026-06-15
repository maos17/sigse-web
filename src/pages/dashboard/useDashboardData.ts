import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Site, Submission } from '../../types/database'
import { jourISO } from '../../lib/format'

export interface PointGraphe {
  label: string
  valeur: number
}

export interface DashboardData {
  total: number
  validees: number
  enAttente: number
  rejetees: number
  /** Taux d'anomalies = soumissions avec ≥1 anomalie / total non rejetées. */
  tauxAnomalies: number
  parSexe: PointGraphe[]
  parAge: PointGraphe[]
  parAbri: PointGraphe[]
  parSite: PointGraphe[]
  parJour: PointGraphe[]
}

interface State {
  data: DashboardData | null
  loading: boolean
  error: string | null
}

const TRANCHES_AGE = ['<25', '25-34', '35-44', '45-59', '60+'] as const

function trancheAge(age: number): string {
  if (age < 25) return '<25'
  if (age < 35) return '25-34'
  if (age < 45) return '35-44'
  if (age < 60) return '45-59'
  return '60+'
}

/** Incrémente un compteur dans une Map. */
function incr(map: Map<string, number>, cle: string) {
  map.set(cle, (map.get(cle) ?? 0) + 1)
}

function mapVersPoints(map: Map<string, number>): PointGraphe[] {
  return [...map.entries()]
    .map(([label, valeur]) => ({ label, valeur }))
    .sort((a, b) => b.valeur - a.valeur)
}

export function useDashboardData(): State {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let annule = false

    async function charger() {
      setState({ data: null, loading: true, error: null })

      const [subRes, siteRes] = await Promise.all([
        supabase.from('submissions').select('*'),
        supabase.from('sites').select('*'),
      ])

      if (annule) return

      if (subRes.error) {
        setState({ data: null, loading: false, error: subRes.error.message })
        return
      }

      const toutes = (subRes.data ?? []) as Submission[]
      const sites = (siteRes.data ?? []) as Site[]
      const nomSite = new Map(sites.map((s) => [s.id, s.nom]))

      // Cartes de synthèse : sur l'ensemble des soumissions.
      const total = toutes.length
      const validees = toutes.filter((s) => s.statut === 'validee').length
      const rejetees = toutes.filter((s) => s.statut === 'rejetee').length
      const enAttente = toutes.filter((s) => s.statut === 'en_attente').length

      // Graphiques : uniquement les soumissions NON rejetées.
      const nonRejetees = toutes.filter((s) => s.statut !== 'rejetee')

      // Taux d'anomalies : on récupère les submission_id ayant ≥1 flag ouvert.
      let tauxAnomalies = 0
      const { data: flags, error: flagErr } = await supabase
        .from('quality_flags')
        .select('submission_id, resolu, severite')
        .eq('resolu', false)
        .eq('severite', 'anomalie')

      if (annule) return
      if (!flagErr && flags) {
        const idsAvecAnomalie = new Set(
          flags.map((f) => (f as { submission_id: string }).submission_id),
        )
        const nbAvec = nonRejetees.filter((s) => idsAvecAnomalie.has(s.id)).length
        tauxAnomalies =
          nonRejetees.length > 0 ? (nbAvec / nonRejetees.length) * 100 : 0
      }

      // Agrégations
      const mSexe = new Map<string, number>()
      const mAge = new Map<string, number>()
      const mAbri = new Map<string, number>()
      const mSite = new Map<string, number>()
      const mJour = new Map<string, number>()

      // Initialise les tranches d'âge dans l'ordre.
      TRANCHES_AGE.forEach((t) => mAge.set(t, 0))

      for (const s of nonRejetees) {
        const d = s.donnees

        const sexe = d['sexe_chef']
        incr(mSexe, sexe ? String(sexe) : 'Non renseigné')

        const ageBrut = d['age_chef']
        const age = Number(ageBrut)
        if (ageBrut !== undefined && ageBrut !== null && !Number.isNaN(age)) {
          incr(mAge, trancheAge(age))
        }

        const abri = d['abri']
        incr(mAbri, abri ? String(abri) : 'Non renseigné')

        const site = s.site_id ? nomSite.get(s.site_id) ?? 'Site inconnu' : 'Sans site'
        incr(mSite, site)

        incr(mJour, jourISO(s.synced_at))
      }

      // Tranches d'âge dans l'ordre fixe défini.
      const parAge = TRANCHES_AGE.map((t) => ({
        label: t,
        valeur: mAge.get(t) ?? 0,
      }))

      // Courbe par jour triée chronologiquement.
      const parJour = [...mJour.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([label, valeur]) => ({ label, valeur }))

      setState({
        data: {
          total,
          validees,
          enAttente,
          rejetees,
          tauxAnomalies,
          parSexe: mapVersPoints(mSexe),
          parAge,
          parAbri: mapVersPoints(mAbri),
          parSite: mapVersPoints(mSite),
          parJour,
        },
        loading: false,
        error: null,
      })
    }

    charger()
    return () => {
      annule = true
    }
  }, [])

  return state
}
