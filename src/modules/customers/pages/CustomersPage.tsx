import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/states";
import { currency } from "@/lib/utils";
import { useCustomers } from "@/modules/customers/hooks/use-customers";

export function CustomersPage(){const {data,isLoading,error}=useCustomers();if(isLoading)return <LoadingState/>;if(error)return <ErrorState error={error}/>;if(!data?.length)return <EmptyState title="尚无战略客户"/>;return <Card><CardHeader title="战略客户组合" subtitle="不是 CRM 线索库；仅管理 Tier 1 客户经营价值"/><div className="overflow-auto"><table className="data-table"><thead><tr><th>客户</th><th>等级</th><th>年度销售</th><th>年度利润</th><th>项目</th><th>主要产品</th><th>风险</th><th>战略价值</th><th>评分</th></tr></thead><tbody>{data.map(c=><tr key={c.id}><td><b>{c.code}</b><div className="text-xs text-slate-500">{c.name} · {c.country}</div></td><td><Badge tone="blue">{c.customer_grade}</Badge></td><td>{currency(c.annual_sales)}</td><td>{currency(c.annual_profit)}</td><td>{c.project_count}</td><td>{c.main_products?.join(" / ")||"—"}</td><td><Badge tone={c.risk_level==="high"?"red":c.risk_level==="medium"?"amber":"green"}>{c.risk_level}</Badge></td><td>{c.strategic_value}</td><td><b>{Math.round(c.value_score)}</b></td></tr>)}</tbody></table></div></Card>}
