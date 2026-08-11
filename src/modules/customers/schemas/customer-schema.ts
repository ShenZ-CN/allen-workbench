import { z } from "zod";
export const customerSchema = z.object({ code:z.string().min(1), name:z.string().min(1), country:z.string().optional(), tier:z.string().default("Tier 1"), customer_grade:z.enum(["A","B","C","D"]), risk_level:z.enum(["low","medium","high"]), strategic_value:z.enum(["strategic","core","key","develop","watch"]), main_products:z.array(z.string()).default([]) });
