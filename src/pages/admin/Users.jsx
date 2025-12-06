import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { ChevronRight, User, Package, X } from 'lucide-react'; 
import UserDetailsModal from './UserDetailsModal';

function Users() {
    const { fetchAllUsers, userRole } = useContext(ShopContext);
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch the list of all users on load
    useEffect(() => {
        if (userRole === 'admin') {
            const loadUsers = async () => {
                setIsLoading(true);
                const users = await fetchAllUsers();
                setUserList(users);
                setIsLoading(false);
            };
            loadUsers();
        } else {
            setIsLoading(false);
        }
    }, [fetchAllUsers, userRole]);

    // Function to view specific user details (fetch full data)
    const viewUserDetails = async (userId) => {
        const BASE_URL = "http://localhost:8000";
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}`);
            if (!response.ok) throw new Error('User details fetch failed');
            const details = await response.json();
            setSelectedUser(details); // Set the detailed user object
        } catch (error) {
            console.error("Error fetching single user details:", error);
            setSelectedUser(null);
            alert("Failed to load user details.");
        }
    };

    if (userRole !== 'admin') {
        return <div className='p-8 text-red-600 font-bold'>Access Denied.</div>;
    }

    return (
        <div className='p-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-6 border-b pb-2'>
                Registered Users Management
            </h1>
            
            {isLoading ? (
                <div className='text-gray-500'>Loading users...</div>
            ) : userList.length === 0 ? (
                <div className='text-gray-500'>No users found.</div>
            ) : (
                <div className='bg-white shadow-xl rounded-xl overflow-hidden'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                                <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Orders</th>
                                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {userList.map((user) => (
                                <tr key={user.id} className='hover:bg-gray-50'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2'>
                                        <User className='w-4 h-4 text-blue-500' /> {user.name}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{user.email}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-green-600'>{user.orderCount}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                        <button
                                            onClick={() => viewUserDetails(user.id)}
                                            className='text-indigo-600 hover:text-indigo-900 flex items-center justify-end'
                                        >
                                            View Details <ChevronRight className='w-4 h-4 ml-1' />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* User Details Modal/Sidebar */}
            {selectedUser && (
                <UserDetailsModal 
                    user={selectedUser} 
                    onClose={() => setSelectedUser(null)} 
                />
            )}
        </div>
    );
}

export default Users;