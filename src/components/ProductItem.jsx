import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye } from "react-icons/fi";

function ProductItem({ id, name, price, offerPrice, onSale, image, currency = '$', openQuickView, product }) {
    const navigate = useNavigate();

    return (
        <div className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
            
            {/* Image Container */}
            <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-50"> 
                {onSale && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
                        SALE
                    </span>
                )}

                {/* IMAGE: Navigates to Product Page */}
                <div 
                    className="relative w-full h-full cursor-pointer"
                    onClick={() => navigate(`/product/${id}`)}
                >
                    <img
                        src={image?.[0] || "/placeholder.png"}
                        alt={name}
                        className="w-full h-full object-cover transition duration-500 ease-in-out group-hover:scale-110"
                        loading="lazy"
                    />
                </div>

                {/* DESKTOP EYE ICON: Centered hover trigger (Hidden on mobile) */}
                <div className="hidden sm:flex absolute inset-0 pointer-events-none items-center justify-center">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            openQuickView(product);
                        }}
                        className="pointer-events-auto bg-white p-3 rounded-full shadow-xl text-gray-900 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100 hover:text-green-600"
                    >
                        <FiEye size={22} />
                    </button>
                </div>
            </div>

            <div className="p-3 flex flex-col flex-grow">
                {/* NAME & MOBILE QUICK VIEW ROW */}
                <div className="flex items-start justify-between gap-1 pt-2">
                    <h3 
                        onClick={() => navigate(`/product/${id}`)}
                        className="text-sm sm:text-base truncate font-medium text-gray-800 cursor-pointer hover:text-green-600 hover:underline flex-1"
                    >
                        {name}
                    </h3>
                    
                    {/* MOBILE EYE ICON: Visible only on small screens */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            openQuickView(product);
                        }}
                        className="sm:hidden p-1.5 text-gray-500 border border-gray-200 rounded-md active:bg-gray-100 active:text-green-600"
                        title="Quick View"
                    >
                        <FiEye size={18} />
                    </button>
                </div>

                <div className="text-sm font-medium flex flex-col mt-auto pt-1"> 
                    {onSale && offerPrice != null ? (
                        <>
                            <span className='text-[10px] text-gray-400 line-through leading-none'>
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