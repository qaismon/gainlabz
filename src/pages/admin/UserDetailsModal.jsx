import React from 'react';
import { Package, X, Clock, DollarSign, MapPin, Mail, Phone } from 'lucide-react';

function UserDetailsModal({ user, onClose }) {
    if (!user) return null;

    const totalSpent = user.orders 
        ? user.orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)
        : '0.00';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10" id="userModal">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Details for: {user.name.toUpperCase()}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Body Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-lg mb-3 text-blue-800 border-b pb-1">Account Info</h4>
                            <p className="flex items-center gap-2 mb-1">
                                <Mail className='w-4 h-4 text-blue-600'/>
                                <strong>Email:</strong> {user.email}
                            </p>
                            <p className="mb-1">
                                <strong>Role:</strong> <span className='capitalize font-medium text-blue-700'>{user.role}</span>
                            </p>
                            <p className="mt-2">
                                <strong>Total Orders:</strong> <span className='font-semibold text-green-700'>{user.orders ? user.orders.length : 0}</span>
                            </p>
                            <p>
                                <strong>Total Lifetime Spent:</strong> <span className='font-semibold text-green-700'>${totalSpent}</span>
                            </p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-1 flex items-center gap-2">
                                <MapPin className='w-5 h-5 text-red-500'/> Default Address
                            </h4>
                            {user.defaultAddress ? (
                                <>
                                    <p><strong>Name:</strong> {user.defaultAddress.firstName} {user.defaultAddress.lastName}</p>
                                    <p className="flex items-center gap-2 mb-1">
                                        <Phone className='w-4 h-4 text-gray-600'/>
                                        <strong>Phone:</strong> {user.defaultAddress.phone}
                                    </p>
                                    <p><strong>Street:</strong> {user.defaultAddress.street}</p>
                                    <p><strong>City/Zip:</strong> {user.defaultAddress.city}, {user.defaultAddress.zipcode}</p>
                                    <p><strong>Country:</strong> {user.defaultAddress.country}</p>
                                </>
                            ) : (
                                <p className='text-gray-500 italic'>No default address saved by this user.</p>
                            )}
                        </div>
                    </div>

                    <h4 className="font-bold text-xl mb-4 pt-4 border-t flex items-center gap-2">
                        <Package className='w-5 h-5 text-green-600'/> Order History
                    </h4>
                    
                    {user.orders && user.orders.length > 0 ? (
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>ID</th>
                                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Date</th>
                                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Items</th>
                                        <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase'>Total</th>
                                        <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {user.orders.map(order => (
                                        <tr key={order.id} className='hover:bg-gray-50'>
                                            <td className='px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900'>#{order.id.slice(0, 6)}...</td>
                                            <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                                                {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>{order.items ? order.items.length : 0} item(s)</td>
                                            <td className='px-4 py-2 whitespace-nowrap text-sm font-semibold text-right text-gray-900'>
                                                ${order.amount.toFixed(2)}
                                            </td>
                                            <td className='px-4 py-2 whitespace-nowrap text-sm'>
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-blue-100 text-blue-800'
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
                        <p className='text-gray-500 italic'>This user has not placed any orders yet.</p>
                    )}
                </div>
                
                {/* Footer */}
                <div className="p-4 bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full hover:bg-gray-300 transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserDetailsModal;