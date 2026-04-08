function formatSchedule(pill) {
    const s = pill.schedule;
    if (!s) {
        // legacy pill saved before schedule field existed
        return Array.isArray(pill.times) ? pill.times.join(', ') : pill.times || '—';
    }
    const timeStr = s.times?.length ? `at ${s.times.join(', ')}` : '';
    switch (s.frequency) {
        case 'every_day':       return ['Every day', timeStr].filter(Boolean).join(' ');
        case 'every_other_day': return ['Every other day', timeStr].filter(Boolean).join(' ');
        case 'specific_days':   return [`${s.days?.join(', ') || ''}`, timeStr].filter(Boolean).join(' ');
        case 'every_x_days':    return [`Every ${s.interval} days`, timeStr].filter(Boolean).join(' ');
        case 'every_x_months':  return [`Every ${s.interval} months`, timeStr].filter(Boolean).join(' ');
        case 'as_needed':       return 'As needed';
        default:                return timeStr || '—';
    }
}

function TrashIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
            className="w-3.5 h-3.5">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
            className="w-3.5 h-3.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

function ChartChart({ pills = [], onDelete, onEdit }) {
    return (
        <div className="p-6 pt-16">
            <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold text-primary-dark">Pill Chart</div>
                        <div className="text-xs text-slate-500">Click a note to expand</div>
                    </div>
                    <div className="text-xs text-slate-500">
                        {pills.length} {pills.length === 1 ? 'pill' : 'pills'}
                    </div>
                </div>

                <div>
                    {pills.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="text-sm font-semibold text-slate-700">No pills yet</div>
                            <div className="text-xs text-slate-500 mt-1">Click "Add" to create one.</div>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="text-xs text-slate-500 border-b border-slate-200">
                                    <th className="text-left font-medium px-4 py-3">Name</th>
                                    <th className="text-left font-medium px-4 py-3">Medication</th>
                                    <th className="text-left font-medium px-4 py-3">Dosage</th>
                                    <th className="text-left font-medium px-4 py-3">Schedule</th>
                                    <th className="text-left font-medium px-4 py-3">Urgency</th>
                                    <th className="text-left font-medium px-4 py-3">Notes</th>
                                    <th className="px-4 py-3" />
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pills.map((pill) => (
                                    <tr key={pill.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-xs text-slate-700">{pill.name}</td>
                                        <td className="px-4 py-3 text-xs text-slate-700">{pill.medication}</td>
                                        <td className="px-4 py-3 text-xs text-slate-700">{pill.dosage}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{formatSchedule(pill)}</td>
                                        <td className="px-4 py-3 text-xs">
                                            <span className="font-medium" style={{ color: pill.urgency >= 4 ? '#f87171' : pill.urgency === 3 ? '#facc15' : '#4ade80' }}>
                                                {'★'.repeat(pill.urgency)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{pill.notes}</td>
                                        <td className="px-4 py-3">
                                            {pill.reminderEnabled && (
                                                <span title="WhatsApp reminder active" className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5">
                                                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-primary">
                                                        <path d="M13 9.5a1 1 0 0 1-1 1H3l-2 2V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1z" />
                                                    </svg>
                                                    <span className="text-[10px] font-semibold text-primary">WhatsApp</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit?.(pill)}
                                                    className="text-slate-400 hover:text-blue-500 transition-colors"
                                                    aria-label="Edit"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete?.(pill.id)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                    aria-label="Delete"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChartChart;
