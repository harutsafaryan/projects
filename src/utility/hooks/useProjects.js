import { useQuery } from "@tanstack/react-query";

export default function useProjects() {
    return useQuery(
        {
            queryKey:['projects'],
            queryFn: () => 
        }
    )
}