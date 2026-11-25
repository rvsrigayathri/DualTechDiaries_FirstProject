import { ExpItem, EduItem, ProjectItem, SimpleEntry } from './shared/TemplateHelpers'

/**
 * 3. Creative Designer Template
 * Dynamic header band, asymmetric layout, portfolio visual focus, and stylish color accents.
 */
export default function CreativeDesignerTemplate({
  data,
  accentColor = '#ec4899',
  secondaryColor = '#831843',
  fontFamily = 'Inter'
}) {
  const { personal, career, education, skills, experience, projects, certifications, achievements, workshops, leadership, languages, interests, volunteer, settings } = data
  const hidden = settings?.hiddenSections || []
  const show = (k) => !hidden.includes(k)

  const ff = fontFamily === 'Georgia' ? 'Georgia, serif' : `${fontFamily}, sans-serif`
  const allSkills = [
    ...(skills.languages || []),
    ...(skills.frontend || []),
    ...(skills.tools || []),
    ...(skills.soft || [])
  ]

  return (
    <div className="rt-creative-des" style={{ fontFamily: ff }}>
      {/* ── Bold Creative Header ── */}
      <header className="rt-c-des-header" style={{ background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor || '#4c0519'})` }}>
        <div className="rt-c-des-header-inner">
          {personal.photoUrl ? (
            <img src={personal.photoUrl} alt="Designer" className="rt-c-des-avatar" />
          ) : (
            <div className="rt-c-des-avatar-fallback">🎨</div>
          )}
          <div className="rt-c-des-title-box">
            <h1 className="rt-c-des-name">{personal.fullName || 'Your Name'}</h1>
            {career.desiredRole && <div className="rt-c-des-role">{career.desiredRole}</div>}
            <div className="rt-c-des-contact-bar">
              {personal.email && <span>✉ {personal.email}</span>}
              {personal.phone && <span>📞 {personal.countryCode} {personal.phone}</span>}
              {personal.location && <span>📍 {personal.location}</span>}
              {personal.portfolio && <span style={{ fontWeight: 600 }}>🌐 {personal.portfolio}</span>}
              {personal.linkedin && <span>🔗 LinkedIn</span>}
              {personal.github && <span>💻 GitHub</span>}
            </div>
          </div>
        </div>
      </header>

      {/* ── Content Grid ── */}
      <div className="rt-c-des-grid">
        {/* Left Column (Work & Projects) */}
        <div className="rt-c-des-left">
          {/* Summary */}
          {show('summary') && (career.summary || career.objective) && (
            <section className="rt-c-des-sec">
              <h2 className="rt-c-des-sec-title" style={{ color: accentColor }}>ABOUT ME</h2>
              <div className="rt-text">{career.summary || career.objective}</div>
            </section>
          )}

          {/* Experience */}
          {show('experience') && experience.some(e => e.company || e.role) && (
            <section className="rt-c-des-sec">
              <h2 className="rt-c-des-sec-title" style={{ color: accentColor }}>EXPERIENCE</h2>
              {experience.filter(e => e.company || e.role).map(e => (
                <ExpItem key={e.id} {...e} accentColor={accentColor} />
              ))}
            </section>
          )}

          {/* Projects / Portfolio */}
          {show('projects') && projects.length > 0 && (
            <section className="rt-c-des-sec">
              <h2 className="rt-c-des-sec-title" style={{ color: accentColor }}>PORTFOLIO &amp; CREATIVE WORK</h2>
              {projects.map(p => (
                <ProjectItem key={p.id} {...p} />
              ))}
            </section>
          )}
        </div>

        {/* Right Column (Skills & Credentials) */}
        <div className="rt-c-des-right">
          {/* Skills / Design Toolkit */}
          {show('skills') && allSkills.length > 0 && (
            <section className="rt-c-des-sec">
              <h2 className="rt-c-des-sec-title" style={{ color: accentColor }}>DESIGN TOOLKIT</h2>
              <div className="rt-c-des-tags">
                {allSkills.map((s, i) => (
                  <span key={i} className="rt-c-des-tag" style={{ borderLeftColor: accentColor }}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {show('education') && education.some(e => e.degree || e.institution) && (
            <section className="rt-c-des-sec">
              <h2 className="rt-c-des-sec-title" style={{ color: accentColor }}>EDUCATION</h2>
              {education.filter(e => e.degree || e.institution).map(e => (
                <EduItem key={e.id} {...e} />
              ))}
            </section>
          )}

          {/* Certifications & Awards */}
          {show('certifications') && certifications.length > 0 && (
            <section className="rt-c-des-sec">
              <h2 className="rt-c-des-sec-title" style={{ color: accentColor }}>RECOGNITION</h2>
              {certifications.map(c => (
                <SimpleEntry key={c.id} title={c.name} subtitle={c.issuer} date={c.year} />
              ))}
            </section>
          )}

          {/* Achievements */}
          {show('achievements') && achievements.length > 0 && (
            <section className="rt-c-des-sec">
              <h2 className="rt-c-des-sec-title" style={{ color: accentColor }}>HONORS</h2>
              {achievements.map(a => (
                <SimpleEntry key={a.id} title={a.title} description={a.description} />
              ))}
            </section>
          )}

          {/* Languages & Interests */}
          {(show('languages') || show('interests')) && (languages.length > 0 || interests.length > 0) && (
            <section className="rt-c-des-sec">
              <h2 className="rt-c-des-sec-title" style={{ color: accentColor }}>INTERESTS &amp; PASSIONS</h2>
              {show('languages') && languages.length > 0 && (
                <div style={{ fontSize: 11, marginBottom: 4 }}>
                  <strong>Languages: </strong>{languages.map(l => l.language).join(', ')}
                </div>
              )}
              {show('interests') && interests.length > 0 && (
                <div style={{ fontSize: 11 }}>{interests.join(' • ')}</div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
