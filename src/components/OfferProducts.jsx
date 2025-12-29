import React, { useContext, useState, useEffect, forwardRef } from 'react';
import { motion } from "framer-motion";
import { FiEye } from "react-icons/fi";
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import QuickView from './QuickView'; // Import the global component

const OfferProducts = forwardRef((props, ref) => {
    const { products = [], currency } = useContext(ShopContext);
    const [offerProducts, setOfferProducts] = useState([]);
    const navigate = useNavigate();

    // --- State for the Centralized QuickView ---
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    useEffect(() => {
        if (products && products.length > 0) {
            // Filters products that are specifically marked for sale
            const onSale = products.filter(item => Boolean(item.onSale) && item.offerPrice != null);
            setOfferProducts(onSale.slice(0, 10));
        }
    }, [products]);

    if (offerProducts.length === 0) return null;

    return (
        <div ref={ref} className='my-10 max-w-[1200px] mx-auto px-4'>
            <div className='text-center text-3xl py-8'>
                <Title text1={"FLASH"} text2={"SALE OFFERS"} />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 gap-y-6'>
                {offerProducts.map(product => (
                    <motion.article key={product.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        
                        {/* SALE BADGE */}
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
                            SALE
                        </div>

                        {/* Image Container with Eye Trigger */}
                        <div 
                            className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer" 
                            onClick={() => setQuickViewProduct(product)}
                        >
                            <img 
                                src={product.image[0]} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                            
                            {/* Eye Icon Hover Overlay */}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="bg-white p-3 rounded-full shadow-xl text-gray-900 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    <FiEye size={22} />
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-3 text-center">
                            <h3 
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="text-xs sm:text-sm font-medium text-gray-800 truncate cursor-pointer hover:underline hover:text-red-600"
                            >
                                {product.name}
                            </h3>
                            <div className="mt-1 flex flex-col items-center">
                                <span className="text-[10px] text-gray-400 line-through">
                                    {currency}{Number(product.price).toFixed(2)}
                                </span>
                                <span className="text-sm font-bold text-red-600">
                                    {currency}{Number(product.offerPrice).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>

            {/* Centralized QuickView (Information Only) */}
            <QuickView 
                product={quickViewProduct} 
                isOpen={!!quickViewProduct} 
                onClose={() => setQuickViewProduct(null)} 
                currency={currency}
            />
        </div>
    );
});

export default OfferProducts;