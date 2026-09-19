import type { Language, Pathway, ReferralStatus, RiskLevel } from './types';

export const RISK_COLORS: Record<RiskLevel, string> = {
  HIGH: 'destructive',
  MEDIUM: 'warning',
  LOW: 'secondary',
};

export const RISK_ORDER: Record<RiskLevel, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

export const PATHWAY_LABELS: Record<Pathway, string> = {
  Pregnancy: 'Pregnancy',
  Postnatal: 'Postnatal',
  'Post-Loss': 'Post-Loss',
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  Twi: 'Twi',
  Ga: 'Ga',
  Ewe: 'Ewe',
  Fante: 'Fante',
  English: 'English',
};

export const TRIMESTER_OPTIONS = [
  { value: 'first', label: 'First Trimester (Weeks 1–12)' },
  { value: 'second', label: 'Second Trimester (Weeks 13–26)' },
  { value: 'third', label: 'Third Trimester (Weeks 27–40)' },
] as const;

export const CONDITIONS_OPTIONS = [
  'Diabetes',
  'Hypertension',
  'Thyroid Disorder',
  'Anemia',
] as const;

export const REFERRAL_STATUS_LABELS: Record<ReferralStatus, string> = {
  Pending: 'Pending',
  'In Transit': 'In Transit',
  Admitted: 'Admitted',
  Resolved: 'Resolved',
  'Lost to Follow-up': 'Lost to Follow-up',
};

export const REFERRAL_STATUS_COLORS: Record<ReferralStatus, string> = {
  Pending: 'warning',
  'In Transit': 'info',
  Admitted: 'destructive',
  Resolved: 'secondary',
  'Lost to Follow-up': 'muted',
};

export type UserRole = 'CHW' | 'Provider' | 'Admin';

export const currentUserRole: UserRole = 'Provider';

export const ROLE_BADGE_VARIANT: Record<UserRole, string> = {
  CHW: 'primary',
  Provider: 'success',
  Admin: 'destructive',
};

export const MOCK_USER = {
  name: 'Amina Kofi',
  email: 'amina@mamacare.ai',
  role: currentUserRole,
};
