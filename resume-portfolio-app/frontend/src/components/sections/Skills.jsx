import SectionHeader from '../ui/SectionHeader'
import TagInput from '../ui/TagInput'

const SKILL_CATEGORIES = [
  { key: 'languages',  label: '💻 Programming Languages', placeholder: 'Java, Python, C++…' },
  { key: 'frontend',   label: '🎨 Frontend Technologies', placeholder: 'React, HTML, CSS, Tailwind…' },
  { key: 'backend',    label: '⚙️ Backend Technologies',  placeholder: 'Spring Boot, Node.js, Django…' },
  { key: 'databases',  label: '🗄️ Databases',             placeholder: 'MySQL, MongoDB, PostgreSQL…' },
  { key: 'tools',      label: '🔧 Tools & Platforms',     placeholder: 'Git, Docker, AWS, VS Code…' },
  { key: 'soft',       label: '🤝 Soft Skills',           placeholder: 'Communication, Leadership…' }
]

export default function Skills({ skills, onAdd, onRemove }) {
  const totalSkills = Object.values(skills).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="card" id="section-skills">
      <SectionHeader
        step="4"
        title="Technical Skills"
        subtitle={totalSkills > 0 ? `${totalSkills} skills added` : 'Add your skills by category'}
      />
      <div className="card-body">
        <div className="form-stack">
          {SKILL_CATEGORIES.map(cat => (
            <div key={cat.key} className="skill-category">
              <div className="skill-category-label">{cat.label}</div>
              <TagInput
                tags={skills[cat.key] || []}
                onAdd={(tag) => onAdd(cat.key, tag)}
                onRemove={(i) => onRemove(cat.key, i)}
                placeholder={cat.placeholder}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
