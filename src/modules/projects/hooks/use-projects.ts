import {useQuery} from "@tanstack/react-query";import {listProjects} from "@/modules/projects/api/projects-api";export const useProjects=()=>useQuery({queryKey:["projects"],queryFn:listProjects});
