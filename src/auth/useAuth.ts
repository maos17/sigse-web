import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un <AuthProvider>")
  }
  return ctx
}

/** Rôles autorisés à accéder à l'interface d'administration. */
export const ROLES_AUTORISES = ['superviseur', 'analyste', 'admin'] as const
