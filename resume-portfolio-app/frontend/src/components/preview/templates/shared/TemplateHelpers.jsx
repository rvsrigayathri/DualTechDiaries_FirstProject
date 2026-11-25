/**
 * Shared presentation helpers for ResumeCraft templates.
 * Null-safe, cleanly formatted, consistent typography.
 */

export function formatDateRange(startDate, endDate, current) {
  const end = current ? 'Present' : endDate
  return [startDate, end].filter(s => s && s.trim()).join(' – ')
}

export function formatDegree(degree, specialization) {
  return [degree, specialization].filter(s => s && s.trim()).join(' in ')
}

export function formatOrgLocation(org, location) {
  return [org, location].filter(s => s && s.trim()).join(' · ')
}

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
      {description && <div className="rt-exp-desc">{description}</div>}
    </div>
  )
}

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

export function ProjectItem({ title, tech, link, description }) {
  return (
    <div className="rt-entry">
      <div className="rt-entry-title">
        {title}
        {link && <span className="rt-entry-link"> ({link})</span>}
      </div>
      {tech && <div className="rt-entry-sub">Tech: {tech}</div>}
      {description && <div className="rt-entry-desc">{description}</div>}
    </div>
  )
}

export function SimpleEntry({ title, subtitle, date, description }) {
  return (
    <div className="rt-entry">
      {title && <div className="rt-entry-title">{title}</div>}
      {(subtitle || date) && (
        <div className="rt-entry-sub">
          {[subtitle, date].filter(Boolean).join(' · ')}
        </div>
      )}
      {description && <div className="rt-entry-desc">{description}</div>}
    </div>
  )
}
