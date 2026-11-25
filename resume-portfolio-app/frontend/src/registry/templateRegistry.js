/**
 * ResumeCraft — Template Registry
 * Central single-source-of-truth for all template metadata,
 * categorization, layout configurations, and query helpers.
 */

import AtsProfessionalTemplate from '../components/preview/templates/AtsProfessionalTemplate'
import ModernExecutiveTemplate from '../components/preview/templates/ModernExecutiveTemplate'
import CreativeDesignerTemplate from '../components/preview/templates/CreativeDesignerTemplate'
import SoftwareDeveloperTemplate from '../components/preview/templates/SoftwareDeveloperTemplate'
import DataAnalystTemplate from '../components/preview/templates/DataAnalystTemplate'
import AcademicCvTemplate from '../components/preview/templates/AcademicCvTemplate'
import GraduateFresherTemplate from '../components/preview/templates/GraduateFresherTemplate'
import SeniorExecutiveTemplate from '../components/preview/templates/SeniorExecutiveTemplate'
import MarketingProfessionalTemplate from '../components/preview/templates/MarketingProfessionalTemplate'
import EngineeringProfessionalTemplate from '../components/preview/templates/EngineeringProfessionalTemplate'
import MinimalistTemplate from '../components/preview/templates/MinimalistTemplate'
import PremiumCorporateTemplate from '../components/preview/templates/PremiumCorporateTemplate'

// Backward-compatible original templates
import ClassicTemplate from '../components/preview/templates/ClassicTemplate'
import ModernTemplate from '../components/preview/templates/ModernTemplate'
import CreativeTemplate from '../components/preview/templates/CreativeTemplate'
import AtsTemplate from '../components/preview/templates/AtsTemplate'

export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All Templates', count: 12 },
  { id: 'tech', label: 'Tech & Engineering', count: 3 },
  { id: 'executive', label: 'Executive & Corporate', count: 3 },
  { id: 'creative', label: 'Creative & Marketing', count: 2 },
  { id: 'academic', label: 'Fresher & Academic', count: 2 },
  { id: 'ats', label: 'ATS Friendly', count: 4 }
]

