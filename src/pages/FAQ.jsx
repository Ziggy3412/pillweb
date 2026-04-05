import { useState } from 'react'

const FAQS = [
  {
    q: 'How does PillPal work?',
    a: "You, the caregiver, will set up the medication taker's schedule. Then, we will automatically send reminder messages on WhatsApp to the medication taker, who simply replies in the chat. You will get a confirmation or an alert depending on whether the medication was taken successfully or not.",
  },
  {
    q: 'Who is PillPal for?',
    a: 'PillPal is a tool built for caregivers who want a simple and automated way to remotely monitor the medicine schedules of loved ones.',
  },
  {
    q: "What happens if the medication taker doesn't reply?",
    a: "If the medication taker doesn't reply to PillPal's WhatsApp reminder within 30 minutes, the caregiver will receive an alert notifying them that the medicine was not taken successfully.",
  },
  {
    q: 'Do I need to download anything?',
    a: 'PillPal is entirely web-based for the caregiver—you set up the schedule on our website. The medication taker only needs WhatsApp (no separate PillPal app to install).',
  },
  {
    q: 'Does the medication taker need an account?',
    a: 'No, the caregiver can fully set up an account and medication schedule on their behalf. The medication taker simply receives reminders on WhatsApp.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(new Set())

  return (
    <div className="overflow-y-auto h-full bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-primary-dark mb-1">Frequently Asked Questions</h1>
        <p className="text-sm text-slate-500 mb-8">Everything you need to know about PillPal.</p>

        <div className="flex flex-col gap-2">
          {FAQS.map((item, i) => (
            <div key={i} className="rounded-xl border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen((prev) => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next; })}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-primary-dark hover:bg-slate-50 transition-colors"
              >
                <span>{item.q}</span>
                <svg
                  className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${open.has(i) ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {open.has(i) && (
                <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
