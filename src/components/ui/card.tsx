import { cn } from "@/lib/utils";

export function Card({ className, children }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("panel", className)}>{children}</div>; }
export function CardHeader({ title, action, subtitle }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <div className="mb-4 flex items-start justify-between gap-3"><div><h2 className="m-0 text-[15px] font-semibold">{title}</h2>{subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}</div>{action}</div>;
}

