import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/modules/dashboard/api/dashboard-api";
export const useDashboard = () => useQuery({ queryKey: ["dashboard"], queryFn: fetchDashboard });
