import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login/Login'
import Register from './pages/register/Register'

import Dashboard from './pages/admin/Dashboard/Dashboard'
import Modules from './pages/admin/Module/Module'
import RegistrationPage from './pages/admin/Registration/Registration'
import QuizReviews from './pages/admin/Quizzes/Quizzes'
import GuidePage from './pages/admin/Guide/Guide'
import Certifications from './pages/admin/Certification/Certification'
import IoTAlerts from './pages/admin/IoTAlert/IoTAlert'
import Notifications from './pages/admin/Notification/Notification'
import Settings from './pages/admin/Setting/Setting'
import SettingsStations from './pages/admin/SettingsStations/SettingsStations'
import RegistrationDetails from './pages/admin/RegistrationDetails/RegistrationDetails'
import ModuleEdit from './pages/admin/ModuleEdit/ModuleEdit'
import ContentBuild from './pages/admin/ContentBuild/ContentBuild'
import CertIssue from './pages/admin/CertIssue/CertIssue'
import GuideDetail from './pages/admin/GuideDetail/GuideDetail'
import QuizGrading from './pages/admin/QuizGrading/QuizGrading'
import IoTAlertDetail from './pages/admin/IoTAlertDetail/IoTAlertDetail'

import GuideDashboard from './pages/park_guide/GuideDashboard/GuideDashboard'
import GuideQuiz from './pages/park_guide/GuideQuiz/GuideQuiz'
import GuideBadge from './pages/park_guide/Badge/Badge'
import GuideNotification from './pages/park_guide/GuideNotification/GuideNotification'
import GuideCertifications from './pages/park_guide/GuideCertifications/GuideCertifications'
import GuideViewCert from './pages/park_guide/GuideViewCert/GuideViewCert'
import GuideProfile from './pages/park_guide/GuideProfile/GuideProfile'
import GuideModules from './pages/park_guide/GuideModule/GuideModule'
import GuideQuizList from './pages/park_guide/GuideQuizList/GuideQuizList'
import GuideModuleDetail from './pages/park_guide/GuideModuleDetail/GuideModuleDetail'
import GuideContentViewer from './pages/park_guide/GuideContentViewer/GuideContentViewer'
import GuideQuizResult from './pages/park_guide/GuideQuizResult/GuideQuizResult'

import { AuthProvider } from './rbac/AuthProvider'
import { ProtectedRoute } from './rbac/ProtectedRoute'

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Navigate to="/" replace />} />
                    <Route path="/register" element={<Register />} />

                    {/* Admin routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><Dashboard /></ProtectedRoute>
                    } />
                    <Route path="/registrations" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><RegistrationPage /></ProtectedRoute>
                    } />
                    <Route path="/registrations/:id" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><RegistrationDetails /></ProtectedRoute>
                    } />
                    <Route path="/modules" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><Modules /></ProtectedRoute>
                    } />
                    <Route path="/modules/new" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><ModuleEdit /></ProtectedRoute>
                    } />
                    <Route path="/modules/:id/edit" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><ModuleEdit /></ProtectedRoute>
                    } />
                    <Route path="/modules/:id/content" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><ContentBuild /></ProtectedRoute>
                    } />
                    <Route path="/guides" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><GuidePage /></ProtectedRoute>
                    } />
                    <Route path="/guides/:id" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><GuideDetail /></ProtectedRoute>
                    } />
                    <Route path="/quiz-reviews" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><QuizReviews /></ProtectedRoute>
                    } />
                    <Route path="/quiz-reviews/:attemptId" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><QuizGrading /></ProtectedRoute>
                    } />
                    <Route path="/certifications" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><Certifications /></ProtectedRoute>
                    } />
                    <Route path="/certifications/issue/:attemptId" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><CertIssue /></ProtectedRoute>
                    } />
                    <Route path="/iot-alerts" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><IoTAlerts /></ProtectedRoute>
                    } />
                    <Route path="/iot-alerts/:alertId" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><IoTAlertDetail /></ProtectedRoute>
                    } />
                    <Route path="/notifications" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><Notifications /></ProtectedRoute>
                    } />
                    <Route path="/settings/admins" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><Settings /></ProtectedRoute>
                    } />
                    <Route path="/settings/stations" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}><SettingsStations /></ProtectedRoute>
                    } />

                    {/* Park Guide routes — all nested under /guide/ */}
                    <Route path="/guide/home" element={
                        <ProtectedRoute allowedRoles={['GUIDE']}><GuideDashboard /></ProtectedRoute>
                    } />
                    <Route path="/guide/modules" element={
                        <ProtectedRoute allowedRoles={['GUIDE']}><GuideModules /></ProtectedRoute>
                    } />
                    <Route path="/guide/modules/:id" element={
                        <ProtectedRoute allowedRoles={['GUIDE']}><GuideModuleDetail /></ProtectedRoute>
                    } />
                    <Route path="/guide/modules/:id/content/:itemId" element={
                        <ProtectedRoute allowedRoles={['GUIDE']}><GuideContentViewer /></ProtectedRoute>
                    } />
                    <Route path="/guide/quizzes" element={
                        <ProtectedRoute allowedRoles={['GUIDE']}><GuideQuizList /></ProtectedRoute>
                    } />
                    <Route path="/guide/quiz/:quizId" element={
                        <ProtectedRoute allowedRoles={['GUIDE']}><GuideQuiz /></ProtectedRoute>
                    } />
                    <Route path="/guide/quiz/:quizId/result" element={
                        <ProtectedRoute allowedRoles={['GUIDE']}><GuideQuizResult /></ProtectedRoute>
                    } />
                    <Route path="/guide/certifications" element={
                        <ProtectedRoute allowedRoles={['GUIDE']}><GuideCertifications /></ProtectedRoute>
                    } />
                    <Route path="/guide/certifications/:id" element={
                        <ProtectedRoute allowedRoles={['GUIDE']}><GuideViewCert /></ProtectedRoute>
                    } />
                    <Route path="/guide/badges" element={
                        <ProtectedRoute allowedRoles={['GUIDE']}><GuideBadge /></ProtectedRoute>
                    } />
                    <Route path="/guide/notifications" element={
                        <ProtectedRoute allowedRoles={['GUIDE']}><GuideNotification /></ProtectedRoute>
                    } />
                    <Route path="/guide/profile" element={
                        <ProtectedRoute allowedRoles={['GUIDE']}><GuideProfile /></ProtectedRoute>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default App
