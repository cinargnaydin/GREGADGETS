'use client';

import { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import { Save, AlertCircle, Plus, Trash2 } from 'lucide-react';

export default function ScheduleSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [overrides, setOverrides] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [overrideDate, setOverrideDate] = useState('');
  const [overrideStart, setOverrideStart] = useState('09:00');
  const [overrideEnd, setOverrideEnd] = useState('17:00');
  const [overrideClosed, setOverrideClosed] = useState(true);

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/schedule');
      const data = await res.json();
      setSettings(data.settings);
      setOverrides(data.overrides);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSettingsChange = (day: string, field: string, value: any) => {
    setSettings({
      ...settings,
      [day]: { ...settings[day], [field]: value }
    });
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'settings', data: settings }),
      });
      alert('Default schedule saved!');
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideDate) return;
    
    const newOverride = {
      date: overrideDate,
      isClosed: overrideClosed,
      startTime: overrideClosed ? null : overrideStart,
      endTime: overrideClosed ? null : overrideEnd,
    };

    try {
      await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'override', data: newOverride }),
      });
      setOverrides({ ...overrides, [overrideDate]: newOverride });
      
      // Reset form
      setOverrideDate('');
      setOverrideClosed(true);
      
    } catch (err) {
      alert('Failed to add override');
    }
  };

  const deleteOverride = async (date: string) => {
    try {
      await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'delete_override', data: { date } }),
      });
      
      const newOverrides = { ...overrides };
      delete newOverrides[date];
      setOverrides(newOverrides);
    } catch (err) {
      alert('Failed to delete override');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Schedule Settings</h1>

      {/* Default Hours */}
      <section className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Default Weekly Hours</h2>
            <p className="text-sm text-gray-500">Set the default working hours for normal weeks.</p>
          </div>
          <button 
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Default Hours'}
          </button>
        </div>

        <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-zinc-800 last:border-0">
              <div className="w-32">
                <span className="capitalize font-medium text-zinc-900 dark:text-gray-200">{day}</span>
              </div>
              
              <label className="flex items-center gap-2 w-32 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!settings?.[day]?.isClosed}
                  onChange={(e) => handleSettingsChange(day, 'isClosed', !e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 bg-gray-100 border-gray-300 dark:border-zinc-700 dark:bg-zinc-800"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Open</span>
              </label>

              {!settings?.[day]?.isClosed ? (
                <div className="flex items-center gap-2 flex-1">
                  <input 
                    type="time" 
                    value={settings?.[day]?.startTime || '09:00'}
                    onChange={(e) => handleSettingsChange(day, 'startTime', e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-32"
                  />
                  <span className="text-gray-400">to</span>
                  <input 
                    type="time" 
                    value={settings?.[day]?.endTime || '17:00'}
                    onChange={(e) => handleSettingsChange(day, 'endTime', e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-32"
                  />
                </div>
              ) : (
                <div className="flex-1 text-sm text-gray-500 italic">Day off</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Date Overrides */}
      <section className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Specific Date Overrides</h2>
          <p className="text-sm text-gray-500">Block out holidays, vacations, or set custom hours for specific days.</p>
        </div>

        <form onSubmit={addOverride} className="flex flex-wrap items-end gap-4 p-4 bg-gray-50 dark:bg-zinc-950/50 rounded-lg border border-gray-100 dark:border-zinc-800 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
            <input 
              type="date" 
              required
              min={format(new Date(), 'yyyy-MM-dd')}
              value={overrideDate}
              onChange={(e) => setOverrideDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 pb-2">
            <input 
              type="checkbox" 
              id="isClosed"
              checked={overrideClosed}
              onChange={(e) => setOverrideClosed(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 bg-gray-100 border-gray-300 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <label htmlFor="isClosed" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Closed all day</label>
          </div>

          {!overrideClosed && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Start</label>
                <input 
                  type="time" 
                  value={overrideStart}
                  onChange={(e) => setOverrideStart(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">End</label>
                <input 
                  type="time" 
                  value={overrideEnd}
                  onChange={(e) => setOverrideEnd(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
                />
              </div>
            </>
          )}

          <button 
            type="submit"
            className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-gray-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Date
          </button>
        </form>

        {Object.keys(overrides).length > 0 ? (
          <div className="space-y-3">
            {Object.keys(overrides).sort().map(date => {
              const ov = overrides[date];
              return (
                <div key={date} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-200 dark:border-zinc-800 rounded-lg gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium px-3 py-1.5 rounded-md text-sm">
                      {format(new Date(date), 'MMM d, yyyy')}
                    </div>
                    {ov.isClosed ? (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
                        <AlertCircle className="h-4 w-4" /> Store Closed
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Open {ov.startTime} - {ov.endTime}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => deleteOverride(date)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No custom dates configured.</p>
        )}
      </section>
    </div>
  );
}
