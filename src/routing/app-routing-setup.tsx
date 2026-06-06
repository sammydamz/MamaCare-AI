import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { Demo1Layout } from '@/layouts/demo1/layout';
import { currentUserRole } from '@/lib/mamacare/constants';
import {
  ConsultationsPage,
  DashboardPage,
  FacilitiesPage,
  AnalyticsPage,
  PatientsPage,
  PatientProfilePage,
  ReferralsPage,
  SettingsPage,
} from '@/pages/mamacare';
import { Navigate, Route, Routes } from 'react-router';

export function AppRoutingSetup() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/:id" element={<PatientProfilePage />} />
          <Route path="/consultations" element={<ConsultationsPage />} />
          <Route path="/referrals" element={<ReferralsPage />} />
          <Route path="/analytics" element={currentUserRole === 'Provider' ? <AnalyticsPage /> : <Navigate to="/" />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="error/*" element={<ErrorRouting />} />
      <Route path="auth/*" element={<AuthRouting />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
}
