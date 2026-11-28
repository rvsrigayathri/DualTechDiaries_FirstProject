import { ExpItem, EduItem, ProjectItem, SimpleEntry, ProfilePhoto } from './shared/TemplateHelpers'

/**
 * 9. Marketing Professional Template
 * Dynamic header, campaign spotlights, ROI metrics emphasis, and social/digital skill badges.
 */
export default function MarketingProfessionalTemplate({
  data,
  accentColor = '#f97316',
  secondaryColor = '#c2410c',
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
    ...(skills.tools || []),
    ...(skills.frontend || []),
    ...(skills.languages || []),
    ...(skills.soft || [])
  ]

  return (
    <div className="rt-marketing" style={{ fontFamily: ff }}>
      {/* Vibrant Marketing Header */}
      <div className="rt-mkt-banner" style={{ background: `linear-gradient(90deg, ${secondaryColor}, ${accentColor})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isPhotoVisible && personal.photoUrl && (
            <ProfilePhoto
              photoUrl={personal.photoUrl}
              fullName={personal.fullName}
              shape={shape}
              size={64}
              border="2.5px solid rgba(255,255,255,0.7)"
            />
          )}
          <div className="rt-mkt-banner-left">
            <h1 className="rt-mkt-name">{personal.fullName || 'Marketer'}</h1>
            <div className="rt-mkt-role">{career.desiredRole || 'Growth & Marketing Lead'}</div>
          </div>
        </div>
        <div className="rt-mkt-banner-right">
          {personal.email && <div>✉ {personal.email}</div>}
          {personal.phone && <div>📞 {personal.countryCode} {personal.phone}</div>}
          {personal.location && <div>📍 {personal.location}</div>}
          {personal.linkedin && <div>🔗 LinkedIn</div>}
          {personal.portfolio && <div>🌐 Portfolio</div>}
        </div>
      </div>

      {/* Body Content */}
      <div className="rt-mkt-body">
        {/* Marketing Summary */}
        {show('summary') && (career.summary || career.objective) && (
          <section className="rt-mkt-sec">
            <h2 className="rt-mkt-sec-h" style={{ color: secondaryColor }}>EXECUTIVE SUMMARY</h2>
            <div className="rt-text">{career.summary || career.objective}</div>
          </section>
        )}

        {/* Growth & Marketing Experience */}
        {show('experience') && experience.some(e => e.company || e.role) && (
          <section className="rt-mkt-sec">
            <h2 className="rt-mkt-sec-h" style={{ color: secondaryColor }}>EXPERIENCE &amp; CAMPAIGN LEADERSHIP</h2>
            {experience.filter(e => e.company || e.role).map(e => (
              <ExpItem key={e.id} {...e} accentColor={accentColor} />
            ))}
          </section>
        )}

        {/* Campaign & Growth Projects */}
        {show('projects') && projects.length > 0 && (
          <section className="rt-mkt-sec">
            <h2 className="rt-mkt-sec-h" style={{ color: secondaryColor }}>CAMPAIGNS &amp; GROWTH PROJECTS</h2>
            {projects.map(p => (
              <ProjectItem key={p.id} {...p} />
            ))}
          </section>
        )}

        {/* Marketing Stack & Skills */}
        {show('skills') && allSkills.length > 0 && (
          <section className="rt-mkt-sec">
            <h2 className="rt-mkt-sec-h" style={{ color: secondaryColor }}>MARKETING CHANNELS &amp; TOOLS</h2>
            <div className="rt-mkt-chips">
              {allSkills.map((s, i) => (
                <span key={i} className="rt-mkt-chip" style={{ background: `${accentColor}18`, color: secondaryColor }}>
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education & Certifications Row */}
        <div className="rt-mkt-split">
          {show('education') && education.some(e => e.degree || e.institution) && (
            <div className="rt-mkt-split-col">
              <h2 className="rt-mkt-sec-h" style={{ color: secondaryColor }}>EDUCATION</h2>
              {education.filter(e => e.degree || e.institution).map(e => (
                <EduItem key={e.id} {...e} />
              ))}
            </div>
          )}

          {show('certifications') && certifications.length > 0 && (
            <div className="rt-mkt-split-col">
              <h2 className="rt-mkt-sec-h" style={{ color: secondaryColor }}>CERTIFICATIONS</h2>
              {certifications.map(c => (
                <SimpleEntry key={c.id} title={c.name} subtitle={c.issuer} date={c.year} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
