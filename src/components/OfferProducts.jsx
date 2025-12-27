import React, { useContext, useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiPlus, FiMinus, FiEye, FiShoppingCart } from "react-icons/fi";
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import { toast } from 'react-toastify';

const OfferProducts = forwardRef((props, ref) => {
    const { products = [], addToCart, currency } = useContext(ShopContext);
    const [offerProducts, setOfferProducts] = useState([]);
    const navigate = useNavigate();

    // Modal States
    const [activeProduct, setActiveProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [selectedFlavor, setSelectedFlavor] = useState(null);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    useEffect(() => {
        if (products && products.length > 0) {
            const onSale = products.filter(item => Boolean(item.onSale) && item.offerPrice != null);
            setOfferProducts(onSale.slice(0, 10));
        }
    }, [products]);

    const openQuickView = (product) => {
        setActiveProduct(product);
        setMainImageIndex(0);
        setSelectedFlavor(Array.isArray(product.flavor) ? product.flavor[0] : null);
        setQty(Number(product.stock) > 0 ? 1 : 0);
        document.body.style.overflow = "hidden";
    };

    const closeQuickView = () => {
        setActiveProduct(null);
        document.body.style.overflow = "";
    };

    const confirmQuickviewAdd = () => {
        if (!activeProduct || qty === 0 || !selectedFlavor) return;
        const priceToUse = activeProduct.offerPrice || activeProduct.price;
        for (let i = 0; i < qty; i++) {
            addToCart(activeProduct.id, selectedFlavor, priceToUse);
        }
        toast.success(`${activeProduct.name} added to cart`);
        closeQuickView();
    };

    if (offerProducts.length === 0) return null;

    return (
        <div ref={ref} className='my-10 max-w-[1200px] mx-auto px-4'>
            <div className='text-center text-3xl py-8'>
                <Title text1={"FLASH"} text2={"SALE OFFERS"} />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 gap-y-6'>
                {offerProducts.map(product => (
                    <motion.article key={product.id} className="group relative bg-white rounded-xl overflow-hidden">
                        {/* SALE BADGE */}
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
                            SALE
                        </div>

                        {/* Image Container */}
                        <div className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer" onClick={() => openQuickView(product)}>
                            <img 
                                src={product.image[0]} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                            {/* Hover Eye Icon Overlay */}
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
                                className="text-xs sm:text-sm font-medium text-gray-800 truncate cursor-pointer hover:underline hover:text-blue-600"
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

            <AnimatePresence>
                {activeProduct && (
                    <QuickViewModal 
                        activeProduct={activeProduct} 
                        mainImageIndex={mainImageIndex} 
                        setMainImageIndex={setMainImageIndex} 
                        closeQuickView={closeQuickView} 
                        currency={currency} 
                        selectedFlavor={selectedFlavor} 
                        setSelectedFlavor={setSelectedFlavor} 
                        qty={qty} 
                        setQty={setQty} 
                        confirmQuickviewAdd={confirmQuickviewAdd} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
});

// Reusable QuickView Component
const QuickViewModal = ({ activeProduct, mainImageIndex, setMainImageIndex, closeQuickView, currency, selectedFlavor, setSelectedFlavor, qty, setQty, confirmQuickviewAdd }) => {
    const maxStock = Number(activeProduct.stock) || 0;
    const isOutOfStock = maxStock === 0;

    return (
        <motion.div 
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeQuickView}
        >
            <motion.div 
                className="bg-white rounded-t-3xl sm:rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2"
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Images */}
                <div className="p-4 bg-gray-50">
                    <img src={activeProduct.image[mainImageIndex]} alt="" className="w-full aspect-square object-cover rounded-xl shadow-sm" />
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {activeProduct.image.map((src, i) => (
                            <button key={i} onClick={() => setMainImageIndex(i)} className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-all ${mainImageIndex === i ? 'border-red-500 scale-105' : 'border-transparent opacity-60'}`}>
                                <img src={src} className="w-full h-full object-cover rounded-md" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{activeProduct.name}</h2>
                                <p className="text-red-600 font-bold text-xl mt-1">
                                    {currency}{Number(activeProduct.offerPrice || activeProduct.price).toFixed(2)}
                                </p>
                            </div>
                            <button onClick={closeQuickView} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FiX size={20}/></button>
                        </div>
                        <p className="text-gray-500 text-sm mt-4 leading-relaxed">{activeProduct.description}</p>
                        
                        <div className="mt-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Flavor</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {activeProduct.flavor?.map(fl => (
                                    <button key={fl} onClick={() => setSelectedFlavor(fl)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedFlavor === fl ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                                        {fl}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 flex items-center gap-4">
                        <div className="flex items-center bg-gray-100 rounded-xl p-1">
                            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2"><FiMinus /></button>
                            <span className="w-8 text-center font-bold text-gray-800">{qty}</span>
                            <button onClick={() => setQty(q => Math.min(maxStock, q + 1))} className="p-2"><FiPlus /></button>
                        </div>
                        <button 
                            onClick={confirmQuickviewAdd} 
                            disabled={isOutOfStock}
                            className="flex-1 bg-red-600 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:bg-gray-300"
                        >
                            <FiShoppingCart /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default OfferProducts;