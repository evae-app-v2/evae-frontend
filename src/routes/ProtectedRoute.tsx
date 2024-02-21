
import { Outlet, Navigate } from 'react-router-dom';
import {useAuth} from "./AuthProvider";


const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/evae/login" replace />;
};

export default ProtectedRoute;