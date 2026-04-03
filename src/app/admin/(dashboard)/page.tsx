'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Trash2, Phone, Mail, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  startTime: string;
  endTime: string;
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/admin/appointments?future=true');
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel and delete this appointment?')) return;
    
    try {
      await fetch(`/api/admin/appointments?id=${id}`, { method: 'DELETE' });
      setAppointments(appointments.filter(app => app.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete appointment');
    }
  };

  if (loading) return <div className="text-zinc-500">Loading appointments...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Upcoming Appointments</h1>
      
      {appointments.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-12 text-center">
          <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No upcoming appointments</h3>
          <p className="text-gray-500 mt-2">When customers book, they will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((app) => (
            <div key={app.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="grid md:grid-cols-2 gap-4 flex-1">
                <div>
                  <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">{app.name}</h3>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <Mail className="h-4 w-4" /> <span>{app.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <Phone className="h-4 w-4" /> <span>{app.phone}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg w-max">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{format(parseISO(app.startTime), 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mt-2 font-medium px-3">
                    <Clock className="h-4 w-4" />
                    <span>{format(parseISO(app.startTime), 'h:mm a')} - {format(parseISO(app.endTime), 'h:mm a')}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(app.id)}
                className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors self-start md:self-center"
                title="Cancel Appointment"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
