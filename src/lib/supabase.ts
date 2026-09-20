import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://alahmdlzbmmxgbkqrdux.supabase.co";
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_V189k3Jz2tZ01oKDXWOW6g_ngjZ1qm1";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Organization = {
  id: string;
  name: string;
  slug: string | null;
  segment: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  description: string | null;
  timezone: string;
  onboarding_completed: boolean;
};

export type Service = {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  professional_id: string | null;
  is_active: boolean;
};

export type Professional = {
  id: string;
  organization_id: string;
  name: string;
  role_title: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
};

export type Client = {
  id: string;
  organization_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

export type Appointment = {
  id: string;
  organization_id: string;
  client_id: string | null;
  service_id: string | null;
  professional_id: string | null;
  starts_at: string;
  ends_at: string;
  status: string;
  notes: string | null;
  created_by_ai: boolean;
  clients?: { name: string; phone: string | null } | null;
  services?: { name: string } | null;
  professionals?: { name: string } | null;
};
