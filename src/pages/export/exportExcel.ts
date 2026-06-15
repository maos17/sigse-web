import * as XLSX from 'xlsx'
import { supabase } from '../../lib/supabase'
import type {
  FormQuestion,
  Profile,
  Site,
  Submission,
} from '../../types/database'
import { formatDateTime, libelleStatut, valeurAffichable } from '../../lib/format'

export interface ResultatExport {
  nbLignes: number
  nomFichier: string
}

/**
 * Génère un fichier .xlsx : une ligne par soumission, une colonne par question
 * du formulaire (JSONB aplati), plus enquêteur, site, statut et date.
 * Déclenche le téléchargement dans le navigateur.
 */
export async function exporterSoumissions(): Promise<ResultatExport> {
  const [subRes, qRes, siteRes, profRes] = await Promise.all([
    supabase.from('submissions').select('*').order('synced_at', { ascending: true }),
    supabase.from('form_questions').select('*').order('ordre', { ascending: true }),
    supabase.from('sites').select('*'),
    supabase.from('profiles').select('id, nom_complet, role, telephone, actif, created_at'),
  ])

  const erreur =
    subRes.error || qRes.error || siteRes.error || profRes.error
  if (erreur) {
    throw new Error(erreur.message)
  }

  const soumissions = (subRes.data ?? []) as Submission[]
  const questions = (qRes.data ?? []) as FormQuestion[]
  const sites = (siteRes.data ?? []) as Site[]
  const profils = (profRes.data ?? []) as Profile[]

  const nomSite = new Map(sites.map((s) => [s.id, s.nom]))
  const nomEnqueteur = new Map(profils.map((p) => [p.id, p.nom_complet]))

  // Colonnes des questions, ordonnées et dédupliquées par code (multi-formulaires).
  const codesVus = new Set<string>()
  const colonnesQuestions: { code: string; libelle: string }[] = []
  for (const q of questions) {
    if (!codesVus.has(q.code)) {
      codesVus.add(q.code)
      colonnesQuestions.push({ code: q.code, libelle: q.libelle })
    }
  }

  // Construction des lignes (objets clé=libellé de colonne).
  const lignes = soumissions.map((s) => {
    const ligne: Record<string, string> = {
      Enquêteur: nomEnqueteur.get(s.enqueteur_id) ?? s.enqueteur_id,
      Site: s.site_id ? nomSite.get(s.site_id) ?? 'Site inconnu' : 'Sans site',
      Statut: libelleStatut(s.statut),
      Date: formatDateTime(s.synced_at),
    }
    for (const col of colonnesQuestions) {
      ligne[col.libelle] = valeurAffichable(s.donnees[col.code])
    }
    return ligne
  })

  // En-têtes : colonnes méta d'abord, puis les questions.
  const enTetes = [
    'Enquêteur',
    'Site',
    'Statut',
    'Date',
    ...colonnesQuestions.map((c) => c.libelle),
  ]

  const feuille = XLSX.utils.json_to_sheet(lignes, { header: enTetes })
  feuille['!cols'] = enTetes.map(() => ({ wch: 20 }))

  const classeur = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(classeur, feuille, 'Soumissions')

  const date = new Date().toISOString().slice(0, 10)
  const nomFichier = `sigse_soumissions_${date}.xlsx`
  XLSX.writeFile(classeur, nomFichier)

  return { nbLignes: lignes.length, nomFichier }
}
