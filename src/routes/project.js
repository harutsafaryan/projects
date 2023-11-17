import { useNavigate, useParams } from "react-router-dom"
import { getProject } from "../api/projectApi";
import { useQuery } from "@tanstack/react-query";
import Button from 'react-bootstrap/Button';
import ProductDetails from "../components/productDetails";
import React from "react";

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
    const navigate = useNavigate();
    const { isLoading, isError, data: project, error } = useQuery(projectQuery(params.projectId));

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <>
            <p>project id {project.id}</p>
            <p>project description {project.description}</p>
            <ProductDetails id={2} />
            <ProductDetails id={1} />
            <Button variant="danger" onClick={() => navigate('destroy')}> Delete</Button>
            <Button variant="success" onClick={() => navigate('addproduct')}>Add product</Button>
        </>
    )
}