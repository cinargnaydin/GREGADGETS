'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Wrench, Info } from 'lucide-react';
import { track } from '@vercel/analytics/react';
import { siteConfig } from '@/content/site';

type Step = 'issue' | 'schedule';

type BookingWidgetProps = {
  issue?: string;
};

export default function BookingWidget({ issue }: BookingWidgetProps) {
  // When an issue is supplied (e.g. via ?issue= on the URL) we pre-select it and
  // jump straight to the scheduler; otherwise the customer picks the repair first.
  const [step, setStep] = useState<Step>(issue ? 'schedule' : 'issue');
  const [selectedIssue, setSelectedIssue] = useState<string>(issue ?? '');

  // The Google scheduler owns date, time, guest details, the calendar write and
  // confirmations. We can't pass the repair into the embed, so it's surfaced to
  // the customer as a note to include in the booking. Fire one analytics event
  // when the scheduler is opened so we can still measure booking intent.
  useEffect(() => {
    if (step === 'schedule') {
      track('booking_scheduler_opened', { issue: selectedIssue || 'not_provided' });
    }
  }, [step, selectedIssue]);

  const isSchedule = step === 'schedule';

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mx-auto w-full transition-[max-width] ${
        isSchedule ? 'max-w-3xl' : 'max-w-xl'
      }`}
    >
      {/* Header */}
      <div className="bg-brand-red p-6 border-b border-brand-red-dark">
        <h2 className="text-xl font-bold text-white">Book an Appointment</h2>
        <div className="flex items-center gap-2 mt-4 text-sm font-medium">
          <span className={step === 'issue' ? 'text-white' : 'text-red-200'}>Repair</span>
          <ChevronRight className="h-4 w-4 text-red-300" />
          <span className={step === 'schedule' ? 'text-white' : 'text-red-200'}>Pick a time</span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* STEP 1: ISSUE */}
        {step === 'issue' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-lg font-medium text-black mb-4 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-gray-400" /> What needs fixing?
            </h3>
            <p className="text-sm text-gray-500 mb-2">Choose the repair you would like to book.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {siteConfig.repairIssues.map((option) => {
                const isSelected = selectedIssue === option;
                return (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedIssue(option);
                      setStep('schedule');
                    }}
                    className={`p-3 rounded-xl border text-left font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'bg-brand-red border-brand-red text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-900 hover:border-red-400 hover:bg-red-50'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: SCHEDULE (Google Appointment Scheduling embed) */}
        {step === 'schedule' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            {/* Only offer "back" when the repair step is part of this flow. */}
            {!issue && (
              <button
                onClick={() => setStep('issue')}
                className="text-sm text-gray-500 hover:text-black transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Back to Repair
              </button>
            )}

            {selectedIssue && (
              <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-900">
                <Info className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="uppercase tracking-widest text-xs opacity-80 mb-1">Selected repair</div>
                  <div className="font-semibold">{selectedIssue}</div>
                  <p className="mt-2 opacity-90">
                    Please mention <strong>{selectedIssue}</strong> in the notes when you book below so we can prepare for your visit.
                  </p>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500">
              Pick a date and time that suits you. You&apos;ll get a confirmation from Google once your booking is complete.
            </p>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <iframe
                src={siteConfig.bookingScheduleUrl}
                title="Book an appointment with Greenwich Gadgets"
                className="w-full h-[680px] border-0"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
