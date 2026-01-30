import React, { useContext } from 'react';
import { Package, X, MapPin, Mail, Phone } from 'lucide-react';
import { ShopContext } from '../../context/ShopContext'; // Double check this path

function UserDetailsModal({ user, onClose }) {
    // 1. Get the global orders list and currency from your context
    const { orders, currency } = useContext(ShopContext);

    if (!user) return null;

    // 2. Filter the orders you already fetched in ShopContext
    // Your backend likely stores the user ID in 'userId' or 'user'
    const userOrders = orders.filter(order => {
    // 1. Check if the order has a 'user' object (populated) or just an ID
    const orderUserId = typeof order.user === 'object' ? order.user._id : order.user;
    
    // 2. Compare with the modal's user ID
    return String(orderUserId) === String(user._id);
});

    

    // 3. Calculate total
    const totalSpent = userOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0).toFixed(2);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10 backdrop-blur-sm">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 my-8 border border-gray-200">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            Customer: {user.name}
                        </h3>
                        <p className="text-sm text-gray-500">ID: {user._id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Account Box */}
                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                                <Mail className='w-4 h-4'/> Contact Info
                            </h4>
                            <div className="space-y-2 text-sm">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p className="capitalize"><strong>Role:</strong> {user.role}</p>
                                <div className="mt-4 pt-4 border-t border-blue-200">
                                    <p className="text-lg font-bold text-blue-900">
                                        Total Spent: {currency}{totalSpent}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Address Box */}
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <MapPin className='w-4 h-4 text-red-500'/> Shipping Address
                            </h4>
                            {user.address || user.deliveryData ? (
                                <div className='text-sm space-y-1'>
                                    <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
                                    <p><strong>Location:</strong> {user.address || "See order history"}</p>
                                </div>
                            ) : (
                                <p className='text-gray-400 italic text-sm'>No saved address.</p>
                            )}
                        </div>
                    </div>

                    <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
                        <Package className='w-5 h-5 text-indigo-600'/> Order History ({userOrders.length})
                    </h4>
                    
                    {userOrders.length > 0 ? (
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Date</th>
                                        <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Items</th>
                                        <th className='px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase'>Price</th>
                                        <th className='px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase'>Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {userOrders.map((order) => (
                                        <tr key={order._id} className='hover:bg-gray-50'>
                                            <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-600'>
    {order.createdAt 
        ? new Date(order.createdAt).toLocaleDateString() 
        : order.date 
            ? new Date(order.date).toLocaleDateString() 
            : "N/A"}
</td>
                                            <td className='px-4 py-3 text-sm text-gray-600'>
                                                {order.items?.length || 0} items
                                            </td>
                                            <td className='px-4 py-3 whitespace-nowrap text-sm font-bold text-right text-gray-900'>
                                                {currency}{(order.amount || 0).toFixed(2)}
                                            </td>
                                            <td className='px-4 py-3 whitespace-nowrap text-center text-xs'>
                                                <span className={`px-3 py-1 rounded-full font-bold uppercase ${
                                                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed">
                            <p className='text-gray-400'>No orders found for this user in the current records.</p>
                        </div>
                    )}
                </div>
                
                <div className="p-4 bg-gray-50 border-t flex justify-end rounded-b-xl">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserDetailsModal;