import { useQuery } from "@tanstack/react-query";
import { listRfqs } from "@/modules/rfq/api/rfq-api";
export const useRfqs=()=>useQuery({queryKey:["rfqs"],queryFn:listRfqs});
