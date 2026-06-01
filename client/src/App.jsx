import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ProtectedRoute  from './components/ProtectedRoute'

import LandingPage     from './pages/LandingPage'
import FAQ             from './pages/FAQ'
import SignInPage      from './pages/SignInPage'
import SignUpPage      from './pages/SignUpPage'

import ParentDashboard from './pages/ParentDashboard'
import ParentLessons   from './pages/ParentLessons'
import ParentReports   from './pages/ParentReports'
import ParentProfile   from './pages/ParentProfile'

import KidDashboard    from './pages/KidDashboard'
import KidLessons      from './pages/KidLessons'
import KidQuiz         from './pages/KidQuiz'
import KidProgress     from './pages/KidProgress'
import KidProfile      from './pages/KidProfile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"       element={<LandingPage />} />
        <Route path="/faq"    element={<FAQ />} />
        <Route path="/login"  element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Parent */}
        <Route path="/parent/dashboard" element={<ProtectedRoute role="parent"><ParentDashboard /></ProtectedRoute>} />
        <Route path="/parent/lessons"   element={<ProtectedRoute role="parent"><ParentLessons /></ProtectedRoute>} />
        <Route path="/parent/reports"   element={<ProtectedRoute role="parent"><ParentReports /></ProtectedRoute>} />
        <Route path="/parent/profile"   element={<ProtectedRoute role="parent"><ParentProfile /></ProtectedRoute>} />

        {/* Kid */}
        <Route path="/kid/dashboard"    element={<ProtectedRoute role="kid"><KidDashboard /></ProtectedRoute>} />
        <Route path="/kid/lessons"      element={<ProtectedRoute role="kid"><KidLessons /></ProtectedRoute>} />
        <Route path="/kid/quiz/:id"     element={<ProtectedRoute role="kid"><KidQuiz /></ProtectedRoute>} />
        <Route path="/kid/progress"     element={<ProtectedRoute role="kid"><KidProgress /></ProtectedRoute>} />
        <Route path="/kid/profile"      element={<ProtectedRoute role="kid"><KidProfile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
