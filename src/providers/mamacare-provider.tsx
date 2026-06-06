import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mamacareApi } from '@/lib/mamacare/api';
import type { Patient, Consultation, Referral, Facility, ActionLogEntry, Pathway, RiskLevel, Language } from '@/lib/mamacare/types';

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
      console.warn('MamaCare API offline. Falling back to local state cache.', error);
      
      const getCached = <T,>(key: string, initial: T): T => {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            return JSON.parse(item);
          } catch {
            // ignore
          }
        }
        localStorage.setItem(key, JSON.stringify(initial));
        return initial;
      };

      // Import dynamic mock fallback
      const mock = await import('@/lib/mamacare/mock-data');

      const pts = getCached('mc_patients', mock.patients);
      const cons = getCached('mc_consultations', mock.consultations);
      const refs = getCached('mc_referrals', mock.referrals);
      const facs = getCached('mc_facilities', mock.facilities);
      const logs = getCached('mc_actionLogs', mock.actionLog);
      
      const defaultDash = {
        kpis: mock.kpiData,
        zoneSummary: mock.zoneSummary,
        riskEscalationFeed: mock.riskEscalationFeed,
      };
      const dash = getCached('mc_dashboardData', defaultDash);

      const defaultAn = {
        kpis: {
          totalReferrals: mock.referrals.length,
          avgResolutionTime: '4.2 hrs',
          followUpRate: '91%',
          emergencyEscalations: mock.patients.filter((p: Patient) => p.riskLevel === 'HIGH').length,
        },
        chwPerformance: mock.chwPerformanceData,
        facilityPerformance: [
          { facility: 'Maitama District Hospital', referrals: 12, resolved: 10, successRate: 83, trend: 'up' },
          { facility: 'National Hospital Abuja', referrals: 8, resolved: 6, successRate: 75, trend: 'down' },
          { facility: 'Lagos University Teaching Hospital', referrals: 5, resolved: 5, successRate: 100, trend: 'stable' },
        ],
        symptomTrend: [
          { month: 'Jan', headache: 4, bleeding: 1, fatigue: 12 },
          { month: 'Feb', headache: 6, bleeding: 2, fatigue: 15 },
          { month: 'Mar', headache: 8, bleeding: 0, fatigue: 10 },
          { month: 'Apr', headache: 12, bleeding: 3, fatigue: 18 },
          { month: 'May', headache: 15, bleeding: 4, fatigue: 20 },
        ],
      };
      const an = getCached('mc_analyticsData', defaultAn);

      setPatients(pts);
      setConsultations(cons);
      setReferrals(refs);
      setFacilities(facs);
      setActionLogs(logs);
      setDashboardData(dash);
      setAnalyticsData(an);
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
    try {
      await mamacareApi.registerPatient(data);
      await refreshAll();
    } catch {
      console.warn('API Offline - registering patient locally');
      const newPatient: Patient = {
        id: 'p' + Math.floor(100 + Math.random() * 900),
        name: data.name,
        age: data.age,
        pathway: data.pathway,
        riskLevel: 'LOW',
        language: data.language as Language,
        assignedChw: data.assignedChw || 'Hadiza Bello',
        stage: data.stage,
        lastCallDate: new Date().toISOString().split('T')[0],
        registrationDate: new Date().toISOString().split('T')[0],
        riskHistory: [{ date: new Date().toISOString().split('T')[0], level: 'LOW' }],
      };
      const updatedPts = [...patients, newPatient];
      setPatients(updatedPts);
      localStorage.setItem('mc_patients', JSON.stringify(updatedPts));

      const newLog: ActionLogEntry = {
        id: 'a' + Math.floor(100 + Math.random() * 900),
        patientId: newPatient.id,
        type: 'Registration',
        description: `Patient registered for MamaCare programme — ${data.pathway} pathway`,
        timestamp: new Date().toISOString(),
        performedBy: data.assignedChw || 'System',
      };
      const updatedLogs = [newLog, ...actionLogs];
      setActionLogs(updatedLogs);
      localStorage.setItem('mc_actionLogs', JSON.stringify(updatedLogs));

      if (dashboardData) {
        const updatedDash = {
          ...dashboardData,
          kpis: {
            ...dashboardData.kpis,
            totalMothers: dashboardData.kpis.totalMothers + 1,
          },
          zoneSummary: {
            ...dashboardData.zoneSummary,
            caseload: dashboardData.zoneSummary.caseload + 1,
          },
        };
        setDashboardData(updatedDash);
        localStorage.setItem('mc_dashboardData', JSON.stringify(updatedDash));
      }
    }
  };

  const recordVitals = async (
    patientId: string,
    data: { bloodPressure?: string; kickCount?: number; copingIndex?: number }
  ) => {
    try {
      await mamacareApi.recordVitals(patientId, data);
      await refreshAll();
    } catch {
      console.warn('API Offline - recording vitals locally');
      const pts = patients.map((p) => {
        if (p.id === patientId) {
          const updatedHistory = [...p.riskHistory];
          let newRisk = p.riskLevel;
          if (data.bloodPressure) {
            const parts = data.bloodPressure.split('/');
            if (parts.length === 2) {
              const sys = parseInt(parts[0]);
              const dia = parseInt(parts[1]);
              if (sys >= 160 || dia >= 100) newRisk = 'HIGH';
              else if (sys >= 140 || dia >= 90) if (newRisk !== 'HIGH') newRisk = 'MEDIUM';
            }
          }
          if (data.copingIndex && data.copingIndex <= 3) {
            newRisk = 'HIGH';
          }
          if (newRisk !== p.riskLevel) {
            updatedHistory.push({ date: new Date().toISOString().split('T')[0], level: newRisk as RiskLevel });
          }
          return {
            ...p,
            bloodPressure: data.bloodPressure || p.bloodPressure,
            kickCount: data.kickCount || p.kickCount,
            copingIndex: data.copingIndex || p.copingIndex,
            riskLevel: newRisk,
            riskHistory: updatedHistory,
          };
        }
        return p;
      });
      setPatients(pts);
      localStorage.setItem('mc_patients', JSON.stringify(pts));

      const newLog: ActionLogEntry = {
        id: 'a' + Math.floor(100 + Math.random() * 900),
        patientId,
        type: 'Vitals',
        description: `Vitals recorded: ${data.bloodPressure ? `BP: ${data.bloodPressure} ` : ''}${data.kickCount ? `Kick Count: ${data.kickCount} ` : ''}${data.copingIndex ? `Coping Index: ${data.copingIndex}` : ''}`,
        timestamp: new Date().toISOString(),
        performedBy: 'CHW',
      };
      const updatedLogs = [newLog, ...actionLogs];
      setActionLogs(updatedLogs);
      localStorage.setItem('mc_actionLogs', JSON.stringify(updatedLogs));
    }
  };

  const logVisit = async (patientId: string, data: { visitType: string; notes: string }) => {
    try {
      await mamacareApi.logVisit(patientId, data);
      await refreshAll();
    } catch {
      console.warn('API Offline - logging visit locally');
      const newLog: ActionLogEntry = {
        id: 'a' + Math.floor(100 + Math.random() * 900),
        patientId,
        type: 'Visit',
        description: `${data.visitType} visit completed: ${data.notes}`,
        timestamp: new Date().toISOString(),
        performedBy: 'CHW',
      };
      const updatedLogs = [newLog, ...actionLogs];
      setActionLogs(updatedLogs);
      localStorage.setItem('mc_actionLogs', JSON.stringify(updatedLogs));
    }
  };

  const createReferral = async (data: { patientId: string; facilityId: string; reason: string }) => {
    try {
      await mamacareApi.createReferral(data);
      await refreshAll();
    } catch {
      console.warn('API Offline - creating referral locally');
      const patient = patients.find((p) => p.id === data.patientId);
      const facility = facilities.find((f) => f.id === data.facilityId);
      if (!patient || !facility) return;

      const newRef: Referral = {
        id: 'r' + Math.floor(100 + Math.random() * 900),
        patientId: data.patientId,
        patientName: patient.name,
        riskLevel: patient.riskLevel,
        status: 'Pending',
        facilityId: data.facilityId,
        facilityName: facility.name,
        assignedChw: patient.assignedChw,
        reason: data.reason,
        createdAt: new Date().toISOString(),
        timeline: [{ stage: 'Referral Created', timestamp: new Date().toISOString(), note: data.reason }],
      };
      const updatedRefs = [newRef, ...referrals];
      setReferrals(updatedRefs);
      localStorage.setItem('mc_referrals', JSON.stringify(updatedRefs));

      const newLog: ActionLogEntry = {
        id: 'a' + Math.floor(100 + Math.random() * 900),
        patientId: data.patientId,
        type: 'Referral',
        description: `Referral created to ${facility.name}. Reason: ${data.reason}`,
        timestamp: new Date().toISOString(),
        performedBy: patient.assignedChw,
      };
      const updatedLogs = [newLog, ...actionLogs];
      setActionLogs(updatedLogs);
      localStorage.setItem('mc_actionLogs', JSON.stringify(updatedLogs));
    }
  };

  const updateReferralStatus = async (
    referralId: string,
    data: { status: string; outcome?: string; note?: string }
  ) => {
    try {
      await mamacareApi.updateReferralStatus(referralId, data);
      await refreshAll();
    } catch {
      console.warn('API Offline - updating referral status locally');
      const refs = referrals.map((r) => {
        if (r.id === referralId) {
          const updatedTimeline = [...r.timeline, { stage: data.status, timestamp: new Date().toISOString(), note: data.note }];
          return {
            ...r,
            status: data.status as Referral['status'],
            outcome: data.outcome || r.outcome,
            timeline: updatedTimeline,
          };
        }
        return r;
      });
      setReferrals(refs);
      localStorage.setItem('mc_referrals', JSON.stringify(refs));

      const targetRef = referrals.find((r) => r.id === referralId);
      if (targetRef) {
        const newLog: ActionLogEntry = {
          id: 'a' + Math.floor(100 + Math.random() * 900),
          patientId: targetRef.patientId,
          type: 'Outcome',
          description: `Referral status updated to ${data.status}.${data.outcome ? ` Outcome: ${data.outcome}` : ''}`,
          timestamp: new Date().toISOString(),
          performedBy: targetRef.assignedChw,
        };
        const updatedLogs = [newLog, ...actionLogs];
        setActionLogs(updatedLogs);
        localStorage.setItem('mc_actionLogs', JSON.stringify(updatedLogs));
      }
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
    } catch {
      console.warn('API Offline - adding facility locally');
      const newFacility: Facility = {
        id: 'f' + Math.floor(100 + Math.random() * 900),
        ...data,
      };
      const updated = [...facilities, newFacility];
      setFacilities(updated);
      localStorage.setItem('mc_facilities', JSON.stringify(updated));
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
