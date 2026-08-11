import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export const currency = (value: number | null | undefined) =>
  new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 0 }).format(value ?? 0);
export const number = (value: number | null | undefined) => new Intl.NumberFormat("zh-CN").format(value ?? 0);

