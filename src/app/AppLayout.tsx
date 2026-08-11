import { NavLink, Outlet, useLocation } from "react-router-dom";
import { BarChart3, BookOpenText, Bot, Boxes, Factory, FileSearch, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const nav = [
  ["/", "经营总览", BarChart3], ["/customers", "Customer 360", Users], ["/rfq", "RFQ & Quotation", FileSearch],
  ["/projects", "Project Development", Boxes], ["/production", "Mass Production", Factory],
  ["/knowledge", "Project Knowledge", BookOpenText], ["/ai", "Ask Allen", Bot]
] as const;
const meta: Record<string, [string,string]> = {
  "/": ["经营总览", "Customer → RFQ → Project → Production → Revenue → Knowledge"],
  "/customers": ["Customer 360", "欧洲 Tier 1 战略客户经营与健康度"],
  "/rfq": ["RFQ & Quotation", "多零件报价、商业评分与赢单判断"],
  "/projects": ["Project Development", "APQP 生命周期、节点与风险"],
  "/production": ["Mass Production", "SOP 后订单、交付、质量与利润"],
  "/knowledge": ["Project Knowledge", "成功、失败、技术、报价、客户与竞争经验"],
  "/ai": ["Ask Allen", "基于授权经营数据的只读 AI 分析"]
};

export function AppLayout() {
  const path = useLocation().pathname; const [title, desc] = meta[path] ?? meta["/"];
  return <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]"><aside className="bg-nav p-4 text-slate-300 lg:sticky lg:top-0 lg:h-screen lg:p-5"><div className="mb-6 px-2"><div className="text-lg font-semibold text-white">Allen Automotive</div><div className="text-[11px] tracking-wide text-slate-400">BUSINESS OS</div></div><nav className="flex gap-1 overflow-x-auto lg:grid">{nav.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==="/"} className={({isActive})=>cn("flex whitespace-nowrap items-center gap-3 rounded-md px-3 py-2.5 text-sm transition",isActive?"bg-[#233355] text-white":"hover:bg-white/5 hover:text-white")}><Icon size={17}/>{label}</NavLink>)}</nav><Button variant="ghost" className="mt-6 w-full justify-start text-slate-400" onClick={()=>supabase?.auth.signOut()}><LogOut size={16}/>退出</Button></aside><main className="min-w-0 p-4 md:p-7"><header className="mb-6"><p className="eyebrow">欧洲区域业务控制台</p><h1 className="page-title mt-1">{title}</h1><p className="mt-1 text-sm text-slate-500">{desc}</p></header><Outlet/></main></div>;
}
