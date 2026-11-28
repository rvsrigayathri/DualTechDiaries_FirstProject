import { ExpItem, EduItem, ProjectItem, SimpleEntry, ProfilePhoto } from './shared/TemplateHelpers'

/**
 * 4. Software Developer Template
 * Code-oriented structure, dark header bar, categorized tech stack chips,
 * and project feature cards with GitHub/Live URLs.
 */
export default function SoftwareDeveloperTemplate({
  data,
  accentColor = '#2563eb',
  secondaryColor = '#1e293b',
  fontFamily = 'Inter',
  showPhoto,
  photoShape
}) {
  const { personal, career, education, skills, experience, projects, certifications, achievements, workshops, leadership, languages, interests, volunteer, settings } = data
  const hidden = settings?.hiddenSections || []
  const show = (k) => !hidden.includes(k)

  const isPhotoVisible = showPhoto !== undefined ? showPhoto : (settings?.showPhoto !== false)
  const shape = photoShape || settings?.photoShape || 'circle'

  const ff = fontFamily === 'Georgia' ? 'Georgia, serif' : `${fontFamily}, sans-serif`

  const skillGroups = [
    { label: 'Languages', list: skills.languages },
    { label: 'Frontend & UI', list: skills.frontend },
    { label: 'Backend & APIs', list: skills.backend },
    { label: 'Databases & Storage', list: skills.databases },
    { label: 'Cloud, DevOps & Tools', list: skills.tools },
    { label: 'Practices & Soft Skills', list: skills.soft }
  ].filter(g => g.list && g.list.length > 0)

  return (
    <div className="rt-dev" style={{ fontFamily: ff }}>
      {/* ── Top Header ── */}
      <header className="rt-dev-header" style={{ borderTop: `4px solid ${accentColor}` }}>
        <div className="rt-dev-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {isPhotoVisible && personal.photoUrl && (
              <ProfilePhoto
                photoUrl={personal.photoUrl}
                fullName={personal.fullName}
                shape={shape}
                size={58}
                border={`2px solid ${accentColor}`}
              />
            )}
            <div>
              <h1 className="rt-dev-name">{personal.fullName || 'Developer Name'}</h1>
              <div className="rt-dev-role" style={{ color: accentColor }}>
                &lt;{career.desiredRole || 'Software Engineer'} /&gt;
              </div>
            </div>
          </div>
        </div>
        <div className="rt-dev-header-right">
          {personal.email && <div>✉ {personal.email}</div>}
          {personal.phone && <div>📞 {personal.countryCode} {personal.phone}</div>}
          {personal.location && <div>📍 {personal.location}</div>}
          {personal.github && <div>💻 {personal.github}</div>}
          {personal.linkedin && <div>🔗 {personal.linkedin}</div>}
          {personal.portfolio && <div>🌐 {personal.portfolio}</div>}
        </div>
      </header>

      {/* ── Summary / Bio ── */}
      {show('summary') && (career.summary || career.objective) && (
        <section className="rt-dev-sec">
          <div className="rt-dev-sec-title">
            <span className="rt-dev-badge" style={{ background: accentColor }}>01</span>
            PROFILE
          </div>
          <div className="rt-text">{career.summary || career.objective}</div>
        </section>
      )}

      {/* ── Technical Stack ── */}
      {show('skills') && skillGroups.length > 0 && (
        <section className="rt-dev-sec">
          <div className="rt-dev-sec-title">
            <span className="rt-dev-badge" style={{ background: accentColor }}>02</span>
            TECHNICAL STACK
          </div>
          <div className="rt-dev-skills-grid">
            {skillGroups.map(sg => (
              <div key={sg.label} className="rt-dev-skill-card">
                <div className="rt-dev-skill-head">{sg.label}</div>
                <div className="rt-dev-tag-row">
                  {sg.list.map((s, i) => (
                    <span key={i} className="rt-dev-chip">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Projects ── */}
      {show('projects') && projects.length > 0 && (
        <section className="rt-dev-sec">
          <div className="rt-dev-sec-title">
            <span className="rt-dev-badge" style={{ background: accentColor }}>03</span>
            TECHNICAL PROJECTS
          </div>
          <div className="rt-dev-proj-grid">
            {projects.map(p => (
              <div key={p.id} className="rt-dev-proj-card">
                <div className="rt-dev-proj-top">
                  <span className="rt-dev-proj-title">{p.title}</span>
                  {p.link && <span className="rt-dev-proj-link">{p.link}</span>}
                </div>
                {p.tech && <div className="rt-dev-proj-tech">Stack: {p.tech}</div>}
                {p.description && <div className="rt-text" style={{ marginTop: 4 }}>{p.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Work Experience ── */}
      {show('experience') && experience.some(e => e.company || e.role) && (
        <section className="rt-dev-sec">
          <div className="rt-dev-sec-title">
            <span className="rt-dev-badge" style={{ background: accentColor }}>04</span>
            WORK EXPERIENCE
          </div>
          {experience.filter(e => e.company || e.role).map(e => (
            <ExpItem key={e.id} {...e} accentColor={accentColor} />
          ))}
        </section>
      )}

      {/* ── Education ── */}
      {show('education') && education.some(e => e.degree || e.institution) && (
        <section className="rt-dev-sec">
          <div className="rt-dev-sec-title">
            <span className="rt-dev-badge" style={{ background: accentColor }}>05</span>
            EDUCATION
          </div>
          {education.filter(e => e.degree || e.institution).map(e => (
            <EduItem key={e.id} {...e} />
          ))}
        </section>
      )}

      {/* ── Certifications & Achievements ── */}
      {show('certifications') && certifications.length > 0 && (
        <section className="rt-dev-sec">
          <div className="rt-dev-sec-title">
            <span className="rt-dev-badge" style={{ background: accentColor }}>06</span>
            CERTIFICATIONS
          </div>
          {certifications.map(c => (
            <SimpleEntry key={c.id} title={c.name} subtitle={c.issuer} date={c.year} />
          ))}
        </section>
      )}
    </div>
  )
}
