/**
 * Reusable Section Container Component for all templates.
 * Enforces page-break-inside: avoid during printing, and standardizes title styles.
 */
export default function TemplateSection({
  title,
  children,
  variant = 'underline',
  accentColor,
  icon,
  badge,
  className = ''
}) {
  if (!children) return null

  const getHeaderStyle = () => {
    switch (variant) {
      case 'underline':
        return { borderBottomColor: accentColor || '#1e3a8a', color: accentColor || '#1e3a8a' }
      case 'double-rule':
        return { borderColor: accentColor || '#111827', color: accentColor || '#111827' }
      case 'badge':
        return { color: '#0f172a' }
      default:
        return { color: accentColor }
    }
  }

  return (
    <section className={`rt-shared-section rt-sec-variant-${variant} ${className}`}>
      {title && (
        <div className="rt-sec-title-wrap">
          {badge && (
            <span className="rt-sec-badge" style={{ background: accentColor || '#2563eb' }}>
              {badge}
            </span>
          )}
          <h2 className="rt-sec-title" style={getHeaderStyle()}>
            {icon && <span className="rt-sec-icon">{icon}</span>}
            {title}
          </h2>
        </div>
      )}
      <div className="rt-sec-content">
        {children}
      </div>
    </section>
  )
}
