import type { ReactNode } from 'react'

interface DrawerProps {
  ouvert: boolean
  titre: string
  onClose: () => void
  children: ReactNode
  /** Contenu collé en bas (boutons d'action). */
  pied?: ReactNode
}

/** Panneau latéral coulissant (détail d'une soumission). */
export function Drawer({ ouvert, titre, onClose, children, pied }: DrawerProps) {
  if (!ouvert) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(31, 41, 51, 0.35)',
          zIndex: 40,
        }}
      />
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(520px, 92vw)',
          background: 'var(--surface)',
          boxShadow: '-4px 0 16px rgba(31, 41, 51, 0.15)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
        }}
        role="dialog"
        aria-label={titre}
      >
        <header
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <h2 style={{ margin: 0 }}>{titre}</h2>
          <button
            className="btn"
            onClick={onClose}
            aria-label="Fermer"
            style={{ padding: '4px 12px' }}
          >
            ✕
          </button>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>{children}</div>

        {pied && (
          <footer
            style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
            }}
          >
            {pied}
          </footer>
        )}
      </aside>
    </>
  )
}
