import SectionHeader from '../ui/SectionHeader'

const CATEGORIES = [
  { id: 'fresher',        label: '🎓 Fresher' },
  { id: 'experienced',   label: '💼 Experienced' },
  { id: 'internship',    label: '📚 Internship Seeker' },
  { id: 'career-changer', label: '🔄 Career Changer' },
  { id: 'other',         label: '✦ Other' }
]

export default function CareerObjective({ career, onChange }) {
  return (
    <div className="card" id="section-career">
      <SectionHeader step="2" title="Career Objective" subtitle="Define your professional direction" />
      <div className="card-body form-stack">

        {/* Career category */}
        <div className="field">
          <label>Career Category</label>
          <div className="career-pills">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                type="button"
                className={`career-pill${career.category === c.id ? ' active' : ''}`}
                onClick={() => onChange('category', c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desired role */}
        <div className="field">
          <label>Desired Job Role</label>
          <input
            type="text"
            value={career.desiredRole}
            onChange={e => onChange('desiredRole', e.target.value)}
            placeholder="e.g. Full Stack Developer, Data Analyst"
          />
        </div>

        {/* Objective */}
        <div className="field">
          <label>Career Objective</label>
          <textarea
            value={career.objective}
            onChange={e => onChange('objective', e.target.value)}
            placeholder="A concise statement about your career goals and what you bring to an employer (2–3 sentences)…"
            style={{ minHeight: 90 }}
          />
        </div>

        {/* Summary */}
        <div className="field">
          <label>Professional Summary</label>
          <textarea
            value={career.summary}
            onChange={e => onChange('summary', e.target.value)}
            placeholder="A detailed overview of your professional background, key strengths, and areas of expertise (3–5 sentences)…"
            style={{ minHeight: 110 }}
          />
          <div className="field-hint">💡 Use keywords from job descriptions you're targeting</div>
        </div>

      </div>
    </div>
  )
}
