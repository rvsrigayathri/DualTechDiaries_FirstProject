import { ExpItem, EduItem, ProjectItem, SimpleEntry } from './shared/TemplateHelpers'

/**
 * 6. Academic CV Template
 * Classical academic styling, Georgia serif font, structured research, publications & teaching credentials.
 */
export default function AcademicCvTemplate({
  data,
  accentColor = '#374151',
  secondaryColor = '#1f2937',
  fontFamily = 'Georgia'
}) {
  const { personal, career, education, skills, experience, projects, certifications, achievements, workshops, leadership, languages, interests, volunteer, settings } = data
  const hidden = settings?.hiddenSections || []
  const show = (k) => !hidden.includes(k)

  const ff = fontFamily === 'Inter' ? 'Inter, sans-serif' : 'Georgia, serif'

  return (
    <div className="rt-academic" style={{ fontFamily: ff }}>
      {/* Centered Academic Header */}
      <div className="rt-acad-header">
        <h1 className="rt-acad-name">{personal.fullName || 'Curriculum Vitae'}</h1>
        {career.desiredRole && <div className="rt-acad-role">{career.desiredRole}</div>}
        <div className="rt-acad-contact">
          {[
            personal.location,
            personal.email,
            personal.phone ? `${personal.countryCode} ${personal.phone}` : '',
            personal.portfolio,
            personal.linkedin
          ].filter(Boolean).join('  •  ')}
        </div>
      </div>
      <div className="rt-acad-rule" />

      {/* Research Statement / Objective */}
      {show('summary') && (career.summary || career.objective) && (
        <section className="rt-acad-sec">
          <h2 className="rt-acad-sec-h">RESEARCH INTERESTS &amp; PROFILE</h2>
          <div className="rt-text">{career.summary || career.objective}</div>
        </section>
      )}

      {/* Education (Top Priority for Academic CV) */}
      {show('education') && education.some(e => e.degree || e.institution) && (
        <section className="rt-acad-sec">
          <h2 className="rt-acad-sec-h">EDUCATION</h2>
          {education.filter(e => e.degree || e.institution).map(e => (
            <EduItem key={e.id} {...e} />
          ))}
        </section>
      )}

      {/* Academic / Teaching / Research Experience */}
      {show('experience') && experience.some(e => e.company || e.role) && (
        <section className="rt-acad-sec">
          <h2 className="rt-acad-sec-h">ACADEMIC &amp; PROFESSIONAL APPOINTMENTS</h2>
          {experience.filter(e => e.company || e.role).map(e => (
            <ExpItem key={e.id} {...e} />
          ))}
        </section>
      )}

      {/* Publications / Projects */}
      {show('projects') && projects.length > 0 && (
        <section className="rt-acad-sec">
          <h2 className="rt-acad-sec-h">RESEARCH PROJECTS &amp; PUBLICATIONS</h2>
          {projects.map(p => (
            <ProjectItem key={p.id} {...p} />
          ))}
        </section>
      )}

      {/* Workshops & Conferences */}
      {show('workshops') && workshops.length > 0 && (
        <section className="rt-acad-sec">
          <h2 className="rt-acad-sec-h">CONFERENCES, WORKSHOPS &amp; SYMPOSIA</h2>
          {workshops.map(w => (
            <SimpleEntry key={w.id} title={w.name} subtitle={w.organizer} date={w.year} />
          ))}
        </section>
      )}

      {/* Honors & Grants */}
      {show('achievements') && achievements.length > 0 && (
        <section className="rt-acad-sec">
          <h2 className="rt-acad-sec-h">HONORS, AWARDS &amp; GRANTS</h2>
          {achievements.map(a => (
            <SimpleEntry key={a.id} title={a.title} description={a.description} />
          ))}
        </section>
      )}

      {/* Certifications */}
      {show('certifications') && certifications.length > 0 && (
        <section className="rt-acad-sec">
          <h2 className="rt-acad-sec-h">FELLOWSHIPS &amp; CERTIFICATIONS</h2>
          {certifications.map(c => (
            <SimpleEntry key={c.id} title={c.name} subtitle={c.issuer} date={c.year} />
          ))}
        </section>
      )}

      {/* Languages */}
      {show('languages') && languages.length > 0 && (
        <section className="rt-acad-sec">
          <h2 className="rt-acad-sec-h">LANGUAGES &amp; SCHOLARLY PROFICIENCIES</h2>
          <div className="rt-text">
            {languages.map(l => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(', ')}
          </div>
        </section>
      )}
    </div>
  )
}
