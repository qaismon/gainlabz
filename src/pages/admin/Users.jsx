import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Trash2, Eye, Search, UserCheck, UserX } from 'lucide-react'; 
import UserDetailsModal from './UserDetailsModal';

function Users() {
    const { users, fetchUsers, deleteUser, updateRole } = useContext(ShopContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (fetchUsers) fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='p-4 md:p-6 bg-gray-50 min-h-screen relative'>
            
            {/* MODAL RENDER */}
            {selectedUser && (
                <UserDetailsModal 
                    user={selectedUser} 
                    onClose={() => setSelectedUser(null)} 
                />
            )}

            <div className='max-w-6xl mx-auto'>
                {/* Header Section */}
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
                    <div>
                        <h2 className='text-2xl font-black text-gray-800 tracking-tight'>USER MANAGEMENT</h2>
                        <p className='text-sm text-gray-500 font-medium'>Manage registered customers and staff</p>
                    </div>
                    
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                <div className="hidden md:block bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-100 text-[11px] uppercase tracking-widest text-gray-400 font-black bg-gray-50/50">
                                <th className="px-6 py-4 text-left">User Details</th>
                                <th className="px-6 py-4 text-left">Role</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${user.role === 'admin' ? 'bg-purple-100 text-purple-600 border-purple-200' : 'bg-orange-100 text-orange-600 border-orange-200'}`}>
                                                {user.name ? user.name[0].toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button 
                                                onClick={() => setSelectedUser(user)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="View Full Details"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    const nextRole = user.role === 'admin' ? 'user' : 'admin';
                                                    if(window.confirm(`Change ${user.name} to ${nextRole}?`)) {
                                                        updateRole(user._id, nextRole);
                                                    }
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                    user.role === 'admin' ? 'text-red-500 border-red-100 hover:bg-red-50' : 'text-green-600 border-green-100 hover:bg-green-50'
                                                }`}
                                            >
                                                {user.role === 'admin' ? "Demote" : "Make Admin"}
                                            </button>

                                            <button 
                                                onClick={() => window.confirm("Delete user?") && deleteUser(user._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {filteredUsers.map((user) => (
                        <div key={user._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {user.name ? user.name[0].toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {user.role}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 gap-2">
                                <button 
                                    onClick={() => setSelectedUser(user)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold"
                                >
                                    <Eye size={14} /> Details
                                </button>
                                
                                <button
                                    onClick={() => {
                                        const nextRole = user.role === 'admin' ? 'user' : 'admin';
                                        if(window.confirm(`Change role to ${nextRole}?`)) updateRole(user._id, nextRole);
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border ${
                                        user.role === 'admin' ? 'border-red-100 text-red-500' : 'border-green-100 text-green-600'
                                    }`}
                                >
                                    {user.role === 'admin' ? <UserX size={14} /> : <UserCheck size={14} />}
                                    {user.role === 'admin' ? "Demote" : "Admin"}
                                </button>

                                <button 
                                    onClick={() => window.confirm("Delete user?") && deleteUser(user._id)}
                                    className="p-2 bg-red-50 text-red-500 rounded-xl"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No users found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Users;