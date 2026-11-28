import { ExpItem, EduItem, ProjectItem, SimpleEntry, ProfilePhoto } from './shared/TemplateHelpers'

/**
 * 2. Modern Executive Template
 * Dual-column with dark executive sidebar, gold/royal accent tags, and metric-focused layout.
 */
export default function ModernExecutiveTemplate({
  data,
  accentColor = '#1e3a8a',
  secondaryColor = '#0f172a',
  fontFamily = 'Inter',
  sidebarPosition = 'left',
  showPhoto,
  photoShape
}) {
  const { personal, career, education, skills, experience, projects, certifications, achievements, workshops, leadership, languages, interests, volunteer, settings } = data
  const hidden = settings?.hiddenSections || []
  const show = (k) => !hidden.includes(k)

  const isPhotoVisible = showPhoto !== undefined ? showPhoto : (settings?.showPhoto !== false)
  const shape = photoShape || settings?.photoShape || 'circle'

  const ff = fontFamily === 'Georgia' ? 'Georgia, serif' : `${fontFamily}, sans-serif`
  const isRight = sidebarPosition === 'right'

  const allSkills = [
    ...(skills.languages || []),
    ...(skills.frontend || []),
    ...(skills.backend || []),
    ...(skills.databases || []),
    ...(skills.tools || [])
  ]

  return (
    <div className={`rt-modern-exec ${isRight ? 'sidebar-right' : ''}`} style={{ fontFamily: ff }}>
      {/* ── Sidebar ── */}
      <aside className="rt-m-exec-sidebar" style={{ backgroundColor: secondaryColor || '#0f172a' }}>
        {isPhotoVisible && personal.photoUrl ? (
          <div className="rt-m-exec-avatar-wrap">
            <ProfilePhoto
              photoUrl={personal.photoUrl}
              fullName={personal.fullName}
              shape={shape}
              size={68}
              border="2.5px solid rgba(255,255,255,0.4)"
            />
          </div>
        ) : null}

        <div className="rt-m-exec-side-head">
          <h1 className="rt-m-exec-side-name">{personal.fullName || 'Your Name'}</h1>
          {career.desiredRole && <div className="rt-m-exec-side-role" style={{ color: '#93c5fd' }}>{career.desiredRole}</div>}
        </div>

        {/* Contact info */}
        <div className="rt-m-exec-side-sec">
          <div className="rt-m-exec-side-title">CONTACT</div>
          {personal.email && <div className="rt-m-exec-side-item">✉ {personal.email}</div>}
          {personal.phone && <div className="rt-m-exec-side-item">📞 {personal.countryCode} {personal.phone}</div>}
          {personal.location && <div className="rt-m-exec-side-item">📍 {personal.location}</div>}
          {personal.linkedin && <div className="rt-m-exec-side-item">🔗 {personal.linkedin}</div>}
          {personal.github && <div className="rt-m-exec-side-item">💻 {personal.github}</div>}
          {personal.portfolio && <div className="rt-m-exec-side-item">🌐 {personal.portfolio}</div>}
        </div>

        {/* Skills */}
        {show('skills') && allSkills.length > 0 && (
          <div className="rt-m-exec-side-sec">
            <div className="rt-m-exec-side-title">KEY COMPETENCIES</div>
            <div className="rt-m-exec-tags">
              {allSkills.map((s, i) => (
                <span key={i} className="rt-m-exec-tag">{s}</span>
              ))}
            </div>
            {skills.soft?.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 10, color: '#cbd5e1' }}>
                <strong style={{ color: '#fff' }}>Leadership: </strong>{skills.soft.join(', ')}
              </div>
            )}
          </div>
        )}

        {/* Certifications */}
        {show('certifications') && certifications.length > 0 && (
          <div className="rt-m-exec-side-sec">
            <div className="rt-m-exec-side-title">CREDENTIALS</div>
            {certifications.map(c => (
              <div key={c.id} style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 11, color: '#fff' }}>{c.name}</div>
                <div style={{ fontSize: 9.5, color: '#94a3b8' }}>{[c.issuer, c.year].filter(Boolean).join(' · ')}</div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {show('languages') && languages.length > 0 && (
          <div className="rt-m-exec-side-sec">
            <div className="rt-m-exec-side-title">LANGUAGES</div>
            {languages.map(l => (
              <div key={l.id} className="rt-m-exec-side-item">
                {l.language} {l.proficiency ? `(${l.proficiency})` : ''}
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* ── Main Column ── */}
      <main className="rt-m-exec-main">
        {/* Executive Summary */}
        {show('summary') && (career.summary || career.objective) && (
          <section className="rt-m-exec-sec">
            <h2 className="rt-m-exec-sec-title" style={{ color: accentColor, borderColor: accentColor }}>
              EXECUTIVE PROFILE
            </h2>
            <div className="rt-text">{career.summary || career.objective}</div>
          </section>
        )}

        {/* Experience */}
        {show('experience') && experience.some(e => e.company || e.role) && (
          <section className="rt-m-exec-sec">
            <h2 className="rt-m-exec-sec-title" style={{ color: accentColor, borderColor: accentColor }}>
              CAREER EXPERIENCE
            </h2>
            {experience.filter(e => e.company || e.role).map(e => (
              <ExpItem key={e.id} {...e} accentColor={accentColor} />
            ))}
          </section>
        )}

        {/* Education */}
        {show('education') && education.some(e => e.degree || e.institution) && (
          <section className="rt-m-exec-sec">
            <h2 className="rt-m-exec-sec-title" style={{ color: accentColor, borderColor: accentColor }}>
              EDUCATION
            </h2>
            {education.filter(e => e.degree || e.institution).map(e => (
              <EduItem key={e.id} {...e} />
            ))}
          </section>
        )}

        {/* Leadership & Governance */}
        {show('leadership') && leadership.length > 0 && (
          <section className="rt-m-exec-sec">
            <h2 className="rt-m-exec-sec-title" style={{ color: accentColor, borderColor: accentColor }}>
              EXECUTIVE LEADERSHIP
            </h2>
            {leadership.map(l => (
              <SimpleEntry key={l.id} title={l.role} subtitle={l.org} description={l.description} />
            ))}
          </section>
        )}

        {/* Achievements */}
        {show('achievements') && achievements.length > 0 && (
          <section className="rt-m-exec-sec">
            <h2 className="rt-m-exec-sec-title" style={{ color: accentColor, borderColor: accentColor }}>
              HONORS &amp; MILESTONES
            </h2>
            {achievements.map(a => (
              <SimpleEntry key={a.id} title={a.title} description={a.description} />
            ))}
          </section>
        )}

        {/* Projects / Key Engagements */}
        {show('projects') && projects.length > 0 && (
          <section className="rt-m-exec-sec">
            <h2 className="rt-m-exec-sec-title" style={{ color: accentColor, borderColor: accentColor }}>
              STRATEGIC INITIATIVES
            </h2>
            {projects.map(p => (
              <ProjectItem key={p.id} {...p} />
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
