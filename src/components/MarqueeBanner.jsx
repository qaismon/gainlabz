import React from 'react';
import { Truck, ShieldCheck, Zap } from 'lucide-react'; 
import './MarqueeBanner.css'; // Import the CSS for the animation

const marqueeContent = [
    { icon: Truck, text: "FREE SHIPPING on all orders over $75" },
    { icon: ShieldCheck, text: "LAB-TESTED & GMP Certified Quality" },
    { icon: Zap, text: "NEXT-LEVEL ENERGY: New Pre-Workout Drops" },
    { icon: Truck, text: "FREE SHIPPING on all orders over $75" },
    { icon: ShieldCheck, text: "LAB-TESTED & GMP Certified Quality" },
];

function MarqueeBanner() {
    return (
        <div className=" overflow-hidden rounded-full mt-2">
            <div className="marquee-container">
                <div className="marquee-content">
                    {marqueeContent.map((item, index) => (
                        <div key={index} className="flex items-center mx-10 whitespace-nowrap">
                            <item.icon className="h-5 w-5 text-green-500 mr-3" />
                            <span className="text-black text-md font-medium tracking-wide">
                                {item.text}
                            </span>
                        </div>
                    ))}
                    {/* Duplicate content to ensure seamless loop */}
                    {marqueeContent.map((item, index) => (
                        <div key={`dup-${index}`} className="flex items-center mx-10 whitespace-nowrap">
                            <item.icon className="h-5 w-5 text-green-500 mr-3" />
                            <span className="text-white text-lg font-medium tracking-wide">
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MarqueeBanner;