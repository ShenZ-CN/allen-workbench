import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { ErrorState, LoadingState } from "@/components/shared/states";
import { MetricCard } from "@/components/shared/metric-card";
import { currency } from "@/lib/utils";
import { useDashboard } from "@/modules/dashboard/hooks/use-dashboard";
import { LegacyImport } from "@/modules/dashboard/components/LegacyImport";

export function DashboardPage() {
  const { data, isLoading, error } = useDashboard();
  if (isLoading) return <LoadingState/>; if (error || !data) return <ErrorState error={error}/>;
  const s=data.summary;
  return <div className="space-y-4"><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="活跃 RFQ" value={s.active_rfqs}/><MetricCard label="进行中项目" value={s.active_projects}/><MetricCard label="本年实际收入" value={currency(s.annual_revenue)}/><MetricCard label="本年利润" value={currency(s.annual_profit)}/></section><section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]"><Card><CardHeader title="客户健康度" subtitle="Customer 360 综合价值与风险"/><div className="overflow-auto"><table className="data-table"><thead><tr><th>客户</th><th>战略价值</th><th>价值分</th><th>健康度</th></tr></thead><tbody>{data.customers.map(c=><tr key={c.id}><td><b>{c.code}</b><div className="text-xs text-slate-500">{c.name}</div></td><td>{c.strategic_value}</td><td>{Math.round(c.value_score)}</td><td><Badge tone={c.health_status==="healthy"?"green":c.health_status==="risk"?"red":"amber"}>{c.health_status}</Badge></td></tr>)}</tbody></table></div></Card><Card><CardHeader title="项目节点风险" subtitle={`${s.delayed_projects} 个延期项目 · ${s.high_risk_customers} 个高风险客户`}/>{data.projects.map(p=><div key={p.id} className="flex items-center justify-between gap-3 border-t py-3 first:border-0"><div><b className="text-sm">{p.project_name}</b><p className="text-xs text-slate-500">{p.current_stage} → {p.next_stage ?? "完成"}</p></div><Badge tone={p.delay_status==="delayed"?"red":"amber"}>{p.delay_status}</Badge></div>)}</Card></section><LegacyImport/></div>;
}
