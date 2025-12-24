import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import AdminDashboard from './pages/Admin/Dashboard'
import UserManagement from './pages/Admin/UserManagement'
import MentorManagement from './pages/Admin/MentorManagement'
import PackageManagement from './pages/Admin/PackageManagement'
import FeedbackModeration from './pages/Admin/FeedbackModeration'
import LearnerSupport from './pages/Admin/LearnerSupport'
import PolicyManagement from './pages/Admin/PolicyManagement'
import PurchaseHistory from './pages/Admin/PurchaseHistory'
import Reports from './pages/Admin/Reports'
import Challenges from './pages/Learner/Challenges'
import { ADMIN_ROUTES, AUTH_ROUTES, LEARNER_ROUTES } from './routes/paths'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path={AUTH_ROUTES.LOGIN} element={<Login />} />
        <Route path={AUTH_ROUTES.REGISTER} element={<Register />} />

        {/* Admin Routes */}
        <Route path={ADMIN_ROUTES.DASHBOARD} element={<AdminDashboard />} />
        <Route path={ADMIN_ROUTES.USER_MANAGEMENT} element={<UserManagement />} />
        <Route path={ADMIN_ROUTES.MENTOR_MANAGEMENT} element={<MentorManagement />} />
        <Route path={ADMIN_ROUTES.PACKAGE_MANAGEMENT} element={<PackageManagement />} />
        <Route path={ADMIN_ROUTES.FEEDBACK_MODERATION} element={<FeedbackModeration />} />
        <Route path={ADMIN_ROUTES.LEARNER_SUPPORT} element={<LearnerSupport />} />
        <Route path={ADMIN_ROUTES.POLICY_MANAGEMENT} element={<PolicyManagement />} />
        <Route path={ADMIN_ROUTES.REPORTS} element={<Reports />} />

        {/* Learner Routes */}
        <Route path={LEARNER_ROUTES.CHALLENGES} element={<Challenges />} />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to={AUTH_ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
