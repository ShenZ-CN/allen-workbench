import { getSupabase } from "@/lib/supabase";
import type { Customer360, DashboardSummary, ProjectOverview } from "@/lib/types";

export async function fetchDashboard() {
  const db = getSupabase();
  const [summary, customers, projects] = await Promise.all([
    db.from("dashboard_summary").select("*").single(),
    db.from("customer_360").select("*").order("value_score", { ascending: false }).limit(5),
    db.from("project_overview").select("*").neq("delay_status", "on_track").limit(5)
  ]);
  const error = summary.error ?? customers.error ?? projects.error;
  if (error) throw error;
  return { summary: summary.data as DashboardSummary, customers: customers.data as Customer360[], projects: projects.data as ProjectOverview[] };
}
