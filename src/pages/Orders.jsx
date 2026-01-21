import React, { useContext, useEffect } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

function Orders() {
    const { currency, orders, fetchOrders, cancelOrder } = useContext(ShopContext);

    useEffect(() => {
        if (fetchOrders) fetchOrders();
    }, [fetchOrders]);

    const handleCancelRequest = (orderId) => {
    // Create a custom toast with Confirm/Cancel buttons
    const confirmToast = toast(
        ({ closeToast }) => (
            <div className="p-1">
                <p className="font-bold mb-2 text-sm">Cancel this order?</p>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            const success = await cancelOrder(orderId);
                            if (success) {
                                toast.success("Order cancelled successfully");
                                fetchOrders();
                            }
                            closeToast(); // Close the confirmation toast
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold"
                    >
                        Yes, Cancel
                    </button>
                    <button
                        onClick={closeToast}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-bold"
                    >
                        No
                    </button>
                </div>
            </div>
        ),
        {
            position: "top-center",
            autoClose: false, // Don't close until user interacts
            closeOnClick: false,
            draggable: false,
        }
    );
};

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
            case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className='py-14 max-w-[1100px] mx-auto px-4'>
            <div className='mb-10'>
                <Title text1={"YOUR"} text2={"ORDERS"} />
            </div>

            {(!orders || orders.length === 0) ? (
                <div className='text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200'>
                    <p className='text-gray-400 font-medium text-lg'>No orders found in your history.</p>
                </div>
            ) : (
                <div className='flex flex-col gap-10'>
                    {orders.map((order) => (
                        <div key={order._id} className='bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'>
                            
                            {/* Order Header */}
                            <div className='bg-gray-50/80 px-6 py-4 flex flex-wrap justify-between items-center border-b border-gray-100 gap-4'>
                                <div className='flex gap-10'>
                                    <div>
                                        <p className='text-[10px] text-gray-400 uppercase font-black tracking-[0.15em] mb-1'>Date</p>
                                        <p className='text-sm text-gray-700 font-semibold'>{new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className='text-[10px] text-gray-400 uppercase font-black tracking-[0.15em] mb-1'>Total</p>
                                        <p className='text-sm font-bold text-orange-600'>{currency}{order.amount.toFixed(2)}</p>
                                    </div>
                                    <div className='hidden sm:block'>
                                        <p className='text-[10px] text-gray-400 uppercase font-black tracking-[0.15em] mb-1'>Payment</p>
                                        <p className='text-sm text-gray-700 font-medium'>{order.payment}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col items-end'>
                                    <p className='text-[10px] text-gray-400 font-mono mb-1'>ID: {order._id.slice(-8).toUpperCase()}</p>
                                    <span className={`px-4 py-1 text-[10px] font-bold rounded-full border ${getStatusColor(order.status)}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Order Body */}
                            <div className='p-6 flex flex-col md:flex-row gap-12'>
                                <div className='flex-1 space-y-6'>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className='flex items-center justify-between group py-2'>
                                            <div className='flex items-center gap-6'>
                                                <div className='w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100 text-2xl shadow-inner group-hover:bg-orange-100 transition-colors'>
                                                    {['📦', '💊', '🥤', '⚡'][idx % 4]}
                                                </div>
                                                <div>
                                                    <p className='text-base font-bold text-gray-800 group-hover:text-orange-600 transition-colors'>{item.name}</p>
                                                    <p className='text-xs text-gray-500 font-medium'>Flavor: {item.flavor} | Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className='font-bold text-gray-800'>{currency}{item.price.toFixed(2)}</p>
                                        </div>
                                    ))}

                                    {/* CANCEL BUTTON LOGIC */}
                                    {(order.status === 'Pending' || order.status === 'Paid') && (
                                        <div className='pt-4 border-t border-gray-50 flex justify-start'>
                                            <button 
                                                onClick={() => handleCancelRequest(order._id)}
                                                className='text-red-500 text-xs font-bold hover:text-red-700 transition-colors flex items-center gap-1 border border-red-100 px-3 py-2 rounded-lg hover:bg-red-50'
                                            >
                                                <span>✕</span> CANCEL ORDER
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Delivery Info Sidebar */}
                                <div className='w-full md:w-80 bg-orange-50/30 p-6 rounded-2xl border border-orange-100/50 self-start'>
                                    <h4 className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2'>
                                        <span className='text-orange-500'>📍</span> SHIPPING DETAILS
                                    </h4>
                                    <div className='text-sm text-gray-700 space-y-1'>
                                        <p className='font-bold text-gray-900 text-base mb-1'>{order.deliveryData?.firstName} {order.deliveryData?.lastName}</p>
                                        <p className='leading-snug text-gray-600'>{order.deliveryData?.street}</p>
                                        <p className='text-gray-600'>{order.deliveryData?.city}, {order.deliveryData?.zipcode}</p>
                                        <p className='text-gray-600'>{order.deliveryData?.country}</p>
                                        <div className='pt-4 text-gray-500 font-bold text-xs'>
                                            📞 {order.deliveryData?.phone}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;