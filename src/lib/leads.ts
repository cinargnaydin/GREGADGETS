import { getOptionalSupabaseAdmin } from '@/lib/supabase/supabase-admin';

export const LEAD_TYPES = ['repair', 'trade_in', 'contact', 'booking'] as const;
export const LEAD_STAGES = ['new', 'contacted', 'booked', 'won', 'lost'] as const;
export const LEAD_URGENCIES = ['today', 'tomorrow', 'this_week', 'flexible'] as const;
export const LEAD_PREFERRED_CONTACTS = ['pending', 'booking', 'whatsapp', 'phone', 'email'] as const;

export type LeadType = (typeof LEAD_TYPES)[number];
export type LeadStage = (typeof LEAD_STAGES)[number];
export type LeadUrgency = (typeof LEAD_URGENCIES)[number];
export type LeadPreferredContact = (typeof LEAD_PREFERRED_CONTACTS)[number];
export type LeadStorage = 'supabase' | 'memory';

export type LeadInput = {
  type: LeadType;
  sourcePage?: string;
  sourceUrl?: string;
  name?: string;
  phone: string;
  email?: string;
  issue: string;
  device?: string;
  urgency: LeadUrgency;
  preferredContact?: LeadPreferredContact;
  consent: boolean;
  utm?: Record<string, string>;
};

export type LeadRecord = Omit<LeadInput, 'consent'> & {
  id: string;
  stage: LeadStage;
  preferredContact: LeadPreferredContact;
  consent: boolean;
  appointmentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  storage: LeadStorage;
};

type LeadUpdate = Partial<Pick<LeadRecord, 'stage' | 'preferredContact' | 'appointmentId' | 'notes'>>;
type SupabaseRow = Record<string, unknown>;

declare global {
  var __greenwichGadgetsDevLeads: LeadRecord[] | undefined;
}

function getDevLeads() {
  globalThis.__greenwichGadgetsDevLeads ??= [];
  return globalThis.__greenwichGadgetsDevLeads;
}

function cleanOptional(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function cleanInput(input: LeadInput): LeadInput {
  return {
    ...input,
    sourcePage: cleanOptional(input.sourcePage),
    sourceUrl: cleanOptional(input.sourceUrl),
    name: cleanOptional(input.name),
    phone: input.phone.trim(),
    email: cleanOptional(input.email),
    issue: input.issue.trim(),
    device: cleanOptional(input.device),
    preferredContact: input.preferredContact ?? 'pending',
    utm: input.utm ?? {},
  };
}

function timestampToIso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string' && value) return new Date(value).toISOString();
  return new Date().toISOString();
}

function stringValue(data: SupabaseRow, key: string, fallback = '') {
  const value = data[key];
  return typeof value === 'string' ? value : fallback;
}

function booleanValue(data: SupabaseRow, key: string, fallback = false) {
  const value = data[key];
  return typeof value === 'boolean' ? value : fallback;
}

function recordValue(data: SupabaseRow, key: string) {
  const value = data[key];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).flatMap(([entryKey, entryValue]) =>
      typeof entryValue === 'string' ? [[entryKey, entryValue]] : []
    )
  );
}

// Drop keys whose value is undefined so we never write `undefined` into a column.
function dropUndefined<T extends Record<string, unknown>>(data: T) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

// Map a camelCase LeadInput into the snake_case Postgres row shape.
function leadInputToRow(cleaned: LeadInput): SupabaseRow {
  return dropUndefined({
    type: cleaned.type,
    source_page: cleaned.sourcePage,
    source_url: cleaned.sourceUrl,
    name: cleaned.name,
    phone: cleaned.phone,
    email: cleaned.email,
    issue: cleaned.issue,
    device: cleaned.device,
    urgency: cleaned.urgency,
    preferred_contact: cleaned.preferredContact ?? 'pending',
    consent: cleaned.consent,
    utm: cleaned.utm ?? {},
  });
}

function supabaseRowToLead(data: SupabaseRow): LeadRecord {
  return {
    id: String(data.id),
    type: stringValue(data, 'type', 'repair') as LeadType,
    sourcePage: stringValue(data, 'source_page') || undefined,
    sourceUrl: stringValue(data, 'source_url') || undefined,
    name: stringValue(data, 'name') || undefined,
    phone: stringValue(data, 'phone'),
    email: stringValue(data, 'email') || undefined,
    issue: stringValue(data, 'issue'),
    device: stringValue(data, 'device') || undefined,
    urgency: stringValue(data, 'urgency', 'flexible') as LeadUrgency,
    preferredContact: stringValue(data, 'preferred_contact', 'pending') as LeadPreferredContact,
    consent: booleanValue(data, 'consent', true),
    stage: stringValue(data, 'stage', 'new') as LeadStage,
    appointmentId: stringValue(data, 'appointment_id') || undefined,
    notes: stringValue(data, 'notes') || undefined,
    utm: recordValue(data, 'utm'),
    createdAt: timestampToIso(data.created_at),
    updatedAt: timestampToIso(data.updated_at),
    storage: 'supabase',
  };
}

export async function createLead(input: LeadInput): Promise<LeadRecord> {
  const cleaned = cleanInput(input);
  const now = new Date();

  const db = getOptionalSupabaseAdmin();
  if (db) {
    const { data, error } = await db
      .from('leads')
      .insert(leadInputToRow(cleaned))
      .select('*')
      .single();

    if (error) throw error;
    return supabaseRowToLead(data as SupabaseRow);
  }

  const lead: LeadRecord = {
    ...cleaned,
    id: `dev-lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    stage: 'new',
    preferredContact: cleaned.preferredContact ?? 'pending',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    storage: 'memory',
  };

  getDevLeads().unshift(lead);
  return lead;
}

export async function listLeads(limit = 100): Promise<LeadRecord[]> {
  const db = getOptionalSupabaseAdmin();
  if (db) {
    const { data, error } = await db
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data as SupabaseRow[]).map(supabaseRowToLead);
  }

  return getDevLeads().slice(0, limit);
}

export async function getLead(id: string): Promise<LeadRecord | null> {
  const db = getOptionalSupabaseAdmin();
  if (db) {
    const { data, error } = await db.from('leads').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? supabaseRowToLead(data as SupabaseRow) : null;
  }

  return getDevLeads().find((lead) => lead.id === id) ?? null;
}

export async function updateLead(id: string, update: LeadUpdate): Promise<LeadRecord> {
  const now = new Date();

  const db = getOptionalSupabaseAdmin();
  if (db) {
    const row = dropUndefined({
      stage: update.stage,
      preferred_contact: update.preferredContact,
      appointment_id: update.appointmentId,
      notes: cleanOptional(update.notes),
      updated_at: now.toISOString(),
    });

    const { data, error } = await db
      .from('leads')
      .update(row)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Lead not found');
    return supabaseRowToLead(data as SupabaseRow);
  }

  const leads = getDevLeads();
  const index = leads.findIndex((lead) => lead.id === id);

  if (index === -1) {
    throw new Error('Lead not found');
  }

  leads[index] = {
    ...leads[index],
    ...update,
    notes: cleanOptional(update.notes),
    updatedAt: now.toISOString(),
  };

  return leads[index];
}
