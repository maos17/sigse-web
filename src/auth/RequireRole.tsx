import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ROLES_AUTORISES, useAuth } from './useAuth'
import { Spinner } from '../components/Spinner'

/**
 * Garde de route :
 *  - non connecté  → redirection vers /login
 *  - connecté sans rôle autorisé (ex. enquêteur) → page « Accès réservé »
 *  - connecté + rôle autorisé → contenu protégé
 */
export function RequireRole({ children }: { children: ReactNode }) {
  const { session, profile, loading } = useAuth()

  if (loading) {
    return <Spinner plein label="Chargement…" />
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  const autorise =
    profile != null &&
    (ROLES_AUTORISES as readonly string[]).includes(profile.role)

  if (!autorise) {
    return <Navigate to="/acces-refuse" replace />
  }

  return <>{children}</>
}
