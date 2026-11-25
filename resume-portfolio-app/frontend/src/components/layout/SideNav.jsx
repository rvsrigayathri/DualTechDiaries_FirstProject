import { useState } from 'react'
import HealthStatus from '../HealthStatus'

const NAV_ITEMS = [
  { id: 'personal',      icon: '👤', label: 'Personal Info' },
  { id: 'career',        icon: '🎯', label: 'Career Objective' },
  { id: 'education',     icon: '🎓', label: 'Education' },
  { id: 'skills',        icon: '⚡', label: 'Technical Skills' },
  { id: 'experience',    icon: '💼', label: 'Experience' },
  { id: 'additional',    icon: '➕', label: 'Additional Sections' },
  { id: 'templates',     icon: '🎨', label: 'Resume Templates' },
  { id: 'preview',       icon: '👁', label: 'Live Preview' },
]

export default function SideNav({ activeSection, onNavigate, healthProps }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-text">ResumeCraft</div>
        <div className="sidebar-logo-sub">Professional Resume Builder</div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Sections</div>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            type="button"
            className={`nav-item${activeSection === item.id ? ' active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Backend health */}
      <div className="sidebar-footer">
        <SidebarHealth {...healthProps} />
      </div>
    </aside>
  )
}

function SidebarHealth({ status, loading, error }) {
  if (loading) {
    return (
      <span>
        <span className="health-dot loading" />
        Connecting to backend…
      </span>
    )
  }
  if (error) {
    return (
      <span>
        <span className="health-dot err" />
        Backend offline
      </span>
    )
  }
  return (
    <span>
      <span className="health-dot ok" />
      {status}
    </span>
  )
}
