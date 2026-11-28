/**
 * Modern Template — navy sidebar + clean main content.
 * Improved: tighter A4 spacing, clearer experience layout, no null/empty renders,
 * avatar centred, sidebar scales with content.
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

export default function ModernTemplate({ data, accentColor = '#2457d6', fontFamily = 'Inter' }) {
  const { personal, career, education, skills, experience,
    projects, certifications, achievements,
    workshops, leadership, volunteer,
    settings } = data
  const hidden = settings.hiddenSections || []
  const show = (key) => !hidden.includes(key)
  const ff = fontFamily === 'Georgia' ? 'Georgia, serif' : fontFamily + ', sans-serif'

  const allSkills = [
    ...skills.languages, ...skills.frontend, ...skills.backend,
    ...skills.databases, ...skills.tools
  ]

  const isPhotoVisible = settings?.showPhoto !== false
  const photoShape = settings?.photoShape || 'circle'

  return (
    <div className="rt-modern" style={{ fontFamily: ff }}>
      {/* ── Sidebar ── */}
      <div className="rt-modern-sidebar" style={{ background: accentColor }}>
        {/* Avatar */}
        {isPhotoVisible && personal.photoUrl ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <ProfilePhoto
              photoUrl={personal.photoUrl}
              fullName={personal.fullName}
              size={72}
              shape={photoShape}
              border="2px solid rgba(255,255,255,0.4)"
            />
          </div>
        ) : (
          <div className="rt-modern-avatar">👤</div>
        )}
        <div className="rt-modern-name">{personal.fullName || 'Your Name'}</div>
        {career.desiredRole && <div className="rt-modern-role">{career.desiredRole}</div>}

        {/* Contact */}
        <div className="rt-modern-sec-title">Contact</div>
        {personal.email    && <div className="rt-modern-contact-item">✉ {personal.email}</div>}
        {personal.phone    && <div className="rt-modern-contact-item">📞 {personal.countryCode} {personal.phone}</div>}
        {personal.location && <div className="rt-modern-contact-item">📍 {personal.location}</div>}
        {personal.linkedin && <div className="rt-modern-contact-item">🔗 {personal.linkedin}</div>}
        {personal.github   && <div className="rt-modern-contact-item">💻 {personal.github}</div>}
        {personal.portfolio && <div className="rt-modern-contact-item">🌐 {personal.portfolio}</div>}

        {/* Technical Skills */}
        {allSkills.length > 0 && (
          <>
            <div className="rt-modern-sec-title">Technical Skills</div>
            <div>
              {allSkills.map((s, i) => (
                <span key={i} className="rt-modern-stag">{s}</span>
              ))}
            </div>
          </>
        )}

        {/* Soft Skills */}
        {skills.soft.length > 0 && (
          <>
            <div className="rt-modern-sec-title">Soft Skills</div>
            {skills.soft.map((s, i) => (
              <div key={i} className="rt-modern-contact-item">• {s}</div>
            ))}
          </>
        )}

        {/* Languages (spoken) */}
        {data.languages && data.languages.length > 0 && (
          <>
            <div className="rt-modern-sec-title">Languages</div>
            {data.languages.map(l => (
              <div key={l.id} className="rt-modern-contact-item">
                {l.language}{l.proficiency ? ` — ${l.proficiency}` : ''}
              </div>
            ))}
          </>
        )}

        {/* Interests */}
        {data.interests && data.interests.length > 0 && (
          <>
            <div className="rt-modern-sec-title">Interests</div>
            <div className="rt-modern-contact-item">{data.interests.join(', ')}</div>
          </>
        )}
      </div>

      {/* ── Main content ── */}
      <div className="rt-modern-main">
        {/* Summary */}
        {show('summary') && (career.summary || career.objective) && (
          <div className="rt-modern-main-sec">
            <div className="rt-modern-sec-h">Summary</div>
            <div className="rt-text">{career.summary || career.objective}</div>
          </div>
        )}

        {/* Education */}
        {show('education') && education.some(e => e.degree || e.institution) && (
          <div className="rt-modern-main-sec">
            <div className="rt-modern-sec-h">Education</div>
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

        {/* Experience */}
        {show('experience') && experience.some(e => e.company || e.role || e.description) && (
          <div className="rt-modern-main-sec">
            <div className="rt-modern-sec-h">Experience</div>
            {experience.filter(e => e.company || e.role || e.description).map(e => (
              <ExpEntry key={e.id} e={e} />
            ))}
          </div>
        )}

        {/* Projects */}
        {show('projects') && projects.length > 0 && (
          <div className="rt-modern-main-sec">
            <div className="rt-modern-sec-h">Projects</div>
            {projects.map(p => (
              <div key={p.id} className="rt-entry">
                <div className="rt-entry-title">
                  {p.title}
                  {p.link && <span style={{ fontSize: 9.5, fontWeight: 400, marginLeft: 8, opacity: 0.8 }}>{p.link}</span>}
                </div>
                {p.tech && <div className="rt-entry-sub">{p.tech}</div>}
                {p.description && <div className="rt-entry-desc">{p.description}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {show('certifications') && certifications.length > 0 && (
          <div className="rt-modern-main-sec">
            <div className="rt-modern-sec-h">Certifications</div>
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
          <div className="rt-modern-main-sec">
            <div className="rt-modern-sec-h">Achievements</div>
            {achievements.map(a => (
              <div key={a.id} className="rt-entry">
                <div className="rt-entry-title">{a.title}</div>
                {a.description && <div className="rt-entry-desc">{a.description}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Workshops */}
        {show('workshops') && workshops && workshops.length > 0 && (
          <div className="rt-modern-main-sec">
            <div className="rt-modern-sec-h">Workshops &amp; Training</div>
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
        {show('leadership') && leadership && leadership.length > 0 && (
          <div className="rt-modern-main-sec">
            <div className="rt-modern-sec-h">Leadership &amp; Extracurriculars</div>
            {leadership.map(l => (
              <div key={l.id} className="rt-entry">
                <div className="rt-entry-title">{l.role}{l.org ? ` — ${l.org}` : ''}</div>
                {l.description && <div className="rt-entry-desc">{l.description}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Volunteer */}
        {show('volunteer') && volunteer && volunteer.length > 0 && (
          <div className="rt-modern-main-sec">
            <div className="rt-modern-sec-h">Volunteer Experience</div>
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
  )
}
