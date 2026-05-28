export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW'

export type Pathway = 'Pregnancy' | 'Post-Loss'

export type Language = 'Hausa' | 'Yoruba' | 'Igbo' | 'English' | 'French'

export type ReferralStatus = 'Pending' | 'In Transit' | 'Admitted' | 'Resolved' | 'Lost to Follow-up'

export type UserRole = 'chw' | 'provider'

export interface Patient {
  id: string
  name: string
  age: number
  pathway: Pathway
  riskLevel: RiskLevel
  language: Language
  assignedChw: string
  avatarUrl?: string
  stage?: string
  lastCallDate: string
  registrationDate: string
  riskHistory: { date: string; level: RiskLevel }[]
  bloodPressure?: string
  kickCount?: number
  copingIndex?: number
  sleepQuality?: 'Poor' | 'Fair' | 'Good'
  bleedingStatus?: string
}

export interface Consultation {
  id: string
  patientId: string
  patientName: string
  date: string
  language: Language
  symptoms: string[]
  riskLevel: RiskLevel
  aiSummary: string
  transcript: { speaker: 'AI' | 'Mother'; text: string }[]
  triggeredReferral: boolean
}

export interface Referral {
  id: string
  patientId: string
  patientName: string
  riskLevel: RiskLevel
  status: ReferralStatus
  facilityId: string
  facilityName: string
  assignedChw: string
  outcome?: string
  createdAt: string
  timeline: { stage: string; timestamp: string; note?: string }[]
}

export interface Facility {
  id: string
  name: string
  distance: string
  hours: string
  services: string[]
  phone: string
  address: string
}

export interface ActionLogEntry {
  id: string
  patientId: string
  type: 'Visit' | 'Call' | 'Referral' | 'Alert' | 'Outcome' | 'Registration' | 'Vitals'
  description: string
  timestamp: string
  performedBy: string
}

export interface ChwPerformance {
  chwName: string
  totalCases: number
  followUpRate: number
  resolvedCases: number
  activeCases: number
}

export interface ZoneSummary {
  caseload: number
  pendingVisits: number
  unresolvedDanger: number
}
