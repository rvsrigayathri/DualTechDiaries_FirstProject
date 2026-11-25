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
  { id: 'all', label: 'All Templates' },
  { id: 'tech', label: 'Tech & Engineering' },
  { id: 'executive', label: 'Executive & Corporate' },
  { id: 'creative', label: 'Creative & Marketing' },
  { id: 'academic', label: 'Fresher & Academic' },
  { id: 'ats', label: 'ATS Friendly' }
]

export const TEMPLATES = [
  {
    id: 'ats_professional',
    label: 'ATS Professional',
    category: 'ats',
    isAts: true,
    description: 'Ultra-clean single-column format optimized for applicant tracking algorithms.',
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
    description: 'High-contrast dual-column layout with dark leadership sidebar and metrics.',
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
    description: 'Dynamic gradient header with portfolio links and visual skill meter chips.',
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
    description: 'Tech stack grouped chips, GitHub/live links, and structured project cards.',
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
    description: 'Analytical layout emphasizing SQL, BI tools, and data-driven impact statements.',
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
    description: 'Formal serif styling dedicated to research, publications, conferences & degrees.',
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
    description: 'Education & academic projects placed first; ideal for students and fresh grads.',
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
    description: 'Stately layout with letterhead header, board advisory, and milestone milestones.',
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
    description: 'Vibrant header band, campaign performance spotlights, and growth tools.',
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
    description: 'Disciplined technical structure for mechanical, electrical, civil & hardware engineers.',
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
    description: 'Swiss typography, balanced whitespace, and ultra-crisp monochromatic readability.',
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
    description: 'Authoritative double-rule header for consulting, finance, law & enterprise roles.',
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

export function getTemplateById(id) {
  return TEMPLATES.find(t => t.id === id) || TEMPLATES[0]
}
