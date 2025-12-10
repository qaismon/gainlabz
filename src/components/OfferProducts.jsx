import React, { useContext, useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiPlus, FiMinus } from "react-icons/fi";
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { toast } from 'react-toastify';

// Rename the component to follow the pattern and accept a ref
const OfferProducts = forwardRef((props, ref) => {
    // Destructure necessary context values
    const { products = [], addToCart, currency } = useContext(ShopContext);

    // Filter for products on sale (equivalent to filtering for 'bestseller' in the original)
    const [offerProducts, setOfferProducts] = useState([]);

    // States for Quick View Modal (copied directly from BestSeller)
    const [activeProduct, setActiveProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [selectedFlavor, setSelectedFlavor] = useState(null);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    // --- EFFECT: Filter Offer Products ---
    useEffect(() => {
        if (products && products.length > 0) {
            // Filter products where onSale is true and offerPrice is a valid number
            const onSale = products.filter(item => Boolean(item.onSale) && item.offerPrice !== undefined && item.offerPrice !== null);
            setOfferProducts(onSale.slice(0, 10)); // Display up to 10 offer products
        } else {
            setOfferProducts([]);
        }
    }, [products]);

    // --- QUICK VIEW HANDLERS (Copied logic from BestSeller) ---
    const openQuickView = (product) => {
        const maxQty = Number(product.stock) || 0;

        setActiveProduct(product);
        setMainImageIndex(0);

        const defaultFlavor = Array.isArray(product.flavor) && product.flavor.length > 0 ? product.flavor[0] : null;
        setSelectedFlavor(defaultFlavor);
        setQty(maxQty > 0 ? 1 : 0);

        document.body.style.overflow = "hidden";
    };

    const closeQuickView = () => {
        setActiveProduct(null);
        setSelectedFlavor(null);
        setQty(1);
        setMainImageIndex(0);
        document.body.style.overflow = "";
    };

    // Note: onGridAddToCart logic is skipped here since the offer grid uses 'Quick View' button, 
    // but the Quick View modal itself needs the add to cart logic.

    const confirmQuickviewAdd = () => {
        if (!activeProduct || qty === 0 || !selectedFlavor) return;

        const maxStock = Number(activeProduct.stock) || 0;
        if (qty > maxStock) {
            toast.error(`Cannot add ${qty} items. Only ${maxStock} left in stock.`);
            return;
        }

        const flavor = selectedFlavor || (Array.isArray(activeProduct.flavor) ? activeProduct.flavor[0] : "Default");
        for (let i = 0; i < (Number(qty) || 1); i++) {
            try {
                // Ensure the price added to cart reflects the offer price if active
                const priceToUse = (activeProduct.onSale && activeProduct.offerPrice !== undefined) ? activeProduct.offerPrice : activeProduct.price;
                addToCart(activeProduct.id, flavor, priceToUse); 
            } catch (err) {
                console.error(err);
                toast.error("Couldn't add to cart");
                return;
            }
        }
        toast.success(`${activeProduct.name} (${flavor}) x${qty} added to cart`);
        closeQuickView();
    };

    // --- EFFECT: Close on Escape Key ---
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') { closeQuickView(); } };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Framer Motion Variants
    const cardVariants = {
        rest: { y: 0, boxShadow: "0 0px 0px rgba(0,0,0,0.04)" },
        hover: { y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }
    };

    // Quick View Modal Stock Status
    const maxStock = activeProduct ? Number(activeProduct.stock) : 0;
    const isOutOfStock = maxStock === 0;
    const isMaxQuantity = qty >= maxStock;

    // Quick View Modal Price Logic (NEW - to handle offer price)
    const displayPrice = activeProduct ? (activeProduct.onSale && activeProduct.offerPrice !== undefined ? activeProduct.offerPrice : activeProduct.price) : 0;
    const originalPrice = activeProduct ? activeProduct.price : 0;
    const isOnSale = activeProduct ? Boolean(activeProduct.onSale && activeProduct.offerPrice !== undefined) : false;
    const discountPercent = isOnSale && originalPrice > displayPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : null;


    if (offerProducts.length === 0) {
        return (
            <div className='my-10 max-w-[1200px] mx-auto px-4 text-center'>
                <Title text1={"FLASH"} text2={"SALE OFFERS"} />
                <p className="py-8 text-gray-500">No active offers right now! Check back soon.</p>
            </div>
        );
    }

    // --- RENDER COMPONENT ---
    return (
        <div ref={ref} className='my-10 max-w-[1200px] mx-auto px-4'>
            <div className='text-center text-3xl py-8'>
                <Title text1={"FLASH"} text2={"SALE OFFERS"} />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {offerProducts.map(product => (
                    <motion.article
                        key={product.id}
                        className="bg-white rounded-lg overflow-hidden cursor-pointer relative"
                        initial="rest"
                        whileHover="hover"
                        animate="rest"
                        variants={cardVariants}
                    >
                        {/* SALE BADGE */}
                        {product.onSale && (
                            <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                                SALE
                            </span>
                        )}
                        
                        <div className="relative">
                            <img
                                src={(product.image && product.image[0]) || "/placeholder.png"}
                                alt={product.name}
                                className="hover:scale-110 transition ease-in-out w-full h-48 object-cover" // Added object-cover for better image handling
                                loading="lazy"
                                onClick={() => openQuickView(product)}
                            />
                        </div>

                        <div className="p-3">
                            <h3 className="pt-3 pb-1 text-sm truncate">{product.name}</h3>

                            <div className="flex items-center justify-between mt-3">
                                <div className="text-sm font-medium flex flex-col">
                                    {/* Offer Price Display on Grid */}
                                    {product.onSale && product.offerPrice !== undefined ? (
                                        <>
                                            <span className='text-xs text-gray-400 line-through'>
                                                {currency}{Number(product.price || 0).toFixed(2)}
                                            </span>
                                            <span className='text-base font-bold text-red-600'>
                                                {currency}{Number(product.offerPrice || 0).toFixed(2)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className='text-base font-bold text-gray-900'>
                                            {currency}{Number(product.price || 0).toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => openQuickView(product)}
                                    className="text-sm bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200"
                                >
                                    Quick view
                                </button>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>

            {/* --- QUICK VIEW MODAL (Framer Motion and state logic) --- */}
            <AnimatePresence>
                {activeProduct && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeQuickView}
                    >
                        <motion.div
                            className="bg-white rounded-lg max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden"
                            initial={{ y: 20, opacity: 0, scale: 0.98 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.98 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Product Image Panel */}
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex-1 relative">
                                    {/* Discount Percentage Badge in Quick View */}
                                    {isOnSale && discountPercent && (
                                        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                                            {discountPercent}% OFF
                                        </span>
                                    )}
                                    <img
                                        src={(activeProduct.image && activeProduct.image[mainImageIndex]) || "/placeholder.png"}
                                        alt={activeProduct.name}
                                        className="w-full h-80 object-cover rounded-md"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {(activeProduct.image || []).slice(0, 4).map((src, i) => (
                                        <button key={i}
                                            onClick={() => setMainImageIndex(i)}
                                            className={`w-16 h-12 rounded overflow-hidden border ${mainImageIndex === i ? 'border-green-500 ring-2 ring-green-500' : ''}`}
                                        >
                                            <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Product Info Panel */}
                            <div className="p-6 flex flex-col">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">{activeProduct.name}</h2>
                                        <p className="text-sm text-gray-500 mt-1">{activeProduct.category || ""}</p>
                                    </div>
                                    <button onClick={closeQuickView} className="text-gray-500 hover:text-gray-800">
                                        <FiX size={22} />
                                    </button>
                                </div>

                                <div className="mt-4 flex-1">
                                    <p className="text-gray-700">{activeProduct.description || "No description available."}</p>

                                    {/* Price section with sale logic in Quick View */}
                                    <div className="mt-4">
                                        {isOnSale && (
                                            <div className="text-sm text-gray-400 line-through">
                                                {currency}{Number(originalPrice).toFixed(2)}
                                            </div>
                                        )}
                                        <div className={`text-xl font-bold ${isOnSale ? 'text-red-600' : 'text-red-600'}`}>
                                            {currency}{Number(displayPrice).toFixed(2)}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">Inclusive of taxes (if any)</div>
                                    </div>

                                    <div className={`mt-2 font-semibold ${isOutOfStock ? 'text-green-500' : 'text-green-500'}`}>
                                        {isOutOfStock ? 'Currently Out of Stock' : `In Stock: ${maxStock}`}
                                    </div>
                                </div>

                                {/* Flavor Selector */}
                                <div className="mt-4">
                                    <div className="text-sm font-medium mb-2">Choose flavor</div>
                                    <div className="flex gap-2 flex-wrap">
                                        {(activeProduct.flavor || []).map(fl => (
                                            <button
                                                key={fl}
                                                onClick={() => setSelectedFlavor(fl)}
                                                className={`px-3 py-1 rounded-full border ${selectedFlavor === fl ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700'}`}
                                            >
                                                {fl}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity and Add to Cart */}
                                <div className="mt-6 flex items-center gap-3">
                                    <div className="flex items-center border rounded-md overflow-hidden">
                                        <button
                                            onClick={() => setQty(q => Math.max(1, q - 1))}
                                            className={`px-3 py-2 ${qty <= 1 || isOutOfStock ? 'text-gray-400 cursor-not-allowed' : ''}`}
                                            disabled={qty <= 1 || isOutOfStock}
                                        >
                                            <FiMinus />
                                        </button>
                                        <div className="px-4 py-2 min-w-[44px] text-center">{qty}</div>
                                        <button
                                            onClick={() => setQty(q => Math.min(maxStock, q + 1))}
                                            className={`px-3 py-2 ${isMaxQuantity || isOutOfStock ? 'text-gray-400 cursor-not-allowed' : ''}`}
                                            disabled={isMaxQuantity || isOutOfStock}
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>

                                    <button
                                        onClick={confirmQuickviewAdd}
                                        className={`
                                            px-5 py-2 rounded-md transition-all font-medium
                                            ${isOutOfStock || qty === 0 || !selectedFlavor
                                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                                : 'bg-green-500 hover:bg-green-600 text-white'
                                            }
                                        `}
                                        disabled={isOutOfStock || qty === 0 || !selectedFlavor}
                                    >
                                        {isOutOfStock ? 'Out of Stock' : `Add ${qty} to cart`}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export default OfferProducts;