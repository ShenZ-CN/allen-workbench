import { getSupabase } from "@/lib/supabase";
import type { RfqPipelineRow } from "@/lib/types";
export async function listRfqs(): Promise<RfqPipelineRow[]> { const { data,error }=await getSupabase().from("rfq_pipeline").select("*").order("created_at",{ascending:false});if(error)throw error;return data as RfqPipelineRow[]; }