export const TEMPLATES = [
  {
    id: 'ats_professional',
    label: 'ATS Professional',
    category: 'ats',
    isAts: true,
    layoutType: 'single-column',
    description: 'Ultra-clean single-column format optimized for applicant tracking algorithms.',
    bestFor: 'Corporate job portals, Fortune 500 applications, online job boards',
    features: ['100% Machine Parseable', 'Clean Typography', 'Tabular Alignment'],
    accentDefault: '#111827',
    secondaryDefault: '#374151',
    fontDefault: 'Inter',
    component: AtsProfessionalTemplate,
    badge: '100% ATS Safe'
  },
  {
    id: 'modern_executive',
    label: 'Modern Executive',
    category: 'executive',
    isAts: false,
    layoutType: 'two-column-sidebar',
    description: 'High-contrast dual-column layout with dark leadership sidebar and metrics.',
    bestFor: 'Team Leads, Directors, Project Managers, Consultants',
    features: ['Executive Dark Sidebar', 'Metrics Highlights', 'Dual Column Efficiency'],
    accentDefault: '#1e3a8a',
    secondaryDefault: '#0f172a',
    fontDefault: 'Inter',
    component: ModernExecutiveTemplate,
    badge: 'Executive Presence'
  },
  {
    id: 'creative_designer',
    label: 'Creative Designer',
    category: 'creative',
    isAts: false,
    layoutType: 'banner-grid',
    description: 'Dynamic gradient header with portfolio links and visual skill meter chips.',
    bestFor: 'UI/UX Designers, Product Designers, Illustrators, Art Directors',
    features: ['Gradient Header Banner', 'Portfolio Focus', 'Visual Toolkit Badges'],
    accentDefault: '#ec4899',
    secondaryDefault: '#831843',
    fontDefault: 'Inter',
    component: CreativeDesignerTemplate,
    badge: 'Portfolio Ready'
  },
  {
    id: 'software_developer',
    label: 'Software Developer',
    category: 'tech',
    isAts: true,
    layoutType: 'single-column-code',
    description: 'Tech stack grouped chips, GitHub/live links, and structured project cards.',
    bestFor: 'Full-Stack, Backend, Frontend, Cloud & DevOps Engineers',
    features: ['Categorized Tech Chips', 'Project Live Links', 'Code Header Accent'],
    accentDefault: '#2563eb',
    secondaryDefault: '#1e293b',
    fontDefault: 'Inter',
    component: SoftwareDeveloperTemplate,
    badge: 'Developer Focus'
  },
  {
    id: 'data_analyst',
    label: 'Data Analyst',
    category: 'tech',
    isAts: true,
    layoutType: 'matrix-data',
    description: 'Analytical layout emphasizing SQL, BI tools, and data-driven impact statements.',
    bestFor: 'Data Analysts, BI Developers, Data Scientists, Analytics Leads',
    features: ['Query/Tool Matrix', 'Quantifiable Metrics', 'Structured Impact'],
    accentDefault: '#0d9488',
    secondaryDefault: '#134e4a',
    fontDefault: 'Inter',
    component: DataAnalystTemplate,
    badge: 'Metrics Driven'
  },
  {
    id: 'academic_cv',
    label: 'Academic CV',
    category: 'academic',
    isAts: true,
    layoutType: 'letterhead-serif',
    description: 'Formal serif styling dedicated to research, publications, conferences & degrees.',
    bestFor: 'Ph.D. Researchers, Professors, Lecturers, Fellows, Scientists',
    features: ['Academic Chronology', 'Publications & Grants', 'Refined Serif Editorial'],
    accentDefault: '#374151',
    secondaryDefault: '#1f2937',
    fontDefault: 'Georgia',
    component: AcademicCvTemplate,
    badge: 'Academic Standard'
  },
  {
    id: 'graduate_fresher',
    label: 'Graduate Fresher',
    category: 'academic',
    isAts: true,
    layoutType: 'education-first',
    description: 'Education & academic projects placed first; ideal for students and fresh grads.',
    bestFor: 'Fresh Graduates, Final Year Students, Internship Seekers',
    features: ['Education Prominent', 'Academic Projects', 'Coursework & Leadership'],
    accentDefault: '#3b82f6',
    secondaryDefault: '#1d4ed8',
    fontDefault: 'Inter',
    component: GraduateFresherTemplate,
    badge: 'Student / Entry-Level'
  },
  {
    id: 'senior_executive',
    label: 'Senior Executive',
    category: 'executive',
    isAts: false,
    layoutType: 'letterhead-governance',
    description: 'Stately layout with letterhead header, board advisory, and milestone milestones.',
    bestFor: 'CEOs, VPs, Managing Directors, Founders, Board Advisors',
    features: ['Double-Rule Letterhead', 'Board Roles Block', 'Strategic Transactions'],
    accentDefault: '#4338ca',
    secondaryDefault: '#312e81',
    fontDefault: 'Georgia',
    component: SeniorExecutiveTemplate,
    badge: 'C-Suite & VP'
  },
  {
    id: 'marketing_professional',
    label: 'Marketing Professional',
    category: 'creative',
    isAts: false,
    layoutType: 'banner-roi',
    description: 'Vibrant header band, campaign performance spotlights, and growth tools.',
    bestFor: 'Growth Marketers, Brand Strategists, Performance Marketing Leads',
    features: ['Campaign Highlights', 'Channel Toolkits', 'ROI Callouts'],
    accentDefault: '#f97316',
    secondaryDefault: '#c2410c',
    fontDefault: 'Inter',
    component: MarketingProfessionalTemplate,
    badge: 'Growth & ROI'
  },
  {
    id: 'engineering_professional',
    label: 'Engineering Professional',
    category: 'tech',
    isAts: true,
    layoutType: 'precision-spec',
    description: 'Disciplined technical structure for mechanical, electrical, civil & hardware engineers.',
    bestFor: 'Civil, Mechanical, Electrical, Robotics & Hardware Engineers',
    features: ['Engineering Standards', 'Project Specifications', 'Licensure Section'],
    accentDefault: '#0284c7',
    secondaryDefault: '#0369a1',
    fontDefault: 'Inter',
    component: EngineeringProfessionalTemplate,
    badge: 'Technical Precision'
  },
  {
    id: 'minimalist',
    label: 'Minimalist',
    category: 'ats',
    isAts: true,
    layoutType: 'swiss-minimal',
    description: 'Swiss typography, balanced whitespace, and ultra-crisp monochromatic readability.',
    bestFor: 'Architects, Developers, Minimalists, Clean Thinkers',
    features: ['Swiss Whitespace', 'High Contrast Monochromatic', 'Timeless Simplicity'],
    accentDefault: '#18181b',
    secondaryDefault: '#27272a',
    fontDefault: 'Inter',
    component: MinimalistTemplate,
    badge: 'Timeless Design'
  },
  {
    id: 'premium_corporate',
    label: 'Premium Corporate',
    category: 'corporate',
    isAts: false,
    layoutType: 'corporate-crest',
    description: 'Authoritative double-rule header for consulting, finance, law & enterprise roles.',
    bestFor: 'Management Consultants, Investment Bankers, Legal Advisors',
    features: ['Corporate Prestige Bar', 'Executive Competencies', 'Framed Dividers'],
    accentDefault: '#881337',
    secondaryDefault: '#4c0519',
    fontDefault: 'Georgia',
    component: PremiumCorporateTemplate,
    badge: 'Enterprise Prestige'
  }
]

