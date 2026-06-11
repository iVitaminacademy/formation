import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import HowItWorks from './pages/HowItWorks'
import FAQ from './pages/FAQ'
import PrivacyTerms from './pages/PrivacyTerms'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'

import KidDashboard from './pages/KidDashboard'
import KidLessons from './pages/KidLessons'
import KidLessonView from './pages/KidLessonView'
import KidQuiz from './pages/KidQuiz'
import KidProgress from './pages/KidProgress'
import KidProfile from './pages/KidProfile'
import CertificatePage from './pages/CertificatePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/how" element={<HowItWorks />} />
        <Route path="/privacy" element={<PrivacyTerms />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboardPage /></ProtectedRoute>} />

        {/* Médecin uniquement */}
        <Route path="/medecin/dashboard" element={<ProtectedRoute role="medecin"><KidDashboard /></ProtectedRoute>} />
        <Route path="/medecin/lessons" element={<ProtectedRoute role="medecin"><KidLessons /></ProtectedRoute>} />
        <Route path="/medecin/lesson/:id" element={<ProtectedRoute role="medecin"><KidLessonView /></ProtectedRoute>} />
        <Route path="/medecin/quiz/:id" element={<ProtectedRoute role="medecin"><KidQuiz /></ProtectedRoute>} />
        <Route path="/medecin/progress" element={<ProtectedRoute role="medecin"><KidProgress /></ProtectedRoute>} />
        <Route path="/medecin/profile" element={<ProtectedRoute role="medecin"><KidProfile /></ProtectedRoute>} />
        <Route path="/medecin/certificate" element={<ProtectedRoute role="medecin"><CertificatePage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
