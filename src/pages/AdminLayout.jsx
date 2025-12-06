// src/pages/AdminLayout.jsx (or Admin.jsx, depends on your file structure)

import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

function AdminLayout() {
  return (
    <div className='flex min-h-[calc(100vh-80px)]'> 
      
      <div className='w-1/5 bg-gray-800 p-4 sticky top-0 h-full rounded-xl'>
        <AdminSidebar />
      </div>

      <div className='w-4/5 p-8 bg-gray-100'>
        <Outlet /> 
      </div>
      
    </div>
  );
}

export default AdminLayout;