import { ExpItem, EduItem, ProjectItem, SimpleEntry, formatDateRange, ProfilePhoto } from './shared/TemplateHelpers'

/**
 * 1. ATS Professional Template
 * Ultra-clean, single-column, strictly linear structure designed for optimal ATS parsing.
 * High contrast, standard dividers, tabular alignment.
 */
export default function AtsProfessionalTemplate({
  data,
  accentColor = '#111827',
  fontFamily = 'Inter',
  showPhoto,
  photoShape
}) {
  const { personal, career, education, skills, experience, projects, certifications, achievements, workshops, leadership, languages, interests, volunteer, settings } = data
  const hidden = settings?.hiddenSections || []
  const show = (k) => !hidden.includes(k)

  // ATS templates default to photo hidden for parsing compliance, but respect explicit user toggle
  const isPhotoVisible = showPhoto === true || (settings?.showPhoto === true)
  const shape = photoShape || settings?.photoShape || 'circle'

  const ff = fontFamily === 'Georgia' ? 'Georgia, serif' : `${fontFamily}, sans-serif`
  const contactParts = [
    personal.email,
    personal.phone ? `${personal.countryCode} ${personal.phone}` : '',
    personal.location,
    personal.linkedin,
    personal.github,
    personal.portfolio
  ].filter(Boolean)

  const skillCategories = [
    { label: 'Technical Languages', list: skills.languages },
    { label: 'Frontend', list: skills.frontend },
    { label: 'Backend', list: skills.backend },
    { label: 'Databases', list: skills.databases },
    { label: 'Tools & Platforms', list: skills.tools },
    { label: 'Core Competencies', list: skills.soft }
  ].filter(c => c.list && c.list.length > 0)

  return (
    <div className="rt-ats-pro" style={{ fontFamily: ff }}>
      {/* Header */}
      <div className="rt-ats-pro-header" style={isPhotoVisible && personal.photoUrl ? { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 } : undefined}>
        <div style={isPhotoVisible && personal.photoUrl ? { flex: 1 } : undefined}>
          <h1 className="rt-ats-pro-name">{personal.fullName || 'Your Name'}</h1>
          {career.desiredRole && <div className="rt-ats-pro-role">{career.desiredRole}</div>}
          {contactParts.length > 0 && (
            <div className="rt-ats-pro-contact">
              {contactParts.join('  •  ')}
            </div>
          )}
        </div>
        {isPhotoVisible && personal.photoUrl && (
          <ProfilePhoto
            photoUrl={personal.photoUrl}
            fullName={personal.fullName}
            shape={shape}
            size={60}
            border="2px solid #111827"
          />
        )}
      </div>

      {/* Summary */}
      {show('summary') && (career.summary || career.objective) && (
        <section className="rt-ats-pro-sec">
          <div className="rt-ats-pro-sec-title">PROFESSIONAL SUMMARY</div>
          <div className="rt-text">{career.summary || career.objective}</div>
        </section>
      )}

      {/* Experience */}
      {show('experience') && experience.some(e => e.company || e.role) && (
        <section className="rt-ats-pro-sec">
          <div className="rt-ats-pro-sec-title">PROFESSIONAL EXPERIENCE</div>
          {experience.filter(e => e.company || e.role).map(e => (
            <ExpItem key={e.id} {...e} />
          ))}
        </section>
      )}

      {/* Education */}
      {show('education') && education.some(e => e.degree || e.institution) && (
        <section className="rt-ats-pro-sec">
          <div className="rt-ats-pro-sec-title">EDUCATION</div>
          {education.filter(e => e.degree || e.institution).map(e => (
            <EduItem key={e.id} {...e} />
          ))}
        </section>
      )}

      {/* Skills */}
      {show('skills') && skillCategories.length > 0 && (
        <section className="rt-ats-pro-sec">
          <div className="rt-ats-pro-sec-title">SKILLS &amp; EXPERTISE</div>
          {skillCategories.map(sc => (
            <div key={sc.label} className="rt-ats-skill-line">
              <strong>{sc.label}: </strong>{sc.list.join(', ')}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {show('projects') && projects.length > 0 && (
        <section className="rt-ats-pro-sec">
          <div className="rt-ats-pro-sec-title">PROJECTS</div>
          {projects.map(p => (
            <ProjectItem key={p.id} {...p} />
          ))}
        </section>
      )}

      {/* Certifications */}
      {show('certifications') && certifications.length > 0 && (
        <section className="rt-ats-pro-sec">
          <div className="rt-ats-pro-sec-title">CERTIFICATIONS</div>
          {certifications.map(c => (
            <SimpleEntry key={c.id} title={c.name} subtitle={c.issuer} date={c.year} />
          ))}
        </section>
      )}

      {/* Achievements */}
      {show('achievements') && achievements.length > 0 && (
        <section className="rt-ats-pro-sec">
          <div className="rt-ats-pro-sec-title">KEY ACHIEVEMENTS</div>
          {achievements.map(a => (
            <SimpleEntry key={a.id} title={a.title} description={a.description} />
          ))}
        </section>
      )}

      {/* Workshops */}
      {show('workshops') && workshops.length > 0 && (
        <section className="rt-ats-pro-sec">
          <div className="rt-ats-pro-sec-title">TRAINING &amp; WORKSHOPS</div>
          {workshops.map(w => (
            <SimpleEntry key={w.id} title={w.name} subtitle={w.organizer} date={w.year} />
          ))}
        </section>
      )}

      {/* Leadership */}
      {show('leadership') && leadership.length > 0 && (
        <section className="rt-ats-pro-sec">
          <div className="rt-ats-pro-sec-title">LEADERSHIP &amp; ACTIVITIES</div>
          {leadership.map(l => (
            <SimpleEntry key={l.id} title={l.role} subtitle={l.org} description={l.description} />
          ))}
        </section>
      )}

      {/* Languages & Interests */}
      {(show('languages') || show('interests')) && (languages.length > 0 || interests.length > 0) && (
        <section className="rt-ats-pro-sec">
          <div className="rt-ats-pro-sec-title">ADDITIONAL INFORMATION</div>
          {show('languages') && languages.length > 0 && (
            <div className="rt-ats-skill-line">
              <strong>Languages: </strong>
              {languages.map(l => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(', ')}
            </div>
          )}
          {show('interests') && interests.length > 0 && (
            <div className="rt-ats-skill-line">
              <strong>Interests: </strong>{interests.join(', ')}
            </div>
          )}
        </section>
      )}

      {/* Volunteer */}
      {show('volunteer') && volunteer.length > 0 && (
        <section className="rt-ats-pro-sec">
          <div className="rt-ats-pro-sec-title">VOLUNTEER SERVICE</div>
          {volunteer.map(v => (
            <SimpleEntry key={v.id} title={v.role} subtitle={v.org} description={v.description} />
          ))}
        </section>
      )}
    </div>
  )
}
