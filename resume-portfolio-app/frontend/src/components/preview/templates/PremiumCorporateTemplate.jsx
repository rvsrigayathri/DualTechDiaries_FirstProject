import { ExpItem, EduItem, ProjectItem, SimpleEntry, ProfilePhoto } from './shared/TemplateHelpers'

/**
 * 12. Premium Corporate Template
 * Prestigious corporate presentation, deep burgundy or navy accent, framed headers,
 * suited for finance, enterprise consulting, management, and executive legal roles.
 */
export default function PremiumCorporateTemplate({
  data,
  accentColor = '#881337',
  secondaryColor = '#4c0519',
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
  const allSkills = [
    ...(skills.languages || []),
    ...(skills.frontend || []),
    ...(skills.backend || []),
    ...(skills.databases || []),
    ...(skills.tools || []),
    ...(skills.soft || [])
  ]

  return (
    <div className="rt-prem-corp" style={{ fontFamily: ff }}>
      {/* Corporate Letterhead Header */}
      <header className="rt-prem-header">
        <div className="rt-prem-top-bar" style={{ background: accentColor }} />
        <div className="rt-prem-header-content" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {isPhotoVisible && personal.photoUrl && (
            <ProfilePhoto
              photoUrl={personal.photoUrl}
              fullName={personal.fullName}
              shape={shape}
              size={66}
              border={`2.5px solid ${accentColor}`}
            />
          )}
          <div style={{ flex: 1 }}>
            <h1 className="rt-prem-name" style={{ color: secondaryColor }}>{personal.fullName || 'Corporate Executive'}</h1>
            {career.desiredRole && <div className="rt-prem-role" style={{ color: accentColor }}>{career.desiredRole}</div>}
            <div className="rt-prem-contact">
              {[
                personal.location,
                personal.email,
                personal.phone ? `${personal.countryCode} ${personal.phone}` : '',
                personal.linkedin,
                personal.portfolio
              ].filter(Boolean).join('  ◆  ')}
            </div>
          </div>
        </div>
      </header>

      {/* Executive Summary */}
      {show('summary') && (career.summary || career.objective) && (
        <section className="rt-prem-sec">
          <div className="rt-prem-sec-h" style={{ borderBottomColor: accentColor, color: secondaryColor }}>
            EXECUTIVE SUMMARY
          </div>
          <div className="rt-text">{career.summary || career.objective}</div>
        </section>
      )}

      {/* Professional Experience */}
      {show('experience') && experience.some(e => e.company || e.role) && (
        <section className="rt-prem-sec">
          <div className="rt-prem-sec-h" style={{ borderBottomColor: accentColor, color: secondaryColor }}>
            PROFESSIONAL EXPERIENCE
          </div>
          {experience.filter(e => e.company || e.role).map(e => (
            <ExpItem key={e.id} {...e} accentColor={accentColor} />
          ))}
        </section>
      )}

      {/* Core Competencies */}
      {show('skills') && allSkills.length > 0 && (
        <section className="rt-prem-sec">
          <div className="rt-prem-sec-h" style={{ borderBottomColor: accentColor, color: secondaryColor }}>
            AREAS OF EXPERTISE
          </div>
          <div className="rt-prem-skills-row">
            {allSkills.map((s, i) => (
              <span key={i} className="rt-prem-skill-tag">{s}</span>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {show('education') && education.some(e => e.degree || e.institution) && (
        <section className="rt-prem-sec">
          <div className="rt-prem-sec-h" style={{ borderBottomColor: accentColor, color: secondaryColor }}>
            EDUCATION &amp; DEGREES
          </div>
          {education.filter(e => e.degree || e.institution).map(e => (
            <EduItem key={e.id} {...e} />
          ))}
        </section>
      )}

      {/* Leadership & Advisory */}
      {show('leadership') && leadership.length > 0 && (
        <section className="rt-prem-sec">
          <div className="rt-prem-sec-h" style={{ borderBottomColor: accentColor, color: secondaryColor }}>
            LEADERSHIP &amp; BOARD ADVISORY
          </div>
          {leadership.map(l => (
            <SimpleEntry key={l.id} title={l.role} subtitle={l.org} description={l.description} />
          ))}
        </section>
      )}

      {/* Strategic Engagements / Projects */}
      {show('projects') && projects.length > 0 && (
        <section className="rt-prem-sec">
          <div className="rt-prem-sec-h" style={{ borderBottomColor: accentColor, color: secondaryColor }}>
            STRATEGIC INITIATIVES
          </div>
          {projects.map(p => (
            <ProjectItem key={p.id} {...p} />
          ))}
        </section>
      )}

      {/* Certifications & Honors */}
      {show('certifications') && certifications.length > 0 && (
        <section className="rt-prem-sec">
          <div className="rt-prem-sec-h" style={{ borderBottomColor: accentColor, color: secondaryColor }}>
            CERTIFICATIONS &amp; HONORS
          </div>
          {certifications.map(c => (
            <SimpleEntry key={c.id} title={c.name} subtitle={c.issuer} date={c.year} />
          ))}
        </section>
      )}
    </div>
  )
}
