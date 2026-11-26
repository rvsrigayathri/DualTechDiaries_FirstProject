import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchMyResumes, deleteResumeFromBackend, clearStoredBackendId, setStoredBackendId } from '../api/resume'

export default function DashboardPage({ onNavigate, onLoadResume, onCreateNew }) {
  const { user, logout } = useAuth()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const loadUserResumes = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchMyResumes()
      setResumes(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load your resumes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserResumes()
  }, [])

  const handleCreateNew = () => {
    clearStoredBackendId()
    if (onCreateNew) onCreateNew()
    onNavigate('builder')
  }

  const handleEdit = (id) => {
    setStoredBackendId(id)
    if (onLoadResume) onLoadResume(id)
    onNavigate('builder')
  }

  const handleDownloadPdf = (id) => {
    setStoredBackendId(id)
    if (onLoadResume) onLoadResume(id, true) // pass preview flag
    onNavigate('builder')
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await deleteResumeFromBackend(id)
      setResumes(prev => prev.filter(r => r.id !== id))
      setDeleteConfirmId(null)
    } catch (err) {
      alert(`Could not delete resume: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="dashboard-layout">
      {/* Top Navbar */}
      <header className="dashboard-nav">
        <div className="dashboard-brand">
          <span className="brand-logo-icon">📄</span>
          <span className="brand-title">ResumeCraft</span>
          <span className="brand-tag">Professional</span>
        </div>

        <div className="dashboard-nav-right">
          <div className="user-profile-badge">
            <span className="user-avatar-initials">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </span>
            <div className="user-details">
              <span className="user-name">{user?.fullName || 'User'}</span>
              <span className="user-email">{user?.email || ''}</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={logout}
            title="Log out of ResumeCraft"
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-content">
        {/* Welcome Banner */}
        <section className="dashboard-banner">
          <div className="banner-text">
            <h1>Welcome, {user?.fullName || 'Craftsman'}! 👋</h1>
            <p>Manage, create, and customize your professional ATS resumes all in one place.</p>
          </div>
          <div className="banner-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleCreateNew}
            >
              ➕ Create New Resume
            </button>
          </div>
        </section>

        {/* Resumes Section */}
        <section className="dashboard-resumes-section">
          <div className="section-header-row">
            <div>
              <h2>My Resumes</h2>
              <p className="section-subtitle">
                {resumes.length === 1 ? '1 saved resume' : `${resumes.length} saved resumes`}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={loadUserResumes}
              title="Refresh resumes"
            >
              🔄 Refresh
            </button>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error" role="alert">
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="dashboard-loading">
              <div className="spinner" />
              <p>Loading your resumes…</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="dashboard-empty-state">
              <div className="empty-icon">📂</div>
              <h3>No Resumes Created Yet</h3>
              <p>You haven't created any resumes yet. Start building your first professional resume now!</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateNew}
              >
                Create My First Resume
              </button>
            </div>
          ) : (
            <div className="resume-cards-grid">
              {resumes.map(resume => (
                <div key={resume.id} className="resume-card">
                  <div className="resume-card-header">
                    <span className="template-badge">
                      {resume.targetTemplate ? resume.targetTemplate.replace(/_/g, ' ') : 'ATS Professional'}
                    </span>
                    <span className="resume-card-date">
                      {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString([], {
                        month: 'short', day: 'numeric', year: 'numeric'
                      }) : 'Recent'}
                    </span>
                  </div>

                  <div className="resume-card-body">
                    <h3 className="resume-card-title">{resume.title || resume.fullName || 'Untitled Resume'}</h3>
                    <p className="resume-card-role">{resume.desiredRole || 'General Professional'}</p>
                    <p className="resume-card-email">{resume.email || user?.email}</p>
                  </div>

                  <div className="resume-card-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleEdit(resume.id)}
                      title="Edit this resume"
                    >
                      ✏️ Edit Resume
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleDownloadPdf(resume.id)}
                      title="Download PDF"
                    >
                      📄 Download PDF
                    </button>

                    <button
                      type="button"
                      className="btn btn-ghost btn-danger-ghost btn-sm"
                      onClick={() => setDeleteConfirmId(resume.id)}
                      title="Delete resume"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Inline Delete Confirmation Dialog */}
                  {deleteConfirmId === resume.id && (
                    <div className="delete-confirm-overlay">
                      <div className="delete-confirm-box">
                        <p><strong>Delete this resume?</strong></p>
                        <p className="delete-confirm-desc">This action cannot be undone.</p>
                        <div className="delete-confirm-btns">
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={() => setDeleteConfirmId(null)}
                            disabled={deletingId === resume.id}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-xs"
                            onClick={() => handleDelete(resume.id)}
                            disabled={deletingId === resume.id}
                          >
                            {deletingId === resume.id ? 'Deleting…' : 'Yes, Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
