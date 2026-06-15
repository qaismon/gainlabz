import React from 'react'
import { assets } from '../assets/assets'

function OurPolicy() {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap2 text-center py-20 text-sm md:text-base text-gray-700 dark:text-gray-300'>
            <div className='gsap-policy-card'>
                <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt=""/>
                <p className='font-semibold'>Easy Exchange Policy</p>
                <p className='text-gray-400 dark:text-gray-500'>Offer hassle free exchanges.</p>
            </div>

         <div className='gsap-policy-card'>
                <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt=""/>
                <p className='font-semibold'>7 Days Return Policy</p>
                <p className='text-gray-400 dark:text-gray-500'>We offer 7 days free return policy.</p>
            </div>

             <div className='gsap-policy-card'>
                <img src={assets.support_img} className='w-12 m-auto mb-5' alt=""/>
                <p className='font-semibold'>Best Customer</p>
                <p className='text-gray-400 dark:text-gray-500'>We offer 24/7 customer support</p>
            </div>
    </div>
  )
}

export default OurPolicy