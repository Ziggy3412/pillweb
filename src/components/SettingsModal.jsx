import { useState, useCallback } from 'react'

const COUNTRY_CODES = [
  { code: '+1',  label: 'US' },
  { code: '+44', label: 'UK' },
  { code: '+61', label: 'AU' },
  { code: '+91', label: 'IN' },
  { code: '+52', label: 'MX' },
]

const cls = 'rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

function load() {
  try { return JSON.parse(localStorage.getItem('pillpal_settings') || '{}') } catch { return {} }
}

function PhoneRow({ cc, onCC, value, onChange, onRemove, showRemove }) {
  return (
    <div className="flex gap-2 items-center">
      <select value={cc} onChange={e => onCC(e.target.value)} className={`w-24 shrink-0 ${cls}`}>
        {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label} {c.code}</option>)}
      </select>
      <input type="tel" value={value} onChange={e => onChange(e.target.value)}
        placeholder="Phone number" className={`flex-1 ${cls}`} />
      {showRemove && (
        <button type="button" onClick={onRemove}
          className="shrink-0 text-slate-400 hover:text-red-500 transition-colors text-lg leading-none px-1"
          aria-label="Remove">×</button>
      )}
    </div>
  )
}

const NAV = [
  { id: 'general', label: 'General' },
  { id: 'contact', label: 'Contact Information' },
]

