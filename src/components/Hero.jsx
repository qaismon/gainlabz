import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import MarqueeBanner from './MarqueeBanner';

function Hero({ scrollToBestSeller }) {
    const navigate = useNavigate();
    const [videoLoaded, setVideoLoaded] = useState(false);

    return (
        <>
            <div className='flex flex-col sm:flex-row overflow-hidden min-h-[300px]'>

                {/* LEFT SIDE */}
                <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-16 px-6 lg:px-12'>
                    <div className='text-gray-900 max-w-lg'>
                        <div className='flex items-center gap-3 mb-3'>
                            <p className='w-10 h-0.5 bg-green-500'></p>
                            <p 
                                onClick={scrollToBestSeller} 
                                className='font-bold text-sm md:text-base text-green-600 uppercase tracking-[0.2em] cursor-pointer hover:text-green-800 transition'>
                                Elevate Your Fitness
                            </p>
                        </div>

                        <h1 className='text-4xl sm:text-5xl lg:text-5xl font-black leading-snug tracking-tight mb-6'>
                            Unleash Your <span className='text-green-600'>Full Potential</span><br />
                            with Premium Supplements
                        </h1>

                        <div className='flex items-center gap-6 mt-8'>
                            <button 
                                onClick={() => navigate("/collections")} 
                                className='bg-green-600 text-white font-extrabold py-3 px-8 rounded-full text-base tracking-wider 
                                           transition duration-300 ease-in-out transform 
                                           hover:bg-green-700 hover:scale-[1.02] active:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300'
                            >
                                Shop Now
                            </button>
                            <p 
                                onClick={() => navigate("/collections")} 
                                className='font-medium text-base cursor-pointer text-gray-700 hover:text-green-600 transition'>
                                Explore All →
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE — VIDEO WITH BLOB LOADER */}
                <div className="w-full sm:w-1/2 relative flex items-center justify-center p-4">

                    {/* BLOB LOADER UNTIL VIDEO LOADS */}
                    {!videoLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="blob-loader"></div>
                        </div>
                    )}

                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        onLoadedData={() => setVideoLoaded(true)}
                        onClick={() => navigate("/collections")}
                        className={`cursor-pointer w-4/5 h-4/5 object-cover rounded-xl transition-opacity duration-700 
                                     ${videoLoaded ? "opacity-100" : "opacity-0"}`}
                        src={assets.on_vid}
                    />
                </div>
            </div>

            <MarqueeBanner />
        </>
    );
}

export default Hero;
