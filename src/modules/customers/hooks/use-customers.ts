import { useQuery } from "@tanstack/react-query";
import { listCustomers } from "@/modules/customers/api/customers-api";
export const useCustomers = () => useQuery({ queryKey: ["customers"], queryFn: listCustomers });
