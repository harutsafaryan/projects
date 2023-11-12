import { useAuthUser } from "react-auth-kit";
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
    const auth = useAuthUser();

    if (!auth())
        return <Navigate to='/login'/>
    else
        return children;

}