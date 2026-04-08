import { useState, useRef, useEffect } from 'react';
import { api } from './api';

const HOUR_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const FREQUENCY_OPTIONS = [
    { value: 'every_day',       label: 'Every day' },
    { value: 'every_other_day', label: 'Every other day' },
    { value: 'specific_days',   label: 'Specific days of the week' },
    { value: 'every_x_days',    label: 'Every x days' },
    { value: 'every_x_months',  label: 'Every x months' },
    { value: 'as_needed',       label: 'Only as needed' },
];

function filterHourOptions(value) {
    if (!value) return HOUR_OPTIONS;
    return HOUR_OPTIONS.filter((opt) => opt.startsWith(value));
}

function filterMinuteOptions(value) {
    if (!value) return MINUTE_OPTIONS;
    return MINUTE_OPTIONS.filter(
        (opt) => opt.startsWith(value) || (value.length === 1 && opt === '0' + value)
    );
}

function TimeDropdown({ name, placeholder, filterOptions, value, onChange, inputClassName }) {
    const [isOpen, setIsOpen] = useState(false);
    const [openUp, setOpenUp] = useState(false);
    const containerRef = useRef(null);
    const listRef = useRef(null);

    const filtered = filterOptions(value);

    useEffect(() => {
        if (!isOpen || !containerRef.current || !listRef.current) return;
        const id = requestAnimationFrame(() => {
            const el = containerRef.current;
            const list = listRef.current;
            if (!el || !list) return;
            const rect = el.getBoundingClientRect();
            const listHeight = list.getBoundingClientRect().height;
            const spaceBelow = window.innerHeight - rect.bottom;
            setOpenUp(spaceBelow < listHeight && rect.top > spaceBelow);
        });
        return () => cancelAnimationFrame(id);
    }, [isOpen, filtered.length]);

    useEffect(() => {
        if (!isOpen) return;
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative">
            <input
                type="text"
                name={name}
                value={value}
                onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
                    // For hour fields: clamp to 1-12
                    if (name.includes('hour') && digits !== '') {
                        const n = parseInt(digits, 10);
                        if (n > 12) return; // reject
                        if (digits.length === 2 && n < 1) return; // reject 00
                    }
                    onChange(digits);
                }}
                onFocus={() => setIsOpen(true)}
                onClick={() => setIsOpen(true)}
                placeholder={placeholder}
                autoComplete="off"
                className={inputClassName}
            />
            {isOpen && (
                <ul
                    ref={listRef}
                    className={`absolute left-0 right-0 z-50 max-h-32 overflow-auto rounded border border-slate-300 bg-white py-0.5 shadow-lg text-xs ${
                        openUp ? 'bottom-full mb-1' : 'top-full mt-1'
                    }`}
                    style={{ minWidth: 'var(--input-width, 5rem)' }}
                >
                    {filtered.length ? (
                        filtered.map((opt) => (
                            <li key={opt}>
                                <button
                                    type="button"
                                    className="w-full px-2.5 py-1.5 text-left text-slate-700 hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
                                    onClick={() => { onChange(opt); setIsOpen(false); }}
                                >
                                    {opt}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="px-2.5 py-1.5 text-slate-500">No match</li>
                    )}
                </ul>
            )}
        </div>
    );
}

function TimePickers({ pillTimeEntries, setPillTimeEntries, timeValues, setTimeValues, amPmValues, setAmPmValues }) {
    function removeTimeEntry(index) {
        const total = pillTimeEntries + 1;
        if (total <= 1) return;
        setPillTimeEntries((n) => n - 1);
        setTimeValues((prev) => {
            const next = { ...prev };
            for (let j = index; j < total - 1; j++) {
                next[`time-hour-${j}`] = prev[`time-hour-${j + 1}`] ?? '';
                next[`time-min-${j}`] = prev[`time-min-${j + 1}`] ?? '';
            }
            delete next[`time-hour-${total - 1}`];
            delete next[`time-min-${total - 1}`];
            return next;
        });
        setAmPmValues((prev) => {
            const next = { ...prev };
            for (let j = index; j < total - 1; j++) next[j] = prev[j + 1] ?? 'AM';
            delete next[total - 1];
            return next;
        });
    }

    return (
        <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-slate-600">Time(s)</span>
                <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded border border-primary bg-primary px-2 py-1 text-[11px] text-white hover:bg-primary-dark"
                    onClick={() => setPillTimeEntries((n) => n + 1)}
                >
                    + Add time
                </button>
            </div>
            <div className="space-y-2">
                {Array.from({ length: pillTimeEntries + 1 }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-20 shrink-0">
                            <TimeDropdown
                                name={`time-hour-${i}`}
                                placeholder="Hour"
                                filterOptions={filterHourOptions}
                                value={timeValues[`time-hour-${i}`] ?? ''}
                                onChange={(v) => setTimeValues((prev) => ({ ...prev, [`time-hour-${i}`]: v }))}
                                inputClassName="block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <span className="text-slate-400 text-xs">:</span>
                        <div className="w-20 shrink-0">
                            <TimeDropdown
                                name={`time-min-${i}`}
                                placeholder="Min"
                                filterOptions={filterMinuteOptions}
                                value={timeValues[`time-min-${i}`] ?? ''}
                                onChange={(v) => setTimeValues((prev) => ({ ...prev, [`time-min-${i}`]: v }))}
                                inputClassName="block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="flex shrink-0 rounded border border-slate-300 overflow-hidden text-xs">
                            {['AM', 'PM'].map((period) => (
                                <button
                                    key={period}
                                    type="button"
                                    onClick={() => setAmPmValues((prev) => ({ ...prev, [i]: period }))}
                                    className={`px-2 py-1.5 font-medium transition-colors ${
                                        (amPmValues[i] ?? 'AM') === period
                                            ? 'bg-primary text-white'
                                            : 'bg-white text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                        {pillTimeEntries > 0 && (
                            <button
                                type="button"
                                onClick={() => removeTimeEntry(i)}
                                className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                aria-label={`Remove time ${i + 1}`}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function initTimeState(pill) {
    const times = pill?.schedule?.times ?? [];
    const tv = {};
    const av = {};
    times.forEach((t, i) => {
        const [timePart, ampm] = t.split(' ');
        const [h, m] = (timePart ?? '').split(':');
        tv[`time-hour-${i}`] = h ?? '';
        tv[`time-min-${i}`] = m ?? '';
        av[i] = ampm ?? 'AM';
    });
    return { tv, av, count: Math.max(0, times.length - 1) };
}

function PopupChart({ changePopupState, onSave, editPill, onUpdate, onToast }) {
    // Controlled text fields — pre-filled when editing
    const defaultName = editPill?.name ?? (() => {
        try { return JSON.parse(localStorage.getItem('pillpal_settings') || '{}').patientName || ''; } catch { return ''; }
    })();
    const [name, setName] = useState(defaultName);
    const [medication, setMedication] = useState(editPill?.medication ?? '');
    const [dosage, setDosage] = useState(editPill?.dosage ?? '');
    const [notes, setNotes] = useState(editPill?.notes ?? '');

    const [urgency, setUrgency] = useState(editPill?.urgency ?? 0);
    const [urgencyError, setUrgencyError] = useState('');
    const [dosageError, setDosageError] = useState('');
    const [frequencyError, setFrequencyError] = useState('');
    const [timeError, setTimeError] = useState('');
    const [daysError, setDaysError] = useState('');
    const [intervalError, setIntervalError] = useState('');
    const [reminderEnabled, setReminderEnabled] = useState(editPill?.reminderEnabled ?? false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    // Frequency — pre-filled when editing
    const [frequency, setFrequency] = useState(editPill?.schedule?.frequency ?? '');
    const [intervalValue, setIntervalValue] = useState(String(editPill?.schedule?.interval ?? ''));
    const [selectedDays, setSelectedDays] = useState(editPill?.schedule?.days ?? []);
    const [startDate, setStartDate] = useState(editPill?.schedule?.startDate ?? new Date().toISOString().split('T')[0]);

    const needsStartDate = frequency === 'every_other_day' || frequency === 'every_x_days' || frequency === 'every_x_months';

    // Time pickers — pre-filled when editing
    const { tv: initTv, av: initAv, count: initCount } = initTimeState(editPill);
    const [pillTimeEntries, setPillTimeEntries] = useState(initCount);
    const [timeValues, setTimeValues] = useState(initTv);
    const [amPmValues, setAmPmValues] = useState(initAv);

    const needsTimes = frequency && frequency !== 'as_needed';

    function getStarColor(starIndex) {
        if (starIndex <= 2) return '#4ade80';
        if (starIndex === 3) return '#facc15';
        return '#f87171';
    }

    function toggleDay(day) {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
        setDaysError('');
    }

    function buildTimes() {
        return Array.from({ length: pillTimeEntries + 1 }, (_, i) => {
            const hour = timeValues[`time-hour-${i}`]?.trim();
            const min = timeValues[`time-min-${i}`]?.trim();
            const ampm = amPmValues[i] ?? 'AM';
            return hour && min ? `${hour}:${min} ${ampm}` : null;
        }).filter(Boolean);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setUrgencyError('');
        setDosageError('');
        setFrequencyError('');
        setTimeError('');
        setDaysError('');
        setIntervalError('');
        setSaveError('');

        const trimmedDosage = dosage.trim();

        if (urgency === 0) { setUrgencyError('Please choose an urgency (1–5 stars) before saving.'); return; }
        if (!trimmedDosage) { setDosageError('Dosage is required.'); return; }
        if (!frequency) { setFrequencyError('Please select how often to take this medication.'); return; }

        if (frequency === 'specific_days' && selectedDays.length === 0) {
            setDaysError('Please select at least one day.');
            return;
        }
        if ((frequency === 'every_x_days' || frequency === 'every_x_months') && (!intervalValue || Number(intervalValue) < 1)) {
            setIntervalError('Please enter a number of 1 or more.');
            return;
        }

        const times = needsTimes ? buildTimes() : [];
        if (needsTimes && times.length === 0) {
            setTimeError('Please add at least one time (hour and minute).');
            return;
        }

        const schedule = { frequency };
        if (frequency === 'specific_days') schedule.days = selectedDays;
        if (frequency === 'every_x_days') schedule.interval = Number(intervalValue);
        if (frequency === 'every_x_months') schedule.interval = Number(intervalValue);
        if (needsStartDate) schedule.startDate = startDate;
        if (needsTimes) schedule.times = times;

        const payload = { name: name.trim(), medication: medication.trim(), dosage: trimmedDosage, urgency, schedule, notes: notes.trim(), reminderEnabled };

        setSaving(true);
        try {
            let savedPill;
            if (editPill) {
                savedPill = await api.put(`/api/pills/${editPill.id}`, payload);
                onUpdate?.(savedPill);
            } else {
                savedPill = await api.post('/api/pills', payload);
                onSave?.(savedPill);
            }

            if (reminderEnabled) {
                try {
                    const s = JSON.parse(localStorage.getItem('pillpal_settings') || '{}');
                    const caregiverPhones = (s.caregivers || [{ cc: s.caregiverCC || '+1', phone: s.caregiverPhone || '' }])
                        .map(c => (c.cc || '+1') + (c.phone || '')).filter(p => p.length > 3);
                    await api.post('/api/reminders', {
                        caregiverPhones,
                        patientName: s.patientName || '',
                        patientPhone: (s.patientCC || '+1') + (s.patientPhone || ''),
                        pillId: savedPill.id,
                        notes: notes.trim(),
                    });
                    onToast?.('WhatsApp reminder scheduled — a message will be sent to the patient.', 'success');
                } catch (remErr) {
                    console.error('[reminder send]', remErr);
                    onToast?.('Pill saved, but the WhatsApp reminder failed to send. Check your contact info in Settings.', 'error', 6000);
                }
            } else {
                onToast?.(editPill ? 'Pill updated.' : 'Pill saved.', 'success');
            }

            changePopupState(false);
        } catch (err) {
            console.error('[save pill]', err);
            setSaveError(err?.message || 'Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div id="add-modal" className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl bg-white border border-slate-200 shadow-lg">
                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 p-4">
                    <h2 className="text-sm font-semibold text-primary-dark" id="modal-title">{editPill ? 'Edit' : 'Add'}</h2>
                    <button
                        id="close-add-modal"
                        className="rounded px-2 py-1 text-sm border border-slate-200 hover:bg-slate-50"
                        type="button"
                        onClick={() => changePopupState(false)}
                    >
                        ✕
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                    <form id="pill-form" className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>

                        {/* Name */}
                        <div>
                            <label className="block text-[11px] font-medium text-slate-700">Name</label>
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>

                        {/* Medication */}
                        <div>
                            <label className="block text-[11px] font-medium text-slate-700">Medication</label>
                            <input type="text" required value={medication} onChange={(e) => setMedication(e.target.value)}
                                className="mt-1 block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>

                        {/* Dosage */}
                        <div>
                            <label className="block text-[11px] font-medium text-slate-700">Dosage</label>
                            <input type="text" required value={dosage} onChange={(e) => setDosage(e.target.value)}
                                className="mt-1 block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                            {dosageError && <p className="mt-1 text-[11px] text-red-600" role="alert">{dosageError}</p>}
                        </div>

                        {/* Urgency */}
                        <div>
                            <label className="block text-[11px] font-medium text-slate-700">Urgency</label>
                            <div className="mt-1 flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <button key={value} type="button"
                                        className="p-0.5 rounded hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                                        onClick={() => { setUrgency(value); setUrgencyError(''); }}
                                        aria-label={`Set urgency to ${value}`}
                                    >
                                        {urgency >= value ? (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill={getStarColor(value)} aria-hidden>
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {urgencyError && <p className="mt-1 text-[11px] text-red-600" role="alert">{urgencyError}</p>}
                        </div>

                        {/* How often */}
                        <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-slate-700">Frequency</label>
                            <select
                                value={frequency}
                                onChange={(e) => { setFrequency(e.target.value); setFrequencyError(''); }}
                                className="mt-1 block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Select…</option>
                                {FREQUENCY_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            {frequencyError && <p className="mt-1 text-[11px] text-red-600" role="alert">{frequencyError}</p>}
                        </div>

                        {/* Specific days checkboxes */}
                        {frequency === 'specific_days' && (
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-medium text-slate-700 mb-1.5">Days</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {DAYS_OF_WEEK.map((day) => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(day)}
                                            className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                                                selectedDays.includes(day)
                                                    ? 'border-primary bg-primary text-white'
                                                    : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                                {daysError && <p className="mt-1 text-[11px] text-red-600" role="alert">{daysError}</p>}
                            </div>
                        )}

                        {/* Every x days / x months interval input */}
                        {(frequency === 'every_x_days' || frequency === 'every_x_months') && (
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                                    {frequency === 'every_x_days' ? 'Every how many days?' : 'Every how many months?'}
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Every</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={intervalValue}
                                        onChange={(e) => { setIntervalValue(e.target.value); setIntervalError(''); }}
                                        className="w-20 rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="e.g. 3"
                                    />
                                    <span className="text-xs text-slate-500">
                                        {frequency === 'every_x_days' ? 'days' : 'months'}
                                    </span>
                                </div>
                                {intervalError && <p className="mt-1 text-[11px] text-red-600" role="alert">{intervalError}</p>}
                            </div>
                        )}

                        {/* Start date — shown for every_other_day, every_x_days, every_x_months */}
                        {needsStartDate && (
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-medium text-slate-700 mb-1">Starting from</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <p className="mt-1 text-[11px] text-slate-400">
                                    The schedule will follow this date as day 1.
                                </p>
                            </div>
                        )}

                        {/* Time pickers — shown for all except as_needed */}
                        {needsTimes && (
                            <div className="md:col-span-2">
                                <TimePickers
                                    pillTimeEntries={pillTimeEntries}
                                    setPillTimeEntries={setPillTimeEntries}
                                    timeValues={timeValues}
                                    setTimeValues={setTimeValues}
                                    amPmValues={amPmValues}
                                    setAmPmValues={setAmPmValues}
                                />
                                {timeError && <p className="mt-1 text-[11px] text-red-600" role="alert">{timeError}</p>}
                            </div>
                        )}

                        {/* Notes */}
                        <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-slate-700">Notes</label>
                            <textarea rows="4" value={notes} onChange={(e) => setNotes(e.target.value)}
                                className="mt-1 block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        {/* Reminders */}
                        <div className="md:col-span-2 rounded-lg border border-slate-200 p-3">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={reminderEnabled}
                                    onChange={e => setReminderEnabled(e.target.checked)}
                                    className="h-3.5 w-3.5 rounded border-slate-300 accent-primary"
                                />
                                <span className="text-[11px] font-medium text-slate-700">Send WhatsApp reminder for this pill</span>
                            </label>
                            {reminderEnabled && (
                                <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed">
                                    Uses contact info from <strong>Settings → Contact Information</strong>.
                                    {!JSON.parse(localStorage.getItem('pillpal_settings') || '{}').patientPhone && (
                                        <span className="text-amber-500 ml-1">Contact info not set up yet.</span>
                                    )}
                                </p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="md:col-span-2 flex items-center justify-end pt-1">
                            <button type="submit" disabled={saving}
                                className="inline-flex items-center justify-center rounded bg-primary px-3 py-1.5 text-[11px] font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                        </div>

                        {saveError && <p className="md:col-span-2 text-[11px] text-red-600">{saveError}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PopupChart;
