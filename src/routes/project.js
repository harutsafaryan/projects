import { useNavigate, useParams } from "react-router-dom"
import { deleteProject, getProject } from "../api/projectApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { isLoading, isError, data: project, error } = useQuery(projectQuery(params.projectId));
   
    const mutation = useMutation({
        mutationFn: (id) => deleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] })
            navigate('deleted');
        }
    })
   
    const deleteBtn = mutation.isPending ? 'Deleteing...' : mutation.isSuccess ? 'Deleted!' : 'Delete';

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
            <button onClick={() => mutation.mutate(params.projectId)}>{deleteBtn}</button>
        </>
    )
}