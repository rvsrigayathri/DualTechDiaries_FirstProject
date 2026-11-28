import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchMyResumes, deleteResumeFromBackend, clearStoredBackendId, setStoredBackendId } from '../api/resume'
import { TEMPLATES } from '../registry/templateRegistry'
import companyLogo from '../assets/company-logo.jpg'

export default function DashboardPage({ onNavigate, onLoadResume, onCreateNew }) {
  const { user, logout } = useAuth()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [activeSection, setActiveSection] = useState('resumes') // 'resumes' | 'about' | 'products' | 'contact'

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

  // Real statistics derived directly from authenticated user's actual data
  const totalResumes = resumes.length
  const totalTemplates = TEMPLATES.length

  // Recently updated resume (most recent from user's actual list)
  const sortedResumes = useMemo(() => {
    return [...resumes].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
  }, [resumes])

  const latestUpdatedResume = sortedResumes[0] || null

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="dash-workspace-wrapper">

      {/* ════ 1. TOP NAVIGATION BAR ════ */}
      <header className="dash-navbar">
        <div className="dash-nav-container">
          {/* Logo & Brand Identity */}
          <div className="dash-brand-block" onClick={() => onNavigate('dashboard')} style={{ cursor: 'pointer' }}>
            <div className="dash-brand-logo-frame">
              <img
                src={companyLogo}
                alt="DualTechDiaries Logo - Bridging Heritage and Technology"
                className="dash-brand-logo"
              />
            </div>
            <div className="dash-brand-titles">
              <div className="dash-parent-company">DualTechDiaries</div>
              <div className="dash-product-name">
                ResumeCraft <span className="dash-pill-badge">Workspace</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="dash-nav-links" aria-label="Dashboard Navigation">
            <button
              type="button"
              className={`dash-nav-link${activeSection === 'resumes' ? ' active' : ''}`}
              onClick={() => scrollToSection('resumes')}
            >
              <span>🏠</span> Home
            </button>
            <button
              type="button"
              className={`dash-nav-link${activeSection === 'about' ? ' active' : ''}`}
              onClick={() => scrollToSection('about')}
            >
              <span>🏢</span> About Us
            </button>
            <button
              type="button"
              className={`dash-nav-link${activeSection === 'products' ? ' active' : ''}`}
              onClick={() => scrollToSection('products')}
            >
              <span>🚀</span> Our Products
            </button>
            <button
              type="button"
              className={`dash-nav-link${activeSection === 'contact' ? ' active' : ''}`}
              onClick={() => scrollToSection('contact')}
            >
              <span>📞</span> Contact Us
            </button>
          </nav>

          {/* User Profile & Logout */}
          <div className="dash-nav-user-actions">
            <div className="dash-user-chip" title={user?.email || ''}>
              <span className="dash-user-avatar">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </span>
              <div className="dash-user-meta">
                <span className="dash-user-name">{user?.fullName || 'User'}</span>
                <span className="dash-user-email">{user?.email || ''}</span>
              </div>
            </div>

            <button
              type="button"
              className="dash-logout-btn"
              onClick={logout}
              title="Sign Out of ResumeCraft"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ════ 2. MAIN DASHBOARD CONTENT ════ */}
      <main className="dash-main-content">
        <div className="dash-content-container">

          {/* ════ 2A. WELCOME HERO BANNER ════ */}
          <section className="dash-hero-banner">
            <div className="dash-hero-left">
              <div className="dash-hero-badge">
                <span>🌟 DualTechDiaries Ecosystem</span>
              </div>
              <h1 className="dash-hero-title">
                Welcome back, {user?.fullName || 'Professional'}! 👋
              </h1>
              <p className="dash-hero-subtitle">
                Beyond Technology, Into Every Heart · Connecting lives, creating impact, and building your career with confidence.
              </p>
              <div className="dash-hero-btns">
                <button
                  type="button"
                  className="btn btn-primary btn-lg dash-cta-btn"
                  onClick={handleCreateNew}
                >
                  ➕ Create New Resume
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-lg dash-secondary-btn"
                  onClick={() => scrollToSection('resumes')}
                >
                  📂 View My Resumes
                </button>
              </div>
            </div>

            <div className="dash-hero-right">
              <div className="dash-hero-card">
                <div className="dash-hero-card-icon">⚡</div>
                <div className="dash-hero-card-content">
                  <h4>Quick Builder Tip</h4>
                  <p>Choose an ATS-optimized template to maximize your interview chances across modern hiring portals.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ════ 2B. DASHBOARD STATISTICS ════ */}
          <section className="dash-stats-grid">
            <div className="dash-stat-card">
              <div className="dash-stat-icon-wrapper stat-blue">
                <span className="dash-stat-icon">📄</span>
              </div>
              <div className="dash-stat-data">
                <span className="dash-stat-value">{totalResumes}</span>
                <span className="dash-stat-label">Total Saved Resumes</span>
              </div>
              <div className="dash-stat-foot">
                {totalResumes === 0 ? 'Start your first draft' : `${totalResumes} active drafts saved in cloud`}
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon-wrapper stat-indigo">
                <span className="dash-stat-icon">🎨</span>
              </div>
              <div className="dash-stat-data">
                <span className="dash-stat-value">{totalTemplates}+</span>
                <span className="dash-stat-label">Available Resume Templates</span>
              </div>
              <div className="dash-stat-foot">
                ATS, Executive, Tech, Fresher & Creative
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon-wrapper stat-emerald">
                <span className="dash-stat-icon">⏱️</span>
              </div>
              <div className="dash-stat-data">
                <span className="dash-stat-value">
                  {latestUpdatedResume?.updatedAt
                    ? new Date(latestUpdatedResume.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
                    : 'N/A'}
                </span>
                <span className="dash-stat-label">Recently Updated Resume</span>
              </div>
              <div className="dash-stat-foot">
                {latestUpdatedResume?.title || (latestUpdatedResume ? 'Recent Draft' : 'No recent updates')}
              </div>
            </div>
          </section>

          {/* ════ 2C. QUICK ACTIONS ════ */}
          <section className="dash-quick-actions-bar">
            <div className="quick-actions-title">
              <span>⚡</span>
              <h3>Quick Actions:</h3>
            </div>
            <div className="quick-action-chips">
              <button
                type="button"
                className="quick-action-chip"
                onClick={handleCreateNew}
              >
                ➕ New Resume
              </button>
              <button
                type="button"
                className="quick-action-chip"
                onClick={loadUserResumes}
              >
                🔄 Refresh List
              </button>
              <button
                type="button"
                className="quick-action-chip"
                onClick={() => {
                  if (latestUpdatedResume) handleEdit(latestUpdatedResume.id)
                  else handleCreateNew()
                }}
              >
                ✏️ Edit Recent Resume
              </button>
              <button
                type="button"
                className="quick-action-chip"
                onClick={() => scrollToSection('about')}
              >
                ℹ️ About DualTechDiaries
              </button>
            </div>
          </section>

          {/* ════ 2D. MY RESUMES SECTION ════ */}
          <section id="resumes" className="dash-section-card">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-section-title">My Resumes</h2>
                <p className="dash-section-subtitle">
                  {resumes.length === 0
                    ? 'No resumes saved yet. Click "Create New Resume" to begin.'
                    : `Managing ${resumes.length} saved ${resumes.length === 1 ? 'resume' : 'resumes'}`}
                </p>
              </div>

              <div className="dash-section-header-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={loadUserResumes}
                  title="Refresh resumes from cloud"
                >
                  🔄 Refresh
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleCreateNew}
                >
                  ➕ New Resume
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-alert auth-alert-error" role="alert">
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="dashboard-loading">
                <div className="spinner" />
                <p>Loading your resumes from database…</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="dash-empty-state-box">
                <div className="dash-empty-icon">📂</div>
                <h3>Your Workspace is Ready</h3>
                <p>You haven't created any resumes yet. Start building your first professional resume with live previews and ATS optimization.</p>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={handleCreateNew}
                >
                  Create My First Resume
                </button>
              </div>
            ) : (
              <div className="dash-resume-grid">
                {resumes.map(resume => (
                  <div key={resume.id} className="dash-resume-card">
                    {/* Card Top Pill & Date */}
                    <div className="dash-card-meta-row">
                      <span className="dash-template-tag">
                        {resume.targetTemplate ? resume.targetTemplate.replace(/_/g, ' ') : 'ATS Professional'}
                      </span>
                      <span className="dash-card-date">
                        {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString([], {
                          month: 'short', day: 'numeric', year: 'numeric'
                        }) : 'Recent'}
                      </span>
                    </div>

                    {/* Resume Details */}
                    <div className="dash-card-info">
                      <h3 className="dash-card-title">{resume.title || resume.fullName || 'Untitled Resume'}</h3>
                      <p className="dash-card-role">
                        <span>💼</span> {resume.desiredRole || 'General Professional'}
                      </p>
                      <p className="dash-card-email">
                        <span>✉️</span> {resume.email || user?.email || 'N/A'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="dash-card-actions-grid">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm dash-btn-edit"
                        onClick={() => handleEdit(resume.id)}
                        title="Open and edit resume in Builder"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-ghost btn-sm dash-btn-pdf"
                        onClick={() => handleDownloadPdf(resume.id)}
                        title="Download or Print PDF"
                      >
                        📄 Download PDF
                      </button>

                      <button
                        type="button"
                        className="btn btn-ghost btn-danger-ghost btn-sm dash-btn-delete"
                        onClick={() => setDeleteConfirmId(resume.id)}
                        title="Delete resume permanently"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Inline Delete Confirmation */}
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

          {/* ════ 2E. RECENT ACTIVITY SECTION (BASED ON ACTUAL USER RESUME DATA) ════ */}
          <section className="dash-section-card">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-section-title">Recent Activity</h2>
                <p className="dash-section-subtitle">Real-time update history from your active workspace</p>
              </div>
            </div>

            {resumes.length === 0 ? (
              <div className="dash-activity-empty">
                <p>No recent activity recorded. Created resumes and saved edits will be logged here.</p>
              </div>
            ) : (
              <div className="dash-timeline-list">
                {sortedResumes.slice(0, 5).map((r, idx) => (
                  <div key={r.id || idx} className="dash-timeline-item">
                    <div className="dash-timeline-bullet" />
                    <div className="dash-timeline-body">
                      <div className="dash-timeline-head">
                        <strong>Saved & Updated: {r.title || r.fullName || 'Resume'}</strong>
                        <span className="dash-timeline-time">
                          {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString([], {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          }) : 'Recently'}
                        </span>
                      </div>
                      <p className="dash-timeline-desc">
                        Template: <span className="dash-tag-inline">{r.targetTemplate || 'ATS Professional'}</span> · Role: {r.desiredRole || 'Professional'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ════ 2F. DUALTECHDIARIES COMPANY INTRODUCTION ════ */}
          <section id="about" className="dash-section-card dash-company-highlight">
            <div className="dash-company-banner">
              <div className="dash-company-logo-large">
                <img
                  src={companyLogo}
                  alt="DualTechDiaries Logo - Bridging Heritage and Technology"
                  className="dash-logo-img"
                />
              </div>
              <div className="dash-company-text">
                <span className="dash-company-badge">About Our Organization</span>
                <h2 className="dash-company-title">DualTechDiaries</h2>
                <p className="dash-company-tagline">
                  <strong>Beyond Technology, Into Every Heart.</strong>
                </p>
                <p className="dash-company-subtagline">
                  Connecting lives. Creating impact. Inspiring change.
                </p>
                <p className="dash-company-summary">
                  DualTechDiaries is a technology-focused company with a people-centered vision.
                  We believe technology should go beyond screens and systems—bringing people closer,
                  creating opportunities, simplifying everyday challenges, and inspiring positive change.
                </p>
              </div>
            </div>

            <div className="dash-pillars-grid">
              <div className="dash-pillar-card">
                <h4>🎯 Our Vision</h4>
                <p>To build a technology-driven ecosystem that connects people, empowers communities, and contributes to a better society.</p>
              </div>

              <div className="dash-pillar-card">
                <h4>🚀 Our Mission</h4>
                <ul className="dash-mission-list">
                  <li>Develop useful and accessible technology solutions.</li>
                  <li>Connect people with opportunities and resources.</li>
                  <li>Solve real-world challenges through continuous innovation.</li>
                  <li>Create positive social impact and encourage lifelong learning.</li>
                </ul>
              </div>

              <div className="dash-pillar-card">
                <h4>💎 Core Values</h4>
                <div className="dash-values-chips">
                  <span>Innovation</span>
                  <span>Connection</span>
                  <span>Accessibility</span>
                  <span>Integrity</span>
                  <span>Impact</span>
                </div>
              </div>
            </div>
          </section>

          {/* ════ 2G. OUR PRODUCTS SECTION ════ */}
          <section id="products" className="dash-section-card">
            <div className="dash-section-header">
              <div>
                <span className="dash-company-badge">Product Suite</span>
                <h2 className="dash-section-title">Our Products</h2>
                <p className="dash-section-subtitle">Flagship tools crafted by DualTechDiaries</p>
              </div>
            </div>

            <div className="dash-product-spotlight-card">
              <div className="dash-product-head">
                <div className="dash-product-logo-pill">📄 ResumeCraft</div>
                <span className="dash-product-status">Active Production</span>
              </div>
              <h3 className="dash-product-headline">ResumeCraft – Build Your Professional Resume</h3>
              <p className="dash-product-p">
                ResumeCraft is a comprehensive platform developed under DualTechDiaries to help individuals create professional resumes with ease.
                It brings resume creation, customization, and PDF downloading together in one unified workspace.
              </p>
              <div className="dash-feature-tags">
                <span>Multiple Professional Templates</span>
                <span>Customizable Sections & Layouts</span>
                <span>Live Interactive Preview</span>
                <span>Profile Photo Customizer</span>
                <span>Cloud Resume Saving & Dashboard</span>
                <span>ATS Parsing Protection</span>
                <span>Instant PDF Download</span>
              </div>
              <div className="dash-product-btn-row">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateNew}
                >
                  🚀 Open Resume Builder
                </button>
              </div>
            </div>
          </section>

          {/* ════ 2H. CONTACT US SECTION ════ */}
          <section id="contact" className="dash-section-card">
            <div className="dash-section-header">
              <div>
                <span className="dash-company-badge">Get In Touch</span>
                <h2 className="dash-section-title">Contact DualTechDiaries</h2>
                <p className="dash-section-subtitle">We would love to hear from you</p>
              </div>
            </div>

            <div className="dash-contact-channels-grid">
              {/* Gmail */}
              <a href="mailto:dualtechdiaries@gmail.com" className="dash-contact-tile" title="Email DualTechDiaries">
                <svg className="contact-icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                  <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.5l8.073-6.007C21.69 2.28 24 3.434 24 5.457z"/>
                </svg>
                <div className="dash-contact-tile-text">
                  <span className="dash-tile-label">Email Support</span>
                  <strong className="dash-tile-val">dualtechdiaries@gmail.com</strong>
                </div>
              </a>

              {/* WhatsApp */}
              <a href="https://wa.me/917354666252" target="_blank" rel="noreferrer" className="dash-contact-tile" title="WhatsApp Chat">
                <svg className="contact-icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                  <path fill="#25D366" d="M12.004 0C5.374 0 0 5.373 0 12c0 2.115.553 4.184 1.603 6.005L0 24l6.166-1.579A11.94 11.94 0 0 0 12.004 24c6.627 0 12-5.373 12-12s-5.373-12-12-12zm.004 21.905a9.88 9.88 0 0 1-5.044-1.378l-.362-.215-3.664.939.977-3.571-.237-.377A9.873 9.873 0 0 1 2.095 12c0-5.464 4.444-9.905 9.909-9.905 5.464 0 9.905 4.441 9.905 9.905 0 5.464-4.441 9.905-9.905 9.905zm5.426-7.41c-.297-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.668.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.496.099-.198.05-.372-.025-.52-.074-.149-.668-1.611-.916-2.206-.241-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                <div className="dash-contact-tile-text">
                  <span className="dash-tile-label">WhatsApp Chat</span>
                  <strong className="dash-tile-val">+91 7354666252</strong>
                </div>
              </a>

              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/r-srigayathri-rajkumar-096600328/" target="_blank" rel="noreferrer" className="dash-contact-tile" title="LinkedIn Profile">
                <svg className="contact-icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                  <path fill="#0A66C2" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <div className="dash-contact-tile-text">
                  <span className="dash-tile-label">Professional Network</span>
                  <strong className="dash-tile-val">LinkedIn Profile</strong>
                </div>
              </a>
            </div>
          </section>

        </div>
      </main>

      {/* ════ 3. PROFESSIONAL BRANDED FOOTER ════ */}
      <footer className="dash-footer">
        <div className="dash-footer-container">
          <div className="dash-footer-top">
            {/* Brand Block */}
            <div className="dash-footer-brand">
              <div className="dash-footer-logo-frame">
                <img
                  src={companyLogo}
                  alt="DualTechDiaries Logo"
                  className="dash-footer-logo"
                />
              </div>
              <div className="dash-footer-text">
                <h3>DualTechDiaries</h3>
                <p className="dash-footer-tag">Beyond Technology, Into Every Heart.</p>
                <p className="dash-footer-sub">Connecting lives. Creating impact. Inspiring change.</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="dash-footer-links-col">
              <h4>Navigation</h4>
              <ul>
                <li><button type="button" onClick={() => scrollToSection('resumes')}>My Resumes</button></li>
                <li><button type="button" onClick={() => scrollToSection('about')}>About Us</button></li>
                <li><button type="button" onClick={() => scrollToSection('products')}>Our Products</button></li>
                <li><button type="button" onClick={() => scrollToSection('contact')}>Contact Us</button></li>
              </ul>
            </div>

            {/* Product Links */}
            <div className="dash-footer-links-col">
              <h4>ResumeCraft</h4>
              <ul>
                <li><button type="button" onClick={handleCreateNew}>Create Resume</button></li>
                <li><button type="button" onClick={() => scrollToSection('resumes')}>Saved Drafts</button></li>
                <li><span className="dash-footer-pill">12+ Pro Templates</span></li>
              </ul>
            </div>

            {/* Contacts & Social */}
            <div className="dash-footer-links-col">
              <h4>Connect</h4>
              <ul className="dash-footer-contact-list">
                <li><a href="mailto:dualtechdiaries@gmail.com">✉️ dualtechdiaries@gmail.com</a></li>
                <li><a href="https://wa.me/917354666252" target="_blank" rel="noreferrer">💬 +91 7354666252</a></li>
                <li><a href="https://frontend-rose-pi-53.vercel.app/" target="_blank" rel="noreferrer">🌐 ResumeCraft Live</a></li>
                <li><a href="https://www.linkedin.com/in/r-srigayathri-rajkumar-096600328/" target="_blank" rel="noreferrer">💼 LinkedIn Profile</a></li>
              </ul>
            </div>
          </div>

          <div className="dash-footer-bottom">
            <p>© {new Date().getFullYear()} DualTechDiaries. All rights reserved. Technology is our tool. People are our purpose. Impact is our journey.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
