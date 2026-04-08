import { useState } from 'react';

const HOW_STEPS = [
  {
    label: 'Create an Account',
    description: 'Create an account as the caregiver and link the medication taker\'s contact information.',
    icon: '👤',
  },
  {
    label: 'Setup Medication Schedule',
    description: 'Create the medication taker\'s medication schedule for them.',
    icon: '💊',
  },
  {
    label: 'Automated Reminders',
    description: 'Send automated, timely WhatsApp reminders to the medication taker hands free.',
    icon: '🔔',
  },
  {
    label: 'Confirmation Messages',
    description: 'Get automatic logs of when medication is taken (or missed) with status updates and alert options for loved ones.',
    icon: '✅',
  },
];

const WHY_ITEMS = [
  {
    title: 'Simple',
    description: 'The medication taker receives WhatsApp reminders with no setup required on their part.',
  },
  {
    title: 'Remote',
    description: "Set up the medication taker's schedule remotely without the need to be there in person.",
  },
  {
    title: 'Reliable',
    description: 'Receive confirmation or alert WhatsApp messages when the medication taker successfully takes (or misses) a dose.',
  },
];

export default function Dashboard() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeWhy, setActiveWhy] = useState(1);

  return (
    <div className="overflow-y-auto h-full bg-white text-slate-800">

      {/* ── Hero ── */}
      <section className="px-12 py-16 flex items-center justify-between max-w-5xl mx-auto">
        <div className="max-w-md">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-1">Subscribe to</p>
          <h1 className="text-5xl font-bold text-[#2d3a5e] leading-tight mb-4">PillPal</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            With our subscription service you will never need to stress about reminding
            those you love about their medication again. That's our job now!
          </p>
          <div className="flex items-center gap-4">
            <button className="bg-[#8b9fd4] hover:bg-[#7a8fc4] text-white font-medium px-6 py-2.5 rounded-lg transition-colors cursor-default">
              Start Now
            </button>
            <button className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium transition-colors cursor-default">
              <span className="w-6 h-6 rounded-full border-2 border-slate-400 flex items-center justify-center text-xs">▶</span>
              See how it works
            </button>
          </div>
        </div>

        {/* Logo mark */}
        <div className="flex items-center gap-3 text-[#2d3a5e]">
          <div className="w-16 h-16 relative">
            <div className="w-16 h-10 bg-[#8b9fd4] rounded-t-full" />
            <div className="w-16 h-8 bg-[#3d5a9e] rounded-b-full flex items-center justify-center">
              <span className="text-white text-lg">✓</span>
            </div>
          </div>
          <span className="text-4xl font-bold">PillPal</span>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="px-12 py-14 max-w-5xl mx-auto flex items-center gap-12">
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-[#2d3a5e] leading-tight mb-4">
            Medication management is a problem.
          </h2>
          <p className="text-slate-500 leading-relaxed mb-6">
            59% of patients taking maintenance medication have forgotten a dose before.
            Managing multiple medication schedules and medications for multiple people is
            even tougher, but PillPal can help.
          </p>
          <button className="bg-[#8b9fd4] hover:bg-[#7a8fc4] text-white font-medium px-5 py-2 rounded-lg transition-colors cursor-default text-sm">
            Explore PillPal solutions
          </button>
        </div>
        <div className="text-[120px] select-none">💊</div>
      </section>

      {/* ── How it solves ── */}
      <section className="py-14 bg-[#eef2fb] rounded-2xl mx-8 mb-8">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-[#2d3a5e] text-center mb-2">How PillPal Solves Your Problem</h2>
          <p className="text-slate-500 text-center mb-8 text-sm">
            Stay on top of medication with PillPal. Learn more about how our solution helps you below.
          </p>

          {/* Tabs */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {HOW_STEPS.map((step, i) => (
              <button
                key={step.label}
                onClick={() => setActiveStep(i)}
                className={`p-4 rounded-xl text-center text-sm font-medium transition-all cursor-default border ${
                  activeStep === i
                    ? 'bg-white text-[#2d3a5e] border-white shadow-sm font-semibold'
                    : 'bg-white/50 text-slate-400 border-transparent'
                }`}
              >
                {step.label}
                {activeStep === i && <div className="mt-2 h-0.5 w-8 bg-[#2d3a5e] mx-auto rounded-full" />}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="text-center">
            <p className="text-slate-600 text-sm mb-8">{HOW_STEPS[activeStep].description}</p>
            <div className="text-[100px] select-none">{HOW_STEPS[activeStep].icon}</div>
          </div>
        </div>
      </section>

      {/* ── Why PillPal ── */}
      <section className="px-12 py-14 max-w-5xl mx-auto flex items-start gap-16">
        <div className="text-[120px] select-none flex-shrink-0">👩‍💻</div>

        <div className="flex-1">
          <h2 className="text-3xl font-bold text-[#2d3a5e] mb-2">Why PillPal?</h2>
          <p className="text-slate-500 text-sm mb-6">
            Take control of medication with a simple, remote, and reliable solution.
          </p>

          <div className="space-y-2">
            {WHY_ITEMS.map((item, i) => (
              <button
                key={item.title}
                onClick={() => setActiveWhy(i)}
                className={`w-full text-left px-5 py-4 rounded-xl transition-all cursor-default ${
                  activeWhy === i ? 'bg-[#eef2fb]' : 'hover:bg-slate-50'
                }`}
              >
                <p className={`font-semibold text-sm ${activeWhy === i ? 'text-[#2d3a5e]' : 'text-slate-400'}`}>
                  {item.title}
                </p>
                {activeWhy === i && (
                  <>
                    <p className="text-slate-500 text-sm mt-1">{item.description}</p>
                    <div className="mt-3 h-0.5 w-10 bg-[#2d3a5e] rounded-full" />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="px-12 py-14 max-w-5xl mx-auto flex items-center justify-between border-t border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-[#2d3a5e] mb-2">Still have questions?</h3>
          <p className="text-slate-500 text-sm max-w-sm">
            Check out our FAQ. If you cannot find the answer to your question in our FAQ,
            you can always contact us.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#8b9fd4] hover:bg-[#7a8fc4] text-white font-medium px-6 py-2.5 rounded-lg transition-colors cursor-default text-sm">
            FAQ
          </button>
          <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-6 py-2.5 rounded-lg transition-colors cursor-default text-sm">
            Contact Us
          </button>
        </div>
      </section>

    </div>
  );
}
