import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify'

function NewsletterBox() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isSubmitting) return; 

        setIsSubmitting(true);

        setTimeout(() => {
            
            toast.success(`Subscription confirmed for ${email}! Check your inbox for the 20% off code.`);    
            setEmail("");
            setIsSubmitting(false);
        }, 1000); 
    }

    return (
        <div className='text-center'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe Now & Get 20% Off</p>
           

            <form onSubmit={handleSubmit} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
                <input 
                    className="w-full sm:flex-1 outline-none" 
                    type='email' 
                    placeholder='Enter your email' 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting} 
                />
                <button 
                    type='submit' 
                    className='bg-black text-white text-xs px-10 py-4 transition-colors disabled:bg-gray-500'
                    disabled={isSubmitting} 
                >
                    {isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                </button>
            </form>
        </div>
    )
}

export default NewsletterBox