export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW'

export type Pathway = 'Pregnancy' | 'Post-Loss'

export type Language = 'Twi' | 'Ga' | 'Ewe' | 'Fante' | 'English'

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
  phone?: string
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
  transcript: { speaker: 'AI' | 'Mother' | 'Full Audio'; text: string }[]
  triggeredReferral: boolean
  audioUrl?: string
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
  reason?: string
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
 
export interface AppNotification {
  id: string;
  uiType: string;
  payload: any;
  isRead: boolean;
  timestamp: string;
  pathway: string;
}
 
export interface Communication {
  id: string;
  pathway: string;
  recipientType: string;
  recipientCount: number;
  message: string;
  status: string;
  sentAt: string;
}

export interface Schedule {
  id: string;
  pathway: string;
  appointmentDate: string;
  appointmentTime: string;
  reminderTiming: string;
  message: string;
  patientsCount: number;
  status: string;
  createdAt: string;
}
