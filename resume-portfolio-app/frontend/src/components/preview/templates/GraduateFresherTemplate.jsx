import { ExpItem, EduItem, ProjectItem, SimpleEntry, ProfilePhoto } from './shared/TemplateHelpers'

/**
 * 7. Graduate Fresher Template
 * Student/entry-level friendly: Education & Academic Projects up front,
 * coursework, campus leadership, and technical proficiencies.
 */
export default function GraduateFresherTemplate({
  data,
  accentColor = '#3b82f6',
  secondaryColor = '#1d4ed8',
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
  const allSkills = [
    ...(skills.languages || []),
    ...(skills.frontend || []),
    ...(skills.backend || []),
    ...(skills.databases || []),
    ...(skills.tools || [])
  ]

  return (
    <div className="rt-fresher" style={{ fontFamily: ff }}>
      {/* Header */}
      <div className="rt-fresher-header">
        {isPhotoVisible && personal.photoUrl && (
          <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
            <ProfilePhoto
              photoUrl={personal.photoUrl}
              fullName={personal.fullName}
              shape={shape}
              size={64}
              border={`2px solid ${accentColor}`}
            />
          </div>
        )}
        <h1 className="rt-fresher-name" style={{ color: secondaryColor }}>{personal.fullName || 'Graduate Name'}</h1>
        {career.desiredRole && <div className="rt-fresher-role" style={{ color: accentColor }}>{career.desiredRole}</div>}
        <div className="rt-fresher-contact">
          {[
            personal.email,
            personal.phone ? `${personal.countryCode} ${personal.phone}` : '',
            personal.location,
            personal.github,
            personal.linkedin,
            personal.portfolio
          ].filter(Boolean).join('  •  ')}
        </div>
      </div>
      <div className="rt-fresher-bar" style={{ background: accentColor }} />

      {/* Career Objective */}
      {show('summary') && (career.objective || career.summary) && (
        <section className="rt-fresher-sec">
          <div className="rt-fresher-sec-h" style={{ color: secondaryColor }}>CAREER OBJECTIVE</div>
          <div className="rt-text">{career.objective || career.summary}</div>
        </section>
      )}

      {/* Education (Top Highlight for Freshers) */}
      {show('education') && education.some(e => e.degree || e.institution) && (
        <section className="rt-fresher-sec">
          <div className="rt-fresher-sec-h" style={{ color: secondaryColor }}>EDUCATION</div>
          {education.filter(e => e.degree || e.institution).map(e => (
            <EduItem key={e.id} {...e} />
          ))}
        </section>
      )}

      {/* Technical Skills */}
      {show('skills') && allSkills.length > 0 && (
        <section className="rt-fresher-sec">
          <div className="rt-fresher-sec-h" style={{ color: secondaryColor }}>TECHNICAL &amp; SOFT SKILLS</div>
          <div className="rt-fresher-tags">
            {allSkills.map((s, i) => (
              <span key={i} className="rt-fresher-tag" style={{ borderColor: accentColor }}>{s}</span>
            ))}
          </div>
          {skills.soft?.length > 0 && (
            <div style={{ marginTop: 6, fontSize: 11 }}>
              <strong>Interpersonal Skills: </strong>{skills.soft.join(', ')}
            </div>
          )}
        </section>
      )}

      {/* Academic / Major Projects */}
      {show('projects') && projects.length > 0 && (
        <section className="rt-fresher-sec">
          <div className="rt-fresher-sec-h" style={{ color: secondaryColor }}>PROJECTS &amp; ACADEMIC WORK</div>
          {projects.map(p => (
            <ProjectItem key={p.id} {...p} />
          ))}
        </section>
      )}

      {/* Internships & Work Experience */}
      {show('experience') && experience.some(e => e.company || e.role) && (
        <section className="rt-fresher-sec">
          <div className="rt-fresher-sec-h" style={{ color: secondaryColor }}>INTERNSHIPS &amp; EXPERIENCE</div>
          {experience.filter(e => e.company || e.role).map(e => (
            <ExpItem key={e.id} {...e} accentColor={accentColor} />
          ))}
        </section>
      )}

      {/* Certifications & Trainings */}
      {show('certifications') && certifications.length > 0 && (
        <section className="rt-fresher-sec">
          <div className="rt-fresher-sec-h" style={{ color: secondaryColor }}>CERTIFICATIONS &amp; ONLINE COURSES</div>
          {certifications.map(c => (
            <SimpleEntry key={c.id} title={c.name} subtitle={c.issuer} date={c.year} />
          ))}
        </section>
      )}

      {/* Campus Leadership & Extracurriculars */}
      {show('leadership') && leadership.length > 0 && (
        <section className="rt-fresher-sec">
          <div className="rt-fresher-sec-h" style={{ color: secondaryColor }}>CAMPUS INVOLVEMENT &amp; LEADERSHIP</div>
          {leadership.map(l => (
            <SimpleEntry key={l.id} title={l.role} subtitle={l.org} description={l.description} />
          ))}
        </section>
      )}

      {/* Achievements */}
      {show('achievements') && achievements.length > 0 && (
        <section className="rt-fresher-sec">
          <div className="rt-fresher-sec-h" style={{ color: secondaryColor }}>HONORS &amp; ACHIEVEMENTS</div>
          {achievements.map(a => (
            <SimpleEntry key={a.id} title={a.title} description={a.description} />
          ))}
        </section>
      )}
    </div>
  )
}
