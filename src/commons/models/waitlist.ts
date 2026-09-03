export interface WaitlistEntry {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  origin: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
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
  origin: string;
  status: string;
  createdAt: string;
}
