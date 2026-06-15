import type { StatutSoumission, TypeAnomalie } from '../types/database'

const dateFormat = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const dateTimeFormat = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const numberFormat = new Intl.NumberFormat('fr-FR')

/** Formate une date ISO en JJ/MM/AAAA. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : dateFormat.format(d)
}

/** Formate une date ISO en JJ/MM/AAAA HH:MM. */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : dateTimeFormat.format(d)
}

/** Renvoie la portion AAAA-MM-JJ d'une date ISO (pour le regroupement par jour). */
export function jourISO(iso: string): string {
  return iso.slice(0, 10)
}

/** Formate un nombre selon la locale française. */
export function formatNombre(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return numberFormat.format(n)
}

/** Formate une durée en secondes sous forme « 2 min 05 s ». */
export function formatDuree(secondes: number | null | undefined): string {
  if (secondes === null || secondes === undefined) return '—'
  const min = Math.floor(secondes / 60)
  const s = secondes % 60
  if (min === 0) return `${s} s`
  return `${min} min ${String(s).padStart(2, '0')} s`
}

const LIBELLES_STATUT: Record<StatutSoumission, string> = {
  en_attente: 'En attente',
  validee: 'Validée',
  rejetee: 'Rejetée',
}

export function libelleStatut(statut: StatutSoumission): string {
  return LIBELLES_STATUT[statut] ?? statut
}

const LIBELLES_ANOMALIE: Record<TypeAnomalie, string> = {
  saisie_trop_rapide: 'Saisie trop rapide',
  gps_hors_zone: 'GPS hors zone',
  gps_manquant: 'GPS manquant',
  doublon_probable: 'Doublon probable',
  valeur_aberrante: 'Valeur aberrante',
  champ_obligatoire_vide: 'Champ obligatoire vide',
}

export function libelleAnomalie(type: string): string {
  return LIBELLES_ANOMALIE[type as TypeAnomalie] ?? type
}

/**
 * Met en forme la liste de types agrégée par la vue (array_agg → string[],
 * ex. ["saisie_trop_rapide", "gps_hors_zone"]) en libellés lisibles séparés
 * par des virgules. Les types connus sont traduits en français ; les autres
 * voient simplement leurs underscores remplacés par des espaces.
 * Renvoie "—" si la liste est nulle ou vide.
 */
export function formatTypesListe(types: string[] | null | undefined): string {
  if (!types || types.length === 0) return '—'
  return types
    .map((t) => {
      const libelle = libelleAnomalie(t)
      return libelle === t ? t.replace(/_/g, ' ') : libelle
    })
    .join(', ')
}

/** Convertit une valeur JSONB en chaîne affichable. */
export function valeurAffichable(v: unknown): string {
  if (v === null || v === undefined || v === '') return '—'
  if (Array.isArray(v)) return v.join(', ')
  if (typeof v === 'boolean') return v ? 'Oui' : 'Non'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}
