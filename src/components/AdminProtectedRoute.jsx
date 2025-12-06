// src/components/AdminProtectedRoute.jsx
import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminProtectedRoute = () => {
    const { isLoggedIn, userRole } = useContext(ShopContext);

    if (isLoggedIn && userRole === 'admin') {
        return <Outlet />;
    } else {
        
        if (isLoggedIn) {
            toast.error("Access Denied. You are not an administrator.");
        } else {
            toast.warn("Please log in to access this page.");
        }
        
        return <Navigate to="/" replace />;
    }
};

export default AdminProtectedRoute;