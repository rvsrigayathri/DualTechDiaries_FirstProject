import { ExpItem, EduItem, ProjectItem, SimpleEntry, ProfilePhoto } from './shared/TemplateHelpers'

/**
 * 10. Engineering Professional Template
 * Disciplined technical layout for civil, mechanical, electrical & hardware engineers.
 * Clear specifications, standards, project scopes, and credentials.
 */
export default function EngineeringProfessionalTemplate({
  data,
  accentColor = '#0284c7',
  secondaryColor = '#0369a1',
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
  const engineeringSkills = [
    { cat: 'Engineering Software & Tools', list: skills.tools },
    { cat: 'Programming & Analysis', list: skills.languages },
    { cat: 'Core Technologies', list: [...(skills.frontend || []), ...(skills.backend || [])] },
    { cat: 'Systems & Methodologies', list: skills.soft }
  ].filter(s => s.list && s.list.length > 0)

  return (
    <div className="rt-eng" style={{ fontFamily: ff }}>
      {/* Header */}
      <div className="rt-eng-header" style={{ borderLeft: `6px solid ${accentColor}` }}>
        <div className="rt-eng-title-group" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
            <h1 className="rt-eng-name">{personal.fullName || 'Engineer Name'}</h1>
            {career.desiredRole && <div className="rt-eng-role" style={{ color: accentColor }}>{career.desiredRole}</div>}
          </div>
        </div>
        <div className="rt-eng-contact-block">
          {personal.email && <div>✉ {personal.email}</div>}
          {personal.phone && <div>📞 {personal.countryCode} {personal.phone}</div>}
          {personal.location && <div>📍 {personal.location}</div>}
          {personal.linkedin && <div>🔗 {personal.linkedin}</div>}
          {personal.portfolio && <div>🌐 {personal.portfolio}</div>}
        </div>
      </div>

      {/* Engineering Profile */}
      {show('summary') && (career.summary || career.objective) && (
        <section className="rt-eng-sec">
          <h2 className="rt-eng-sec-h" style={{ color: secondaryColor }}>
            ENGINEERING PROFILE
          </h2>
          <div className="rt-text">{career.summary || career.objective}</div>
        </section>
      )}

      {/* Engineering Competencies */}
      {show('skills') && engineeringSkills.length > 0 && (
        <section className="rt-eng-sec">
          <h2 className="rt-eng-sec-h" style={{ color: secondaryColor }}>
            TECHNICAL &amp; ENGINEERING COMPETENCIES
          </h2>
          <div className="rt-eng-skills-list">
            {engineeringSkills.map(es => (
              <div key={es.cat} style={{ marginBottom: 4, fontSize: 11 }}>
                <strong style={{ color: '#1e293b' }}>{es.cat}: </strong>{es.list.join(', ')}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {show('experience') && experience.some(e => e.company || e.role) && (
        <section className="rt-eng-sec">
          <h2 className="rt-eng-sec-h" style={{ color: secondaryColor }}>
            ENGINEERING &amp; FIELD EXPERIENCE
          </h2>
          {experience.filter(e => e.company || e.role).map(e => (
            <ExpItem key={e.id} {...e} accentColor={accentColor} />
          ))}
        </section>
      )}

      {/* Major Projects & Designs */}
      {show('projects') && projects.length > 0 && (
        <section className="rt-eng-sec">
          <h2 className="rt-eng-sec-h" style={{ color: secondaryColor }}>
            ENGINEERING PROJECTS &amp; SPECIFICATIONS
          </h2>
          {projects.map(p => (
            <ProjectItem key={p.id} {...p} />
          ))}
        </section>
      )}

      {/* Education */}
      {show('education') && education.some(e => e.degree || e.institution) && (
        <section className="rt-eng-sec">
          <h2 className="rt-eng-sec-h" style={{ color: secondaryColor }}>
            EDUCATION &amp; ENGINEERING DEGREE
          </h2>
          {education.filter(e => e.degree || e.institution).map(e => (
            <EduItem key={e.id} {...e} />
          ))}
        </section>
      )}

      {/* Licensure & Certifications */}
      {show('certifications') && certifications.length > 0 && (
        <section className="rt-eng-sec">
          <h2 className="rt-eng-sec-h" style={{ color: secondaryColor }}>
            LICENSURE &amp; CERTIFICATIONS
          </h2>
          {certifications.map(c => (
            <SimpleEntry key={c.id} title={c.name} subtitle={c.issuer} date={c.year} />
          ))}
        </section>
      )}
    </div>
  )
}
