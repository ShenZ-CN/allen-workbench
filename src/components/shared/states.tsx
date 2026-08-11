import { AlertCircle, Database } from "lucide-react";
import { Card } from "@/components/ui/card";

export function LoadingState() { return <Card className="py-12 text-center text-sm text-slate-500">正在读取经营数据…</Card>; }
export function EmptyState({ title = "暂无数据", description = "完成 Supabase 配置或导入旧版 JSON 后，这里将显示业务数据。" }) {
  return <Card className="py-12 text-center"><Database className="mx-auto mb-3 text-slate-300"/><b>{title}</b><p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">{description}</p></Card>;
}
export function ErrorState({ error }: { error: unknown }) { return <Card className="border-rose-200 bg-rose-50 text-rose-700"><AlertCircle className="mb-2"/><b>数据读取失败</b><p className="mt-1 text-sm">{error instanceof Error ? error.message : "未知错误"}</p></Card>; }

