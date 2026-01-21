import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';

function Users() {
    const { users, fetchUsers } = useContext(ShopContext);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (fetchUsers) fetchUsers();
    }, []);

    // Filter users by name or email
    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='p-6 bg-gray-50 min-h-screen'>
            <div className='max-w-6xl mx-auto bg-white shadow-sm rounded-2xl border border-gray-100 p-6'>
                
                {/* Header */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
                    <div>
                        <h2 className='text-2xl font-black text-gray-800 tracking-tight'>USER MANAGEMENT</h2>
                        <p className='text-sm text-gray-500 font-medium'>Manage registered customers and staff</p>
                    </div>
                    
                    <div className="w-full sm:w-72">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-100 text-[11px] uppercase tracking-widest text-gray-400 font-black">
                                <th className="px-6 py-4 text-left">User Details</th>
                                <th className="px-6 py-4 text-left">Email</th>
                                <th className="px-6 py-4 text-center">Join Date</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm border border-orange-200">
                                                    {user.name ? user.name[0].toUpperCase() : 'U'}
                                                </div>
                                                <span className="font-bold text-gray-800 text-sm">
                                                    {user.name || 'Unknown User'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 text-center text-xs text-gray-400 font-mono">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2025-01-01'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="bg-green-100 text-green-600 text-[10px] px-3 py-1 rounded-full font-black uppercase">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-gray-400 text-sm">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Users;