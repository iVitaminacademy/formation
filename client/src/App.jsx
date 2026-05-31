import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LandingPage     from './pages/LandingPage'

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
        <Route path="/" element={<LandingPage />} />

        {/* Parent */}
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/parent/lessons"   element={<ParentLessons />} />
        <Route path="/parent/reports"   element={<ParentReports />} />
        <Route path="/parent/profile"   element={<ParentProfile />} />

        {/* Kid */}
        <Route path="/kid/dashboard"    element={<KidDashboard />} />
        <Route path="/kid/lessons"      element={<KidLessons />} />
        <Route path="/kid/quiz/:id"     element={<KidQuiz />} />
        <Route path="/kid/progress"     element={<KidProgress />} />
        <Route path="/kid/profile"      element={<KidProfile />} />
      </Routes>
    </BrowserRouter>
  )
}
