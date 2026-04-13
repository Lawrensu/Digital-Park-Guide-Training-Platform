import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CourseListPage from './pages/CourseListPage'
import LessonPage from './pages/LessonPage'
import QuizPage from './pages/QuizPage'
import CertificationPage from './pages/CertificationPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import RegistrationsPage from './pages/RegistrationsPage'
import RegistrationDetailPage from './pages/RegistrationDetailPage'
import ModulesPage from './pages/ModulesPage'
import NewModulePage from './pages/NewModulePage'
import EditModulePage from './pages/EditModulePage'
import GuidesPage from './pages/GuidesPage'
import GuideDetailPage from './pages/GuideDetailPage'
import QuizReviewsPage from './pages/QuizReviewsPage'
import QuizReviewDetailPage from './pages/QuizReviewDetailPage'
import AdminCertificationsPage from './pages/AdminCertificationsPage'
import AdminIssueCertificationPage from './pages/AdminIssueCertificationPage'
import AdminIoTAlertsPage from './pages/AdminIoTAlertsPage'
import AdminIoTAlertDetailPage from './pages/AdminIoTAlertDetailPage'
import AdminNotificationsPage from './pages/AdminNotificationsPage'
import AdminSettingsPage from './pages/AdminSettingsPage'
import AdminProtected from './components/AdminProtected'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes (Protected) */}
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/registrations" element={<RegistrationsPage />} />
        <Route path="/registration/:id" element={<RegistrationDetailPage />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/module/new" element={<NewModulePage />} />
        <Route path="/module/edit/:id" element={<EditModulePage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/guide/:id" element={<GuideDetailPage />} />
        <Route path="/quiz-reviews" element={<QuizReviewsPage />} />
        <Route path="/quiz-review/:id" element={<QuizReviewDetailPage />} />
        <Route path="/certificates-admin" element={<AdminCertificationsPage />} />
        <Route path="/issue-certificate/:id" element={<AdminIssueCertificationPage />} />
        <Route path="/iot-alerts" element={<AdminIoTAlertsPage />} />
        <Route path="/iot-alert/:id" element={<AdminIoTAlertDetailPage />} />
        <Route path="/notifications-admin" element={<AdminNotificationsPage />} />
        <Route path="/settings-admin" element={<AdminSettingsPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/lesson/:courseId" element={<LessonPage />} />
        <Route path="/quiz/:courseId" element={<QuizPage />} />
        <Route path="/certificates" element={<CertificationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  )
}

export default App
