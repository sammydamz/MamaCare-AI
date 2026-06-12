import type { Patient, Consultation, Referral, Facility, ActionLogEntry, Pathway } from './types';

const API_BASE = '/api';

export const mamacareApi = {
  async fetchDashboard() {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
  },

  async fetchPatients(): Promise<Patient[]> {
    const res = await fetch(`${API_BASE}/patients`);
    if (!res.ok) throw new Error('Failed to fetch patients');
    return res.json();
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
    const res = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to register patient');
    return res.json();
  },

  async recordVitals(
    patientId: string,
    data: {
      bloodPressure?: string;
      kickCount?: number;
      copingIndex?: number;
    }
  ): Promise<{ success: boolean; riskLevel: string }> {
    const res = await fetch(`${API_BASE}/patients/${patientId}/vitals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to record vitals');
    return res.json();
  },

  async logVisit(
    patientId: string,
    data: {
      visitType: string;
      notes: string;
    }
  ): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/patients/${patientId}/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to log visit');
    return res.json();
  },

  async fetchConsultations(): Promise<Consultation[]> {
    const res = await fetch(`${API_BASE}/consultations`);
    if (!res.ok) throw new Error('Failed to fetch consultations');
    return res.json();
  },

  async recordConsultation(data: {
    patientId: string;
    transcript: Array<{ speaker: 'AI' | 'Mother' | 'Patient'; text: string }>;
    language: string;
  }): Promise<{ success: boolean; riskLevel: string; referralTriggered: boolean }> {
    const res = await fetch(`${API_BASE}/consultations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to record consultation');
    return res.json();
  },

  async fetchReferrals(): Promise<Referral[]> {
    const res = await fetch(`${API_BASE}/referrals`);
    if (!res.ok) throw new Error('Failed to fetch referrals');
    return res.json();
  },

  async createReferral(data: {
    patientId: string;
    facilityId: string;
    reason: string;
  }): Promise<{ id: string; success: boolean }> {
    const res = await fetch(`${API_BASE}/referrals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create referral');
    return res.json();
  },

  async updateReferralStatus(
    referralId: string,
    data: {
      status: string;
      outcome?: string;
      note?: string;
    }
  ): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/referrals/${referralId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update referral status');
    return res.json();
  },

  async fetchFacilities(): Promise<Facility[]> {
    const res = await fetch(`${API_BASE}/facilities`);
    if (!res.ok) throw new Error('Failed to fetch facilities');
    return res.json();
  },

  async addFacility(data: {
    name: string;
    distance: string;
    hours: string;
    services: string[];
    phone: string;
    address: string;
  }): Promise<Facility> {
    const res = await fetch(`${API_BASE}/facilities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add facility');
    return res.json();
  },

  async fetchActionLogs(): Promise<ActionLogEntry[]> {
    const res = await fetch(`${API_BASE}/action-logs`);
    if (!res.ok) throw new Error('Failed to fetch action logs');
    return res.json();
  },

  async fetchAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics data');
    return res.json();
  },

  async fetchNotifications() {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationAsRead(id: string) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to mark notification as read');
    return res.json();
  }
};
