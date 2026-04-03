import Link from 'next/link';
import { CalendarDays, Settings, Users, ArrowLeft } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-white">
      <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 hidden md:block">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <CalendarDays className="h-6 w-6 text-blue-600" />
            Booking Admin
          </Link>
        </div>
        <nav className="mt-6 px-4 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
            <Users className="h-5 w-5" />
            Appointments
          </Link>
          <Link href="/admin/schedule" className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
            <Settings className="h-5 w-5" />
            Schedule Settings
          </Link>
          <Link href="/" className="flex items-center gap-2 px-4 py-2 mt-8 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
