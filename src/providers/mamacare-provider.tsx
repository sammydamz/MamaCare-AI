import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mamacareApi } from '@/lib/mamacare/api';
import type { Patient, Consultation, Referral, Facility, ActionLogEntry, Pathway } from '@/lib/mamacare/types';

interface DashboardData {
  kpis: {
    totalMothers: number;
    highRisk: number;
    pendingActions: number;
    resolutionRate: number;
  };
  zoneSummary: {
    caseload: number;
    pendingVisits: number;
    unresolvedDanger: number;
  };
  riskEscalationFeed: Array<{
    patientId: string;
    patientName: string;
    fromLevel: string;
    toLevel: string;
    date: string;
    reason: string;
  }>;
}

interface AnalyticsData {
  kpis: {
    totalReferrals: number;
    avgResolutionTime: string;
    followUpRate: string;
    emergencyEscalations: number;
  };
  chwPerformance: Array<{
    chwName: string;
    totalCases: number;
    followUpRate: number;
    resolvedCases: number;
    activeCases: number;
  }>;
  facilityPerformance: Array<{
    facility: string;
    referrals: number;
    resolved: number;
    successRate: number;
    trend: string;
  }>;
  symptomTrend: Array<{
    month: string;
    headache: number;
    bleeding: number;
    fatigue: number;
  }>;
}

interface MamaCareContextType {
  patients: Patient[];
  consultations: Consultation[];
  referrals: Referral[];
  facilities: Facility[];
  actionLogs: ActionLogEntry[];
  dashboardData: DashboardData | null;
  analyticsData: AnalyticsData | null;
  isLoading: boolean;
  refreshAll: () => Promise<void>;
  registerPatient: (data: {
    name: string;
    age: number;
    pathway: Pathway;
    language: string;
    assignedChw?: string;
    stage: string;
  }) => Promise<void>;
  recordVitals: (
    patientId: string,
    data: { bloodPressure?: string; kickCount?: number; copingIndex?: number }
  ) => Promise<void>;
  logVisit: (patientId: string, data: { visitType: string; notes: string }) => Promise<void>;
  createReferral: (data: { patientId: string; facilityId: string; reason: string }) => Promise<void>;
  updateReferralStatus: (
    referralId: string,
    data: { status: string; outcome?: string; note?: string }
  ) => Promise<void>;
  addFacility: (data: {
    name: string;
    distance: string;
    hours: string;
    services: string[];
    phone: string;
    address: string;
  }) => Promise<void>;
}

const MamaCareContext = createContext<MamaCareContextType | undefined>(undefined);

export function MamaCareProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [actionLogs, setActionLogs] = useState<ActionLogEntry[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAll = async () => {
    setIsLoading(true);
    try {
      const [pts, cons, refs, facs, logs, dash, an] = await Promise.all([
        mamacareApi.fetchPatients(),
        mamacareApi.fetchConsultations(),
        mamacareApi.fetchReferrals(),
        mamacareApi.fetchFacilities(),
        mamacareApi.fetchActionLogs(),
        mamacareApi.fetchDashboard(),
        mamacareApi.fetchAnalytics(),
      ]);
      setPatients(pts);
      setConsultations(cons);
      setReferrals(refs);
      setFacilities(facs);
      setActionLogs(logs);
      setDashboardData(dash);
      setAnalyticsData(an);
    } catch (error) {
      console.error('Error fetching MamaCare data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const registerPatient = async (data: {
    name: string;
    age: number;
    pathway: Pathway;
    language: string;
    assignedChw?: string;
    stage: string;
  }) => {
    await mamacareApi.registerPatient(data);
    await refreshAll();
  };

  const recordVitals = async (
    patientId: string,
    data: { bloodPressure?: string; kickCount?: number; copingIndex?: number }
  ) => {
    await mamacareApi.recordVitals(patientId, data);
    await refreshAll();
  };

  const logVisit = async (patientId: string, data: { visitType: string; notes: string }) => {
    await mamacareApi.logVisit(patientId, data);
    await refreshAll();
  };

  const createReferral = async (data: { patientId: string; facilityId: string; reason: string }) => {
    await mamacareApi.createReferral(data);
    await refreshAll();
  };

  const updateReferralStatus = async (
    referralId: string,
    data: { status: string; outcome?: string; note?: string }
  ) => {
    await mamacareApi.updateReferralStatus(referralId, data);
    await refreshAll();
  };

  const addFacility = async (data: {
    name: string;
    distance: string;
    hours: string;
    services: string[];
    phone: string;
    address: string;
  }) => {
    await mamacareApi.addFacility(data);
    await refreshAll();
  };

  return (
    <MamaCareContext.Provider
      value={{
        patients,
        consultations,
        referrals,
        facilities,
        actionLogs,
        dashboardData,
        analyticsData,
        isLoading,
        refreshAll,
        registerPatient,
        recordVitals,
        logVisit,
        createReferral,
        updateReferralStatus,
        addFacility,
      }}
    >
      {children}
    </MamaCareContext.Provider>
  );
}

export function useMamaCare() {
  const context = useContext(MamaCareContext);
  if (!context) {
    throw new Error('useMamaCare must be used within a MamaCareProvider');
  }
  return context;
}
