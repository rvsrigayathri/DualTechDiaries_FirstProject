import { ExpItem, EduItem, ProjectItem, SimpleEntry } from './shared/TemplateHelpers'

/**
 * 5. Data Analyst Template
 * Quantitative, analytical, structured format emphasizing metrics, BI tools, and data insights.
 */
export default function DataAnalystTemplate({
  data,
  accentColor = '#0d9488',
  secondaryColor = '#134e4a',
  fontFamily = 'Inter'
}) {
  const { personal, career, education, skills, experience, projects, certifications, achievements, workshops, leadership, languages, interests, volunteer, settings } = data
  const hidden = settings?.hiddenSections || []
  const show = (k) => !hidden.includes(k)

  const ff = fontFamily === 'Georgia' ? 'Georgia, serif' : `${fontFamily}, sans-serif`

  const analyticalSkills = [
    { cat: 'Querying & Databases', list: skills.databases },
    { cat: 'Programming & Analysis', list: skills.languages },
    { cat: 'BI & Visualization', list: skills.tools },
    { cat: 'Frameworks & ETL', list: skills.backend },
    { cat: 'Communication & Soft Skills', list: skills.soft }
  ].filter(s => s.list && s.list.length > 0)

  return (
    <div className="rt-data-analyst" style={{ fontFamily: ff }}>
      {/* Header */}
      <div className="rt-da-header">
        <div className="rt-da-header-left">
          <h1 className="rt-da-name" style={{ color: secondaryColor || '#134e4a' }}>
            {personal.fullName || 'Data Analyst'}
          </h1>
          {career.desiredRole && (
            <div className="rt-da-role" style={{ color: accentColor }}>
              {career.desiredRole}
            </div>
          )}
        </div>
        <div className="rt-da-header-right">
          {personal.email && <div>✉ {personal.email}</div>}
          {personal.phone && <div>📞 {personal.countryCode} {personal.phone}</div>}
          {personal.location && <div>📍 {personal.location}</div>}
          {personal.linkedin && <div>🔗 {personal.linkedin}</div>}
          {personal.github && <div>💻 {personal.github}</div>}
        </div>
      </div>
      <div className="rt-da-divider" style={{ background: accentColor }} />

      {/* Summary / Impact Statement */}
      {show('summary') && (career.summary || career.objective) && (
        <section className="rt-da-sec">
          <div className="rt-da-sec-h" style={{ color: accentColor }}>
            EXECUTIVE DATA SUMMARY
          </div>
          <div className="rt-text">{career.summary || career.objective}</div>
        </section>
      )}

      {/* Core Competencies Matrix */}
      {show('skills') && analyticalSkills.length > 0 && (
        <section className="rt-da-sec">
          <div className="rt-da-sec-h" style={{ color: accentColor }}>
            TECHNICAL &amp; ANALYTICAL COMPETENCIES
          </div>
          <div className="rt-da-skill-matrix">
            {analyticalSkills.map(as => (
              <div key={as.cat} className="rt-da-skill-row">
                <span className="rt-da-skill-label">{as.cat}:</span>
                <span className="rt-da-skill-vals">{as.list.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Analytics Projects */}
      {show('projects') && projects.length > 0 && (
        <section className="rt-da-sec">
          <div className="rt-da-sec-h" style={{ color: accentColor }}>
            DATA &amp; BUSINESS INTELLIGENCE PROJECTS
          </div>
          {projects.map(p => (
            <div key={p.id} className="rt-da-proj-item">
              <div className="rt-entry-title">
                {p.title}
                {p.link && <span className="rt-entry-link"> | {p.link}</span>}
              </div>
              {p.tech && <div className="rt-da-proj-tools">Tools: {p.tech}</div>}
              {p.description && <div className="rt-entry-desc">{p.description}</div>}
            </div>
          ))}
        </section>
      )}

      {/* Work Experience */}
      {show('experience') && experience.some(e => e.company || e.role) && (
        <section className="rt-da-sec">
          <div className="rt-da-sec-h" style={{ color: accentColor }}>
            PROFESSIONAL EXPERIENCE
          </div>
          {experience.filter(e => e.company || e.role).map(e => (
            <ExpItem key={e.id} {...e} accentColor={secondaryColor} />
          ))}
        </section>
      )}

      {/* Education */}
      {show('education') && education.some(e => e.degree || e.institution) && (
        <section className="rt-da-sec">
          <div className="rt-da-sec-h" style={{ color: accentColor }}>
            EDUCATION &amp; QUANTITATIVE BACKGROUND
          </div>
          {education.filter(e => e.degree || e.institution).map(e => (
            <EduItem key={e.id} {...e} />
          ))}
        </section>
      )}

      {/* Certifications */}
      {show('certifications') && certifications.length > 0 && (
        <section className="rt-da-sec">
          <div className="rt-da-sec-h" style={{ color: accentColor }}>
            CERTIFICATIONS &amp; CREDENTIALS
          </div>
          {certifications.map(c => (
            <SimpleEntry key={c.id} title={c.name} subtitle={c.issuer} date={c.year} />
          ))}
        </section>
      )}
    </div>
  )
}
