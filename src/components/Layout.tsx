import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div>
      <Sidebar />
      <main
        style={{
          marginLeft: 'var(--sidebar-width)',
          padding: '28px 32px',
          maxWidth: 1280,
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}
