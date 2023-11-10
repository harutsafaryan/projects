import { useAuthUser, useSignOut } from "react-auth-kit";
import { NavLink, Outlet } from "react-router-dom";

export default function Root() {

    const auth = useAuthUser();
    console.log('auth: ', auth());
    const signOut = useSignOut();

    //style={{pointerEvents:'none'}}
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
                            <NavLink onClick={() => signOut()}>Logout</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Register">Register</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Profile">Profile</NavLink>
                        </li>
                        {
                            (auth()?.user) &&
                            <li>
                                Hello {auth().user}
                            </li>
                        }
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