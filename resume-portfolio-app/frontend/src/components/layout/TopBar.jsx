/**
 * Mobile-only top bar with hamburger menu.
 * Props: onMenuToggle – () => void
 */
export default function TopBar({ onMenuToggle }) {
  return (
    <header className="topbar">
      <button className="hamburger" type="button" onClick={onMenuToggle} aria-label="Toggle menu">
        ☰
      </button>
      <span className="topbar-brand">ResumeCraft</span>
    </header>
  )
}
