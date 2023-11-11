import { useEffect } from "react";
import { useAuthUser } from "react-auth-kit"
import { Link, NavLink, Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { getProjects } from "../api/projectApi";
import { useQuery, fetchQuery } from "@tanstack/react-query";

const projectsQuery = () => ({
    queryKey: ['projects'],
    queryFn: () => getProjects(),
})

export async function loader(queryClient) {
    return async function ({ params }) {
        const query = projectsQuery;
        return queryClient.getQueryData(query.queryKey) ??
            await queryClient.fetchQuery(query)
    }
}

export default function Project() {
    const auth = useAuthUser();
    const navigate = useNavigate();
    const { isLoading, isError, data: projects, error } = useQuery(projectsQuery())


    useEffect(() => {
        if (!auth())
            navigate('login');
    })

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <>
            <div>
                <button onClick={() => navigate('new')}>New</button>
                {
                    projects.length ? (
                        <ul>
                            {projects.map(project => (
                                <li key={project.id}>
                                    <NavLink to={`${project.id}`}>{project.description}</NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <i>no projetcs</i>
                    )
                }
            </div>
            <div>
                <h1>project page ...</h1>
                <Outlet />
            </div>
        </>
    )
}