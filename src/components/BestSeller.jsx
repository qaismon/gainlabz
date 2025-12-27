import React, { useContext, useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiPlus, FiMinus, FiEye, FiShoppingCart } from "react-icons/fi";
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import { toast } from 'react-toastify';

const BestSeller = forwardRef((props, ref) => {
    const { products = [], addToCart, currency } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);
    const navigate = useNavigate();

    const [activeProduct, setActiveProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [selectedFlavor, setSelectedFlavor] = useState(null);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    useEffect(() => {
        if (products && products.length > 0) {
            const best = products.filter(item => Boolean(item.bestseller));
            setBestSeller(best.slice(0, 5));
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
        for (let i = 0; i < qty; i++) addToCart(activeProduct.id, selectedFlavor);
        toast.success(`${activeProduct.name} added to cart`);
        closeQuickView();
    };

    return (
        <div ref={ref} className='my-10 max-w-[1200px] mx-auto px-4'>
            <div className='text-center text-3xl py-8'>
                <Title text1={"Best"} text2={"Sellers"} />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 gap-y-6'>
                {bestSeller.map(product => (
                    <motion.article key={product.id} className="group relative bg-white rounded-xl overflow-hidden ">
                        <div className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer" onClick={() => openQuickView(product)}>
                            <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="bg-white p-3 rounded-full shadow-xl text-gray-900 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    <FiEye size={22} />
                                </div>
                            </div>
                        </div>
                        <div className="p-3 text-center">
                            <h3 
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="text-xs sm:text-sm font-medium text-gray-800 truncate cursor-pointer hover:underline hover:text-blue-600"
                            >
                                {product.name}
                            </h3>
                            <p className="text-sm font-bold text-green-600 mt-1">{currency}{Number(product.price).toFixed(2)}</p>
                        </div>
                    </motion.article>
                ))}
            </div>

            <AnimatePresence>
                {activeProduct && <QuickViewModal activeProduct={activeProduct} mainImageIndex={mainImageIndex} setMainImageIndex={setMainImageIndex} closeQuickView={closeQuickView} currency={currency} selectedFlavor={selectedFlavor} setSelectedFlavor={setSelectedFlavor} qty={qty} setQty={setQty} confirmQuickviewAdd={confirmQuickviewAdd} themeColor="bg-green-600" />}
            </AnimatePresence>
        </div>
    );
});

export default BestSeller;