import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

const SECTIONS = [
  { to: '/validation', label: 'File de validation', icone: '✓' },
  { to: '/dashboard', label: 'Dashboard', icone: '▤' },
  { to: '/indicateurs', label: 'Indicateurs', icone: '▰' },
  { to: '/export', label: 'Export', icone: '↧' },
]

export function Sidebar() {
  const { profile, signOut } = useAuth()

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
      }}
    >
      <div style={{ padding: '20px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>
          SIGSE
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Suivi-évaluation
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {SECTIONS.map((s) => (
          <NavLink
            key={s.to}
            to={s.to}
            className="nav-link"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 'var(--radius)',
              marginBottom: 2,
              textDecoration: 'none',
              fontWeight: 500,
              color: isActive ? 'var(--primary)' : 'var(--text)',
              background: isActive ? 'var(--primary-light)' : 'transparent',
            })}
          >
            <span aria-hidden style={{ width: 18, textAlign: 'center' }}>
              {s.icone}
            </span>
            {s.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: 14, borderTop: '1px solid var(--border)' }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>
          {profile?.nom_complet ?? '—'}
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            textTransform: 'capitalize',
            marginBottom: 10,
          }}
        >
          {profile?.role ?? ''}
        </div>
        <button
          className="btn"
          onClick={signOut}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}
