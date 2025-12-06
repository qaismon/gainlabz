import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function PlaceOrder() {
    const {
        getCartAmount,
        currency,
        delivery_fee,
        cartItems,
        products,
        addOrder,
        clearCart,
        defaultAddress,
        updateDefaultAddress,
        activeUserId
    } = useContext(ShopContext);

    const navigate = useNavigate();

    const subtotal = getCartAmount();
    const totalAmount = subtotal > 0 ? subtotal + delivery_fee : 0;

    const addressDefaultState = {
        firstName: "", lastName: "", email: "", street: "",
        city: "", zipcode: "", country: "", phone: ""
    };

    const [data, setData] = useState(addressDefaultState);

    const [useSavedAddress, setUseSavedAddress] = useState(false);

    const [saveAddress, setSaveAddress] = useState(false);

    useEffect(() => {
        if (defaultAddress && typeof defaultAddress === 'object') {
            setUseSavedAddress(true);
            setSaveAddress(false);
            setData(prev => ({ ...addressDefaultState, ...defaultAddress }));
        } else {
            setUseSavedAddress(false);
        }
    }, [defaultAddress]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleUseSavedToggle = (useSaved) => {
        setUseSavedAddress(useSaved);
        if (useSaved && defaultAddress) {
            setData(prev => ({ ...addressDefaultState, ...defaultAddress }));
            setSaveAddress(false);
        } else {
            setData(addressDefaultState);
            setSaveAddress(false);
        }
    };

    const [paymentMethod, setPaymentMethod] = useState("");
    const [upiId, setUpiId] = useState("");

    const placeOrder = async (event) => {
        event.preventDefault();

        if (subtotal === 0) {
            toast.error("Your cart is empty. Please add items before placing an order.");
            return;
        }

        if (!paymentMethod) {
            toast.error("Please select a payment method.");
            return;
        }

        if (paymentMethod === 'UPI' && !upiId.trim()) {
            toast.error("Please enter your UPI ID.");
            return;
        }

        const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'zipcode', 'country', 'phone'];
        const isValid = requiredFields.every(field => data[field] && data[field].toString().trim() !== '');

        if (!isValid) {
            toast.error("Please fill in all delivery information fields.");
            return;
        }

        const orderItems = [];
        for (const itemId in cartItems) {
            const product = products.find(p => String(p.id) === String(itemId));
            if (!product) continue;

            for (const flavor in cartItems[itemId]) {
                const quantity = Number(cartItems[itemId][flavor]) || 0;
                if (quantity > 0) {
                    orderItems.push({
                        id: itemId,
                        name: product.name,
                        flavor: flavor,
                        price: Number(product.price) || 0,
                        quantity: quantity
                    });
                }
            }
        }

        if (orderItems.length === 0) {
            toast.error("No valid items found in the cart.");
            return;
        }

        const newOrder = {
            id: `ORD${Date.now()}`,
            items: orderItems,
            amount: Number(totalAmount) || 0,
            status: 'Processing',
            date: new Date().toISOString().split('T')[0],
            payment: paymentMethod,
            deliveryData: data,
            upiId: paymentMethod === 'UPI' ? upiId : null
        };

        try {
            if (!useSavedAddress && saveAddress && activeUserId) {
                await updateDefaultAddress(data);
            }

            if (useSavedAddress && defaultAddress && (!data || !data.street)) {
                setData(prev => ({ ...addressDefaultState, ...defaultAddress }));
            }

            const success = await addOrder(newOrder);

            if (success) {
                clearCart();
                toast.success(`Order placed via ${paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI'}!`);
                navigate('/orders');
            } else {
                toast.error("Order could not be placed. Please try again.");
            }
        } catch (err) {
            console.error("Place order error:", err);
            toast.error("An unexpected error occurred while placing the order.");
        }
    };

    if (subtotal === 0) {
        return (
            <div className='py-20 text-center'>
                <Title text1={"Your"} text2={"Cart is Empty"} />
                <p className='text-gray-500 mt-4'>Add some delicious items to place an order!</p>
            </div>
        );
    }

    return (
        <form onSubmit={placeOrder} className='flex flex-col py-14 gap-10 md:gap-20 max-w-[1200px] mx-auto px-4 md:px-0'>
            <div className='flex flex-col sm:flex-row gap-10 md:gap-20'>

                <div className='w-full sm:w-3/5'>
                    <Title text1={"Delivery"} text2={"Information"} />

                    {defaultAddress ? (
                        <div className='mt-4 flex gap-4 items-center'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type='radio'
                                    name='addrMode'
                                    checked={useSavedAddress === true}
                                    onChange={() => handleUseSavedToggle(true)}
                                    className='h-4 w-4'
                                />
                                <span className='text-sm'>Use saved default address</span>
                            </label>

                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type='radio'
                                    name='addrMode'
                                    checked={useSavedAddress === false}
                                    onChange={() => handleUseSavedToggle(false)}
                                    className='h-4 w-4'
                                />
                                <span className='text-sm'>Enter a new address</span>
                            </label>
                        </div>
                    ) : null}

                    <div className='flex flex-col gap-4 mt-6'>
                        <div className='flex gap-4'>
                            <input required type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' className='p-3 border rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500' disabled={useSavedAddress} />
                            <input required type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' className='p-3 border rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500' disabled={useSavedAddress} />
                        </div>

                        <input required type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' className='p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500' disabled={useSavedAddress} />
                        <input required type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' className='p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500' disabled={useSavedAddress} />

                        <div className='flex gap-4'>
                            <input required type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' className='p-3 border rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500' disabled={useSavedAddress} />
                            <input required type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' className='p-3 border rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500' disabled={useSavedAddress} />
                        </div>
                        <input required type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' className='p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500' disabled={useSavedAddress} />
                        <input required type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' className='p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500' disabled={useSavedAddress} />

                        {!useSavedAddress && activeUserId && (
                            <div className='flex items-center mt-2'>
                                <input
                                    type='checkbox'
                                    id='saveAddress'
                                    checked={saveAddress}
                                    onChange={(e) => setSaveAddress(e.target.checked)}
                                    className='h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500'
                                />
                                <label htmlFor='saveAddress' className='ml-2 text-sm font-medium text-gray-700'>
                                    Save this address as default for future orders
                                </label>
                            </div>
                        )}

                        {useSavedAddress && defaultAddress && (
                            <div className='mt-3 p-3 border rounded-md bg-gray-50 text-sm text-gray-700'>
                                <div className='font-medium'>Using saved address:</div>
                                <div>{defaultAddress.firstName} {defaultAddress.lastName}</div>
                                <div>{defaultAddress.street}, {defaultAddress.city} {defaultAddress.zipcode}</div>
                                <div>{defaultAddress.country} • {defaultAddress.phone}</div>
                                <div className='text-xs text-gray-500 mt-1'>You can choose "Enter a new address" to modify it for this order.</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='w-full sm:w-2/5 flex flex-col gap-8'>
                    <div>
                        <Title text1={"Cart"} text2={"Totals"} />
                        <div className='mt-6 p-6 border rounded-md bg-gray-50'>
                            <div className='flex justify-between py-2 border-b border-gray-300'>
                                <p className='text-gray-700'>Subtotal</p>
                                <p className='font-medium'>{currency}{(Number(subtotal) || 0).toFixed(2)}</p>
                            </div>
                            <div className='flex justify-between py-2 border-b border-gray-300'>
                                <p className='text-gray-700'>Delivery Fee</p>
                                <p className='font-medium'>{currency}{(Number(delivery_fee) || 0).toFixed(2)}</p>
                            </div>
                            <div className='flex justify-between py-4 text-xl font-bold'>
                                <h2>Total</h2>
                                <h2>{currency}{(Number(totalAmount) || 0).toFixed(2)}</h2>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Title text1={"Payment"} text2={"Method"} />
                        <div className='mt-6 p-6 border rounded-md bg-white shadow-sm'>
                            <h4 className='font-semibold text-gray-700 mb-4'>Choose Payment Option:</h4>

                            <div
                                className='flex items-center gap-3 py-2 cursor-pointer'
                                onClick={() => {
                                    setPaymentMethod('COD');
                                    setUpiId('');
                                }}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={() => {
                                        setPaymentMethod('COD');
                                        setUpiId('');
                                    }}
                                    className='h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300'
                                />
                                <label className='text-gray-700 font-medium'>Cash on Delivery (COD)</label>
                            </div>

                            <div
                                className='flex items-center gap-3 py-2 mt-2 cursor-pointer'
                                onClick={() => setPaymentMethod('UPI')}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value="UPI"
                                    checked={paymentMethod === 'UPI'}
                                    onChange={() => setPaymentMethod('UPI')}
                                    className='h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300'
                                />
                                <label className='text-gray-700 font-medium'>UPI / Online Payment</label>
                            </div>

                            {paymentMethod === 'UPI' && (
                                <div className='mt-4 pt-4 border-t'>
                                    <input
                                        type="text"
                                        placeholder="Enter your UPI ID (e.g., username@bank)"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        required
                                        className='w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    />
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full sm:w-2/5 mx-auto sm:mx-0'>
                <button
                    type='submit'
                    className='w-full bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 transition duration-200 mt-4 font-semibold'
                >
                    PROCEED TO PAYMENT ({currency}{(Number(totalAmount) || 0).toFixed(2)})
                </button>
            </div>
        </form>
    );
}

export default PlaceOrder;