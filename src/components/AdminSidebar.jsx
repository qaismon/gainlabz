// src/components/AdminSidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';

function AdminSidebar() {
    const linkClasses = ({ isActive }) =>
        `flex items-center p-3 rounded-lg transition duration-200 ${
            isActive ? 'bg-green-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700'
        }`;

    return (
        <div className='w-full p-4 space-y-2'>
            <h2 className='text-2xl font-bold mb-6 border-b border-gray-600 pb-3 text-white'>
                Admin Dashboard
            </h2>
            
            <NavLink to="/admin" end className={linkClasses}>
                Dashboard
            </NavLink>
            
            <NavLink to="/admin/add-product" className={linkClasses}>
                Add Product
            </NavLink>
            
            <NavLink to="/admin/list-products" className={linkClasses}>
                List Products
            </NavLink>
            
            <NavLink 
    to="/admin/offers" 
className={linkClasses}>
    Manage Offers
    </NavLink>
            <NavLink to="/admin/orders" className={linkClasses}>
                Order Management
            </NavLink>

            <NavLink 
                    to="/admin/users" 
                     className={linkClasses}
                >
                    Users
                </NavLink>
        </div>
    );
}

export default AdminSidebar;