import { useState } from 'react'
import { usePills } from '../hooks/usePills.js'
import { api } from '../api.js'

const COUNTRY_CODES = [
  { code: '+1',  label: 'US' },
  { code: '+44', label: 'UK' },
  { code: '+61', label: 'AU' },
  { code: '+91', label: 'IN' },
  { code: '+52', label: 'MX' },
]

function PhoneInput({ label, value, onChange, countryCode, onCountryChange, id }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-primary-dark mb-1">
        {label} <span className="text-red-400">*</span>
      </label>
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={(e) => onCountryChange(e.target.value)}
          className="w-24 rounded-lg border border-slate-200 bg-slate-100 px-2 py-2.5 text-xs text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>{c.label} {c.code}</option>
          ))}
        </select>
        <input
          id={id}
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Phone number"
          className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  )
}

function StarRating({ urgency, setUrgency }) {
  function getColor(starIndex) {
    if (starIndex <= 2) return '#4ade80'
    if (starIndex === 3) return '#facc15'
    return '#f87171'
  }

  return (
    <div className="flex items-center gap-0.5 mt-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setUrgency(value)}
          className="p-0.5 rounded hover:opacity-80 focus:outline-none"
          aria-label={`Set urgency to ${value}`}
        >
          {urgency >= value ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill={getColor(value)} aria-hidden>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
        </button>
      ))}
    </div>
  )
}

export default function AddReminder() {
  const { pills } = usePills()

  const [caregiverPhone, setCaregiverPhone] = useState('')
  const [caregiverCC, setCaregiverCC] = useState('+1')
  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [patientCC, setPatientCC] = useState('+1')

  const [medType, setMedType] = useState('choose')
  const [selectedPillId, setSelectedPillId] = useState('')

  // New medication fields
  const [medication, setMedication] = useState('')
  const [dosage, setDosage] = useState('')
  const [reminderDate, setReminderDate] = useState('')
  const [reminderTime, setReminderTime] = useState('')
  const [refillDate, setRefillDate] = useState('')
  const [urgency, setUrgency] = useState(0)

  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaveError('')
    setSuccess(false)
    setSaving(true)

    const medPayload =
      medType === 'choose'
        ? { pillId: selectedPillId }
        : { medication, dosage, reminderDate, reminderTime, refillDate, urgency }

    try {
      await api.post('/api/reminders', {
        caregiverPhone: caregiverCC + caregiverPhone,
        patientName,
        patientPhone: patientCC + patientPhone,
        notes,
        ...medPayload,
      })
      setSuccess(true)
    } catch (err) {
      console.error('[add reminder]', err)
      setSaveError(err?.message || 'Failed to send reminder. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
  const labelCls = 'block text-xs font-semibold text-primary-dark mb-1'

  return (
    <div className="overflow-y-auto h-full bg-white p-8 flex justify-center">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-md px-8 py-8">
          <h1 className="text-xl font-bold text-primary-dark mb-1">Add reminder</h1>
          <p className="text-xs text-slate-500 mb-6">Add details of the reminder you want to send!</p>

          {success ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
              <p className="text-sm font-semibold text-green-700">Reminder sent!</p>
              <button
                type="button"
                onClick={() => { setSuccess(false); setCaregiverPhone(''); setPatientName(''); setPatientPhone(''); setMedication(''); setDosage(''); setNotes(''); setUrgency(0) }}
                className="mt-3 text-xs text-primary hover:underline"
              >
                Add another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <PhoneInput
                label="Caregiver phone"
                id="caregiver-phone"
                value={caregiverPhone}
                onChange={setCaregiverPhone}
                countryCode={caregiverCC}
                onCountryChange={setCaregiverCC}
              />

              <div>
                <label htmlFor="patient-name" className={labelCls}>
                  Patient Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="patient-name"
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className={inputCls}
                />
              </div>

              <PhoneInput
                label="Patient Phone"
                id="patient-phone"
                value={patientPhone}
                onChange={setPatientPhone}
                countryCode={patientCC}
                onCountryChange={setPatientCC}
              />

              {/* Medication section */}
              <div>
                <label className={labelCls}>
                  Medication <span className="text-red-400">*</span>
                </label>
                <select
                  value={medType}
                  onChange={(e) => { setMedType(e.target.value); setSelectedPillId('') }}
                  className={inputCls}
                >
                  <option value="choose">Choose Medication</option>
                  <option value="new">New Medication</option>
                </select>
              </div>

              {medType === 'choose' && (
                <div>
                  <label htmlFor="pill-select" className={labelCls}>Select from chart</label>
                  {pills.length === 0 ? (
                    <p className="text-xs text-slate-400 mt-1">No medications in your chart yet. Add one first.</p>
                  ) : (
                    <select
                      id="pill-select"
                      required
                      value={selectedPillId}
                      onChange={(e) => setSelectedPillId(e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Select a medication…</option>
                      {pills.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.medication} {p.dosage}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {medType === 'new' && (
                <>
                  <div>
                    <label htmlFor="med-name" className={labelCls}>Medication name <span className="text-red-400">*</span></label>
                    <input id="med-name" type="text" required value={medication} onChange={(e) => setMedication(e.target.value)} className={inputCls} />
                  </div>

                  <div>
                    <label htmlFor="dosage" className={labelCls}>Dosage <span className="text-red-400">*</span></label>
                    <input id="dosage" type="text" required value={dosage} onChange={(e) => setDosage(e.target.value)} className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Time <span className="text-red-400">*</span></label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                        </span>
                        <input type="date" required value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} className={`${inputCls} pl-8`} />
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                        </span>
                        <input type="time" required value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className={`${inputCls} pl-8`} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Date of Refill <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                      </span>
                      <input type="date" required value={refillDate} onChange={(e) => setRefillDate(e.target.value)} className={`${inputCls} pl-8`} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Urgency Level <span className="text-red-400">*</span></label>
                    <StarRating urgency={urgency} setUrgency={setUrgency} />
                  </div>
                </>
              )}

              <div>
                <label htmlFor="notes" className={labelCls}>Notes</label>
                <textarea
                  id="notes"
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={inputCls}
                />
              </div>

              {saveError && <p className="text-xs text-red-500">{saveError}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50 transition-colors mt-1"
              >
                {saving ? 'Sending…' : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
