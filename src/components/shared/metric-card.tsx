import { Card } from "@/components/ui/card";

export function MetricCard({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return <Card><span className="text-xs text-slate-500">{label}</span><strong className="mt-1 block text-2xl">{value}</strong>{detail && <small className="mt-1 block text-slate-500">{detail}</small>}</Card>;
}
