import { useState } from 'react'
import SectionHeader from '../ui/SectionHeader'
import EntryCard from '../ui/EntryCard'
import TagInput from '../ui/TagInput'

const PROFICIENCY = ['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'Native']

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 20 }, (_, i) => String(CURRENT_YEAR - i))

// Generic text field row
function F({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="field">
      <label>{label}</label>
      {type === 'textarea' ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ minHeight: 70 }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  )
}

// Collapsible sub-section
function SubSection({ icon, title, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="additional-section">
      <div className="additional-section-header" onClick={() => setOpen(o => !o)}>
        <div className="additional-section-title">
          <span>{icon}</span> {title}
          {count > 0 && (
            <span style={{ background: 'var(--light-blue)', color: 'var(--blue)', borderRadius: 100, padding: '1px 8px', fontSize: 11, fontWeight: 600 }}>
              {count}
            </span>
          )}
        </div>
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && <div className="additional-section-body">{children}</div>}
    </div>
  )
}

export default function AdditionalSections({
  projects, certifications, achievements, workshops,
  leadership, languages, interests, volunteer,
  addItem, updateItem, removeItem,
  addInterest, removeInterest
}) {
  return (
    <div className="card" id="section-additional">
      <SectionHeader step="6" title="Additional Sections" subtitle="Projects, certifications, achievements and more" />
      <div className="card-body">

        {/* ── Projects ─────────────────────────── */}
        <SubSection icon="🚀" title="Projects" count={projects.length} defaultOpen>
          {projects.map((p, idx) => (
            <EntryCard
              key={p.id}
              defaultOpen={idx === 0}
              title={p.title || `Project ${idx + 1}`}
              subtitle={p.tech}
              onRemove={() => removeItem('projects', p.id)}
            >
              <div className="form-stack">
                <F label="Project Title" value={p.title} onChange={v => updateItem('projects', p.id, 'title', v)} placeholder="Resume Builder, E-Commerce App…" />
                <F label="Tech Stack" value={p.tech} onChange={v => updateItem('projects', p.id, 'tech', v)} placeholder="React, Spring Boot, MySQL" />
                <F label="Project URL / GitHub Link" value={p.link} onChange={v => updateItem('projects', p.id, 'link', v)} placeholder="https://github.com/…" />
                <F label="Description" value={p.description} onChange={v => updateItem('projects', p.id, 'description', v)} placeholder="Describe features, challenges solved, your role…" type="textarea" />
              </div>
            </EntryCard>
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 4 }}
            onClick={() => addItem('projects', { title: '', tech: '', link: '', description: '' })}
          >+ Add Project</button>
        </SubSection>

        {/* ── Certifications ───────────────────── */}
        <SubSection icon="🏆" title="Certifications" count={certifications.length}>
          {certifications.map((c, idx) => (
            <EntryCard
              key={c.id}
              defaultOpen={idx === 0}
              title={c.name || `Certification ${idx + 1}`}
              subtitle={c.issuer}
              onRemove={() => removeItem('certifications', c.id)}
            >
              <div className="form-stack">
                <F label="Certification Name" value={c.name} onChange={v => updateItem('certifications', c.id, 'name', v)} placeholder="AWS Certified Developer, Oracle Java SE 11…" />
                <div className="grid-2">
                  <F label="Issuing Authority" value={c.issuer} onChange={v => updateItem('certifications', c.id, 'issuer', v)} placeholder="AWS, Coursera, Udemy…" />
                  <div className="field">
                    <label>Year</label>
                    <select value={c.year} onChange={e => updateItem('certifications', c.id, 'year', e.target.value)}>
                      <option value="">Year</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <F label="Certificate URL" value={c.link} onChange={v => updateItem('certifications', c.id, 'link', v)} placeholder="https://…" />
              </div>
            </EntryCard>
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 4 }}
            onClick={() => addItem('certifications', { name: '', issuer: '', year: '', link: '' })}
          >+ Add Certification</button>
        </SubSection>

        {/* ── Achievements ─────────────────────── */}
        <SubSection icon="🌟" title="Achievements" count={achievements.length}>
          {achievements.map((a, idx) => (
            <EntryCard
              key={a.id}
              defaultOpen={idx === 0}
              title={a.title || `Achievement ${idx + 1}`}
              onRemove={() => removeItem('achievements', a.id)}
            >
              <div className="form-stack">
                <F label="Achievement Title" value={a.title} onChange={v => updateItem('achievements', a.id, 'title', v)} placeholder="1st Place — HackIndia 2024…" />
                <F label="Description" value={a.description} onChange={v => updateItem('achievements', a.id, 'description', v)} placeholder="Brief description…" type="textarea" />
              </div>
            </EntryCard>
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 4 }}
            onClick={() => addItem('achievements', { title: '', description: '' })}
          >+ Add Achievement</button>
        </SubSection>

        {/* ── Workshops ─────────────────────────── */}
        <SubSection icon="📋" title="Workshops & Training" count={workshops.length}>
          {workshops.map((w, idx) => (
            <EntryCard
              key={w.id}
              defaultOpen={idx === 0}
              title={w.name || `Workshop ${idx + 1}`}
              subtitle={w.organizer}
              onRemove={() => removeItem('workshops', w.id)}
            >
              <div className="form-stack">
                <F label="Workshop / Training Name" value={w.name} onChange={v => updateItem('workshops', w.id, 'name', v)} placeholder="React Bootcamp, Machine Learning Workshop…" />
                <div className="grid-2">
                  <F label="Organizer" value={w.organizer} onChange={v => updateItem('workshops', w.id, 'organizer', v)} placeholder="IIT Madras, Google…" />
                  <div className="field">
                    <label>Year</label>
                    <select value={w.year} onChange={e => updateItem('workshops', w.id, 'year', e.target.value)}>
                      <option value="">Year</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </EntryCard>
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 4 }}
            onClick={() => addItem('workshops', { name: '', organizer: '', year: '' })}
          >+ Add Workshop</button>
        </SubSection>

        {/* ── Leadership ───────────────────────── */}
        <SubSection icon="👑" title="Leadership & Extracurriculars" count={leadership.length}>
          {leadership.map((l, idx) => (
            <EntryCard
              key={l.id}
              defaultOpen={idx === 0}
              title={l.role || `Leadership ${idx + 1}`}
              subtitle={l.org}
              onRemove={() => removeItem('leadership', l.id)}
            >
              <div className="form-stack">
                <div className="grid-2">
                  <F label="Role / Position" value={l.role} onChange={v => updateItem('leadership', l.id, 'role', v)} placeholder="President, Head of Tech…" />
                  <F label="Organization / Club" value={l.org} onChange={v => updateItem('leadership', l.id, 'org', v)} placeholder="IEEE, NSS, Coding Club…" />
                </div>
                <F label="Description" value={l.description} onChange={v => updateItem('leadership', l.id, 'description', v)} placeholder="Your responsibilities and impact…" type="textarea" />
              </div>
            </EntryCard>
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 4 }}
            onClick={() => addItem('leadership', { role: '', org: '', description: '' })}
          >+ Add Leadership Role</button>
        </SubSection>

        {/* ── Languages ───────────────────────── */}
        <SubSection icon="🌐" title="Languages" count={languages.length}>
          {languages.map((l, idx) => (
            <EntryCard
              key={l.id}
              defaultOpen={idx === 0}
              title={l.language || `Language ${idx + 1}`}
              subtitle={l.proficiency}
              onRemove={() => removeItem('languages', l.id)}
            >
              <div className="grid-2">
                <F label="Language" value={l.language} onChange={v => updateItem('languages', l.id, 'language', v)} placeholder="Tamil, Hindi, English…" />
                <div className="field">
                  <label>Proficiency</label>
                  <select value={l.proficiency} onChange={e => updateItem('languages', l.id, 'proficiency', e.target.value)}>
                    <option value="">Select…</option>
                    {PROFICIENCY.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </EntryCard>
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 4 }}
            onClick={() => addItem('languages', { language: '', proficiency: '' })}
          >+ Add Language</button>
        </SubSection>

        {/* ── Interests ───────────────────────── */}
        <SubSection icon="💡" title="Interests & Hobbies" count={interests.length}>
          <TagInput
            tags={interests}
            onAdd={addInterest}
            onRemove={removeInterest}
            placeholder="Photography, Open Source, Chess…"
          />
        </SubSection>

        {/* ── Volunteer ───────────────────────── */}
        <SubSection icon="🤲" title="Volunteer Experience" count={volunteer.length}>
          {volunteer.map((v, idx) => (
            <EntryCard
              key={v.id}
              defaultOpen={idx === 0}
              title={v.role || `Volunteer ${idx + 1}`}
              subtitle={v.org}
              onRemove={() => removeItem('volunteer', v.id)}
            >
              <div className="form-stack">
                <div className="grid-2">
                  <F label="Role" value={v.role} onChange={val => updateItem('volunteer', v.id, 'role', val)} placeholder="Volunteer Coordinator…" />
                  <F label="Organization" value={v.org} onChange={val => updateItem('volunteer', v.id, 'org', val)} placeholder="Red Cross, NGO…" />
                </div>
                <F label="Description" value={v.description} onChange={val => updateItem('volunteer', v.id, 'description', val)} placeholder="What you did and the impact…" type="textarea" />
              </div>
            </EntryCard>
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 4 }}
            onClick={() => addItem('volunteer', { role: '', org: '', description: '' })}
          >+ Add Volunteer Experience</button>
        </SubSection>

      </div>
    </div>
  )
}
