// Types TypeScript reflétant le schéma PostgreSQL du backend SIGSE.
// Volontairement partiels : seuls les champs utilisés par l'app web sont typés.

export type RoleUtilisateur = 'enqueteur' | 'superviseur' | 'analyste' | 'admin'

export type StatutSoumission = 'en_attente' | 'validee' | 'rejetee'

export type TypeQuestion =
  | 'texte'
  | 'nombre'
  | 'choix_unique'
  | 'choix_multiple'
  | 'date'
  | 'gps'
  | 'photo'
  | 'note'

export type ModeCalcul =
  | 'manuel'
  | 'comptage_soumissions'
  | 'somme_champ'
  | 'moyenne_champ'

export interface Profile {
  id: string
  nom_complet: string
  telephone: string | null
  role: RoleUtilisateur
  actif: boolean
  created_at: string
}

/** Données JSONB d'une soumission : { code_question: valeur } */
export type DonneesSoumission = Record<string, unknown>

export interface Submission {
  id: string
  form_id: string
  form_version: number
  site_id: string | null
  enqueteur_id: string
  donnees: DonneesSoumission
  statut: StatutSoumission
  commentaire_validation: string | null
  valide_par: string | null
  latitude: number | null
  longitude: number | null
  duree_saisie_secondes: number | null
  device_id: string | null
  uuid_local: string | null
  demarre_le: string | null
  termine_le: string | null
  synced_at: string
}

export interface FormQuestion {
  id: string
  form_id: string
  ordre: number
  code: string
  libelle: string
  type: TypeQuestion
  obligatoire: boolean
  options: string[] | null
  contraintes: Record<string, unknown> | null
  condition: Record<string, unknown> | null
}

export interface Site {
  id: string
  project_id: string
  nom: string
  latitude: number | null
  longitude: number | null
  rayon_metres: number | null
  created_at: string
}

export type TypeAnomalie =
  | 'saisie_trop_rapide'
  | 'gps_hors_zone'
  | 'gps_manquant'
  | 'doublon_probable'
  | 'valeur_aberrante'
  | 'champ_obligatoire_vide'

export interface QualityFlag {
  id: string
  submission_id: string
  type: TypeAnomalie
  detail: string | null
  resolu: boolean
  resolu_par: string | null
  created_at: string
}

export interface Indicator {
  id: string
  project_id: string
  code: string
  libelle: string
  unite: string | null
  baseline: number | null
  cible: number
  mode_calcul: ModeCalcul
  form_id: string | null
  champ_source: string | null
  filtre: Record<string, unknown> | null
}

/** Ligne de la vue v_soumissions_qualite. */
export interface SoumissionQualite {
  id: string
  formulaire: string | null
  enqueteur: string | null
  statut: StatutSoumission
  nom_chef_menage: string | null
  duree_saisie_secondes: number | null
  synced_at: string
  anomalies_ouvertes: number
  types_anomalies: string | null
}
