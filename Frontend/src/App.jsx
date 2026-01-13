import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ParticipantLayout from './layouts/ParticipantLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import InstituteList from './pages/InstituteList';
import DepartmentList from './pages/DepartmentList';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import GroupList from './pages/GroupList';
import ParticipantList from './pages/ParticipantList';
import WinnerDisplay from './pages/WinnerDisplay';
import RegisterPage from './pages/RegisterPage';
import ResultPage from './pages/ResultPage';
import ParticipantEventBrowser from './pages/ParticipantEventBrowser';
import ParticipantDashboard from './pages/ParticipantDashboard';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public / Main Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/institutes" element={<InstituteList />} />
          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/winners" element={<WinnerDisplay />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'coordinator']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="institutes" element={<InstituteList />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="events" element={<EventList />} />
          <Route path="participants" element={<ParticipantList />} />
          <Route path="winners" element={<WinnerDisplay />} />
          <Route path="groups" element={<GroupList />} />
        </Route>

        {/* Participant Routes - Restricted View */}
        <Route
          path="/participant"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin', 'coordinator']}>
              <ParticipantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/participant/dashboard" replace />} />
          <Route path="dashboard" element={<ParticipantDashboard />} />
          <Route path="events" element={<ParticipantEventBrowser />} />
          <Route path="results" element={<ResultPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
