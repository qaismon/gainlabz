import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets'; 

function About() {
  return (
    <div className='py-14 px-4 max-w-[1200px] mx-auto'>
      
      {/* Header Section */}
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'GAIN LABBZ'} />
      </div>

      {/* Hero Section: Story & Mission */}
      <div className='my-10 flex flex-col md:flex-row gap-16 items-center'>
        {/* Replace 'assets.about_img' with your actual fitness image path */}
        <img 
          className='w-full md:max-w-[450px] rounded-3xl shadow-2xl' 
          src={assets.about_img || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000"} 
          alt="Fitness Training" 
        />
        
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <h3 className='text-xl font-bold text-black uppercase tracking-widest'>Our Mission</h3>
          <p>
            We believe that <span className='text-[#00b852] font-semibold'>premium supplements</span> should be accessible to every athlete, from beginner to pro. At Gain Labbz, our mission is to fuel your ambition by delivering the finest scientifically-backed products directly to your door.
          </p>
          <p>
            We don't just sell supplements; we provide the tools for transformation. We strive to be the most reliable, performance-focused supplement platform in the industry, ensuring speed, quality, and community support in every order.
          </p>
          <div className='flex gap-4 mt-2'>
            <div className='border-l-4 border-[#00b852] pl-4'>
              <p className='text-black font-bold text-2xl'>100%</p>
              <p className='text-xs uppercase tracking-tighter'>Pure Quality</p>
            </div>
            <div className='border-l-4 border-[#00b852] pl-4'>
              <p className='text-black font-bold text-2xl'>24/7</p>
              <p className='text-xs uppercase tracking-tighter'>Expert Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20 gap-4'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 rounded-2xl hover:bg-[#00b852] hover:text-white transition-all duration-300 group cursor-default shadow-sm'>
            <b className='text-black group-hover:text-white uppercase tracking-widest'>Quality:</b>
            <p className='text-gray-600 group-hover:text-white/90'>Ensuring every batch meets international standards of purity, taste, and effectiveness.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 rounded-2xl hover:bg-black hover:text-white transition-all duration-300 group cursor-default shadow-sm'>
            <b className='text-black group-hover:text-white uppercase tracking-widest'>Reliability:</b>
            <p className='text-gray-600 group-hover:text-white/90'>Getting your gains to you on time, every time. No delays, no excuses.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 rounded-2xl hover:bg-[#00b852] hover:text-white transition-all duration-300 group cursor-default shadow-sm'>
            <b className='text-black group-hover:text-white uppercase tracking-widest'>Innovation:</b>
            <p className='text-gray-600 group-hover:text-white/90'>Constantly researching the latest in sports science to bring you cutting-edge formulas.</p>
          </div>
      </div>

      {/* Newsletter / CTA Section */}
      <div className='bg-gray-50 rounded-3xl p-10 md:p-20 text-center border border-gray-100 mb-10'>
        <h2 className='text-2xl md:text-3xl font-black text-black mb-4'>READY TO START YOUR JOURNEY?</h2>
        <p className='text-gray-500 mb-8'>Join the Gain Labbz community and get exclusive training tips and supplement deals.</p>
        <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <button 
              onClick={() => window.location.href = '/collection'}
              className='bg-black text-white px-10 py-4 font-bold rounded-full hover:bg-[#00b852] transition-all'
            >
              SHOP NOW
            </button>
            <button 
              onClick={() => window.location.href = '/contact'}
              className='border border-black px-10 py-4 font-bold rounded-full hover:bg-black hover:text-white transition-all'
            >
              CONTACT EXPERTS
            </button>
        </div>
      </div>

    </div>
  );
}

export default About;