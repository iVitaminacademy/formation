import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { verifyCertificate } from '../services/certificates'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function CertificateVerifyPage() {
  const { code } = useParams()
  const [cert,    setCert]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    if (!code) { setInvalid(true); setLoading(false); return }
    verifyCertificate(code)
      .then(data => {
        if (data?.valid) setCert(data)
        else setInvalid(true)
      })
      .catch(() => setInvalid(true))
      .finally(() => setLoading(false))
  }, [code])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' }}
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="text-3xl font-extrabold tracking-tight" style={{ color: '#1E3A5F' }}>
          💉 iVitaminacademy
        </div>
        <div className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: '#64748B' }}>
          Vérification de certificat
        </div>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ boxShadow: '0 8px 40px rgba(30,58,95,0.15)', border: '2px solid #BFDBFE', backgroundColor: '#fff' }}
      >
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="text-4xl animate-pulse">🔍</div>
            <p className="text-sm font-semibold text-gray-400">Vérification en cours…</p>
          </div>
        )}

        {!loading && invalid && (
          <>
            <div className="px-8 py-6" style={{ background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-2xl">❌</div>
                <div>
                  <div className="font-extrabold text-red-700 text-lg">Certificat invalide</div>
                  <div className="text-xs font-semibold text-red-400">Ce code n'est pas reconnu</div>
                </div>
              </div>
            </div>
            <div className="px-8 py-6">
              <p className="text-sm text-gray-500 leading-relaxed">
                Le certificat associé à ce code QR est introuvable ou n'a pas encore été émis.
                S'il s'agit d'une erreur, veuillez contacter l'administrateur.
              </p>
            </div>
          </>
        )}

        {!loading && cert && (
          <>
            {/* Success header */}
            <div className="px-8 py-6 text-white" style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #1D4ED8 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl">✅</div>
                <div>
                  <div className="font-extrabold text-white text-lg">Certificat authentique</div>
                  <div className="text-xs font-semibold text-blue-200">Émis par iVitaminacademy</div>
                </div>
              </div>
            </div>

            {/* Certificate details */}
            <div className="px-8 py-7">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🏆</div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gray-400 mb-2">
                  Certificat de réussite décerné à
                </p>
                <h2 className="text-3xl font-extrabold" style={{ color: '#1E3A5F' }}>
                  {cert.name}
                </h2>
              </div>

              <div
                className="rounded-2xl p-5 mb-5 text-center"
                style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-sky-500 mb-1">Formation validée</p>
                <p className="text-sm font-extrabold" style={{ color: '#1E3A5F' }}>
                  {cert.formation}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  className="flex flex-col items-center justify-center p-4 rounded-2xl"
                  style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC' }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-green-500 mb-1">Score obtenu</p>
                  <p className="text-2xl font-extrabold text-green-700">{cert.score_pct}%</p>
                </div>
                <div
                  className="flex flex-col items-center justify-center p-4 rounded-2xl"
                  style={{ backgroundColor: '#EFF6FF', border: '1px solid #93C5FD' }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#3B82F6' }}>
                    Délivré le
                  </p>
                  <p className="text-sm font-extrabold text-center mt-1" style={{ color: '#1E3A5F' }}>
                    {formatDate(cert.issued_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-8 py-4 border-t text-center"
              style={{ backgroundColor: '#F8FAFC', borderColor: '#BFDBFE' }}
            >
              <p className="text-[10px] font-semibold" style={{ color: '#64748B' }}>
                iVitaminacademy · Ce document est une preuve d'obtention officielle · 2026
              </p>
            </div>
          </>
        )}
      </div>

      <p className="mt-6 text-[11px] font-semibold text-center" style={{ color: '#94A3B8' }}>
        Vérification sécurisée · <a href={window.location.origin} className="underline">{window.location.host}</a>
      </p>
    </div>
  )
}
