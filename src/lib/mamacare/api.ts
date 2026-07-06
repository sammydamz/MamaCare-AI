import type { Patient, Consultation, Referral, Facility, ActionLogEntry, Pathway } from './types';

const API_BASE = '/api';

function authHeaders(): Record<string, string> {
  try {
    const raw = localStorage.getItem('mamacare-current-user');
    if (!raw) return {};
    const user = JSON.parse(raw);
    return { 'X-User-Email': user.email || '' };
  } catch {
    return {};
  }
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers as Record<string, string> || {}),
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.statusText}`);
  return res.json();
}

export const mamacareApi = {
  async fetchDashboard() {
    return authFetch(`${API_BASE}/dashboard`);
  },

  async fetchPatients(): Promise<Patient[]> {
    return authFetch(`${API_BASE}/patients`);
  },

  async registerPatient(data: {
    name: string;
    age: number;
    pathway: Pathway;
    language: string;
    assignedChw?: string;
    stage: string;
    phone: string;
  }): Promise<Patient> {
    return authFetch(`${API_BASE}/patients`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async recordVitals(
    patientId: string,
    data: {
      bloodPressure?: string;
      kickCount?: number;
      copingIndex?: number;
    }
  ): Promise<{ success: boolean; riskLevel: string }> {
    return authFetch(`${API_BASE}/patients/${patientId}/vitals`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logVisit(
    patientId: string,
    data: {
      visitType: string;
      notes: string;
    }
  ): Promise<{ success: boolean }> {
    return authFetch(`${API_BASE}/patients/${patientId}/visits`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async fetchConsultations(): Promise<Consultation[]> {
    return authFetch(`${API_BASE}/consultations`);
  },

  async recordConsultation(data: {
    patientId: string;
    transcript: Array<{ speaker: 'AI' | 'Mother' | 'Patient'; text: string }>;
    language: string;
  }): Promise<{ success: boolean; riskLevel: string; referralTriggered: boolean }> {
    return authFetch(`${API_BASE}/consultations`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async fetchReferrals(): Promise<Referral[]> {
    return authFetch(`${API_BASE}/referrals`);
  },

  async createReferral(data: {
    patientId: string;
    facilityId: string;
    reason: string;
  }): Promise<{ id: string; success: boolean }> {
    return authFetch(`${API_BASE}/referrals`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateReferralStatus(
    referralId: string,
    data: {
      status: string;
      outcome?: string;
      note?: string;
    }
  ): Promise<{ success: boolean }> {
    return authFetch(`${API_BASE}/referrals/${referralId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async fetchFacilities(): Promise<Facility[]> {
    return authFetch(`${API_BASE}/facilities`);
  },

  async addFacility(data: {
    name: string;
    distance: string;
    hours: string;
    services: string[];
    phone: string;
    address: string;
  }): Promise<Facility> {
    return authFetch(`${API_BASE}/facilities`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async fetchActionLogs(): Promise<ActionLogEntry[]> {
    return authFetch(`${API_BASE}/action-logs`);
  },

  async fetchAnalytics(pathway?: string) {
    const query = pathway ? `?pathway=${encodeURIComponent(pathway)}` : '';
    return authFetch(`${API_BASE}/analytics${query}`);
  },

  async fetchNotifications() {
    return authFetch(`${API_BASE}/notifications`);
  },

  async markNotificationAsRead(id: string) {
    return authFetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' });
  },

  async changePatientPathway(patientId: string, pathway: Pathway): Promise<{ message: string; pathway: string }> {
    return authFetch(`${API_BASE}/patients/${patientId}/pathway`, {
      method: 'PATCH',
      body: JSON.stringify({ pathway }),
    });
  },

  async fetchCommunications(pathway: string) {
    return authFetch(`${API_BASE}/communications/${encodeURIComponent(pathway)}`);
  },

  async fetchSchedules(pathway: string) {
    return authFetch(`${API_BASE}/schedules/${encodeURIComponent(pathway)}`);
  }
};
