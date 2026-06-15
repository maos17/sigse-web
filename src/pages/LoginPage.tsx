import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/useAuth'

export function LoginPage() {
  const { session, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, setEnCours] = useState(false)

  // Déjà connecté : on laisse RequireRole / la redirection faire le travail.
  if (!loading && session) {
    return <Navigate to="/validation" replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: motDePasse,
    })

    setEnCours(false)
    if (error) {
      setErreur('Identifiants incorrects ou compte inexistant.')
    }
    // En cas de succès, onAuthStateChange met à jour la session → redirection.
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: 380, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>
            SIGSE
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Administration — Suivi-évaluation
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="email">Adresse e-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label htmlFor="mdp">Mot de passe</label>
            <input
              id="mdp"
              type="password"
              autoComplete="current-password"
              required
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
            />
          </div>

          {erreur && (
            <p className="error-text" style={{ marginTop: 0, marginBottom: 16 }}>
              {erreur}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={enCours}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {enCours ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
