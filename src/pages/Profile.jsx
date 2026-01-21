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

    if (!isLoggedIn) {
        navigate('/login');
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
                
                {/* Header Section */}
                <div className="flex justify-between items-center border-b pb-4 mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">User Profile</h1>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Status</p>
                        <p className="text-xs font-bold text-green-500 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> ONLINE
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    
                    {/* DISPLAY NAME SECTION (PROMINENT) */}
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-3xl border-2 border-orange-200 shadow-inner">
                            {activeUserName ? activeUserName[0].toUpperCase() : '👤'}
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logged in as</label>
                            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                                {activeUserName || 'Valued Member'}
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        

                        {/* ACCOUNT TYPE */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Account Security</label>
                            <p className="text-gray-700 font-medium italic">Password Protected</p>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => navigate('/orders')} 
                            className="flex-1 bg-black text-white py-4 px-6 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                        >
                            View My Orders
                        </button>
                        <button 
                            onClick={handleLogout} 
                            className="flex-1 border-2 border-red-500 text-red-500 py-4 px-6 rounded-xl font-bold hover:bg-red-50 transition-all active:scale-95"
                        >
                            Log Out Account
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-400">Secure Profile Page • {new Date().getFullYear()}</p>
            </div>
        </div>
    );
};

export default Profile;