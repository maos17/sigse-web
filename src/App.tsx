import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { RequireRole } from './auth/RequireRole'
import { LoginPage } from './pages/LoginPage'
import { AccesRefuse } from './pages/AccesRefuse'
import { ValidationPage } from './pages/validation/ValidationPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { IndicateursPage } from './pages/indicateurs/IndicateursPage'
import { ExportPage } from './pages/export/ExportPage'

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/acces-refuse" element={<AccesRefuse />} />

      <Route
        element={
          <RequireRole>
            <Layout />
          </RequireRole>
        }
      >
        <Route path="/validation" element={<ValidationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/indicateurs" element={<IndicateursPage />} />
        <Route path="/export" element={<ExportPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/validation" replace />} />
      <Route path="*" element={<Navigate to="/validation" replace />} />
    </Routes>
  )
}
