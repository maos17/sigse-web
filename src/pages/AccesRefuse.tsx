import { useAuth } from '../auth/useAuth'

export function AccesRefuse() {
  const { profile, signOut } = useAuth()

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
      <div
        className="card"
        style={{ maxWidth: 440, padding: 36, textAlign: 'center' }}
      >
        <div style={{ fontSize: 40, marginBottom: 8 }}>🔒</div>
        <h1>Accès réservé aux superviseurs</h1>
        <p className="text-muted" style={{ marginBottom: 24 }}>
          {profile
            ? `Votre compte (${profile.nom_complet}) a le rôle « ${profile.role} ». `
            : ''}
          Cette interface d'administration est réservée aux superviseurs,
          analystes et administrateurs.
        </p>
        <button className="btn" onClick={signOut}>
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
