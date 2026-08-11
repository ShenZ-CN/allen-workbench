import { getSupabase } from "@/lib/supabase";
import type { Customer360 } from "@/lib/types";
export async function listCustomers(): Promise<Customer360[]> { const { data, error } = await getSupabase().from("customer_360").select("*").order("value_score", { ascending: false }); if (error) throw error; return data as Customer360[]; }
