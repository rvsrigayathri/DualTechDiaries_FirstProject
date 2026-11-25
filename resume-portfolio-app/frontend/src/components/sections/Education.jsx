import SectionHeader from '../ui/SectionHeader'
import EntryCard from '../ui/EntryCard'

// Extended year range: 2000 → current year + 5 (covers all graduates)
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from(
  { length: CURRENT_YEAR - 2000 + 6 },
  (_, i) => String(2000 + i)
)

export default function Education({ education, onAdd, onUpdate, onRemove }) {
  return (
    <div className="card" id="section-education">
      <SectionHeader
        step="3"
        title="Education"
        subtitle="Add your academic qualifications"
        onAdd={onAdd}
        addLabel="Add Education"
      />
      <div className="card-body">
        {education.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎓</div>
            Click "+ Add Education" to add your first qualification.
          </div>
        ) : (
          education.map((edu, idx) => (
            <EntryCard
              key={edu.id}
              defaultOpen={idx === 0}
              title={edu.degree || `Education ${idx + 1}`}
              subtitle={edu.institution || edu.university}
              onRemove={() => onRemove(edu.id)}
            >
              <div className="form-stack">
                <div className="grid-2">
                  <div className="field">
                    <label>Degree / Course</label>
                    <input
                      value={edu.degree}
                      onChange={e => onUpdate(edu.id, 'degree', e.target.value)}
                      placeholder="B.E. / B.Tech / BCA…"
                    />
                  </div>
                  <div className="field">
                    <label>Specialization</label>
                    <input
                      value={edu.specialization}
                      onChange={e => onUpdate(edu.id, 'specialization', e.target.value)}
                      placeholder="Computer Science, ECE…"
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Institution / College</label>
                  <input
                    value={edu.institution}
                    onChange={e => onUpdate(edu.id, 'institution', e.target.value)}
                    placeholder="Anna University College of Engineering"
                  />
                </div>

                <div className="field">
                  <label>University / Board</label>
                  <input
                    value={edu.university}
                    onChange={e => onUpdate(edu.id, 'university', e.target.value)}
                    placeholder="Anna University"
                  />
                </div>

                <div className="grid-3">
                  <div className="field">
                    <label>Start Year</label>
                    <select
                      value={edu.startYear}
                      onChange={e => onUpdate(edu.id, 'startYear', e.target.value)}
                    >
                      <option value="">Year</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Graduation Year</label>
                    <select
                      value={edu.gradYear}
                      onChange={e => onUpdate(edu.id, 'gradYear', e.target.value)}
                    >
                      <option value="">Year</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>CGPA / Percentage</label>
                    <input
                      value={edu.cgpa}
                      onChange={e => onUpdate(edu.id, 'cgpa', e.target.value)}
                      placeholder="8.5 / 85%"
                    />
                  </div>
                </div>
              </div>
            </EntryCard>
          ))
        )}
      </div>
    </div>
  )
}
