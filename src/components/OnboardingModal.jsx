import { useState } from 'react'
import { api } from '../api.js'

const COUNTRY_CODES = [
  { code: '+1',  label: 'US' },
  { code: '+44', label: 'UK' },
  { code: '+61', label: 'AU' },
  { code: '+91', label: 'IN' },
  { code: '+52', label: 'MX' },
]

const STEPS = ['welcome', 'yourinfo', 'caregivers', 'whatsapp', 'done']

const inputCls = 'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

function PhoneField({ cc, onCC, value, onChange, placeholder = 'Phone number', id }) {
  return (
    <div className="flex gap-2">
      <select value={cc} onChange={e => onCC(e.target.value)}
        className="w-28 shrink-0 rounded-lg border border-slate-300 bg-white px-2 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
        {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label} {c.code}</option>)}
      </select>
      <input id={id} type="tel" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls + ' flex-1'} />
    </div>
  )
}

function StepDots({ current }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-8">
      {STEPS.map((s, i) => (
        <span key={s} className={`rounded-full transition-all ${
          i === current ? 'w-5 h-2 bg-primary' : 'w-2 h-2 bg-slate-200'
        }`} />
      ))}
    </div>
  )
}

export default function OnboardingModal({ onFinish }) {
  const [step, setStep]             = useState(0)

  // Step 2 — your info
  const [patientName,   setPatientName]   = useState('')
  const [patientCC,     setPatientCC]     = useState('+1')
  const [patientPhone,  setPatientPhone]  = useState('')

  // Step 3 — caregivers
  const [caregivers, setCaregivers] = useState([{ cc: '+1', phone: '' }])

  // Step 4 — WhatsApp
  const [checking,    setChecking]    = useState(false)
  // phoneStatuses: null before first check, or [{ phone, label, joined }]
  const [phoneStatuses, setPhoneStatuses] = useState(null)

  // Step 5 — finishing
  const [saving,    setSaving]    = useState(false)
  const [saveError, setSaveError] = useState('')

  function next() { setStep(s => Math.min(s + 1, STEPS.length - 1)) }
  function back() { setStep(s => Math.max(s - 1, 0)) }

  // Caregiver helpers
  function updateCG(i, field, val) {
    setCaregivers(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c))
  }
  function addCG()    { setCaregivers(prev => [...prev, { cc: '+1', phone: '' }]) }
  function removeCG(i){ setCaregivers(prev => prev.filter((_, idx) => idx !== i)) }

  async function checkJoined() {
    setChecking(true)
    setPhoneStatuses(null)
    try {
      // Build a labelled list: patient first, then caregivers
      const allPhones = [
        { phone: patientCC + patientPhone, label: `Patient (${patientName || 'patient'})` },
        ...caregivers
          .filter(c => c.phone.trim())
          .map((c, i) => ({ phone: (c.cc || '+1') + c.phone, label: `Caregiver ${i + 1}` })),
      ].filter(p => p.phone.length > 3)

      const res = await api.post('/api/whatsapp/check', {
        phones: allPhones.map(p => p.phone),
      })

      // Backend returns { results: [{ phone, joined }] }
      const resultMap = Object.fromEntries((res.results || []).map(r => [r.phone, r.joined]))
      setPhoneStatuses(allPhones.map(p => ({
        ...p,
        joined: resultMap[p.phone] ?? false,
      })))
    } catch {
      // On error mark everything as unknown
      const allPhones = [
        { phone: patientCC + patientPhone, label: `Patient (${patientName || 'patient'})` },
        ...caregivers.filter(c => c.phone.trim()).map((c, i) => ({ phone: (c.cc || '+1') + c.phone, label: `Caregiver ${i + 1}` })),
      ].filter(p => p.phone.length > 3)
      setPhoneStatuses(allPhones.map(p => ({ ...p, joined: false })))
    } finally {
      setChecking(false)
    }
  }

  async function finish() {
    setSaving(true)
    setSaveError('')
    try {
      const caregiverPhones = caregivers
        .map(c => ({ cc: c.cc, phone: c.phone }))
        .filter(c => c.phone.trim())

      await api.post('/api/onboarding', {
        patientName,
        patientPhone: patientCC + patientPhone,
        caregivers: caregiverPhones,
      })

      // Persist to localStorage so PopupChart can read it immediately
      localStorage.setItem('pillpal_settings', JSON.stringify({
        caregivers: caregiverPhones,
        patientName,
        patientCC,
        patientPhone,
      }))

      onFinish()
    } catch (err) {
      setSaveError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <StepDots current={step} />

        {/* ── Step 0: Welcome ── */}
        {step === 0 && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 relative flex items-end justify-center">
                <div className="w-20 h-12 bg-primary rounded-t-full opacity-60" />
                <div className="absolute bottom-0 w-20 h-10 bg-primary-dark rounded-b-full flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-primary-dark mb-3">Welcome to PillPal</h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              Let's get you set up in just a few steps so you can start sending medication reminders.
            </p>
            <button onClick={next}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-colors">
              Get started →
            </button>
          </div>
        )}

        {/* ── Step 1: Your info ── */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-primary-dark mb-1">Patient info</h2>
            <p className="text-slate-500 text-sm mb-6">Who will be receiving the medication reminders?</p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Patient Name</label>
                <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)}
                  placeholder="e.g. Grandma Rose" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Patient Phone</label>
                <PhoneField cc={patientCC} onCC={setPatientCC} value={patientPhone} onChange={setPatientPhone} />
                <p className="mt-1.5 text-[11px] text-slate-400">This is the number that will receive WhatsApp reminders.</p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={back}
                className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Back
              </button>
              <button onClick={next} disabled={!patientName.trim() || !patientPhone.trim()}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-40 transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Caregivers ── */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-primary-dark mb-1">Caregiver phones</h2>
            <p className="text-slate-500 text-sm mb-6">
              Who should receive confirmations and missed-dose alerts?
            </p>

            <div className="flex flex-col gap-3">
              {caregivers.map((c, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <PhoneField cc={c.cc} onCC={val => updateCG(i, 'cc', val)}
                      value={c.phone} onChange={val => updateCG(i, 'phone', val)}
                      placeholder={`Caregiver ${i + 1}`} />
                  </div>
                  {caregivers.length > 1 && (
                    <button type="button" onClick={() => removeCG(i)}
                      className="shrink-0 text-slate-400 hover:text-red-500 transition-colors text-xl leading-none pb-0.5">×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addCG}
                className="self-start text-sm text-primary font-medium hover:underline">
                + Add another caregiver
              </button>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={back}
                className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Back
              </button>
              <button onClick={next} disabled={!caregivers.some(c => c.phone.trim())}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-40 transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: WhatsApp sandbox ── */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-primary-dark mb-1">Join WhatsApp sandbox</h2>
            <p className="text-slate-500 text-sm mb-6">
              PillPal uses WhatsApp to send reminders. Every phone number (patient + caregivers) must join the sandbox first.
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 mb-5">
              <p className="text-sm font-semibold text-slate-700 mb-3">From each phone, open WhatsApp and text:</p>
              <div className="rounded-lg bg-white border border-slate-200 px-4 py-3 mb-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Message</p>
                  <p className="font-mono font-bold text-primary-dark text-sm">join die-stranger</p>
                </div>
                <span className="text-slate-300 text-xl">→</span>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">To this number</p>
                  <p className="font-mono font-bold text-primary-dark text-sm">+1 415 523 8886</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">Do this for the patient's phone and every caregiver phone.</p>
            </div>

            <button type="button" onClick={checkJoined} disabled={checking}
              className="w-full rounded-xl border border-primary py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-50 transition-colors mb-3">
              {checking ? 'Checking…' : 'Check if I\'ve joined'}
            </button>

            {phoneStatuses && (
              <div className="rounded-xl border border-slate-200 overflow-hidden mb-3">
                {phoneStatuses.map((p) => (
                  <div key={p.phone} className={`flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0 ${p.joined ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                    {p.joined ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 shrink-0">
                        <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                          <polyline points="10 3 5 9 2 6" />
                        </svg>
                      </span>
                    ) : (
                      <span className="text-amber-500 text-base shrink-0 leading-none">⚠</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${p.joined ? 'text-green-700' : 'text-amber-700'}`}>{p.label}</p>
                      <p className={`text-[11px] font-mono ${p.joined ? 'text-green-600' : 'text-amber-600'}`}>{p.phone}</p>
                    </div>
                    <span className={`text-[11px] font-medium shrink-0 ${p.joined ? 'text-green-600' : 'text-amber-600'}`}>
                      {p.joined ? 'Joined' : 'Not joined'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button onClick={back}
                className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Back
              </button>
              {phoneStatuses && phoneStatuses.every(p => p.joined) ? (
                <button onClick={next}
                  className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-colors">
                  Next →
                </button>
              ) : (
                <button onClick={next}
                  className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
                  Skip for now
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Step 4: Done ── */}
        {step === 4 && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-600">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            </div>
            <h2 className="text-3xl font-bold text-primary-dark mb-3">You're all set!</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-2 max-w-sm mx-auto">
              Your contact info is saved. Head to the Medication chart to add your first pill and enable reminders.
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-left mb-8 text-sm">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Summary</p>
              <p className="text-slate-700"><span className="font-medium">Patient:</span> {patientName} · {patientCC}{patientPhone}</p>
              <p className="text-slate-700 mt-1"><span className="font-medium">Caregivers:</span> {caregivers.filter(c => c.phone).map(c => c.cc + c.phone).join(', ')}</p>
            </div>

            {saveError && <p className="text-xs text-red-500 mb-3">{saveError}</p>}

            <button onClick={finish} disabled={saving}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50 transition-colors">
              {saving ? 'Saving…' : 'Go to PillPal →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
