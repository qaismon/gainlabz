import React from 'react';
import Title from '../components/Title';

function About() {
  return (
    <div className='py-14 max-w-[1200px] mx-auto'>
        
        <div className='mt-8 flex flex-col gap-8'>
            
            <div className='p-6 bg-gray-100 rounded-lg '>
                <h3 className='text-2xl font-bold text-green-600 mb-3'>Our Mission</h3>
                <p className='text-gray-700 leading-relaxed'>
                    We believe that "great supplements should be accessible to everyone, everywhere. Our mission is to connect you with the finest products, delivering the best products directly to your door with speed and a smile. We strive to be the most reliable and customer-focused food delivery platform in the region.
                </p>
            </div>
            
            <div className='p-6 bg-gray-100 rounded-lg'>
                <h3 className='text-2xl font-bold text-gray-800 mb-3'>What We Value</h3>
                <ul className='list-disc list-inside text-gray-700 ml-4 space-y-2'>
                    <li>Quality: Ensuring every meal we deliver meets the highest standards of taste and freshness.</li>
                    <li>Reliability: Getting your order right and on time, every time.</li>
                    <li>Community: Supporting our local restaurant partners and delivery drivers.</li>
                    <li>Innovation: Constantly improving our app and service to enhance your experience.</li>
                </ul>
            </div>

            
            
        </div>
    </div>
  );
}

export default About;