import { Navigate, Route, Routes } from "react-router-dom";
import { AuthGate } from "@/app/AuthGate";
import { AppLayout } from "@/app/AppLayout";
import { DashboardPage } from "@/modules/dashboard/pages/DashboardPage";
import { CustomersPage } from "@/modules/customers/pages/CustomersPage";
import { RfqPage } from "@/modules/rfq/pages/RfqPage";
import { ProjectsPage } from "@/modules/projects/pages/ProjectsPage";
import { ProductionPage } from "@/modules/production/pages/ProductionPage";
import { KnowledgePage } from "@/modules/knowledge/pages/KnowledgePage";
import { AiPage } from "@/modules/ai/pages/AiPage";

export function App() {
  return <AuthGate><Routes><Route element={<AppLayout/>}><Route index element={<DashboardPage/>}/><Route path="customers" element={<CustomersPage/>}/><Route path="rfq" element={<RfqPage/>}/><Route path="projects" element={<ProjectsPage/>}/><Route path="production" element={<ProductionPage/>}/><Route path="knowledge" element={<KnowledgePage/>}/><Route path="ai" element={<AiPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes></AuthGate>;
}
