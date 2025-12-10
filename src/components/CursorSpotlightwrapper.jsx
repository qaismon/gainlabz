import React, { useEffect } from 'react';

// Assuming this component wraps your main content (e.g., in App.js or Layout.js)
function CursorSpotlightWrapper({ children }) {

    useEffect(() => {
        const handleMouseMove = (e) => {
            const spotlightContainer = document.getElementById('spotlight-container');

            if (spotlightContainer) {
                // Set CSS variables directly on the element
                spotlightContainer.style.setProperty('--mouse-x', `${e.clientX}px`);
                spotlightContainer.style.setProperty('--mouse-y', `${e.clientY}px`);
            }
        };

        // 1. Attach the global listener when the component mounts
        document.addEventListener('mousemove', handleMouseMove);

        // 2. Clean up the listener when the component unmounts
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []); // Empty dependency array ensures it runs only once on mount

    return (
        // The container where the animation effect will live
        <div 
            id="spotlight-container" 
            className="relative min-h-screen bg-white-900 text-black" 
        >
            {/* The actual glow element will be defined via the ::before pseudo-element in CSS. 
              The 'children' prop holds all your standard website content, which should sit above the spotlight.
            */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

export default CursorSpotlightWrapper;