import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '../components/layout/AppLayout';
import { Login } from '../pages/Auth/Login';
import { AuthorityDashboard } from '../pages/Authority/AuthorityDashboard';
import { DocumentsDashboard } from '../pages/Documents/DocumentsDashboard';
import { FlightDetails } from '../pages/Flights/FlightDetails';
import { FlightsDashboard } from '../pages/Flights/FlightsDashboard';
import { SettingsLanding } from '../pages/Settings/SettingsLanding';
import { NotFound } from '../pages/Misc/NotFound';
import { Unauthorized } from '../pages/Misc/Unauthorized';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/flights" replace />} />
            <Route path="flights">
              <Route index element={<FlightsDashboard />} />
              <Route path=":flightId" element={<FlightDetails />} />
            </Route>

            <Route element={<ProtectedRoute roles={['VictorAdmin', 'OperatorAdmin']} />}>
              <Route path="documents" element={<DocumentsDashboard />} />
            </Route>

            <Route element={<ProtectedRoute roles={['VictorAdmin', 'AuthorityUser']} />}>
              <Route path="authority" element={<AuthorityDashboard />} />
            </Route>

            <Route element={<ProtectedRoute roles={['VictorAdmin']} />}>
              <Route path="settings" element={<SettingsLanding />} />
            </Route>

            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};


