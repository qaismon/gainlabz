import React, { useContext } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';

function Orders() {
    const { currency, orders, cancelOrder, userRole } = useContext(ShopContext);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            case 'Out for Delivery':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className='py-14 max-w-[1200px] mx-auto'>
            <Title text1={"Your"} text2={"Orders"} />

            {(!orders || orders.length === 0) ? (
                <div className='text-center py-10 text-gray-500'>
                    <p>You have no current orders.</p>
                </div>
            ) : (
                <div className='flex flex-col gap-6 mt-8'>
                    {orders.map((order) => {
                        const orderId = order?.id;
                        const orderDate = order?.date || 'Unknown';
                        const orderAmount = Number(order?.amount) || 0;

                        return (
                            <div
                                key={orderId}
                                className='border p-4 sm:p-6 rounded-lg shadow-md bg-white'
                            >
                                {/* Header */}
                                <div className='flex justify-between items-center border-b pb-4 mb-4'>
                                    <div>
                                        <h3 className='text-lg font-bold text-gray-800'>Order #{orderId}</h3>
                                        <p className='text-sm text-gray-500'>Date: {orderDate}</p>
                                    </div>

                                    <div className='text-right'>
                                        <p className='text-xl font-extrabold text-orange-600'>
                                            {currency}{orderAmount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Grid */}
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr] gap-4'>
                                    {/* Items */}
                                    <div>
                                        <h4 className='font-semibold mb-2 text-gray-700'>Items Ordered:</h4>
                                        {(order.items || []).map((item, idx) => (
                                            <p key={idx} className='text-sm text-gray-600'>
                                                {item.quantity} x {item.name} ({item.flavor}) – {currency}{item.price.toFixed(2)}
                                            </p>
                                        ))}
                                    </div>

                                    {/* Status */}
                                    <div className='flex flex-col gap-2'>
                                        <h4 className='font-semibold mb-1 text-gray-700'>Status:</h4>
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full w-fit ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>

                                        <p className='text-sm text-gray-600 mt-2'>
                                            Paid via: <span className='font-medium'>{order.payment}</span>
                                        </p>

                                        {/* CANCEL BUTTON */}
                                        {(userRole !== "admin" && order.status === "Processing") && (
                                            <button
                                                onClick={() => cancelOrder(order.id)}
                                                className='mt-3 bg-red-500 text-white text-sm px-3 py-2 rounded-md hover:bg-red-600 transition'
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>

                                    {/* Delivery */}
                                    <div className='flex flex-col gap-2'>
                                        <h4 className='font-semibold mb-1 text-gray-700'>Delivery To:</h4>
                                        {order.deliveryData ? (
                                            <p className='text-sm text-gray-600'>
                                                {order.deliveryData.street}, {order.deliveryData.city}, {order.deliveryData.zipcode}, {order.deliveryData.country}
                                            </p>
                                        ) : (
                                            <p className='text-sm text-gray-600'>No delivery info.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Orders;
