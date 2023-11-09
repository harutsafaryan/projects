import { NavLink, Outlet } from "react-router-dom";

export default function Root() {

    return (
        <>
        <header>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/Home">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/Projects">Projects</NavLink>
                    </li>
                    <li>
                        <NavLink to="/Login">Login</NavLink>
                    </li>
                    <li>
                        <NavLink to="/Logout">Logout</NavLink>
                    </li>
                    <li>
                        <NavLink to="/Register">Register</NavLink>
                    </li>
                    <li>
                        <NavLink to="/Profile">Profile</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
        <main>
            <Outlet />
        </main>
        <footer>
            <h3>This is a footer part!</h3>
        </footer>
    </>
    )
}