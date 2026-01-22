import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';

// Ensure these match the Enum in your Order.model.js
const statusOptions = ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
    // API_BASE_URL is usually BASE_URL in your context, 
    // but we use the updateOrderStatus function directly for reliability
    const { updateOrderStatus, userToken, isAdmin } = useContext(ShopContext); 
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatAddress = (data) => {
        if (!data) return "N/A";
        return `${data.street}, ${data.city}, ${data.zipcode}, ${data.country}`;
    };

 // AdminOrders.jsx
const fetchAllOrders = async () => {
    setLoading(true);
    const token = userToken || localStorage.getItem("token");
    if (!token) return;
    
    try {
        const response = await fetch(`${'http://localhost:5000'}/api/orders/all`, {
            headers: { 
                'Authorization': `Bearer ${token}`, // Added the missing {
                'Content-Type': 'application/json' 
            }
        });
        const data = await response.json();
        
        if (data.success) {
            setAllOrders(data.orders); 
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load orders");
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        if (isAdmin) {
            fetchAllOrders();
        }
    }, [isAdmin]); 
    
    const handleStatusChange = async (orderId, newStatus) => {
        const success = await updateOrderStatus(orderId, newStatus);
        if (success) {
            // Update local state by looking for _id (MongoDB default)
            setAllOrders(prev => prev.map(order => 
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
        }
    };

    if (loading) return <p className='text-center py-8'>Loading orders...</p>;
    if (allOrders.length === 0) return <p className='text-center py-8 text-xl'>No orders placed yet.</p>;

    return (
        <div className='p-4'>
            <h2 className='text-3xl font-bold mb-6 text-gray-800'>📦 All Customer Orders ({allOrders.length})</h2>
            <div className='space-y-6'>
                {allOrders.map((order) => (
                    <div key={order._id} className='p-5 border border-gray-200 rounded-lg shadow-md bg-white'>
                        <h3 className='text-xl font-semibold text-green-600 mb-2'>Order ID: #{order._id.slice(-6)}</h3>
                        <p className='text-sm text-gray-500 mb-4'>
                            Placed by: {order.deliveryData?.firstName} {order.deliveryData?.lastName} ({order.deliveryData?.email}) 
                            on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        
                        <div className='border-t pt-3'>
                            <h4 className='font-medium mb-2'>Items:</h4>
                            <ul className='list-disc list-inside space-y-1 text-sm'>
                                {order.items && order.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className='text-gray-700'>
                                        {item.name} ({item.flavor}): {item.quantity} unit(s) - <span className='text-red-700'>${item.price}</span> each
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className='mt-4 pt-3 border-t flex justify-between items-center'>
                            <div>
                                <p className='text-lg font-bold text-red-700'>Total Amount: ${order.amount}</p>
                                <p className='text-md'><span className='font-bold'>Address:</span> {formatAddress(order.deliveryData)}</p>
                            </div>

                            <div className='flex items-center space-x-2'>
                                <label className='font-medium text-gray-700'>Status:</label>
                                <select
                                    value={order.status}
                                    // FIX: Pass order._id instead of order.userId
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    className={`p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 ${
                                        order.status === "Pending" ? 'bg-yellow-100' :
                                        order.status === 'Shipped' ? 'bg-blue-100' :
                                        order.status === 'Delivered' ? 'bg-green-100' : 'bg-red-100'
                                    }`}
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;