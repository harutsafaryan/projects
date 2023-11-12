import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getProjects } from "../api/projectApi";
import { useQuery } from "@tanstack/react-query";
import NavBar from "../components/navBar";

const projectsQuery = () => ({
    queryKey: ['projects'],
    queryFn: () => getProjects(),
})

export const loader = (queryClient) =>
    async () => {
        const query = projectsQuery()
        return queryClient.getQueryData(query.queryKey) ??
            await queryClient.fetchQuery(query)
    }

export default function Root() {

    const navigate = useNavigate();
    const { isLoading, isError, data: projects, error } = useQuery(projectsQuery())

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    //style={{pointerEvents:'none'}}
    return (
        <>
            <header>
                <NavBar />
            </header>
            <main>
                <div>
                    <div className="sidebar">
                        <button onClick={() => navigate('projects/new')}>New</button>
                        {
                            projects.length ? (
                                <ul>
                                    {projects.map(project => (
                                        <li key={project.id}>
                                            <NavLink to={`projects/${project.id}`}>{project.description}</NavLink>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <i>no projetcs</i>
                            )
                        }
                    </div>
                    <div className="main">
                        <Outlet />
                    </div>
                </div>
            </main>
            <footer>
                <h3>This is a footer part!</h3>
            </footer>
        </>
    )
}