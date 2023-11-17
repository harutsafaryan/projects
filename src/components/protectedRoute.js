import { useAuthUser } from "react-auth-kit";
import { Navigate } from 'react-router-dom'
import React   from "react";

// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ children }) {
    const auth = useAuthUser();

    if (!auth())
        return <Navigate to='/login'/>
    else
        return children;

}