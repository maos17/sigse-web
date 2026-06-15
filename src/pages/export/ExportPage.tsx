import { useState } from 'react'
import { exporterSoumissions } from './exportExcel'

export function ExportPage() {
  const [enCours, setEnCours] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [erreur, setErreur] = useState<string | null>(null)

  async function onExport() {
    setEnCours(true)
    setMessage(null)
    setErreur(null)
    try {
      const res = await exporterSoumissions()
      setMessage(
        `Export terminé : ${res.nbLignes} soumission(s) exportée(s) dans ${res.nomFichier}.`,
      )
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Échec de l'export.")
    } finally {
      setEnCours(false)
    }
  }

  return (
    <div>
      <header style={{ marginBottom: 20 }}>
        <h1>Export</h1>
        <p className="text-muted" style={{ margin: 0 }}>
          Génère un fichier Excel des soumissions, avec une colonne par question
          du formulaire.
        </p>
      </header>

      <div className="card" style={{ padding: 28, maxWidth: 560 }}>
        <h2>Exporter les soumissions</h2>
        <p className="text-muted">
          Le fichier contient une ligne par soumission et une colonne par
          question (données aplaties), ainsi que l'enquêteur, le site, le statut
          et la date de synchronisation.
        </p>

        <button
          className="btn btn-primary"
          onClick={onExport}
          disabled={enCours}
        >
          {enCours ? 'Génération…' : 'Exporter les soumissions en Excel'}
        </button>

        {message && (
          <p style={{ marginTop: 16, color: 'var(--green)' }}>{message}</p>
        )}
        {erreur && (
          <p className="error-text" style={{ marginTop: 16 }}>
            Erreur : {erreur}
          </p>
        )}
      </div>
    </div>
  )
}
