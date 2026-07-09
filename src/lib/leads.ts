import { getOptionalAdminDb } from '@/lib/firebase/firebase-admin';

export const LEAD_TYPES = ['repair', 'trade_in', 'contact', 'booking'] as const;
export const LEAD_STAGES = ['new', 'contacted', 'booked', 'won', 'lost'] as const;
export const LEAD_URGENCIES = ['today', 'tomorrow', 'this_week', 'flexible'] as const;
export const LEAD_PREFERRED_CONTACTS = ['pending', 'booking', 'whatsapp', 'phone', 'email'] as const;

export type LeadType = (typeof LEAD_TYPES)[number];
export type LeadStage = (typeof LEAD_STAGES)[number];
export type LeadUrgency = (typeof LEAD_URGENCIES)[number];
export type LeadPreferredContact = (typeof LEAD_PREFERRED_CONTACTS)[number];
export type LeadStorage = 'firestore' | 'memory';

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
type FirestoreData = Record<string, unknown>;

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
  if (typeof value === 'string' && value) return value;
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof value.toDate === 'function'
  ) {
    return value.toDate().toISOString();
  }

  return new Date().toISOString();
}

function stringValue(data: FirestoreData, key: string, fallback = '') {
  const value = data[key];
  return typeof value === 'string' ? value : fallback;
}

function booleanValue(data: FirestoreData, key: string, fallback = false) {
  const value = data[key];
  return typeof value === 'boolean' ? value : fallback;
}

function recordValue(data: FirestoreData, key: string) {
  const value = data[key];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).flatMap(([entryKey, entryValue]) =>
      typeof entryValue === 'string' ? [[entryKey, entryValue]] : []
    )
  );
}

function dropUndefined<T extends Record<string, unknown>>(data: T) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

function firestoreDocToLead(id: string, data: FirestoreData): LeadRecord {
  return {
    id,
    type: stringValue(data, 'type', 'repair') as LeadType,
    sourcePage: stringValue(data, 'sourcePage') || undefined,
    sourceUrl: stringValue(data, 'sourceUrl') || undefined,
    name: stringValue(data, 'name') || undefined,
    phone: stringValue(data, 'phone'),
    email: stringValue(data, 'email') || undefined,
    issue: stringValue(data, 'issue'),
    device: stringValue(data, 'device') || undefined,
    urgency: stringValue(data, 'urgency', 'flexible') as LeadUrgency,
    preferredContact: stringValue(data, 'preferredContact', 'pending') as LeadPreferredContact,
    consent: booleanValue(data, 'consent', true),
    stage: stringValue(data, 'stage', 'new') as LeadStage,
    appointmentId: stringValue(data, 'appointmentId') || undefined,
    notes: stringValue(data, 'notes') || undefined,
    utm: recordValue(data, 'utm'),
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
    storage: 'firestore',
  };
}

export async function createLead(input: LeadInput): Promise<LeadRecord> {
  const cleaned = cleanInput(input);
  const now = new Date();
  const baseLead = {
    ...cleaned,
    stage: 'new' as LeadStage,
    preferredContact: cleaned.preferredContact ?? 'pending',
    createdAt: now,
    updatedAt: now,
  };

  const db = getOptionalAdminDb();
  if (db) {
    const docRef = await db.collection('leads').add(dropUndefined(baseLead));
    return {
      ...cleaned,
      id: docRef.id,
      stage: 'new',
      preferredContact: cleaned.preferredContact ?? 'pending',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      storage: 'firestore',
    };
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
  const db = getOptionalAdminDb();
  if (db) {
    const snapshot = await db
      .collection('leads')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => firestoreDocToLead(doc.id, doc.data() as FirestoreData));
  }

  return getDevLeads().slice(0, limit);
}

export async function getLead(id: string): Promise<LeadRecord | null> {
  const db = getOptionalAdminDb();
  if (db) {
    const doc = await db.collection('leads').doc(id).get();
    if (!doc.exists) return null;

    return firestoreDocToLead(doc.id, doc.data() as FirestoreData);
  }

  return getDevLeads().find((lead) => lead.id === id) ?? null;
}

export async function updateLead(id: string, update: LeadUpdate): Promise<LeadRecord> {
  const now = new Date();
  const cleanedUpdate: LeadUpdate & { updatedAt: Date } = {
    ...update,
    notes: cleanOptional(update.notes),
    updatedAt: now,
  };

  const db = getOptionalAdminDb();
  if (db) {
    const docRef = db.collection('leads').doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      throw new Error('Lead not found');
    }

    await docRef.set(dropUndefined(cleanedUpdate), { merge: true });
    const updated = await docRef.get();
    return firestoreDocToLead(updated.id, updated.data() as FirestoreData);
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