// Registry map including legacy keys for backward compatibility
export const TEMPLATE_MAP = {
  // New 12 templates
  ats_professional: AtsProfessionalTemplate,
  modern_executive: ModernExecutiveTemplate,
  creative_designer: CreativeDesignerTemplate,
  software_developer: SoftwareDeveloperTemplate,
  data_analyst: DataAnalystTemplate,
  academic_cv: AcademicCvTemplate,
  graduate_fresher: GraduateFresherTemplate,
  senior_executive: SeniorExecutiveTemplate,
  marketing_professional: MarketingProfessionalTemplate,
  engineering_professional: EngineeringProfessionalTemplate,
  minimalist: MinimalistTemplate,
  premium_corporate: PremiumCorporateTemplate,

  // Backward compatibility with previous 4 template IDs
  classic: ClassicTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
  ats: AtsTemplate
}

// ── Registry Query Helpers ──

export function getAllTemplates() {
  return TEMPLATES
}

export function getTemplateById(id) {
  return TEMPLATES.find(t => t.id === id) || TEMPLATES[0]
}

export function getTemplatesByCategory(category) {
  if (!category || category === 'all') return TEMPLATES
  if (category === 'ats') return TEMPLATES.filter(t => t.isAts)
  return TEMPLATES.filter(t => t.category === category)
}

export function filterTemplates({ category = 'all', query = '', isAtsOnly = false }) {
  const q = (query || '').toLowerCase().trim()
  return TEMPLATES.filter(t => {
    const matchesCat =
      category === 'all' ||
      t.category === category ||
      (category === 'ats' && t.isAts) ||
      (category === 'corporate' && (t.category === 'corporate' || t.category === 'executive'))

    const matchesAts = !isAtsOnly || t.isAts

    const matchesQuery =
      !q ||
      t.label.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.badge.toLowerCase().includes(q) ||
      (t.bestFor && t.bestFor.toLowerCase().includes(q))

    return matchesCat && matchesAts && matchesQuery
  })
}

export function getDefaultSettings(templateId) {
  const tmpl = getTemplateById(templateId)
  return {
    accentColor: tmpl.accentDefault,
    secondaryColor: tmpl.secondaryDefault,
    fontFamily: tmpl.fontDefault,
    fontSize: 'medium',
    sectionSpacing: 'normal',
    sidebarPosition: 'left'
  }
}
