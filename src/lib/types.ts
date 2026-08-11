export type RiskLevel = "low" | "medium" | "high";
export type ProjectStage = "RFQ" | "Quotation" | "Technical Review" | "Sample" | "PPAP" | "SOP" | "Mass Production";

export interface DashboardSummary {
  active_rfqs: number;
  active_projects: number;
  annual_revenue: number;
  annual_profit: number;
  high_risk_customers: number;
  delayed_projects: number;
}

export interface Customer360 {
  id: string; code: string; name: string; country: string | null; tier: string;
  customer_grade: string; risk_level: RiskLevel; strategic_value: string;
  main_products: string[]; project_count: number; annual_sales: number; annual_profit: number;
  value_score: number; health_status: string;
}

export interface RfqPipelineRow {
  id: string; code: string; project_name: string; customer_name: string; stage: string;
  due_date: string | null; part_count: number; score: number | null; value_grade: string | null;
  win_probability: number | null; status: string;
}

export interface ProjectOverview {
  id: string; project_name: string; customer_name: string; current_stage: ProjectStage;
  next_stage: ProjectStage | null; next_due_date: string | null; delay_status: string;
  risk_level: RiskLevel; commercial_value: number; rfq_grade: string | null;
}

export interface ProductionOverview {
  id: string; project_name: string; customer_name: string; part_number: string;
  period: string; forecast_sales: number; actual_revenue: number; actual_profit: number;
  delivery_status: string; quality_status: string; ppm: number;
}

export interface KnowledgeEntry {
  id: string; title: string; category: string; summary: string; visibility: "internal" | "restricted";
  customer_name?: string | null; project_name?: string | null; tags: string[]; updated_at: string;
}

