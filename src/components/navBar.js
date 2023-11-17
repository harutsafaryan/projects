import { useAuthUser, useSignOut } from "react-auth-kit";
import { NavLink } from "react-router-dom";
import React from "react";

export default function NavBar() {
    const auth = useAuthUser();
    const signOut = useSignOut();

    return (
        <nav>
            <ul className="header_ul">
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
    )
}