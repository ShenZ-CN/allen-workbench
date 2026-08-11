import { getSupabase } from "@/lib/supabase";
import type { ProjectOverview } from "@/lib/types";
export async function listProjects():Promise<ProjectOverview[]>{const {data,error}=await getSupabase().from("project_overview").select("*").order("next_due_date",{ascending:true});if(error)throw error;return data as ProjectOverview[]}
