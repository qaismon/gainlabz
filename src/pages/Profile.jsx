import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
    const { 
        isLoggedIn, 
        logoutUser, 
        activeUserEmail,
        activeUserName 
    } = useContext(ShopContext);

    const navigate = useNavigate();

    const displayUser = {
        email: activeUserEmail || 'N/A',
        phone: 'null', 
        memberSince: '2025' 
    };

    if (!isLoggedIn) {
        navigate('/login');
        toast.info("Please log in to view your profile.");
        return null;
    }

    const handleLogout = () => {
        logoutUser();
        toast.success("You have been logged out.");
        navigate('/');
    };

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-lg shadow-xl">
                
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">Your Profile</h1>
                    <p className="text-sm text-gray-500">Member Since: {displayUser.memberSince}</p>
                </div>

                
                <div className="space-y-6">
                    
                   
                    
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                        <p className="text-xl font-semibold text-gray-900">{displayUser.email}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                        <p className="text-xl font-semibold text-gray-900">{displayUser.phone}</p>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                        <button 
                            onClick={() => navigate('/orders')} 
                            className="w-full sm:w-auto bg-green-500 text-white py-3 px-6 rounded-lg font-bold hover:bg-green-600 transition-colors shadow-md"
                        >
                            View Order History
                        </button>
                        <button 
                            onClick={handleLogout} 
                            className="w-full sm:w-auto border border-green-500 text-green-500 py-3 px-6 rounded-lg font-bold hover:bg-green-50 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact Support</a></p>
            </div>
        </div>
    );
};

export default Profile;