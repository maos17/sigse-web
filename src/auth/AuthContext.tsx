import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'

interface AuthState {
  /** Session Supabase courante (null si déconnecté). */
  session: Session | null
  /** Profil applicatif lié à l'utilisateur (rôle, nom…). */
  profile: Profile | null
  /** true tant que la session ou le profil sont en cours de chargement. */
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Session initiale puis abonnement aux changements d'auth.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    let annule = false

    async function chargerProfil() {
      if (!session?.user) {
        setProfile(null)
        setLoading(false)
        return
      }

      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (annule) return

      if (error) {
        console.error('Échec du chargement du profil :', error.message)
        setProfile(null)
      } else {
        setProfile(data as Profile)
      }
      setLoading(false)
    }

    chargerProfil()
    return () => {
      annule = true
    }
  }, [session])

  async function signOut() {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
