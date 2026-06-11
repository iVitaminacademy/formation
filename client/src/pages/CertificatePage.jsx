import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'
import { useAuth } from '../context/AuthContext'
import { getProgressMap } from '../services/progress'
import { curriculum } from '../data/curriculum'

function computeModuleProgress(progressMap) {
  const topics = curriculum[1] || []
  return topics.map(topic => {
    const done  = topic.lessons.filter(l => progressMap[l.id]?.completed).length
    const total = topic.lessons.length
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0
    const complete = done === total && total > 0
    return { ...topic, done, total, pct, complete }
  })
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function CertificatePage() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const printRef = useRef(null)

  const [progressMap, setProgressMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [certDate, setCertDate] = useState(null)

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    getProgressMap(user.id)
      .then(map => {
        setProgressMap(map)
        // Use the most recent completion date as the certificate date
        const dates = Object.values(map).map(r => r?.last_date).filter(Boolean)
        if (dates.length) {
          const latest = dates.reduce((a, b) => (new Date(a) > new Date(b) ? a : b))
          setCertDate(latest)
        }
      })
      .catch(err => console.error('[CertificatePage]', err))
      .finally(() => setLoading(false))
  }, [user?.id])

  useEffect(() => {
    function onUpdate() {
      if (user?.id) getProgressMap(user.id).then(setProgressMap)
    }
    window.addEventListener('progressUpdated', onUpdate)
    return () => window.removeEventListener('progressUpdated', onUpdate)
  }, [user?.id])

  const modules   = computeModuleProgress(progressMap)
  const allDone   = modules.length > 0 && modules.every(m => m.complete)
  const doneCount = modules.filter(m => m.complete).length
  const name      = profile?.name || 'Médecin'

  function handlePrint() {
    window.print()
  }

  if (loading) {
    return (
      <KidLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">🎓</div>
            <p className="text-gray-400 font-semibold">Vérification de votre progression…</p>
          </div>
        </div>
      </KidLayout>
    )
  }

  if (!allDone) {
    return (
      <KidLayout>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="text-5xl mb-3">🎓</div>
            <h1 className="text-2xl font-extrabold text-gray-900">Certificat de mise en route</h1>
            <p className="text-gray-500 font-medium mt-2">
              Complétez les {modules.length} modules pour obtenir votre certificat.
            </p>
          </div>

          {/* Progress tracker */}
          <div className="bg-white rounded-3xl border-2 p-6 shadow-sm mb-6" style={{ borderColor: '#93C5FD' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-400">Votre progression</h2>
              <span className="text-sm font-extrabold" style={{ color: '#1E3A5F' }}>
                {doneCount} / {modules.length} modules
              </span>
            </div>

            {/* Overall bar */}
            <div className="mb-6">
              <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#EFF6FF' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(doneCount / modules.length) * 100}%`, background: 'linear-gradient(90deg,#1E3A5F,#1D4ED8)' }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {modules.map(module => (
                <div
                  key={module.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: module.complete ? module.border : '#E5E7EB',
                    backgroundColor: module.complete ? module.bg : '#FAFAFA',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: module.complete ? module.bg : '#F3F4F6' }}
                  >
                    {module.complete ? '✅' : module.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-extrabold text-gray-800">{module.name}</span>
                      <span className="text-xs font-bold" style={{ color: module.complete ? module.color : '#9CA3AF' }}>
                        {module.done}/{module.total}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: module.complete ? module.bg : '#E5E7EB' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${module.pct}%`, backgroundColor: module.color }}
                      />
                    </div>
                  </div>
                  {module.complete && (
                    <span className="text-xs font-extrabold px-2 py-1 rounded-lg text-white shrink-0" style={{ backgroundColor: module.color }}>
                      ✓ Complété
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/medecin/lessons')}
            className="w-full py-4 rounded-2xl text-white font-extrabold text-sm transition-all"
            style={{ backgroundColor: '#1E3A5F', boxShadow: '0 4px 16px rgba(30,58,95,0.30)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#162C48')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1E3A5F')}
          >
            Continuer ma formation →
          </button>
        </div>
      </KidLayout>
    )
  }

  // All modules complete — show the certificate
  return (
    <KidLayout>
      {/* Print action bar (hidden during print) */}
      <div className="no-print flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">🎓 Votre certificat</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Tous les modules complétés — félicitations !</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all"
          style={{ backgroundColor: '#1E3A5F' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#162C48')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1E3A5F')}
        >
          🖨 Imprimer / Télécharger
        </button>
      </div>

      {/* Certificate card */}
      <div
        ref={printRef}
        className="bg-white rounded-3xl mx-auto max-w-2xl overflow-hidden"
        style={{ boxShadow: '0 8px 40px rgba(30,58,95,0.18)', border: '2px solid #BFDBFE' }}
      >
        {/* Header band */}
        <div className="px-8 py-6 text-white" style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #1D4ED8 100%)' }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl bg-white/20">💉</div>
            <div>
              <div className="text-xl font-extrabold tracking-tight">Ivitaminacademy</div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-blue-200">Guide pratique médecin</div>
            </div>
          </div>
        </div>

        {/* Certificate body */}
        <div className="px-8 py-8 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-gray-400 mb-3">
            Certificat de mise en route
          </p>
          <p className="text-lg font-semibold text-gray-500 mb-2">Ce certificat est décerné à</p>
          <h2
            className="text-4xl font-extrabold mb-2 py-2 border-b-2 border-dashed inline-block px-6"
            style={{ color: '#1E3A5F', borderColor: '#BFDBFE' }}
          >
            {name}
          </h2>
          <p className="mt-4 text-base font-medium text-gray-600 max-w-md mx-auto leading-relaxed">
            pour avoir complété avec succès la formation
            <br />
            <span className="font-extrabold" style={{ color: '#1E3A5F' }}>
              Perfusions de vitamines IV — Guide pratique médecin
            </span>
          </p>

          {certDate && (
            <p className="mt-4 text-sm text-gray-400 font-semibold">
              Le {formatDate(certDate)}
            </p>
          )}

          {/* Module list */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            {modules.map(module => (
              <div
                key={module.id}
                className="flex items-center gap-2.5 p-3 rounded-xl"
                style={{ backgroundColor: module.bg, border: `1px solid ${module.border}` }}
              >
                <span className="text-lg">{module.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-extrabold truncate" style={{ color: module.color }}>{module.name}</div>
                  <div className="text-[10px] text-gray-400 font-semibold">{module.total} leçons ✓</div>
                </div>
                <span className="text-green-600 font-extrabold text-sm">✓</span>
              </div>
            ))}
          </div>

          {/* Signature line */}
          <div className="mt-8 flex justify-center gap-16">
            <div className="text-center">
              <div className="w-32 border-b-2 border-gray-300 mb-1" />
              <div className="text-xs text-gray-400 font-semibold">Médecin formé</div>
            </div>
            <div className="text-center">
              <div className="w-32 border-b-2 border-gray-300 mb-1" />
              <div className="text-xs text-gray-400 font-semibold">Superviseur</div>
            </div>
          </div>

          {/* Disclaimer */}
        
        </div>

        {/* Footer band */}
        <div className="px-8 py-4 border-t text-center" style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
          <p className="text-xs font-semibold" style={{ color: '#1E3A5F' }}>
            Ivitaminacademy · Perfusions de vitamines IV · Guide pratique médecin · 2026
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </KidLayout>
  )
}