export default function SettingsModal({ onClose }) {
  const s = load()

  const [section, setSection]         = useState('general')
  const [pendingSection, setPending]  = useState(null)  // section we want to go to
  const [showLeaveWarn, setLeaveWarn] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [dirty, setDirty]             = useState(false)

  // Caregivers: array of { cc, phone }
  const [caregivers, setCaregivers] = useState(
    s.caregivers?.length ? s.caregivers : [{ cc: '+1', phone: '' }]
  )
  const [patientName,  setPatientName]  = useState(s.patientName  || '')
  const [patientCC,    setPatientCC]    = useState(s.patientCC    || '+1')
  const [patientPhone, setPatientPhone] = useState(s.patientPhone || '')

  // Mark dirty whenever any field changes
  function markDirty() { setDirty(true) }

  function updateCaregiver(i, field, val) {
    setCaregivers(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c))
    markDirty()
  }
  function addCaregiver() {
    setCaregivers(prev => [...prev, { cc: '+1', phone: '' }])
    markDirty()
  }
  function removeCaregiver(i) {
    setCaregivers(prev => prev.filter((_, idx) => idx !== i))
    markDirty()
  }

  // Try to navigate away — gate on dirty
  function tryNavigate(id) {
    if (dirty && section === 'contact') {
      setPending(id)
      setLeaveWarn(true)
    } else {
      setSection(id)
    }
  }

  function tryClose() {
    if (dirty && section === 'contact') {
      setPending('__close__')
      setLeaveWarn(true)
    } else {
      onClose()
    }
  }

  function confirmLeave() {
    setLeaveWarn(false)
    setDirty(false)
    if (pendingSection === '__close__') { onClose(); return }
    setSection(pendingSection)
    setPending(null)
  }

  function cancelLeave() {
    setLeaveWarn(false)
    setPending(null)
  }

  // Step 1: show preview before committing
  function handleSaveClick() {
    setShowConfirm(true)
  }

  // Step 2: actually write to localStorage
  function commitSave() {
    localStorage.setItem('pillpal_settings', JSON.stringify({
      caregivers, patientName, patientCC, patientPhone,
    }))
    setShowConfirm(false)
    setDirty(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="flex w-full max-w-2xl rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden relative" style={{ minHeight: '460px' }}>

        {/* ── Sidebar ── */}
        <div className="w-44 shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col">
          <div className="px-4 py-4 border-b border-slate-200">
            <p className="text-sm font-semibold text-primary-dark">Settings</p>
          </div>
          <nav className="flex-1 p-2 flex flex-col gap-1">
            {NAV.map(n => (
              <button key={n.id} type="button" onClick={() => tryNavigate(n.id)}
                className={`w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  section === n.id
                    ? 'bg-white border border-slate-200 text-primary-dark shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}>
                {n.label}
              </button>
            ))}
          </nav>
        </div>

        {/* ── Content ── */}
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-sm font-semibold text-primary-dark">
              {NAV.find(n => n.id === section)?.label}
            </h2>
            <button type="button" onClick={tryClose}
              className="rounded px-2 py-1 text-sm border border-slate-200 hover:bg-slate-50">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">

            {section === 'general' && (
              <p className="text-xs text-slate-500">General settings coming soon.</p>
            )}

            {section === 'contact' && !showConfirm && (
              <div className="flex flex-col gap-4">
                <p className="text-[11px] text-slate-500">
                  Used when sending SMS reminders from the pill chart.
                </p>

                {/* Caregivers */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-medium text-slate-700">Caregiver Phone(s)</label>
                    <button type="button" onClick={addCaregiver}
                      className="text-[11px] text-primary hover:underline font-medium">+ Add caregiver</button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {caregivers.map((c, i) => (
                      <PhoneRow key={i}
                        cc={c.cc} onCC={val => updateCaregiver(i, 'cc', val)}
                        value={c.phone} onChange={val => updateCaregiver(i, 'phone', val)}
                        showRemove={caregivers.length > 1}
                        onRemove={() => removeCaregiver(i)}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    Reminders are sent via <strong>WhatsApp</strong>. Each caregiver must first join the Twilio sandbox by texting{' '}
                    <span className="font-mono font-semibold text-slate-700">join die-stranger</span> to{' '}
                    <span className="font-mono font-semibold text-slate-700">+1 415 523 8886</span> on WhatsApp.
                  </p>
                </div>

                {/* Patient */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Patient Name</label>
                  <input type="text" value={patientName}
                    onChange={e => { setPatientName(e.target.value); markDirty() }}
                    className={`w-full ${cls}`} />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Patient Phone</label>
                  <div className="flex gap-2">
                    <select value={patientCC} onChange={e => { setPatientCC(e.target.value); markDirty() }} className={`w-24 shrink-0 ${cls}`}>
                      {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label} {c.code}</option>)}
                    </select>
                    <input type="tel" value={patientPhone}
                      onChange={e => { setPatientPhone(e.target.value); markDirty() }}
                      placeholder="Phone number" className={`flex-1 ${cls}`} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Save confirmation preview ── */}
            {section === 'contact' && showConfirm && (
              <div className="flex flex-col gap-4">
                <p className="text-xs font-semibold text-primary-dark">Please confirm your contact information:</p>

                <div className="rounded-lg border border-slate-200 divide-y divide-slate-100 text-xs">
                  <div className="px-4 py-3">
                    <p className="text-[11px] font-medium text-slate-500 mb-1">Caregiver(s)</p>
                    {caregivers.map((c, i) => (
                      <p key={i} className="text-slate-800 font-medium">{c.cc} {c.phone || <span className="text-slate-400 font-normal italic">not set</span>}</p>
                    ))}
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[11px] font-medium text-slate-500 mb-1">Patient</p>
                    <p className="text-slate-800 font-medium">{patientName || <span className="text-slate-400 font-normal italic">no name</span>}</p>
                    <p className="text-slate-800">{patientCC} {patientPhone || <span className="text-slate-400 italic">not set</span>}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={commitSave}
                    className="flex-1 rounded bg-primary py-2 text-xs font-semibold text-white hover:bg-primary-dark transition-colors">
                    Yes, save this
                  </button>
                  <button type="button" onClick={() => setShowConfirm(false)}
                    className="flex-1 rounded border border-slate-300 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    Go back and edit
                  </button>
                </div>
              </div>
            )}
          </div>

          {section === 'contact' && !showConfirm && (
            <div className="shrink-0 border-t border-slate-200 px-6 py-3 flex justify-end">
              <button type="button" onClick={handleSaveClick}
                className="rounded bg-primary px-4 py-1.5 text-[11px] font-medium text-white hover:bg-primary-dark transition-colors">
                Save
              </button>
            </div>
          )}
        </div>

        {/* ── Leave-without-saving overlay ── */}
        {showLeaveWarn && (
          <div className="absolute inset-0 z-10 bg-white/90 flex items-center justify-center p-8 rounded-xl">
            <div className="text-center max-w-xs">
              <p className="text-sm font-semibold text-primary-dark mb-2">Leave without saving?</p>
              <p className="text-xs text-slate-500 mb-5">
                You've made changes that haven't been saved yet. If you leave now, they'll be lost.
              </p>
              <div className="flex gap-2 justify-center">
                <button type="button" onClick={confirmLeave}
                  className="rounded border border-red-300 px-4 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                  Leave without saving
                </button>
                <button type="button" onClick={cancelLeave}
                  className="rounded bg-primary px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-dark transition-colors">
                  Stay and keep editing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
