import React, { useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets'; // Assuming you have an assets file
import { toast } from 'react-toastify';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

   const handleSubmit = (e) => {
        e.preventDefault();
        
        // 2. Use a styled Toast instead of alert
        toast.success(`Thanks ${formData.name}! Our team will contact you shortly.`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark", // Matches your black/green theme
            style: { border: '1px solid #00b852' } // Adding your brand green border
        });

        // Clear form
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    return (
        <div className=' px-4 max-w-[1200px] mx-auto'>
            {/* Header Section */}
            <div className='text-center text-2xl'>
                <Title text1={'CONTACT'} text2={'US'} />
                <p className='text-gray-500 mt-3 text-sm md:text-base'>
                    Have questions about our supplements? Our team is here to help you <span className='text-[#00b852] font-bold'>Gain</span>.
                </p>
            </div>

            <div className='mt-12 flex flex-col md:flex-row gap-12 mb-20'>
                
                {/* Left: Contact Info Cards */}
                <div className='md:w-1/3 flex flex-col gap-6'>
                    <div className='bg-white border p-6 rounded-2xl hover:border-[#00b852] transition-all duration-300 shadow-sm'>
                        <div className='flex items-center gap-4 mb-3'>
                            <div className='bg-[#00b852]/10 p-3 rounded-lg'>
                                <span className='text-[#00b852] text-xl'>📞</span>
                            </div>
                            <p className='font-bold text-gray-800 uppercase tracking-wider text-xs'>Support Line</p>
                        </div>
                        <p className='text-gray-600 font-medium'>+91 98765 43210</p>
                        <p className='text-gray-400 text-xs mt-1'>Mon - Sat: 9am to 7pm</p>
                    </div>

                    <div className='bg-white border p-6 rounded-2xl hover:border-[#00b852] transition-all duration-300 shadow-sm'>
                        <div className='flex items-center gap-4 mb-3'>
                            <div className='bg-[#00b852]/10 p-3 rounded-lg'>
                                <span className='text-[#00b852] text-xl'>✉️</span>
                            </div>
                            <p className='font-bold text-gray-800 uppercase tracking-wider text-xs'>Email Support</p>
                        </div>
                        <p className='text-gray-600 font-medium'>support@gainlabbz.com</p>
                        <p className='text-gray-400 text-xs mt-1'>We reply within 24 hours</p>
                    </div>

                    <div className='bg-black text-white p-8 rounded-3xl mt-2'>
                        <h4 className='text-[#00b852] font-bold text-lg mb-4'>Visit Our HQ</h4>
                        <p className='text-gray-300 text-sm leading-relaxed'>
                            123 Fitness Street, Gym Square<br/>
                            Silicon Valley, Bangalore - 560001
                        </p>
                      
                    </div>
                </div>

                {/* Right: Modern Contact Form */}
                <div className='flex-1 bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100'>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                            <div className='flex flex-col gap-1'>
                                <label className='text-xs font-bold text-gray-500 ml-1'>FULL NAME</label>
                                <input 
                                    type="text" name="name" value={formData.name} onChange={handleChange}
                                    placeholder='John Doe'
                                    className='border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b852]/20 focus:border-[#00b852] transition-all'
                                    required 
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-xs font-bold text-gray-500 ml-1'>EMAIL ADDRESS</label>
                                <input 
                                    type="email" name="email" value={formData.email} onChange={handleChange}
                                    placeholder='john@example.com'
                                    className='border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b852]/20 focus:border-[#00b852] transition-all'
                                    required 
                                />
                            </div>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-xs font-bold text-gray-500 ml-1'>MESSAGE SUBJECT</label>
                            <input 
                                type="text" name="subject" value={formData.subject} onChange={handleChange}
                                placeholder='How can we help?'
                                className='border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b852]/20 focus:border-[#00b852] transition-all'
                                required 
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-xs font-bold text-gray-500 ml-1'>YOUR MESSAGE</label>
                            <textarea 
                                name="message" value={formData.message} onChange={handleChange}
                                placeholder='Type your message here...'
                                rows="5"
                                className='border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b852]/20 focus:border-[#00b852] transition-all resize-none'
                                required 
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            className='bg-[#00b852] text-white font-bold py-4 rounded-xl mt-4 hover:bg-black transition-all duration-300 shadow-lg shadow-[#00b852]/20 active:scale-95'
                        >
                            SEND MESSAGE
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;