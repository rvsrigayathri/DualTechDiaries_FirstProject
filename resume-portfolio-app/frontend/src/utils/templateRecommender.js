/**
 * Smart Template Recommendation Engine.
 * Analyzes resume data (career category, job titles, experience level,
 * technical skills, soft skills, projects, certifications, leadership)
 * and calculates relevance scores for all 12 templates.
 * 
 * Returns top 3 recommended template IDs with human-readable rationales.
 */

export function recommendTemplates(data) {
  if (!data) return []

  const {
    career = {},
    education = [],
    skills = {},
    experience = [],
    projects = [],
    certifications = [],
    leadership = [],
    achievements = [],
    workshops = []
  } = data

  const category = (career.category || '').toLowerCase()
  const desiredRole = (career.desiredRole || '').toLowerCase()
  const objective = (career.objective || '').toLowerCase()
  const summary = (career.summary || '').toLowerCase()

  // Collect all text tokens
  const roles = experience.map(e => (e.role || '').toLowerCase()).join(' ')
  const companies = experience.map(e => (e.company || '').toLowerCase()).join(' ')
  const descriptions = experience.map(e => (e.description || '').toLowerCase()).join(' ')
  const projectTech = projects.map(p => (p.tech || '') + ' ' + (p.title || '') + ' ' + (p.description || '')).join(' ').toLowerCase()

  const allSkillsList = [
    ...(skills.languages || []),
    ...(skills.frontend || []),
    ...(skills.backend || []),
    ...(skills.databases || []),
    ...(skills.tools || []),
    ...(skills.soft || [])
  ].map(s => s.toLowerCase())

  const allSkillsStr = allSkillsList.join(' ')
  const totalExperienceItems = experience.filter(e => e.company || e.role).length
  const totalProjects = projects.filter(p => p.title).length
  const totalCerts = certifications.filter(c => c.name).length
  const totalLeadership = leadership.filter(l => l.role).length

  // Scores for all 12 templates
  const scores = {
    graduate_fresher: { score: 10, reason: 'Great for fresh graduates and students highlighting projects & education' },
    software_developer: { score: 10, reason: 'Tailored for software engineers with tech stack badges & project highlights' },
    data_analyst: { score: 10, reason: 'Optimized for analytics, SQL, Python & data visualization competencies' },
    academic_cv: { score: 10, reason: 'Formal structure ideal for research, publications, education & academic credentials' },
    modern_executive: { score: 10, reason: 'Modern two-column design with executive presence & clear milestone timeline' },
    senior_executive: { score: 10, reason: 'High-impact executive layout focusing on leadership, growth & strategic vision' },
    creative_designer: { score: 10, reason: 'Visually distinctive layout crafted for designers, UI/UX, and creative specialists' },
    marketing_professional: { score: 10, reason: 'Dynamic layout highlighting campaigns, performance metrics & communication skills' },
    engineering_professional: { score: 10, reason: 'Structured precision design for core and specialized engineering disciplines' },
    ats_professional: { score: 15, reason: 'High-parsing single-column ATS layout tested for corporate hiring portals' },
    minimalist: { score: 12, reason: 'Clean, elegant Swiss-style typography with maximum readability' },
    premium_corporate: { score: 10, reason: 'Authoritative, polished format suited for finance, consulting & enterprise roles' }
  }

  // 1. Fresher / Student checks
  if (category === 'fresher' || category === 'internship' || totalExperienceItems === 0) {
    scores.graduate_fresher.score += 45
    scores.graduate_fresher.reason = 'Recommended for freshers: highlights education, skills & projects prominently'
    scores.minimalist.score += 15
    scores.ats_professional.score += 15
  }

  if (totalProjects >= 2 && totalExperienceItems <= 1) {
    scores.graduate_fresher.score += 25
  }

  // 2. Software Developer checks
  const devKeywords = ['react', 'node', 'java', 'python', 'javascript', 'typescript', 'c++', 'c#', 'golang', 'rust', 'aws', 'docker', 'kubernetes', 'git', 'full stack', 'frontend', 'backend', 'software', 'developer', 'web', 'devops', 'cloud', 'api', 'flutter', 'android', 'ios']
  let devHits = 0
  devKeywords.forEach(k => {
    if (desiredRole.includes(k) || roles.includes(k) || allSkillsStr.includes(k) || projectTech.includes(k)) {
      devHits++
    }
  })
  if (devHits >= 2 || desiredRole.includes('developer') || desiredRole.includes('software')) {
    scores.software_developer.score += Math.min(devHits * 8, 50)
    scores.software_developer.reason = `Strong match: aligns with your coding background (${allSkillsList.slice(0, 3).join(', ') || 'software skills'})`
  }

  // 3. Data Analyst checks
  const dataKeywords = ['sql', 'power bi', 'tableau', 'excel', 'pandas', 'numpy', 'data analyst', 'data science', 'analytics', 'statistics', 'etl', 'visualization', 'machine learning', 'r', 'bi', 'bigquery', 'snowflake']
  let dataHits = 0
  dataKeywords.forEach(k => {
    if (desiredRole.includes(k) || roles.includes(k) || allSkillsStr.includes(k) || projectTech.includes(k)) {
      dataHits++
    }
  })
  if (dataHits >= 2 || desiredRole.includes('analyst') || desiredRole.includes('data')) {
    scores.data_analyst.score += Math.min(dataHits * 10, 55)
    scores.data_analyst.reason = 'Recommended for data analytics: emphasizes SQL, BI tools & data project insights'
  }

  // 4. Creative / UI/UX / Designer checks
  const creativeKeywords = ['figma', 'ui', 'ux', 'designer', 'graphic', 'photoshop', 'illustrator', 'creative', 'art', 'portfolio', 'wireframe', 'animation', 'video', 'branding']
  let creativeHits = 0
  creativeKeywords.forEach(k => {
    if (desiredRole.includes(k) || roles.includes(k) || allSkillsStr.includes(k)) {
      creativeHits++
    }
  })
  if (creativeHits >= 2 || desiredRole.includes('designer') || desiredRole.includes('ui') || desiredRole.includes('ux')) {
    scores.creative_designer.score += Math.min(creativeHits * 12, 55)
    scores.creative_designer.reason = 'Great match for creative & design roles with portfolio showcase layout'
  }

  // 5. Senior Executive / Leadership
  const execKeywords = ['director', 'manager', 'lead', 'head', 'vp', 'chief', 'executive', 'founder', 'officer', 'principal', 'president', 'operations']
  let execHits = 0
  execKeywords.forEach(k => {
    if (desiredRole.includes(k) || roles.includes(k)) {
      execHits++
    }
  })
  if (category === 'experienced' || totalExperienceItems >= 3 || totalLeadership >= 1) {
    scores.modern_executive.score += 25
    scores.senior_executive.score += 20 + Math.min(execHits * 10, 30)
    scores.premium_corporate.score += 20
    if (execHits >= 1) {
      scores.senior_executive.reason = 'Tailored for senior leadership and management positions'
    }
  }

  // 6. Academic CV
  const academicKeywords = ['phd', 'master', 'research', 'professor', 'publication', 'thesis', 'scholar', 'fellow', 'university', 'academic', 'teaching', 'lecturer']
  let academicHits = 0
  academicKeywords.forEach(k => {
    if (desiredRole.includes(k) || roles.includes(k) || summary.includes(k) || objective.includes(k)) {
      academicHits++
    }
  })
  if (workshops.length >= 2 || academicHits >= 1 || education.some(e => (e.degree || '').toLowerCase().includes('phd') || (e.degree || '').toLowerCase().includes('m.'))) {
    scores.academic_cv.score += 35 + academicHits * 8
    scores.academic_cv.reason = 'Ideal for academic, research, teaching & multi-credential CV presentation'
  }

  // 7. Marketing
  const marketingKeywords = ['marketing', 'seo', 'sem', 'campaign', 'content', 'growth', 'social media', 'advertising', 'sales', 'pr', 'brand']
  let marketingHits = 0
  marketingKeywords.forEach(k => {
    if (desiredRole.includes(k) || roles.includes(k) || allSkillsStr.includes(k)) {
      marketingHits++
    }
  })
  if (marketingHits >= 2 || desiredRole.includes('marketing')) {
    scores.marketing_professional.score += 45 + marketingHits * 5
    scores.marketing_professional.reason = 'Built for marketing & growth professionals showcasing campaigns & metrics'
  }

  // 8. Engineering
  const engKeywords = ['mechanical', 'electrical', 'civil', 'chemical', 'hardware', 'embedded', 'cad', 'autocad', 'matlab', 'iot', 'robotics', 'plc', 'scada', 'systems engineer']
  let engHits = 0
  engKeywords.forEach(k => {
    if (desiredRole.includes(k) || roles.includes(k) || allSkillsStr.includes(k)) {
      engHits++
    }
  })
  if (engHits >= 1 || (desiredRole.includes('engineer') && !desiredRole.includes('software'))) {
    scores.engineering_professional.score += 45 + engHits * 6
    scores.engineering_professional.reason = 'Designed for engineering projects, technical methodologies & standards'
  }

  // Convert to array and sort descending
  const sorted = Object.entries(scores)
    .map(([id, item]) => ({ id, score: item.score, reason: item.reason }))
    .sort((a, b) => b.score - a.score)

  return sorted.slice(0, 3)
}
