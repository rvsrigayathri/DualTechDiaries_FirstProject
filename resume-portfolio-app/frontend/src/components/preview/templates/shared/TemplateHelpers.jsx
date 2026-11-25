/**
 * Shared presentation helpers for ResumeCraft templates.
 * Null-safe, cleanly formatted, consistent typography.
 */

/**
 * Strips http://, https://, and www. for clean visual resume display.
 */
export function cleanUrl(url) {
  if (!url) return ''
  return url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '')
}

/**
 * Formats date range safely without trailing or isolated dashes.
 */
export function formatDateRange(startDate, endDate, current) {
  const end = current ? 'Present' : endDate
  return [startDate, end].filter(s => s && s.trim()).join(' – ')
}

/**
 * Joins degree and specialization safely (e.g. "B.Tech in Computer Science").
 */
export function formatDegree(degree, specialization) {
  return [degree, specialization].filter(s => s && s.trim()).join(' in ')
}

/**
 * Joins organization and location safely.
 */
export function formatOrgLocation(org, location) {
  return [org, location].filter(s => s && s.trim()).join(' · ')
}

/**
 * Smart description parser:
 * Automatically formats multi-line bullet points (lines starting with -, *, •)
 * into semantic lists, and multiline text with proper spacing.
 */
export function FormattedText({ content, className = 'rt-text' }) {
  if (!content || !content.trim()) return null

  const lines = content.split('\n').map(l => l.trim()).filter(Boolean)
  const isBulletList = lines.some(l => /^[•\-\*]\s+/.test(l))

  if (isBulletList) {
    return (
      <ul className={`${className} rt-bullet-list`}>
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[•\-\*]\s+/, '')
          return <li key={idx} className="rt-bullet-item">{cleanLine}</li>
        })}
      </ul>
    )
  }

  return <div className={className}>{content}</div>
}

/**
 * Reusable Experience Entry with clean hierarchy and bullet formatting.
 */
export function ExpItem({ role, company, location, startDate, endDate, current, description, type, accentColor }) {
  const orgLine = formatOrgLocation(company, location)
  const dates = formatDateRange(startDate, endDate, current)
  return (
    <div className="rt-exp-entry">
      <div className="rt-exp-title" style={accentColor ? { color: accentColor } : undefined}>
        {role || (type && type.charAt(0).toUpperCase() + type.slice(1)) || 'Role'}
      </div>
      {orgLine && <div className="rt-exp-org">{orgLine}</div>}
      {dates && <div className="rt-exp-date">{dates}</div>}
      {description && <FormattedText content={description} className="rt-exp-desc" />}
    </div>
  )
}

/**
 * Reusable Education Entry.
 */
export function EduItem({ degree, specialization, institution, university, startYear, gradYear, cgpa }) {
  const degLine = formatDegree(degree, specialization)
  const instLine = [institution, university].filter(s => s && s.trim()).join(' · ')
  const dates = [startYear, gradYear].filter(s => s && s.trim()).join(' – ')
  return (
    <div className="rt-entry">
      {degLine && <div className="rt-entry-title">{degLine}</div>}
      {instLine && <div className="rt-entry-org">{instLine}</div>}
      {(dates || cgpa) && (
        <div className="rt-entry-date">
          {dates}
          {dates && cgpa && ' · '}
          {cgpa && `CGPA/Score: ${cgpa}`}
        </div>
      )}
    </div>
  )
}

/**
 * Reusable Project Entry with clean URL and bullet description.
 */
export function ProjectItem({ title, tech, link, description }) {
  return (
    <div className="rt-entry">
      <div className="rt-entry-title">
        {title}
        {link && <span className="rt-entry-link"> ({cleanUrl(link)})</span>}
      </div>
      {tech && <div className="rt-entry-sub">Tech: {tech}</div>}
      {description && <FormattedText content={description} className="rt-entry-desc" />}
    </div>
  )
}

/**
 * Reusable Simple Entry (Certifications, Achievements, Workshops, Leadership).
 */
export function SimpleEntry({ title, subtitle, date, description }) {
  return (
    <div className="rt-entry">
      {title && <div className="rt-entry-title">{title}</div>}
      {(subtitle || date) && (
        <div className="rt-entry-sub">
          {[subtitle, date].filter(Boolean).join(' · ')}
        </div>
      )}
      {description && <FormattedText content={description} className="rt-entry-desc" />}
    </div>
  )
}

/**
 * Reusable Skill Badge Group.
 */
export function SkillBadgeGroup({ label, skills = [], variant = 'chip', accentColor }) {
  if (!skills || skills.length === 0) return null

  if (variant === 'inline') {
    return (
      <div className="rt-skill-line">
        {label && <strong>{label}: </strong>}
        <span>{skills.join(', ')}</span>
      </div>
    )
  }

  return (
    <div className="rt-skill-group">
      {label && <div className="rt-skill-group-label">{label}</div>}
      <div className="rt-tags">
        {skills.map((s, i) => (
          <span
            key={i}
            className="rt-tag"
            style={accentColor ? { background: `${accentColor}15`, color: accentColor } : undefined}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}
