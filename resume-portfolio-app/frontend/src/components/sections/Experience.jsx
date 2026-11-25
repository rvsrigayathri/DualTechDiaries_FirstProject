import SectionHeader from '../ui/SectionHeader'
import EntryCard from '../ui/EntryCard'

const EXP_TYPES = [
  { id: 'fresher',    label: 'Fresher / No Experience' },
  { id: 'internship', label: 'Internship' },
  { id: 'full-time',  label: 'Full-Time' },
  { id: 'part-time',  label: 'Part-Time' },
  { id: 'freelance',  label: 'Freelance / Contract' },
  { id: 'volunteer',  label: 'Volunteer' }
]

export default function Experience({ experience, onAdd, onUpdate, onRemove }) {
  return (
    <div className="card" id="section-experience">
      <SectionHeader
        step="5"
        title="Experience"
        subtitle="Your work history, internships, and projects"
        onAdd={onAdd}
        addLabel="Add Experience"
      />
      <div className="card-body">
        {experience.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💼</div>
            Click "+ Add Experience" to add your first entry.
          </div>
        ) : (
          experience.map((exp, idx) => (
            <EntryCard
              key={exp.id}
              defaultOpen={idx === 0}
              title={exp.role || exp.company || `Experience ${idx + 1}`}
              subtitle={[exp.company, exp.type].filter(Boolean).join(' · ')}
              onRemove={() => onRemove(exp.id)}
            >
              <div className="form-stack">
                {/* Type */}
                <div className="field">
                  <label>Experience Type</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {EXP_TYPES.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        className={`career-pill${exp.type === t.id ? ' active' : ''}`}
                        style={{ padding: '5px 13px', fontSize: 12 }}
                        onClick={() => onUpdate(exp.id, 'type', t.id)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Company + Role */}
                {exp.type !== 'fresher' && (
                  <>
                    <div className="grid-2">
                      <div className="field">
                        <label>Company / Organisation</label>
                        <input
                          value={exp.company}
                          onChange={e => onUpdate(exp.id, 'company', e.target.value)}
                          placeholder="Infosys, Google…"
                        />
                      </div>
                      <div className="field">
                        <label>Job Title / Role</label>
                        <input
                          value={exp.role}
                          onChange={e => onUpdate(exp.id, 'role', e.target.value)}
                          placeholder="Software Developer Intern"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label>Location</label>
                      <input
                        value={exp.location}
                        onChange={e => onUpdate(exp.id, 'location', e.target.value)}
                        placeholder="Chennai, India / Remote"
                      />
                    </div>

                    <div className="grid-2">
                      <div className="field">
                        <label>Start Date</label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={e => onUpdate(exp.id, 'startDate', e.target.value)}
                        />
                      </div>
                      {!exp.current && (
                        <div className="field">
                          <label>End Date</label>
                          <input
                            type="month"
                            value={exp.endDate}
                            onChange={e => onUpdate(exp.id, 'endDate', e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={e => {
                          onUpdate(exp.id, 'current', e.target.checked)
                          if (e.target.checked) onUpdate(exp.id, 'endDate', '')
                        }}
                      />
                      I currently work here
                    </label>
                  </>
                )}

                {/* Description */}
                <div className="field">
                  <label>
                    {exp.type === 'fresher' ? 'Academic / Personal Projects / Activities' : 'Responsibilities & Achievements'}
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={e => onUpdate(exp.id, 'description', e.target.value)}
                    placeholder={
                      exp.type === 'fresher'
                        ? 'Describe academic projects, hackathons, college activities…'
                        : '• Developed REST APIs using Spring Boot\n• Improved page load time by 40%\n• Collaborated with a team of 5 engineers'
                    }
                    style={{ minHeight: 110 }}
                  />
                  <div className="field-hint">💡 Use bullet points (•) to list each achievement</div>
                </div>
              </div>
            </EntryCard>
          ))
        )}
      </div>
    </div>
  )
}
