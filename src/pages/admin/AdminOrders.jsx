import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';

const BASE_URL = "http://localhost:8000"; 
const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
    const { updateOrderStatus } = useContext(ShopContext); 
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatAddress = (data) => {
        if (!data) return "N/A";
        return `${data.street}, ${data.city}, ${data.zipcode}, ${data.country}`;
    };

    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/users`);
            if (!response.ok) throw new Error('Failed to fetch users for orders.');
            
            const users = await response.json();
            let consolidatedOrders = [];
            
            users.forEach(user => {
                if (user.orders && Array.isArray(user.orders) && user.orders.length > 0) {
                    user.orders.forEach(order => {
                        consolidatedOrders.push({
                            ...order,
                            userName: user.name,
                            userEmail: user.email,
                            userId: user.id 
                        });
                    });
                }
            });
            
            consolidatedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAllOrders(consolidatedOrders);

        } catch (error) {
            console.error("Error fetching admin orders:", error);
            toast.error("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []); 
    
    const handleStatusChange = async (userId, orderId, newStatus) => {
        const success = await updateOrderStatus(userId, orderId, newStatus);
        if (success) {
            fetchAllOrders(); 
        }
    };

    if (loading) {
        return <p className='text-center py-8'>Loading orders...</p>;
    }

    if (allOrders.length === 0) {
        return <p className='text-center py-8 text-xl'>No orders placed yet.</p>;
    }

    return (
        <div className='p-4'>
            <h2 className='text-3xl font-bold mb-6 text-gray-800'>📦 All Customer Orders ({allOrders.length})</h2>
            <div className='space-y-6'>
                {allOrders.map((order, index) => (
                    <div key={order.id || index} className='p-5 border border-gray-200 rounded-lg shadow-md bg-white'>
                        <h3 className='text-xl font-semibold text-green-600 mb-2'>Order ID: #{order.id}</h3>
                        <p className='text-sm text-gray-500 mb-4'>
                            Placed by: {order.userName} ({order.userEmail}) on {order.date}
                        </p>
                        
                        <div className='border-t pt-3'>
                            <h4 className='font-medium mb-2'>Items:</h4>
                            <ul className='list-disc list-inside space-y-1 text-sm'>
                                {order.items && order.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className='text-gray-700'>
                                        {item.name} ({item.flavor}): {item.quantity} unit(s) - <span className='text-red-700'>${item.price}</span>  each
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className='mt-4 pt-3 border-t flex justify-between items-center'>
                            <div>
                                <p className='text-lg font-bold text-red-700'>Total Amount: ${order.amount.toFixed(2)}</p>
                                <p className='text-md'><span className='font-bold'>Delivery Address:</span> {formatAddress(order.deliveryData)}</p>
                            </div>

                            <div className='flex items-center space-x-2'>
                                <label className='font-medium text-gray-700'>Status:</label>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.userId, order.id, e.target.value)}
                                    className={`p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 ${
                                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-300' :
                                        'bg-red-100 text-red-800 border-red-300'
                                    }`}
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            {/* END NEW STATUS DROPDOWN */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;