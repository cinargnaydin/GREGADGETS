import BookingWidget from '@/components/booking/BookingWidget';
import { getLead } from '@/lib/leads';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type BookAppointmentPageProps = {
  searchParams: Promise<{
    leadId?: string | string[];
    issue?: string | string[];
  }>;
};

export default async function BookAppointmentPage({ searchParams }: BookAppointmentPageProps) {
  const params = await searchParams;
  const leadId = firstParam(params.leadId);
  const lead = leadId ? await getLead(leadId).catch(() => null) : null;
  const issue = firstParam(params.issue) ?? lead?.issue;
  const initialCustomer = lead
    ? {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mb-8">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-black text-center mb-2">
          Schedule Your Visit
        </h1>
        <p className="text-gray-500 text-center max-w-xl mx-auto">
          Choose a convenient time from our available slots below. We will send you a confirmation once your booking is complete.
        </p>
      </div>

      <BookingWidget leadId={leadId} issue={issue} initialCustomer={initialCustomer} />
    </div>
  );
}

function firstParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}
