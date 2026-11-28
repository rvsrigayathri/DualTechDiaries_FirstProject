import { ProfilePhoto } from './shared/TemplateHelpers'

/**
 * ATS-Friendly Template — clean single-column, maximally parseable.
 * Improved: clearer experience layout, no null/empty renders, tighter A4 spacing.
 */
export default function AtsTemplate({ data, accentColor, fontFamily = 'Inter' }) {
  const { personal, career, education, skills, experience,
    projects, certifications, achievements, workshops,
    leadership, languages, interests, volunteer, settings } = data
  const hidden = settings.hiddenSections || []
  const show = (key) => !hidden.includes(key)
  const ff = fontFamily === 'Georgia' ? 'Georgia, serif' : fontFamily + ', sans-serif'

  const allSkills = {
    'Programming Languages': skills.languages,
    'Frontend': skills.frontend,
    'Backend': skills.backend,
    'Databases': skills.databases,
    'Tools & Platforms': skills.tools,
    'Soft Skills': skills.soft
  }

  const isPhotoVisible = settings?.showPhoto === true
  const photoShape = settings?.photoShape || 'circle'

  return (
    <div className="rt-ats" style={{ fontFamily: ff }}>
      {/* Header */}
      {isPhotoVisible && personal.photoUrl && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <ProfilePhoto
            photoUrl={personal.photoUrl}
            fullName={personal.fullName}
            size={64}
            shape={photoShape}
            border="2px solid #cbd5e1"
          />
        </div>
      )}
      <div className="rt-ats-name">{personal.fullName || 'Your Name'}</div>
      {career.desiredRole && <div className="rt-ats-role">{career.desiredRole}</div>}
      <div className="rt-ats-contact">
        {[
          personal.email,
          personal.phone ? `${personal.countryCode} ${personal.phone}` : '',
          personal.location,
          personal.linkedin,
          personal.github,
          personal.portfolio
        ].filter(Boolean).join('  |  ')}
      </div>
      <hr className="rt-ats-rule" />

      {/* Summary */}
      {show('summary') && (career.summary || career.objective) && (
        <>
          <div className="rt-ats-sec-h">PROFESSIONAL SUMMARY</div>
          <div className="rt-text" style={{ fontSize: 11, marginBottom: 8 }}>{career.summary || career.objective}</div>
          <hr className="rt-ats-thin" />
        </>
      )}

      {/* Education */}
      {show('education') && education.some(e => e.degree || e.institution) && (
        <>
          <div className="rt-ats-sec-h">EDUCATION</div>
          {education.filter(e => e.degree || e.institution).map(e => {
            const dateRange = [e.startYear, e.gradYear].filter(Boolean).join(' – ')
            return (
              <div key={e.id} style={{ marginBottom: 7 }}>
                <div className="rt-ats-entry-title">
                  <span>{[e.degree, e.specialization].filter(Boolean).join(' in ')}</span>
                  {dateRange && <span>{dateRange}</span>}
                </div>
                <div className="rt-ats-entry-sub">
                  <span>{[e.institution, e.university].filter(Boolean).join(', ')}</span>
                  {e.cgpa && <span>CGPA: {e.cgpa}</span>}
                </div>
              </div>
            )
          })}
          <hr className="rt-ats-thin" />
        </>
      )}

      {/* Skills */}
      {show('skills') && Object.values(allSkills).some(arr => arr.length > 0) && (
        <>
          <div className="rt-ats-sec-h">TECHNICAL SKILLS</div>
          {Object.entries(allSkills).filter(([, arr]) => arr.length > 0).map(([label, arr]) => (
            <div key={label} className="rt-ats-skill-line">
              <strong>{label}:</strong> {arr.join(', ')}
            </div>
          ))}
          <hr className="rt-ats-thin" />
        </>
      )}

      {/* Experience */}
      {show('experience') && experience.some(e => e.company || e.role || e.description) && (
        <>
          <div className="rt-ats-sec-h">EXPERIENCE</div>
          {experience.filter(e => e.company || e.role || e.description).map(e => {
            const dateRange = [e.startDate, e.current ? 'Present' : e.endDate]
              .filter(s => s && s.trim()).join(' – ')
            const orgParts = [e.company, e.location].filter(Boolean).join(', ')
            return (
              <div key={e.id} style={{ marginBottom: 9 }}>
                <div className="rt-ats-entry-title">
                  <span>{e.role || e.type}</span>
                  {dateRange && <span>{dateRange}</span>}
                </div>
                {(orgParts || e.type) && (
                  <div className="rt-ats-entry-sub">
                    {orgParts && <span>{orgParts}</span>}
                    {e.type   && <span style={{ textTransform: 'capitalize' }}>{e.type}</span>}
                  </div>
                )}
                {e.description && <div className="rt-ats-entry-desc">{e.description}</div>}
              </div>
            )
          })}
          <hr className="rt-ats-thin" />
        </>
      )}

      {/* Projects */}
      {show('projects') && projects.length > 0 && (
        <>
          <div className="rt-ats-sec-h">PROJECTS</div>
          {projects.map(p => (
            <div key={p.id} style={{ marginBottom: 7 }}>
              <div className="rt-ats-entry-title">
                <span>{p.title}</span>
                {p.link && <span style={{ fontSize: 10, fontWeight: 400 }}>{p.link}</span>}
              </div>
              {p.tech && <div className="rt-ats-entry-sub"><span>Tech: {p.tech}</span></div>}
              {p.description && <div className="rt-ats-entry-desc">{p.description}</div>}
            </div>
          ))}
          <hr className="rt-ats-thin" />
        </>
      )}

      {/* Certifications */}
      {show('certifications') && certifications.length > 0 && (
        <>
          <div className="rt-ats-sec-h">CERTIFICATIONS</div>
          {certifications.map(c => (
            <div key={c.id} style={{ marginBottom: 5 }}>
              <div className="rt-ats-entry-title">
                <span>{c.name}</span>
                {c.year && <span>{c.year}</span>}
              </div>
              {c.issuer && <div className="rt-ats-entry-sub"><span>{c.issuer}</span></div>}
            </div>
          ))}
          <hr className="rt-ats-thin" />
        </>
      )}

      {/* Achievements */}
      {show('achievements') && achievements.length > 0 && (
        <>
          <div className="rt-ats-sec-h">ACHIEVEMENTS</div>
          {achievements.map(a => (
            <div key={a.id} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700 }}>{a.title}</div>
              {a.description && <div className="rt-ats-entry-desc">{a.description}</div>}
            </div>
          ))}
          <hr className="rt-ats-thin" />
        </>
      )}

      {/* Workshops */}
      {show('workshops') && workshops.length > 0 && (
        <>
          <div className="rt-ats-sec-h">WORKSHOPS &amp; TRAINING</div>
          {workshops.map(w => (
            <div key={w.id} style={{ marginBottom: 4 }}>
              <div className="rt-ats-entry-title">
                <span>{w.name}</span>
                {w.year && <span>{w.year}</span>}
              </div>
              {w.organizer && <div className="rt-ats-entry-sub"><span>{w.organizer}</span></div>}
            </div>
          ))}
          <hr className="rt-ats-thin" />
        </>
      )}

      {/* Leadership */}
      {show('leadership') && leadership.length > 0 && (
        <>
          <div className="rt-ats-sec-h">LEADERSHIP &amp; EXTRACURRICULARS</div>
          {leadership.map(l => (
            <div key={l.id} style={{ marginBottom: 5 }}>
              <div className="rt-ats-entry-title">
                <span>{l.role}</span>
                {l.org && <span>{l.org}</span>}
              </div>
              {l.description && <div className="rt-ats-entry-desc">{l.description}</div>}
            </div>
          ))}
          <hr className="rt-ats-thin" />
        </>
      )}

      {/* Languages & Interests */}
      {((show('languages') && languages.length > 0) || (show('interests') && interests.length > 0)) && (
        <>
          <div className="rt-ats-sec-h">LANGUAGES &amp; INTERESTS</div>
          {languages.length > 0 && (
            <div className="rt-ats-skill-line">
              <strong>Languages: </strong>
              {languages.map(l => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(', ')}
            </div>
          )}
          {interests.length > 0 && (
            <div className="rt-ats-skill-line">
              <strong>Interests: </strong>{interests.join(', ')}
            </div>
          )}
        </>
      )}

      {/* Volunteer */}
      {show('volunteer') && volunteer.length > 0 && (
        <>
          <hr className="rt-ats-thin" />
          <div className="rt-ats-sec-h">VOLUNTEER EXPERIENCE</div>
          {volunteer.map(v => (
            <div key={v.id} style={{ marginBottom: 5 }}>
              <div className="rt-ats-entry-title">
                <span>{v.role}</span>
                {v.org && <span>{v.org}</span>}
              </div>
              {v.description && <div className="rt-ats-entry-desc">{v.description}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
