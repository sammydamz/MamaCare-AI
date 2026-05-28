import type { RiskLevel, Pathway, Language, ReferralStatus } from './types'

export const RISK_COLORS: Record<RiskLevel, string> = {
  HIGH: 'destructive',
  MEDIUM: 'warning',
  LOW: 'secondary',
}

export const RISK_ORDER: Record<RiskLevel, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
}

export const PATHWAY_LABELS: Record<Pathway, string> = {
  Pregnancy: 'Pregnancy',
  'Post-Loss': 'Post-Loss',
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  Hausa: 'Hausa',
  Yoruba: 'Yoruba',
  Igbo: 'Igbo',
  English: 'English',
  French: 'French',
}

export const REFERRAL_STATUS_LABELS: Record<ReferralStatus, string> = {
  Pending: 'Pending',
  'In Transit': 'In Transit',
  Admitted: 'Admitted',
  Resolved: 'Resolved',
  'Lost to Follow-up': 'Lost to Follow-up',
}

export const REFERRAL_STATUS_COLORS: Record<ReferralStatus, string> = {
  Pending: 'warning',
  'In Transit': 'info',
  Admitted: 'destructive',
  Resolved: 'secondary',
  'Lost to Follow-up': 'muted',
}
