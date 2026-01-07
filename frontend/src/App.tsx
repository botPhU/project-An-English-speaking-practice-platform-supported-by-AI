import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import UpdateProfile from './pages/Auth/UpdateProfile'
import AdminDashboard from './pages/Admin/Dashboard'
import UserManagement from './pages/Admin/UserManagement'
import MentorManagement from './pages/Admin/MentorManagement'
import PackageManagement from './pages/Admin/PackageManagement'
import FeedbackModeration from './pages/Admin/FeedbackModeration'
import LearnerSupport from './pages/Admin/LearnerSupport'
import PolicyManagement from './pages/Admin/PolicyManagement'
import Reports from './pages/Admin/Reports'
import AdminProfile from './pages/Admin/AdminProfile'
import AdminSettings from './pages/Admin/settings'
// Learner Pages
import LearnerDashboard from './pages/Learner/Dashboard'
import Progress from './pages/Learner/Progress'
import Packages from './pages/Learner/Packages'
import LearnerProfile from './pages/Learner/Profile'
import TopicSelection from './pages/Learner/TopicSelection'
import Community from './pages/Learner/Community'
import Challenges from './pages/Learner/Challenges'
import AIPractice from './pages/Learner/AIPractice'
// Mentor Pages
import MentorDashboard from './pages/Mentor/Dashboard'
import LearnerAssessment from './pages/Mentor/LearnerAssessment'
import Resources from './pages/Mentor/Resources'
import FeedbackSession from './pages/Mentor/FeedbackSession'
import ConversationTopics from './pages/Mentor/ConversationTopics'
import ExperienceSharing from './pages/Mentor/ExperienceSharing'
import RealLifeSituations from './pages/Mentor/RealLifeSituations'
import CollocationsIdioms from './pages/Mentor/CollocationsIdioms'
import BuildConfidence from './pages/Mentor/BuildConfidence'
import WordUsageCorrection from './pages/Mentor/WordUsageCorrection'
import PronunciationErrors from './pages/Mentor/PronunciationErrors'
import GrammarErrors from './pages/Mentor/GrammarErrors'
import ClearExpression from './pages/Mentor/ClearExpression'
import MentorProfile from './pages/Mentor/Profile'
import { ADMIN_ROUTES, AUTH_ROUTES, LEARNER_ROUTES, MENTOR_ROUTES } from './routes/paths'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path={AUTH_ROUTES.LOGIN} element={<Login />} />
        <Route path={AUTH_ROUTES.REGISTER} element={<Register />} />
        <Route path={AUTH_ROUTES.COMPLETE_PROFILE} element={<UpdateProfile />} />

        {/* Admin Routes */}
        <Route path={ADMIN_ROUTES.DASHBOARD} element={<AdminDashboard />} />
        <Route path={ADMIN_ROUTES.USER_MANAGEMENT} element={<UserManagement />} />
        <Route path={ADMIN_ROUTES.MENTOR_MANAGEMENT} element={<MentorManagement />} />
        <Route path={ADMIN_ROUTES.PACKAGE_MANAGEMENT} element={<PackageManagement />} />
        <Route path={ADMIN_ROUTES.FEEDBACK_MODERATION} element={<FeedbackModeration />} />
        <Route path={ADMIN_ROUTES.LEARNER_SUPPORT} element={<LearnerSupport />} />
        <Route path={ADMIN_ROUTES.POLICY_MANAGEMENT} element={<PolicyManagement />} />
        <Route path={ADMIN_ROUTES.REPORTS} element={<Reports />} />
        <Route path={ADMIN_ROUTES.PROFILE} element={<AdminProfile />} />
        <Route path={ADMIN_ROUTES.SETTINGS} element={<AdminSettings />} />

        {/* Learner Routes - Aligned with Use Case Diagram */}
        <Route path={LEARNER_ROUTES.DASHBOARD} element={<LearnerDashboard />} />
        <Route path={LEARNER_ROUTES.SPEAKING_PRACTICE} element={<TopicSelection />} />
        <Route path={LEARNER_ROUTES.AI_PRACTICE} element={<AIPractice />} />
        <Route path={LEARNER_ROUTES.CHALLENGES} element={<Challenges />} />
        <Route path={LEARNER_ROUTES.COMMUNITY} element={<Community />} />
        <Route path={LEARNER_ROUTES.PROGRESS} element={<Progress />} />
        <Route path={LEARNER_ROUTES.PACKAGES} element={<Packages />} />
        <Route path={LEARNER_ROUTES.PROFILE} element={<LearnerProfile />} />

        {/* Mentor Routes */}
        <Route path={MENTOR_ROUTES.DASHBOARD} element={<MentorDashboard />} />
        <Route path={MENTOR_ROUTES.LEARNER_ASSESSMENT} element={<LearnerAssessment />} />
        <Route path={MENTOR_ROUTES.RESOURCES} element={<Resources />} />
        <Route path={MENTOR_ROUTES.FEEDBACK_SESSION} element={<FeedbackSession />} />
        <Route path={MENTOR_ROUTES.CONVERSATION_TOPICS} element={<ConversationTopics />} />
        <Route path={MENTOR_ROUTES.EXPERIENCE_SHARING} element={<ExperienceSharing />} />
        <Route path={MENTOR_ROUTES.REAL_LIFE_SITUATIONS} element={<RealLifeSituations />} />
        <Route path={MENTOR_ROUTES.COLLOCATIONS_IDIOMS} element={<CollocationsIdioms />} />
        <Route path={MENTOR_ROUTES.BUILD_CONFIDENCE} element={<BuildConfidence />} />
        <Route path={MENTOR_ROUTES.WORD_USAGE} element={<WordUsageCorrection />} />
        <Route path={MENTOR_ROUTES.PRONUNCIATION_ERRORS} element={<PronunciationErrors />} />
        <Route path={MENTOR_ROUTES.GRAMMAR_ERRORS} element={<GrammarErrors />} />
        <Route path={MENTOR_ROUTES.CLEAR_EXPRESSION} element={<ClearExpression />} />
        <Route path={MENTOR_ROUTES.PROFILE} element={<MentorProfile />} />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to={AUTH_ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
