import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { deleteProject } from "../api/projectApi";
import Button from 'react-bootstrap/Button';
import React from "react";

export default function ProjectDeleted() {
    const params = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (id) => deleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        }
    })

    return (
        <>
            <h1>
                {mutation.isPending ? (
                    'Deleting...'
                ) : (
                    mutation.isError ? (
                        `An error occurred: ${mutation.error.message}`
                    ) : (
                        mutation.isSuccess ? 'Deleted' : 'Project will be deleted permanently!!!'
                    )
                )}
            </h1>
            <Button variant="danger" onClick={() => { mutation.mutate(params.projectId) }}>Delete</Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        </>
    )
}