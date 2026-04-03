'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { Calendar, Clock, User, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';

type Step = 'date' | 'time' | 'details' | 'success';

export default function BookingWidget() {
  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Calendar dates generation (next 14 days)
  const today = startOfToday();
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(today, i + 1)); // start tomorrow

  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      setError('');
      // Fetch available times
      fetch(`/api/appointments/available-slots?date=${format(selectedDate, 'yyyy-MM-dd')}`)
        .then(res => res.json())
        .then(data => {
          if (data.slots) setAvailableSlots(data.slots);
          else if (data.error) setError(data.error);
        })
        .catch(() => setError('Failed to load times'))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep('success');
      } else {
        setError(data.error || 'Failed to book appointment');
      }
    } catch (err) {
      setError('An network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white rounded-2xl shadow-xl border border-gray-100  overflow-hidden max-w-xl mx-auto w-full">
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
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-brand-red dark:text-red-400 rounded-xl flex items-start gap-3">
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
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isSelected 
                        ? 'bg-brand-red border-brand-red text-white shadow-md' 
                        : 'bg-white border-gray-200 dark:bg-gray-50  text-gray-900  hover:border-red-400 hover:bg-red-50 dark:hover:bg-zinc-800'
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
              onClick={() => setStep('date')}
              className="text-sm text-gray-500 hover:text-black dark:hover:text-white flex items-center gap-1 mb-4"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Date
            </button>
            <h3 className="text-lg font-medium text-black  mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" /> Select a Time
            </h3>
            <div className="text-sm text-gray-500 mb-4 bg-gray-50 dark:bg-gray-50 p-3 rounded-lg border border-gray-100 ">
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
                        setSelectedTime(time);
                        setStep('details');
                      }}
                      className={`p-3 rounded-xl border text-center transition-all font-medium ${
                        isSelected 
                          ? 'bg-brand-red border-brand-red text-white shadow-md' 
                          : 'bg-white border-gray-200 dark:bg-gray-50  text-gray-900  hover:border-red-400 hover:bg-red-50 dark:hover:bg-zinc-800'
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
              onClick={() => setStep('time')}
              className="text-sm text-gray-500 hover:text-black dark:hover:text-white flex items-center gap-1 mb-4"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Time
            </button>
            
            <div className="bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 p-4 rounded-xl mb-6 font-medium flex justify-between items-center">
              <div>
                <div className="text-sm opacity-80 uppercase tracking-widest mb-1">Selected Slot</div>
                <div>{selectedDate && format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}</div>
              </div>
            </div>

            <form onSubmit={handleBook} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1.5 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200  bg-white dark:bg-gray-50 text-black  focus:ring-2 focus:ring-brand-red outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1.5 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200  bg-white dark:bg-gray-50 text-black  focus:ring-2 focus:ring-brand-red outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1.5 ml-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200  bg-white dark:bg-gray-50 text-black  focus:ring-2 focus:ring-brand-red outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
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
            <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-black  mb-2">You're all set!</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Your appointment for <strong>{selectedDate && format(selectedDate, 'MMM d')}</strong> at <strong>{selectedTime}</strong> has been confirmed. We've sent you an email and SMS confirmation.
            </p>
            <button
              onClick={() => {
                setStep('date');
                setSelectedDate(null);
                setSelectedTime(null);
                setFormData({name:'', email:'', phone:''});
              }}
              className="bg-gray-100 hover:bg-gray-200  dark:hover:bg-zinc-700 text-black  font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Book Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
