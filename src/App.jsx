import { useState, useCallback } from 'react'
import SideBar from './SideBar.jsx'
import AddChart from './AddChart.jsx'
import ChartChart from './ChartChart.jsx'
import PopupChart from './PopupChart.jsx'
import Dashboard from './pages/Dashboard.jsx'
import FAQ from './pages/FAQ.jsx'
import AuthModal from './components/AuthModal.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import Toast from './components/Toast.jsx'
import OnboardingModal from './components/OnboardingModal.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { usePills } from './hooks/usePills.js'

let _toastId = 0

export default function App() {
  const { user, login, onboarded, onboardedLoading, markOnboarded } = useAuth()
  const { pills, addPill, deletePill, updatePill, refresh } = usePills()
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [editingPill, setEditingPill] = useState(null)
  const [authModal, setAuthModal] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('chart')
  const [toasts, setToasts] = useState([])
  const [waBanner, setWaBanner] = useState(() =>
    localStorage.getItem('pillpal_whatsapp_skipped') === 'true'
  )

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++_toastId
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  function handleAddClick() {
    if (!user) { setAuthModal('login'); return }
    setEditingPill(null)
    setIsPopupOpen(true)
  }

  function handleEditClick(pill) {
    if (!user) { setAuthModal('login'); return }
    setEditingPill(pill)
    setIsPopupOpen(true)
  }

  async function handleLogin(credential) {
    await login(credential)
    setTimeout(refresh, 100)
  }

  // Show a spinner while we're checking onboarding status from the backend
  if (user && onboardedLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 text-primary animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-xs text-slate-500">Loading your account…</p>
        </div>
      </div>
    )
  }

  // Show onboarding if user is logged in but hasn't completed setup
  if (user && !onboarded) {
    return <OnboardingModal onFinish={markOnboarded} />
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <SideBar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onOpenAuth={(mode) => setAuthModal(mode)}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <main className="relative flex-1 overflow-y-auto">
          {waBanner && (
            <div className="flex items-start gap-3 bg-amber-50 border-b border-amber-200 px-4 py-3 text-xs text-amber-800">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <p className="flex-1 leading-relaxed">
                <span className="font-semibold">WhatsApp reminders aren't active yet.</span> From each phone, open WhatsApp and text{' '}
                <span className="font-mono font-bold">join die-stranger</span> to{' '}
                <span className="font-mono font-bold">+1 415 523 8886</span>.
              </p>
              <div className="flex shrink-0 items-center gap-2 ml-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('pillpal_whatsapp_skipped')
                    setWaBanner(false)
                  }}
                  className="rounded bg-amber-600 px-2.5 py-1 text-white font-medium hover:bg-amber-700 transition-colors whitespace-nowrap">
                  I've done this
                </button>
                <button
                  type="button"
                  onClick={() => setWaBanner(false)}
                  className="text-amber-500 hover:text-amber-700 transition-colors px-1 text-sm leading-none"
                  title="Remind me later">
                  ✕
                </button>
              </div>
            </div>
          )}
          {currentPage === 'home' ? (
            <Dashboard />
          ) : currentPage === 'faq' ? (
            <FAQ />
          ) : (
            <>
              <AddChart changePopupState={handleAddClick} />
              <ChartChart pills={pills} onDelete={deletePill} onEdit={handleEditClick} />
            </>
          )}
        </main>
      </div>

      {isPopupOpen && (
        <PopupChart
          changePopupState={setIsPopupOpen}
          onSave={addPill}
          editPill={editingPill}
          onUpdate={updatePill}
          onToast={showToast}
        />
      )}

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal(authModal === 'login' ? 'signup' : 'login')}
          onLogin={async (credential) => {
            await handleLogin(credential)
            setAuthModal(null)
          }}
        />
      )}

      <Toast toasts={toasts} dismiss={dismissToast} />
    </>
  )
}
