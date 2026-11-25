import { useState } from 'react'
import SideNav from './SideNav'
import TopBar from './TopBar'

/**
 * Root layout shell.
 * Props:
 *   activeSection  – string
 *   onNavigate     – (id: string) => void
 *   healthProps    – { status, loading, error }
 *   children       – main content
 */
export default function Layout({ activeSection, onNavigate, healthProps, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      <div
        className={`mobile-overlay${mobileOpen ? ' open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <div className={mobileOpen ? 'sidebar mobile-open' : ''}>
        <SideNav
          activeSection={activeSection}
          onNavigate={(id) => { onNavigate(id); setMobileOpen(false) }}
          healthProps={healthProps}
        />
      </div>

      {/* Main */}
      <div className="main-area">
        <TopBar onMenuToggle={() => setMobileOpen(o => !o)} />
        {children}
      </div>
    </div>
  )
}
