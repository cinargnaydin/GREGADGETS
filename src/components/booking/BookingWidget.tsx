'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { Calendar, Clock, User, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { track } from '@vercel/analytics/react';

type Step = 'date' | 'time' | 'details' | 'success';

type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
};

type ContactField = {
  key: keyof CustomerDetails;
  label: string;
  type: 'text' | 'email' | 'tel';
  placeholder: string;
  withIcon?: boolean;
};

type BookingWidgetProps = {
  leadId?: string;
  issue?: string;
  initialCustomer?: Partial<CustomerDetails>;
};

const contactFields: ContactField[] = [
  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', withIcon: true },
  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
  { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000' },
];

// Matches a single address with a non-empty local part, an @, a dotted domain,
// and a 2+ char TLD. Rejects "john@example", "a@b", trailing dots, and spaces.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function createInitialFormData(initialCustomer?: Partial<CustomerDetails>): CustomerDetails {
  return {
    name: initialCustomer?.name ?? '',
    email: initialCustomer?.email ?? '',
    phone: initialCustomer?.phone ?? '',
  };
}

export default function BookingWidget({ leadId, issue, initialCustomer }: BookingWidgetProps) {
  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingContactDetails, setEditingContactDetails] = useState(false);

  const [formData, setFormData] = useState<CustomerDetails>(() => createInitialFormData(initialCustomer));
  const contactSummaryFields = contactFields.filter((field) => formData[field.key].trim());
  const hasCompleteContactDetails = contactFields.every((field) => formData[field.key].trim());
  const visibleContactFields = editingContactDetails
    ? contactFields
    : contactFields.filter((field) => !formData[field.key].trim());
  const showContactSummary = contactSummaryFields.length > 0 && !editingContactDetails;

  // Calendar dates generation (next 14 days)
  const today = startOfToday();
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(today, i + 1)); // start tomorrow

  useEffect(() => {
    if (!selectedDate) return;

    // Guard against out-of-order responses: if the date changes before this
    // request resolves, a late response must not overwrite the newer slots.
    let ignore = false;
    setLoadingSlots(true);
    setError('');
    setAvailableSlots([]); // clear stale slots from the previous date

    fetch(`/api/appointments/available-slots?date=${format(selectedDate, 'yyyy-MM-dd')}`)
      .then(res => res.json())
      .then(data => {
        if (ignore) return;
        if (data.slots) setAvailableSlots(data.slots);
        else if (data.error) setError(data.error);
      })
      .catch(() => {
        if (!ignore) setError('Failed to load times');
      })
      .finally(() => {
        if (!ignore) setLoadingSlots(false);
      });

    return () => {
      ignore = true;
    };
  }, [selectedDate]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    const cleanedFormData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    };

    if (!cleanedFormData.name || !cleanedFormData.email || !cleanedFormData.phone) {
      setError('Please complete your contact details.');
      return;
    }

    if (!EMAIL_REGEX.test(cleanedFormData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cleanedFormData,
          ...(leadId ? { leadId } : {}),
          ...(issue ? { issue } : {}),
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep('success');
        track('booking_confirmed', {
          sourcePage: leadId ? 'lead_funnel' : 'book',
          issue: issue || 'not_provided',
        });
      } else {
        setError(data.error || 'Failed to book appointment');
      }
    } catch {
      setError('A network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100  overflow-hidden max-w-xl mx-auto w-full">
      {/* Header */}
      <div className="bg-brand-red p-6 border-b border-brand-red-dark">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {step === 'success' ? 'Booking Confirmed' : 'Book an Appointment'}
        </h2>
        {step !== 'success' && (
          <div className="flex items-center gap-2 mt-4 text-sm font-medium">
            <span className={step === 'date' ? 'text-white' : 'text-red-200'}>Date</span>
            <ChevronRight className="h-4 w-4 text-red-300" />
            <span className={step === 'time' ? 'text-white' : 'text-red-200'}>Time</span>
            <ChevronRight className="h-4 w-4 text-red-300" />
            <span className={step === 'details' ? 'text-white' : 'text-red-200'}>Details</span>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-brand-red rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* STEP 1: DATE */}
        {step === 'date' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-lg font-medium text-black  mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" /> Select a Date
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableDates.map((date) => {
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                      setStep('time');
                    }}
                    className={`p-3 rounded-xl border text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'bg-brand-red border-brand-red text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-900 hover:border-red-400 hover:bg-red-50'
                    }`}
                  >
                    <div className="text-xs uppercase tracking-wider mb-1 opacity-80">{format(date, 'EEE')}</div>
                    <div className="text-lg font-bold">{format(date, 'MMM d')}</div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 2: TIME */}
        {step === 'time' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <button
              onClick={() => { setError(''); setStep('date'); }}
              className="text-sm text-gray-500 hover:text-black transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red flex items-center gap-1 mb-4"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Date
            </button>
            <h3 className="text-lg font-medium text-black  mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" /> Select a Time
            </h3>
            <div className="text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100 ">
              Showing availability for <strong className="text-black ">{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</strong>
            </div>
            
            {loadingSlots ? (
              <div className="py-8 text-center text-gray-500">Checking availability...</div>
            ) : availableSlots.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500 mb-4">No available times on this date.</p>
                <button 
                  onClick={() => setStep('date')}
                  className="text-brand-red font-medium hover:underline"
                >
                  Choose another date
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                    key={time}
                    onClick={() => {
                      setError('');
                      setSelectedTime(time);
                      setStep('details');
                      track('slot_selected', {
                        sourcePage: leadId ? 'lead_funnel' : 'book',
                        issue: issue || 'not_provided',
                      });
                    }}
                      className={`p-3 rounded-xl border text-center transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 ${
                        isSelected
                          ? 'bg-brand-red border-brand-red text-white shadow-md'
                          : 'bg-white border-gray-200 text-gray-900 hover:border-red-400 hover:bg-red-50'
                      }`}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: DETAILS */}
        {step === 'details' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <button
              onClick={() => { setError(''); setStep('time'); }}
              className="text-sm text-gray-500 hover:text-black transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red flex items-center gap-1 mb-4"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Time
            </button>
            
            <div className="bg-red-50 text-red-900 p-4 rounded-xl mb-6 font-medium flex justify-between items-center">
              <div>
                {issue && (
                  <>
                    <div className="text-sm opacity-80 uppercase tracking-widest mb-1">Selected Repair</div>
                    <div>{issue}</div>
                    <div className="text-sm opacity-80 uppercase tracking-widest mt-3 mb-1">Selected Slot</div>
                  </>
                )}
                {!issue && <div className="text-sm opacity-80 uppercase tracking-widest mb-1">Selected Slot</div>}
                <div>{selectedDate && format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}</div>
              </div>
            </div>

            <form onSubmit={handleBook} className="space-y-5">
              {showContactSummary && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-900">Contact details</div>
                      <div className="mt-3 space-y-2 text-sm">
                        {contactSummaryFields.map((field) => (
                          <div key={field.key} className="flex justify-between gap-4">
                            <span className="text-gray-500">{field.label}</span>
                            <span className="truncate text-right font-medium text-gray-900">
                              {formData[field.key]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingContactDetails(true)}
                      className="text-sm font-semibold text-brand-red hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {visibleContactFields.length > 0 && (
                <>
                  {showContactSummary && (
                    <p className="text-sm text-gray-500">Add the missing details to confirm this booking.</p>
                  )}

                  {visibleContactFields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700  mb-1.5 ml-1">
                        {field.label}
                      </label>
                      <div className="relative">
                        {field.withIcon && (
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <input
                          type={field.type}
                          required
                          value={formData[field.key]}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          className={`w-full ${field.withIcon ? 'pl-11 pr-4' : 'px-4'} py-3 rounded-xl border border-gray-200  bg-white text-black  focus:ring-2 focus:ring-brand-red outline-none`}
                          placeholder={field.placeholder}
                        />
                      </div>
                    </div>
                  ))}
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !hasCompleteContactDetails}
                className="w-full mt-2 bg-brand-red text-white font-bold text-lg py-4 rounded-xl hover:bg-brand-red-dark transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'success' && (
          <div className="text-center py-8 animate-in zoom-in-95">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-black  mb-2">You are all set!</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Your {issue && <><strong>{issue}</strong> </>}appointment for <strong>{selectedDate && format(selectedDate, 'MMM d')}</strong> at <strong>{selectedTime}</strong> has been confirmed. We have sent you an email and SMS confirmation.
            </p>
            <button
              onClick={() => {
                setStep('date');
                setSelectedDate(null);
                setSelectedTime(null);
                setEditingContactDetails(false);
                setFormData(createInitialFormData(initialCustomer));
              }}
              className="bg-gray-100 hover:bg-gray-200 text-black font-medium px-6 py-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
            >
              Book Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
