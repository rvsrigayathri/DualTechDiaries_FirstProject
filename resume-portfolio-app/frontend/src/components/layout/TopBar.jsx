import { useAuth } from '../../context/AuthContext'

/**
 * Mobile-only top bar with hamburger menu and dashboard button.
 * Props:
 *   onMenuToggle  – () => void
 *   onGoDashboard – () => void
 */
export default function TopBar({ onMenuToggle, onGoDashboard }) {
  const { user } = useAuth()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" type="button" onClick={onMenuToggle} aria-label="Toggle menu">
          ☰
        </button>
        <span className="topbar-brand">ResumeCraft</span>
      </div>

      <div className="topbar-right">
        {onGoDashboard && (
          <button
            type="button"
            className="topbar-btn-dashboard"
            onClick={onGoDashboard}
          >
            Dashboard
          </button>
        )}
        {user && (
          <span className="topbar-user-badge" title={user.email}>
            {user.fullName ? user.fullName.split(' ')[0] : 'User'}
          </span>
        )}
      </div>
    </header>
  )
}
