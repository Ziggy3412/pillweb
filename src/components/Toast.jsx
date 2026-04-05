import { useEffect } from 'react'

export default function Toast({ toasts, dismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} dismiss={dismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, dismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), toast.duration ?? 4000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, dismiss])

  const styles = {
    success: 'bg-white border-l-4 border-primary text-slate-700',
    error:   'bg-white border-l-4 border-red-400 text-slate-700',
    info:    'bg-white border-l-4 border-slate-400 text-slate-700',
  }

  const icons = {
    success: (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary shrink-0">
        <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
          <polyline points="10 3 5 9 2 6" />
        </svg>
      </span>
    ),
    error: (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-400 shrink-0">
        <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
          <line x1="3" y1="3" x2="9" y2="9" /><line x1="9" y1="3" x2="3" y2="9" />
        </svg>
      </span>
    ),
    info: (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-400 shrink-0">
        <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
          <line x1="6" y1="5" x2="6" y2="9" /><circle cx="6" cy="3" r="0.5" fill="white" />
        </svg>
      </span>
    ),
  }

  const type = toast.type ?? 'info'

  return (
    <div className={`pointer-events-auto flex items-center gap-3 rounded-lg border border-slate-200 shadow-lg px-4 py-3 min-w-[260px] max-w-sm ${styles[type]}`}>
      {icons[type]}
      <p className="flex-1 text-xs font-medium leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors ml-1"
        aria-label="Dismiss"
      >
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3 h-3">
          <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
        </svg>
      </button>
    </div>
  )
}
