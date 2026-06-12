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
    phone: string;
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
  recordConsultation: (data: {
    patientId: string;
    transcript: Array<{ speaker: 'AI' | 'Mother' | 'Patient'; text: string }>;
    language: string;
  }) => Promise<{ success: boolean; riskLevel: string; referralTriggered: boolean }>;
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
      console.error('MamaCare API offline.', error);
      setPatients([]);
      setConsultations([]);
      setReferrals([]);
      setFacilities([]);
      setActionLogs([]);
      setDashboardData(null);
      setAnalyticsData(null);
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
    phone: string;
  }) => {
    try {
      await mamacareApi.registerPatient(data);
      await refreshAll();
    } catch (error) {
      console.error('Failed to register patient:', error);
      throw error;
    }
  };

  const recordVitals = async (
    patientId: string,
    data: { bloodPressure?: string; kickCount?: number; copingIndex?: number }
  ) => {
    try {
      await mamacareApi.recordVitals(patientId, data);
      await refreshAll();
    } catch (error) {
      console.error('Failed to record vitals:', error);
      throw error;
    }
  };

  const logVisit = async (patientId: string, data: { visitType: string; notes: string }) => {
    try {
      await mamacareApi.logVisit(patientId, data);
      await refreshAll();
    } catch (error) {
      console.error('Failed to log visit:', error);
      throw error;
    }
  };

  const createReferral = async (data: { patientId: string; facilityId: string; reason: string }) => {
    try {
      await mamacareApi.createReferral(data);
      await refreshAll();
    } catch (error) {
      console.error('Failed to create referral:', error);
      throw error;
    }
  };

  const updateReferralStatus = async (
    referralId: string,
    data: { status: string; outcome?: string; note?: string }
  ) => {
    try {
      await mamacareApi.updateReferralStatus(referralId, data);
      await refreshAll();
    } catch (error) {
      console.error('Failed to update referral status:', error);
      throw error;
    }
  };

  const addFacility = async (data: {
    name: string;
    distance: string;
    hours: string;
    services: string[];
    phone: string;
    address: string;
  }) => {
    try {
      await mamacareApi.addFacility(data);
      await refreshAll();
    } catch (error) {
      console.error('Failed to add facility:', error);
      throw error;
    }
  };

  const recordConsultation = async (data: {
    patientId: string;
    transcript: Array<{ speaker: 'AI' | 'Mother' | 'Patient'; text: string }>;
    language: string;
  }) => {
    try {
      const res = await mamacareApi.recordConsultation(data);
      await refreshAll();
      return res;
    } catch (error) {
      console.error('Failed to record consultation:', error);
      throw error;
    }
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
        recordConsultation,
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
