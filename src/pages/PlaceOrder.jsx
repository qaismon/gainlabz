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
        placeOrder,
        defaultAddress,
        userToken,
        backendUrl,
        getCartItemsArray
    } = useContext(ShopContext);

    const navigate = useNavigate();

    const subtotal = getCartAmount();
    const totalAmount = subtotal > 0 ? subtotal + delivery_fee : 0;

    const addressDefaultState = {
        firstName: "", lastName: "", email: "", street: "",
        city: "", zipcode: "", country: "", phone: ""
    };

    const [formData, setFormData] = useState(addressDefaultState);
    const [useSavedAddress, setUseSavedAddress] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [upiId, setUpiId] = useState("");

    useEffect(() => {
        if (defaultAddress && Object.keys(defaultAddress).length > 0) {
            setUseSavedAddress(true);
            setFormData(prev => ({ ...addressDefaultState, ...defaultAddress }));
        }
    }, [defaultAddress]);

    const loadRazorpayScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const initRazorpayPayment = async (orderData) => {
        const isLoaded = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!isLoaded) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }

        // We need the items to send to verification so the backend can save the order
        const orderItems = getCartItemsArray();

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
            amount: orderData.amount,
            currency: orderData.currency,
            name: "GymFluence",
            description: "Store Purchase",
            order_id: orderData.id,
            handler: async function (response) {
                try {
                    const verifyRes = await fetch(`${backendUrl}/api/orders/verify-razorpay`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userToken}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            formData,
                            items: orderItems, // Crucial for backend saving
                            amount: totalAmount
                        })
                    });

                    const data = await verifyRes.json();
                    if (data.success) {
                        toast.success("Payment Successful!");
                        navigate('/orders');
                    } else {
                        toast.error(data.message || "Payment verification failed.");
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("Error verifying payment");
                }
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone
            },
            theme: { color: "#f97316" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUseSavedToggle = (useSaved) => {
        setUseSavedAddress(useSaved);
        if (useSaved && defaultAddress) {
            setFormData({ ...addressDefaultState, ...defaultAddress });
        } else {
            setFormData(addressDefaultState);
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (subtotal === 0) {
            toast.error("Your cart is empty.");
            return;
        }
        if (!paymentMethod) {
            toast.error("Please select a payment method.");
            return;
        }

        if (paymentMethod === 'RAZORPAY') {
            try {
                // Check if backendUrl exists
                if (!backendUrl) {
                    toast.error("Backend URL not found. Check ShopContext.");
                    return;
                }

                const res = await fetch(`${backendUrl}/api/orders/razorpay`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`
                    },
                    body: JSON.stringify({ amount: totalAmount })
                });
                
                const data = await res.json();
                
                if (data.success) {
                    initRazorpayPayment(data.order);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error("Razorpay Init Error:", error);
                toast.error("Failed to initiate payment");
            }
        } else {
            const orderItems = getCartItemsArray();
            await placeOrder(formData, paymentMethod, upiId, orderItems);
        }
    };

    // ... Rest of your JSX remains the same as your provided code ...
    // (Cart Empty check and Form render)

    if (subtotal === 0) {
        return (
            <div className='py-32 text-center animate-fadeIn'>
                <Title text1={"Your"} text2={"Cart is Empty"} />
                <p className='text-gray-500 mt-2'>Add some items to your cart to continue</p>
                <button onClick={() => navigate('/')} className='bg-black text-white px-10 py-3 mt-6 hover:bg-gray-800 transition-all rounded-sm shadow-md'>
                    GO SHOPPING
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col py-10 gap-8 max-w-[1200px] mx-auto px-4 lg:px-10 bg-gray-50/50'>
            {/* The rest of your form JSX code */}
            <div className='flex flex-col lg:flex-row gap-12'>
                {/* Left Side: Delivery Info */}
                <div className='w-full lg:w-[60%] bg-white p-6 md:p-10 rounded-xl border border-gray-100 shadow-sm'>
                    <div className='mb-8'>
                        <Title text1={"DELIVERY"} text2={"INFORMATION"} />
                    </div>

                    {defaultAddress && (
                        <div className='mb-8 flex gap-6 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
                            <label className='flex items-center gap-2 cursor-pointer group'>
                                <input type='radio' name='addrMode' className='accent-orange-500 w-4 h-4' checked={useSavedAddress} onChange={() => handleUseSavedToggle(true)} />
                                <span className={`text-sm font-semibold ${useSavedAddress ? 'text-orange-600' : 'text-gray-600'}`}>Use saved address</span>
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer group'>
                                <input type='radio' name='addrMode' className='accent-orange-500 w-4 h-4' checked={!useSavedAddress} onChange={() => handleUseSavedToggle(false)} />
                                <span className={`text-sm font-semibold ${!useSavedAddress ? 'text-orange-600' : 'text-gray-600'}`}>New address</span>
                            </label>
                        </div>
                    )}

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <input required type="text" name='firstName' onChange={onChangeHandler} value={formData.firstName} placeholder='First name' className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all' disabled={useSavedAddress} />
                        <input required type="text" name='lastName' onChange={onChangeHandler} value={formData.lastName} placeholder='Last name' className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all' disabled={useSavedAddress} />
                        <input required type="email" name='email' onChange={onChangeHandler} value={formData.email} placeholder='Email address' className='md:col-span-2 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all' disabled={useSavedAddress} />
                        <input required type="text" name='street' onChange={onChangeHandler} value={formData.street} placeholder='Street & House Number' className='md:col-span-2 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all' disabled={useSavedAddress} />
                        <input required type="text" name='city' onChange={onChangeHandler} value={formData.city} placeholder='City' className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all' disabled={useSavedAddress} />
                        <input required type="text" name='zipcode' onChange={onChangeHandler} value={formData.zipcode} placeholder='Zip code' className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all' disabled={useSavedAddress} />
                        <input required type="text" name='country' onChange={onChangeHandler} value={formData.country} placeholder='Country' className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all' disabled={useSavedAddress} />
                        <input required type="text" name='phone' onChange={onChangeHandler} value={formData.phone} placeholder='Phone Number' className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all' disabled={useSavedAddress} />
                    </div>
                </div>

                {/* Right Side: Totals & Payment */}
                <div className='w-full lg:w-[40%] space-y-8'>
                    <div className='bg-white p-8 rounded-xl border border-gray-100 shadow-sm'>
                        <Title text1={"ORDER"} text2={"SUMMARY"} />
                        <div className='mt-6 space-y-4'>
                            <div className='flex justify-between text-gray-600'>
                                <span>Subtotal</span>
                                <span>{currency}{subtotal.toFixed(2)}</span>
                            </div>
                            <div className='flex justify-between text-gray-600'>
                                <span>Delivery Fee</span>
                                <span>{currency}{delivery_fee.toFixed(2)}</span>
                            </div>
                            <div className='h-[1px] bg-gray-100 w-full my-2'></div>
                            <div className='flex justify-between text-xl font-bold text-gray-800'>
                                <h2>Total</h2>
                                <h2>{currency}{totalAmount.toFixed(2)}</h2>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white p-8 rounded-xl border border-gray-100 shadow-sm'>
                        <Title text1={'PAYMENT'} text2={'METHOD'} />
                        <div className='flex flex-col gap-4 mt-6'>
                            <div onClick={() => setPaymentMethod('COD')} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                <div className='flex items-center gap-3'>
                                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${paymentMethod === 'COD' ? 'border-orange-500' : 'border-gray-300'}`}>
                                        {paymentMethod === 'COD' && <div className='w-2.5 h-2.5 bg-orange-500 rounded-full'></div>}
                                    </div>
                                    <span className='font-medium text-gray-700 uppercase text-sm tracking-wider'>Cash on Delivery</span>
                                </div>
                            </div>

                            <div onClick={() => setPaymentMethod('RAZORPAY')} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'RAZORPAY' ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                <div className='flex items-center gap-3'>
                                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${paymentMethod === 'RAZORPAY' ? 'border-orange-500' : 'border-gray-300'}`}>
                                        {paymentMethod === 'RAZORPAY' && <div className='w-2.5 h-2.5 bg-orange-500 rounded-full'></div>}
                                    </div>
                                    <span className='font-medium text-gray-700 uppercase text-sm tracking-wider'>Razorpay (Cards/UPI)</span>
                                </div>
                            </div>

                            <div onClick={() => setPaymentMethod('UPI')} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                <div className='flex items-center gap-3'>
                                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${paymentMethod === 'UPI' ? 'border-orange-500' : 'border-gray-300'}`}>
                                        {paymentMethod === 'UPI' && <div className='w-2.5 h-2.5 bg-orange-500 rounded-full'></div>}
                                    </div>
                                    <span className='font-medium text-gray-700 uppercase text-sm tracking-wider'>Direct UPI (Manual)</span>
                                </div>
                            </div>
                        </div>

                        {paymentMethod === 'UPI' && (
                            <div className='mt-4 animate-fadeIn'>
                                <input type="text" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} className='w-full p-4 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-100 outline-none bg-white font-medium' required />
                            </div>
                        )}

                        <button type='submit' className='w-full bg-orange-500 text-white mt-10 py-4 rounded-xl font-bold tracking-widest hover:bg-orange-600 active:scale-[0.98] transition-all shadow-lg shadow-orange-200'>
                            CONFIRM & PLACE ORDER
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default PlaceOrder;