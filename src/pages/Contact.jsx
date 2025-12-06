import React, { useState } from 'react';
import Title from '../components/Title';

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
        
        console.log("Form Submitted:", formData);
        
        alert("Thank you for your message! We will get back to you shortly.");
        
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
    };

    return (
        <div className='py-14 max-w-[1200px] mx-auto '>

            <div className='mt-8 flex flex-col md:flex-row gap-10'>
                
                

                <div className='md:w-2/5 p-6 bg-gray-100 rounded-lg shadow-2xl flex flex-col gap-6 h-fit '>
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>Contact Information</h3>
                    
                    <div className='flex items-center gap-4'>
                        <span className='text-orange-500 text-2xl'>📞</span>
                        <div>
                            <p className='font-semibold text-gray-700'>Call Us</p>
                            <p className='text-gray-600'>+91 98765 43210</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4'>
                        <span className='text-orange-500 text-2xl'>✉️</span>
                        <div>
                            <p className='font-semibold text-gray-700'>Email Us</p>
                            <p className='text-gray-600'>support@app.com</p>
                        </div>
                    </div>

                    <div className='flex items-start gap-4'>
                        <span className='text-orange-500 text-2xl'>📍</span>
                        <div>
                            <p className='font-semibold text-gray-700'>Our Office</p>
                            <p className='text-gray-600'>
                                123 Food Street,<br/>
                                Silicon Valley, Bangalore - 560001
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;