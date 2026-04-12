import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DashboardPage from './pages/DashboardPage';
import CourseListPage from './pages/CourseListPage';
import LessonPage from './pages/LessonPage';
import QuizPage from './pages/QuizPage';
import CertificationPage from './pages/CertificationPage';
import './index.css';

// Protected route component
function ProtectedRoute({ element, role }) {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  
  return element;
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/registration-success" element={<RegistrationSuccessPage />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboardPage />} role="admin" />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
      <Route path="/courses" element={<ProtectedRoute element={<CourseListPage />} />} />
      <Route path="/lesson" element={<ProtectedRoute element={<LessonPage />} />} />
      <Route path="/quiz" element={<ProtectedRoute element={<QuizPage />} />} />
      <Route path="/certificates" element={<ProtectedRoute element={<CertificationPage />} />} />

      {/* Catch all - redirect to dashboard if authenticated, else to login */}
      <Route
        path="*"
        element={
          localStorage.getItem('user') ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}
