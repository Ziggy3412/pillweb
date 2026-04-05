import { useState } from 'react'
import { useAuth } from './context/AuthContext.jsx'

function HomeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function CirclePlusIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

function BellIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function QuestionIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export default function SideBar({ currentPage = 'chart', onNavigate, onOpenAuth, onOpenSettings }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const initials = user?.displayName
    ? user.displayName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <aside
      className={`flex flex-col h-screen max-h-screen border-r border-slate-200 bg-white overflow-x-hidden transition-[width] duration-200 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className={`flex shrink-0 items-center border-b border-slate-200 p-3 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-primary-dark">Pillpal</h1>
            <p className="text-xs text-slate-500">Dashboard</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsCollapsed((c) => !c)}
          className="shrink-0 rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {isCollapsed ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
          </svg>
        </button>
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-1 text-sm">
        <button
          title="Home"
          type="button"
          onClick={() => onNavigate?.('home')}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-primary border ${
            currentPage === 'home'
              ? 'border-slate-200 bg-slate-100 text-primary-dark'
              : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="shrink-0 text-slate-600">
            <HomeIcon />
          </span>
          {!isCollapsed && <span className="truncate">Home</span>}
        </button>
        <button
          title="Pill Chart"
          type="button"
          onClick={() => onNavigate?.('chart')}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-primary border ${
            currentPage === 'chart'
              ? 'border-slate-200 bg-slate-100 text-primary-dark'
              : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="shrink-0 text-slate-600">
            <CirclePlusIcon />
          </span>
          {!isCollapsed && <span className="truncate">Medication chart</span>}
        </button>
        <button
          title="FAQ"
          type="button"
          onClick={() => onNavigate?.('faq')}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-primary border ${
            currentPage === 'faq'
              ? 'border-slate-200 bg-slate-100 text-primary-dark'
              : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="shrink-0 text-slate-600">
            <QuestionIcon />
          </span>
          {!isCollapsed && <span className="truncate">FAQ</span>}
        </button>
      </nav>

      <div className={`shrink-0 border-t border-slate-200 p-2 bg-slate-50 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {user ? (
          <div className="flex items-center gap-2">
            {user.photo ? (
              <img src={user.photo} alt={user.displayName} className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-slate-200" />
            ) : (
              <div className="h-9 w-9 shrink-0 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-semibold">
                {initials}
              </div>
            )}
            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800">{user.displayName}</p>
                  <p className="truncate text-[11px] text-slate-400">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenSettings?.()}
                  title="Settings"
                  className="shrink-0 rounded p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign out"
                  className="shrink-0 rounded p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </>
            )}
          </div>
        ) : isCollapsed ? (
          <button
            type="button"
            title="Sign in"
            onClick={() => onOpenAuth?.('login')}
            className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-300 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onOpenAuth?.('login')}
              className="flex-1 rounded-lg border border-slate-300 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth?.('signup')}
              className="flex-1 rounded-lg bg-slate-800 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
