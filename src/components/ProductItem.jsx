import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom

function ProductItem({ id, name, price, offerPrice, onSale, image, currency = '$' }) {

    return (
        <div className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            
            {/* FIX: Fixed height container for consistent card sizing */}
            <div className="relative **h-56** overflow-hidden"> 
                {onSale && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                        SALE
                    </span>
                )}
                <Link to={`/product/${id}`} className="block">
                    <img
                        src={image?.[0] || "/placeholder.png"}
                        alt={name}
                        // FIX: w-full h-full object-cover ensures the image fills the 56 height
                        className="w-full **h-full object-cover** transition duration-300 ease-in-out hover:scale-110"
                        loading="lazy"
                    />
                </Link>
            </div>

            <div className="p-3">
                <Link to={`/product/${id}`} className="block">
                    {/* FIX: Truncate name to prevent multiple lines that shift other elements */}
                    <h3 className="pt-3 pb-1 text-sm **truncate** font-semibold text-gray-800">{name}</h3>
                </Link>

                {/* FIX: Price Block uses flex-col for consistent vertical stacking */}
                <div className="text-sm font-medium **flex flex-col** mt-1"> 
                    {onSale && offerPrice !== undefined && offerPrice !== null ? (
                        <>
                            <span className='text-xs text-gray-400 line-through'>
                                {currency}{Number(price || 0).toFixed(2)}
                            </span>
                            <span className='text-base font-bold text-red-600'>
                                {currency}{Number(offerPrice || 0).toFixed(2)}
                            </span>
                        </>
                    ) : (
                        <span className='text-base font-bold text-gray-900'>
                            {currency}{Number(price || 0).toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductItem;