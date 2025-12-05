import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Profile = {
  tone: string;
  focus: string;
  style: string;
  pace: string;
  address: string;
};

export type Session = {
  id: string;
  mode: "text" | "avatar";
  profile: Profile;
  step: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  session_id: string;
  sender: "user" | "agent";
  text: string;
  step: string;
  created_at: string;
};
