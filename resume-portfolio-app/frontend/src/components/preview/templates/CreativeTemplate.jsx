/**
 * Creative Template — bold color header band + 2-column body.
 * Improved: clearer experience layout, no null/empty renders, tighter spacing.
 */

import { ProfilePhoto } from './shared/TemplateHelpers'

function ExpEntry({ e }) {
  const orgLine  = [e.company, e.location].filter(Boolean).join(' · ')
  const dateRange = [e.startDate, e.current ? 'Present' : e.endDate]
    .filter(s => s && s.trim()).join(' – ')
  return (
    <div className="rt-exp-entry">
      {e.role     && <div className="rt-exp-title">{e.role}</div>}
      {orgLine    && <div className="rt-exp-org">{orgLine}</div>}
      {dateRange  && <div className="rt-exp-date">{dateRange}</div>}
      {e.description && <div className="rt-exp-desc">{e.description}</div>}
    </div>
  )
}

export default function CreativeTemplate({ data, accentColor = '#2457d6', fontFamily = 'Inter' }) {
  const { personal, career, education, skills, experience,
    projects, certifications, achievements, workshops,
    leadership, languages, interests, volunteer, settings } = data
  const hidden = settings.hiddenSections || []
  const show = (key) => !hidden.includes(key)
  const ff = fontFamily === 'Georgia' ? 'Georgia, serif' : fontFamily + ', sans-serif'

  const allSkills = [
    ...skills.languages, ...skills.frontend, ...skills.backend,
    ...skills.databases, ...skills.tools
  ]

  const SecH = ({ children }) => (
    <div className="rt-creative-sec-h" style={{ color: accentColor }}>{children}</div>
  )

  const isPhotoVisible = settings?.showPhoto !== false
  const photoShape = settings?.photoShape || 'circle'

  return (
    <div className="rt-creative" style={{ fontFamily: ff }}>
      {/* Header */}
      <div className="rt-creative-header" style={{ background: accentColor }}>
        {isPhotoVisible && personal.photoUrl ? (
          <div style={{ flexShrink: 0 }}>
            <ProfilePhoto
              photoUrl={personal.photoUrl}
              fullName={personal.fullName}
              size={68}
              shape={photoShape}
              border="2px solid rgba(255,255,255,0.4)"
            />
          </div>
        ) : (
          <div className="rt-creative-avatar">👤</div>
        )}
        <div>
          <div className="rt-creative-name">{personal.fullName || 'Your Name'}</div>
          {career.desiredRole && <div className="rt-creative-role">{career.desiredRole}</div>}
          <div className="rt-creative-contact">
            {personal.email    && <span>✉ {personal.email}</span>}
            {personal.phone    && <span>📞 {personal.countryCode} {personal.phone}</span>}
            {personal.location && <span>📍 {personal.location}</span>}
            {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
            {personal.github   && <span>💻 {personal.github}</span>}
          </div>
        </div>
      </div>

      <div className="rt-creative-body">
        {/* Summary — full width */}
        {show('summary') && (career.summary || career.objective) && (
          <div style={{ marginBottom: 14 }}>
            <SecH>Professional Summary</SecH>
            <div className="rt-text">{career.summary || career.objective}</div>
          </div>
        )}

        {/* Two column body */}
        <div className="rt-creative-cols">
          {/* Left column */}
          <div>
            {show('experience') && experience.some(e => e.company || e.role || e.description) && (
              <div style={{ marginBottom: 14 }}>
                <SecH>Experience</SecH>
                {experience.filter(e => e.company || e.role || e.description).map(e => (
                  <ExpEntry key={e.id} e={e} />
                ))}
              </div>
            )}

            {show('projects') && projects.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <SecH>Projects</SecH>
                {projects.map(p => (
                  <div key={p.id} className="rt-entry">
                    <div className="rt-entry-title">{p.title}</div>
                    {p.tech && <div className="rt-entry-sub">{p.tech}</div>}
                    {p.description && <div className="rt-entry-desc">{p.description}</div>}
                  </div>
                ))}
              </div>
            )}

            {show('achievements') && achievements.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <SecH>Achievements</SecH>
                {achievements.map(a => (
                  <div key={a.id} className="rt-entry">
                    <div className="rt-entry-title">{a.title}</div>
                    {a.description && <div className="rt-entry-desc">{a.description}</div>}
                  </div>
                ))}
              </div>
            )}

            {show('workshops') && workshops.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <SecH>Workshops</SecH>
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
          </div>

          {/* Right column */}
          <div>
            {show('education') && education.some(e => e.degree || e.institution) && (
              <div style={{ marginBottom: 14 }}>
                <SecH>Education</SecH>
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
                        {[e.startYear, e.gradYear].filter(Boolean).join('–')}
                        {e.cgpa && ` · ${e.cgpa}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {show('skills') && allSkills.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <SecH>Technical Skills</SecH>
                <div className="rt-tags">
                  {allSkills.map((s, i) => (
                    <span key={i} className="rt-tag" style={{ background: accentColor + '18' }}>{s}</span>
                  ))}
                </div>
                {skills.soft.length > 0 && (
                  <div className="rt-text" style={{ marginTop: 6 }}>
                    <strong>Soft: </strong>{skills.soft.join(', ')}
                  </div>
                )}
              </div>
            )}

            {show('certifications') && certifications.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <SecH>Certifications</SecH>
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

            {show('leadership') && leadership.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <SecH>Leadership</SecH>
                {leadership.map(l => (
                  <div key={l.id} className="rt-entry">
                    <div className="rt-entry-title">{l.role}</div>
                    {l.org && <div className="rt-entry-sub">{l.org}</div>}
                    {l.description && <div className="rt-entry-desc">{l.description}</div>}
                  </div>
                ))}
              </div>
            )}

            {show('languages') && languages.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <SecH>Languages</SecH>
                {languages.map(l => (
                  <div key={l.id} className="rt-entry">
                    <div className="rt-entry-title">
                      {l.language}
                      {l.proficiency && <span style={{ fontWeight: 400, fontSize: 10 }}> — {l.proficiency}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {show('interests') && interests.length > 0 && (
              <div>
                <SecH>Interests</SecH>
                <div className="rt-text">{interests.join(' · ')}</div>
              </div>
            )}

            {show('volunteer') && volunteer.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <SecH>Volunteer</SecH>
                {volunteer.map(v => (
                  <div key={v.id} className="rt-entry">
                    <div className="rt-entry-title">{v.role}{v.org ? ` — ${v.org}` : ''}</div>
                    {v.description && <div className="rt-entry-desc">{v.description}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
