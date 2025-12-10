import React from 'react';

function Admin() {
  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='w-1/5 bg-gray-800 text-white p-4'>
        <h2 className='text-xl font-bold mb-6 border-b border-gray-600 pb-2'>Admin Panel</h2>
        <p className='text-gray-400'>Dashboard</p>
        <p className='text-gray-400'>Products</p>
        <p className='text-gray-400'>Orders</p>
      </div>

      <div className='w-4/5 p-8'>
        <h1 className='text-3xl font-semibold mb-6'>Welcome, Admin!</h1>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <p>This is your administrative dashboard. Select an option from the sidebar to manage your store.</p>
        </div>
      </div>
    </div>
  );
}

export default Admin;