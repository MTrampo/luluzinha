export interface WaitlistEntry {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  origin: string | null;
  status: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface WaitlistCreateInput {
  name: string;
  phone?: string | null;
  email?: string | null;
  origin?: string;
  notes?: string | null;
}

export interface WaitlistFormatted {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  origin: string | null;
  status: string | null;
  createdAt: string | null;
}
