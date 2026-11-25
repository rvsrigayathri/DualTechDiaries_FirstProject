import { ExpItem, EduItem, ProjectItem, SimpleEntry } from './shared/TemplateHelpers'

/**
 * 11. Minimalist Template
 * Swiss-design inspired, clean monochromatic elegance, high typographic whitespace ratio,
 * refined readability.
 */
export default function MinimalistTemplate({
  data,
  accentColor = '#18181b',
  fontFamily = 'Inter'
}) {
  const { personal, career, education, skills, experience, projects, certifications, achievements, workshops, leadership, languages, interests, volunteer, settings } = data
  const hidden = settings?.hiddenSections || []
  const show = (k) => !hidden.includes(k)

  const ff = fontFamily === 'Georgia' ? 'Georgia, serif' : `${fontFamily}, sans-serif`
  const allSkills = [
    ...(skills.languages || []),
    ...(skills.frontend || []),
    ...(skills.backend || []),
    ...(skills.databases || []),
    ...(skills.tools || []),
    ...(skills.soft || [])
  ]

  return (
    <div className="rt-minimal" style={{ fontFamily: ff }}>
      {/* Minimal Header */}
      <header className="rt-min-header">
        <h1 className="rt-min-name">{personal.fullName || 'Minimalist Resume'}</h1>
        {career.desiredRole && <div className="rt-min-role">{career.desiredRole}</div>}
        <div className="rt-min-contact">
          {[
            personal.email,
            personal.phone ? `${personal.countryCode} ${personal.phone}` : '',
            personal.location,
            personal.portfolio,
            personal.github,
            personal.linkedin
          ].filter(Boolean).join('  /  ')}
        </div>
      </header>

      {/* Bio */}
      {show('summary') && (career.summary || career.objective) && (
        <section className="rt-min-row">
          <div className="rt-min-label">Profile</div>
          <div className="rt-min-content rt-text">{career.summary || career.objective}</div>
        </section>
      )}

      {/* Experience */}
      {show('experience') && experience.some(e => e.company || e.role) && (
        <section className="rt-min-row">
          <div className="rt-min-label">Experience</div>
          <div className="rt-min-content">
            {experience.filter(e => e.company || e.role).map(e => (
              <ExpItem key={e.id} {...e} />
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {show('projects') && projects.length > 0 && (
        <section className="rt-min-row">
          <div className="rt-min-label">Selected Work</div>
          <div className="rt-min-content">
            {projects.map(p => (
              <ProjectItem key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {show('skills') && allSkills.length > 0 && (
        <section className="rt-min-row">
          <div className="rt-min-label">Expertise</div>
          <div className="rt-min-content rt-text">
            {allSkills.join('  •  ')}
          </div>
        </section>
      )}

      {/* Education */}
      {show('education') && education.some(e => e.degree || e.institution) && (
        <section className="rt-min-row">
          <div className="rt-min-label">Education</div>
          <div className="rt-min-content">
            {education.filter(e => e.degree || e.institution).map(e => (
              <EduItem key={e.id} {...e} />
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {show('certifications') && certifications.length > 0 && (
        <section className="rt-min-row">
          <div className="rt-min-label">Credentials</div>
          <div className="rt-min-content">
            {certifications.map(c => (
              <SimpleEntry key={c.id} title={c.name} subtitle={c.issuer} date={c.year} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
