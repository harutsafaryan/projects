import { useParams } from "react-router-dom"
import { getProject } from "../api/projectApi";
import { useQuery } from "@tanstack/react-query";

const projectQuery = (id) => ({
    queryKey: ['projects', 'id', id],
    queryFn: () => getProject(id)
})

export const loader =
    (queryClient) =>
        async ({ params }) => {
            const query = projectQuery(params.projectId);
            return queryClient.getQueryData(query.queryKey) ??
                await queryClient.fetchQuery(query);
        }

export default function Project() {
    const params = useParams();
    const { isLoading, isError, data: project, error } = useQuery(projectQuery(params.projectId));

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <>
            <p>project details {project.id}</p>
            <p>project details {project.description}</p>
        </>
    )
}