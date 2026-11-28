import { ExpItem, EduItem, ProjectItem, SimpleEntry, ProfilePhoto } from './shared/TemplateHelpers'

/**
 * 8. Senior Executive Template
 * High-stature layout emphasizing corporate governance, strategic leadership,
 * career timeline, board roles, and organizational achievements.
 */
export default function SeniorExecutiveTemplate({
  data,
  accentColor = '#4338ca',
  secondaryColor = '#312e81',
  fontFamily = 'Georgia',
  showPhoto,
  photoShape
}) {
  const { personal, career, education, skills, experience, projects, certifications, achievements, workshops, leadership, languages, interests, volunteer, settings } = data
  const hidden = settings?.hiddenSections || []
  const show = (k) => !hidden.includes(k)

  const isPhotoVisible = showPhoto !== undefined ? showPhoto : (settings?.showPhoto !== false)
  const shape = photoShape || settings?.photoShape || 'circle'

  const ff = fontFamily === 'Inter' ? 'Inter, sans-serif' : 'Georgia, serif'
  const leadershipSkills = [
    ...(skills.soft || []),
    ...(skills.tools || []),
    ...(skills.backend || [])
  ]

  return (
    <div className="rt-sr-exec" style={{ fontFamily: ff }}>
      {/* Executive Letterhead Header */}
      <header className="rt-sr-exec-head">
        {isPhotoVisible && personal.photoUrl && (
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
            <ProfilePhoto
              photoUrl={personal.photoUrl}
              fullName={personal.fullName}
              shape={shape}
              size={68}
              border={`2.5px solid ${accentColor}`}
            />
          </div>
        )}
        <h1 className="rt-sr-exec-name">{personal.fullName || 'Executive Candidate'}</h1>
        {career.desiredRole && <div className="rt-sr-exec-role" style={{ color: accentColor }}>{career.desiredRole}</div>}
        <div className="rt-sr-exec-contact">
          {[
            personal.location,
            personal.email,
            personal.phone ? `${personal.countryCode} ${personal.phone}` : '',
            personal.linkedin,
            personal.portfolio
          ].filter(Boolean).join('  |  ')}
        </div>
      </header>
      <div className="rt-sr-exec-double-rule" style={{ borderColor: accentColor }} />

      {/* Executive Summary */}
      {show('summary') && (career.summary || career.objective) && (
        <section className="rt-sr-exec-sec">
          <h2 className="rt-sr-exec-sec-title">EXECUTIVE SUMMARY</h2>
          <div className="rt-text">{career.summary || career.objective}</div>
        </section>
      )}

      {/* Core Competencies Matrix */}
      {show('skills') && leadershipSkills.length > 0 && (
        <section className="rt-sr-exec-sec">
          <h2 className="rt-sr-exec-sec-title">AREAS OF EXPERTISE</h2>
          <div className="rt-sr-exec-grid-skills">
            {leadershipSkills.map((s, i) => (
              <div key={i} className="rt-sr-exec-skill-pill">{s}</div>
            ))}
          </div>
        </section>
      )}

      {/* Career History / Executive Experience */}
      {show('experience') && experience.some(e => e.company || e.role) && (
        <section className="rt-sr-exec-sec">
          <h2 className="rt-sr-exec-sec-title">EXECUTIVE CAREER HISTORY</h2>
          {experience.filter(e => e.company || e.role).map(e => (
            <ExpItem key={e.id} {...e} accentColor={accentColor} />
          ))}
        </section>
      )}

      {/* Board & Governance Leadership */}
      {show('leadership') && leadership.length > 0 && (
        <section className="rt-sr-exec-sec">
          <h2 className="rt-sr-exec-sec-title">BOARD ROLES &amp; GOVERNANCE</h2>
          {leadership.map(l => (
            <SimpleEntry key={l.id} title={l.role} subtitle={l.org} description={l.description} />
          ))}
        </section>
      )}

      {/* Strategic Initiatives */}
      {show('projects') && projects.length > 0 && (
        <section className="rt-sr-exec-sec">
          <h2 className="rt-sr-exec-sec-title">STRATEGIC TRANSACTIONS &amp; INITIATIVES</h2>
          {projects.map(p => (
            <ProjectItem key={p.id} {...p} />
          ))}
        </section>
      )}

      {/* Education & Credentials */}
      {show('education') && education.some(e => e.degree || e.institution) && (
        <section className="rt-sr-exec-sec">
          <h2 className="rt-sr-exec-sec-title">EDUCATION &amp; ADVANCED DEGREES</h2>
          {education.filter(e => e.degree || e.institution).map(e => (
            <EduItem key={e.id} {...e} />
          ))}
        </section>
      )}

      {/* Honors & Milestones */}
      {show('achievements') && achievements.length > 0 && (
        <section className="rt-sr-exec-sec">
          <h2 className="rt-sr-exec-sec-title">AWARDS &amp; RECOGNITIONS</h2>
          {achievements.map(a => (
            <SimpleEntry key={a.id} title={a.title} description={a.description} />
          ))}
        </section>
      )}
    </div>
  )
}
