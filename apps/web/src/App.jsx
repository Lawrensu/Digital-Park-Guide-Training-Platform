import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/login/login'
import Register from './components/register/register'

// import admin
import Dashboard from './pages/admin/dashboard/dashboard'
import Module from './pages/admin/module/module'
import RegistrationPage from './pages/admin/registration/registration'
import QuizReview from './pages/admin/quizzes/quizzes'
import GuidePage from './pages/admin/guide/guide'
import Certification from './pages/admin/certification/certification'
import IoTAlert from './pages/admin/iotalert/iotalert'
import Notification from './pages/admin/notification/notification'
import Setting from './pages/admin/setting/setting'
import RegistrationDetails from './pages/admin/registrationdetails/registrationdetails'
import ModuleEdit from './pages/admin/moduleedit/moduleedit'
import ContentBuild from './pages/admin/contentbuild/contentbuild'
import CertIssue from './pages/admin/certissue/certissue'
import GuideDetail from './pages/admin/guidedetail/guidedetail'
import QuizGrading from './pages/admin/quizgrading/quizgrading'
import IoTAlertDetail from './pages/admin/iotalertdetail/iotalertdetail'

// import park guide
import GuideDashboard from './pages/park_guide/guidedashboard/guidedashboard'
import GuideQuiz from './pages/park_guide/guidequiz/guidequiz'
import GuideBadge from './pages/park_guide/badge/badge'
import GuideNotification from './pages/park_guide/guidenotification/guidenotification'
import GuideCertifications from './pages/park_guide/guidecertifications/guidecertifications'
import GuideViewCert from './pages/park_guide/guideviewcert/guideviewcert'
import GuideProfile from './pages/park_guide/guideprofile/guideprofile'
import GuideModule from './pages/park_guide/guidemodule/guidemodule'
import GuideQuizList from './pages/park_guide/guidequizlist/guidequizlist'
import GuideModuleDetail from './pages/park_guide/guidemoduledetail/guidemoduledetail'

// for rbac
import { AuthProvider } from './rbac/AuthProvider';
import { ProtectedRoute } from './rbac/protectedroute';

function App() {
  return (
      <Router>
        <AuthProvider>
          <Routes>
            //Public Routes
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Navigate to="/" replace />} />

            <Route path="/register" element={<Register />} />

            // admin routes          
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><Dashboard /></ProtectedRoute>
            } />
            <Route path="/registrations" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><RegistrationPage /></ProtectedRoute>
            } />
            <Route path="/quizzes" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><QuizReview /></ProtectedRoute>
            } />
            <Route path="/guides" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><GuidePage /></ProtectedRoute>
            } />
            <Route path="/certifications" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><Certification /></ProtectedRoute>
            } />
            <Route path="/modules" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><Module /></ProtectedRoute>
            } />
            <Route path="/iot-alerts" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><IoTAlert /></ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><Notification /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><Setting /></ProtectedRoute>
            } />
            <Route path="/registration/:id" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><RegistrationDetails /></ProtectedRoute>
            } />
            <Route path="/modules/edit/:id" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><ModuleEdit /></ProtectedRoute>
            } />
            <Route path="/modules/content/:id" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><ContentBuild /></ProtectedRoute>
            } />
            <Route path="/certifications/issue/:id" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><CertIssue /></ProtectedRoute>
            } />
            <Route path="/guides/:id" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><GuideDetail /></ProtectedRoute>
            } />
            <Route path="/quizzes/grading/:id" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><QuizGrading /></ProtectedRoute>
            } />
            <Route path="/iot-alerts/:id" element={
              <ProtectedRoute allowedRoles={['ADMIN']}><IoTAlertDetail /></ProtectedRoute>
            } />

            // park guide routes
            <Route path="/guidedashboard" element={
              <ProtectedRoute allowedRoles={['GUIDE']}><GuideDashboard /></ProtectedRoute>
            } /> 
            <Route path="/guidequiz" element={
              <ProtectedRoute allowedRoles={['GUIDE']}><GuideQuiz /></ProtectedRoute>
            } /> 
            <Route path="/badge" element={
              <ProtectedRoute allowedRoles={['GUIDE']}><GuideBadge /></ProtectedRoute>
            } />
            <Route path="/guidenotification" element={
              <ProtectedRoute allowedRoles={['GUIDE']}><GuideNotification /></ProtectedRoute> 
            } />
            <Route path="/guidecertifications" element={
              <ProtectedRoute allowedRoles={['GUIDE']}><GuideCertifications /></ProtectedRoute>
            } />
            <Route path="/guideviewcert" element={
              <ProtectedRoute allowedRoles={['GUIDE']}><GuideViewCert /></ProtectedRoute>
            } />
            <Route path="/guideprofile" element={
              <ProtectedRoute allowedRoles={['GUIDE']}><GuideProfile /></ProtectedRoute>
            } />
            <Route path="/guidemodule" element={
              <ProtectedRoute allowedRoles={['GUIDE']}><GuideModule /></ProtectedRoute>
            } />
            <Route path="/guidequizlist" element={
              <ProtectedRoute allowedRoles={['GUIDE']}><GuideQuizList /></ProtectedRoute>
            } />
            <Route path="/guidemoduledetail" element={
              <ProtectedRoute allowedRoles={['GUIDE']}><GuideModuleDetail /></ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </Router>
  )
}

export default App;