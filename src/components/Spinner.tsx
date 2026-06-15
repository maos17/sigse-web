interface SpinnerProps {
  /** Centre le spinner dans toute la fenêtre. */
  plein?: boolean
  label?: string
}

export function Spinner({ plein = false, label }: SpinnerProps) {
  const contenu = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        color: 'var(--text-muted)',
      }}
    >
      <div className="spinner-circle" />
      {label && <span>{label}</span>}
    </div>
  )

  return (
    <>
      <style>{`
        .spinner-circle {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      {plein ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {contenu}
        </div>
      ) : (
        <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
          {contenu}
        </div>
      )}
    </>
  )
}
