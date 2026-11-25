/**
 * Classic Template — traditional professional layout.
 * Improved: tighter spacing, clearer experience layout, no null/empty renders.
 */

/** Render an experience entry with clear hierarchy */
function ExpEntry({ e, accent }) {
  const orgLine = [e.company, e.location].filter(Boolean).join(' · ')
  const dateRange = [e.startDate, e.current ? 'Present' : e.endDate]
    .filter(s => s && s.trim()).join(' – ')
  return (
    <div className="rt-exp-entry">
      {e.role && <div className="rt-exp-title">{e.role}</div>}
      {orgLine  && <div className="rt-exp-org">{orgLine}</div>}
      {dateRange && <div className="rt-exp-date">{dateRange}</div>}
      {e.description && <div className="rt-exp-desc">{e.description}</div>}
    </div>
  )
}

export default function ClassicTemplate({ data, accentColor = '#2457d6', fontFamily = 'Inter' }) {
  const { personal, career, education, skills, experience,
    projects, certifications, achievements, workshops,
    leadership, languages, interests, volunteer,
    settings } = data

  const hidden = settings.hiddenSections || []
  const show = (key) => !hidden.includes(key)

  const accent = accentColor
  const name = personal.fullName || 'Your Name'
  const role = career.desiredRole || ''
  const contactParts = [
    personal.email,
    personal.phone ? `${personal.countryCode} ${personal.phone}` : '',
    personal.location,
    personal.linkedin,
    personal.github,
    personal.portfolio
  ].filter(Boolean)

  const allSkills = [
    ...skills.languages, ...skills.frontend, ...skills.backend,
    ...skills.databases, ...skills.tools
  ]
  const softSkills = skills.soft

  const style = { fontFamily: fontFamily === 'Georgia' ? 'Georgia, serif' : fontFamily + ', sans-serif' }

  return (
    <div className="rt-classic" style={style}>
      {/* Header */}
      <div className="rt-classic-header" style={{ borderBottomColor: accent }}>
        {personal.photoUrl && (
          <img src={personal.photoUrl} className="rt-photo" alt="Profile" />
        )}
        <div className="rt-classic-name" style={{ color: accent }}>{name}</div>
        {role && <div className="rt-classic-role">{role}</div>}
        {contactParts.length > 0 && (
          <div className="rt-classic-contact">
            {contactParts.map((p, i) => (
              <span key={i} className="rt-classic-contact-item">
                {i > 0 && <span style={{ color: accent, marginRight: 4 }}>·</span>}
                {p}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {show('summary') && (career.summary || career.objective) && (
        <div className="rt-section">
          <div className="rt-section-title" style={{ color: accent }}>Professional Summary</div>
          <div className="rt-text">{career.summary || career.objective}</div>
        </div>
      )}

      {/* Education */}
      {show('education') && education.some(e => e.degree || e.institution) && (
        <div className="rt-section">
          <div className="rt-section-title" style={{ color: accent }}>Education</div>
          {education.filter(e => e.degree || e.institution).map(e => (
            <div key={e.id} className="rt-entry">
              <div className="rt-entry-title">
                {[e.degree, e.specialization].filter(Boolean).join(' in ')}
              </div>
              <div className="rt-entry-org">
                {[e.institution, e.university].filter(Boolean).join(' · ')}
              </div>
              {(e.startYear || e.gradYear || e.cgpa) && (
                <div className="rt-entry-date">
                  {[e.startYear, e.gradYear].filter(Boolean).join(' – ')}
                  {e.cgpa && ` · ${e.cgpa}`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {show('skills') && allSkills.length > 0 && (
        <div className="rt-section">
          <div className="rt-section-title" style={{ color: accent }}>Technical Skills</div>
          <div className="rt-tags">
            {allSkills.map((s, i) => (
              <span key={i} className="rt-tag" style={{ background: accentColor + '18', color: '#17233c' }}>{s}</span>
            ))}
          </div>
          {softSkills.length > 0 && (
            <div className="rt-text" style={{ marginTop: 6 }}>
              <strong>Soft Skills: </strong>{softSkills.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Experience */}
      {show('experience') && experience.some(e => e.company || e.role || e.description) && (
        <div className="rt-section">
          <div className="rt-section-title" style={{ color: accent }}>Experience</div>
          {experience.filter(e => e.company || e.role || e.description).map(e => (
            <ExpEntry key={e.id} e={e} accent={accent} />
          ))}
        </div>
      )}

      {/* Projects */}
      {show('projects') && projects.length > 0 && (
        <div className="rt-section">
          <div className="rt-section-title" style={{ color: accent }}>Projects</div>
          {projects.map(p => (
            <div key={p.id} className="rt-entry">
              <div className="rt-entry-title">
                {p.title}
                {p.link && <span style={{ fontSize: 9.5, fontWeight: 400, marginLeft: 8, color: accent }}>{p.link}</span>}
              </div>
              {p.tech && <div className="rt-entry-sub">{p.tech}</div>}
              {p.description && <div className="rt-entry-desc">{p.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {show('certifications') && certifications.length > 0 && (
        <div className="rt-section">
          <div className="rt-section-title" style={{ color: accent }}>Certifications</div>
          {certifications.map(c => (
            <div key={c.id} className="rt-entry">
              <div className="rt-entry-title">{c.name}</div>
              {(c.issuer || c.year) && (
                <div className="rt-entry-sub">{[c.issuer, c.year].filter(Boolean).join(' · ')}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {show('achievements') && achievements.length > 0 && (
        <div className="rt-section">
          <div className="rt-section-title" style={{ color: accent }}>Achievements</div>
          {achievements.map(a => (
            <div key={a.id} className="rt-entry">
              <div className="rt-entry-title">{a.title}</div>
              {a.description && <div className="rt-entry-desc">{a.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Workshops */}
      {show('workshops') && workshops.length > 0 && (
        <div className="rt-section">
          <div className="rt-section-title" style={{ color: accent }}>Workshops &amp; Training</div>
          {workshops.map(w => (
            <div key={w.id} className="rt-entry">
              <div className="rt-entry-title">{w.name}</div>
              {(w.organizer || w.year) && (
                <div className="rt-entry-sub">{[w.organizer, w.year].filter(Boolean).join(' · ')}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Leadership */}
      {show('leadership') && leadership.length > 0 && (
        <div className="rt-section">
          <div className="rt-section-title" style={{ color: accent }}>Leadership &amp; Extracurriculars</div>
          {leadership.map(l => (
            <div key={l.id} className="rt-entry">
              <div className="rt-entry-title">
                {l.role}{l.org ? ` — ${l.org}` : ''}
              </div>
              {l.description && <div className="rt-entry-desc">{l.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Languages + Interests */}
      {((show('languages') && languages.length > 0) || (show('interests') && interests.length > 0)) && (
        <div className="rt-section">
          <div className="rt-section-title" style={{ color: accent }}>Languages &amp; Interests</div>
          {languages.length > 0 && (
            <div className="rt-text"><strong>Languages: </strong>
              {languages.map(l => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' · ')}
            </div>
          )}
          {interests.length > 0 && (
            <div className="rt-text"><strong>Interests: </strong>{interests.join(' · ')}</div>
          )}
        </div>
      )}

      {/* Volunteer */}
      {show('volunteer') && volunteer.length > 0 && (
        <div className="rt-section">
          <div className="rt-section-title" style={{ color: accent }}>Volunteer Experience</div>
          {volunteer.map(v => (
            <div key={v.id} className="rt-entry">
              <div className="rt-entry-title">{v.role}{v.org ? ` — ${v.org}` : ''}</div>
              {v.description && <div className="rt-entry-desc">{v.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Empty state — only shown in editor, not in PDF */}
      {!personal.fullName && (
        <div className="rt-placeholder" style={{ textAlign: 'center', marginTop: 40, fontSize: 13 }}>
          Fill in your details to see your resume here ✦
        </div>
      )}
    </div>
  )
}
