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
                    <ul className="header_ul">
                        <li className="header_li">
                            <NavLink className="li_a" to="/Home">Home</NavLink>
                        </li>
                        <li className="header_li">
                            <NavLink className="li_a" to="/Projects">Projects</NavLink>
                        </li>
                        <li className="header_li">
                            <NavLink className="li_a" to="/Login">Login</NavLink>
                        </li>
                        <li className="header_li">
                            <NavLink className="li_a" onClick={() => signOut()}>Logout</NavLink>
                        </li>
                        <li className="header_li">
                            <NavLink className="li_a" to="/Register">Register</NavLink>
                        </li>
                        <li className="header_li">
                            <NavLink className="li_a" to="/Profile">Profile</NavLink>
                        </li >
                        {
                            (auth()?.user) &&
                            <li className="li_a">
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