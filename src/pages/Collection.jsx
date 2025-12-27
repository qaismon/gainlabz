import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem'; 
import { FiX, FiMinus, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const gridContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.06
        }
    }
};

const gridItem = {
    hidden: { opacity: 0, y: 18, scale: 0.995 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.36, ease: [0.2, 0.9, 0.2, 1] }
    },
    exit: { opacity: 0, y: 12, transition: { duration: 0.22 } }
};

function Collection() {
    const { products = [], search, showSearch, addToCart, currency } = useContext(ShopContext);

    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relevant');
    const [showOffersOnly, setShowOffersOnly] = useState(false);

    const [activeProduct, setActiveProduct] = useState(null);
    const [selectedFlavor, setSelectedFlavor] = useState(null);
    const [qty, setQty] = useState(1);
    const [mainImageIndex, setMainImageIndex] = useState(0); 

    function toggleCategory(e) {
        const v = e.target.value;
        setCategory(prev =>
            prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
        );
    }

    function toggleSubCategory(e) {
        const v = e.target.value;
        setSubCategory(prev =>
            prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
        );
    }

    function applyFilter() {
        let list = [...products];

        if (showSearch && search) {
            list = list.filter(item =>
                (item.name || '')
                    .toLowerCase()
                    .includes((search || '').toLowerCase())
            );
        }

        if (showOffersOnly) {
            list = list.filter(item => item.onSale && item.offerPrice !== undefined && item.offerPrice !== null);
        }
        
        if (category.length > 0) {
            list = list.filter(item => category.includes(item.category));
        }

        if (subCategory.length > 0) {
            list = list.filter(item => subCategory.includes(item.subCategory));
        }

        setFilterProducts(list);
    }

    function sortProduct() {
        let sorted = [...filterProducts];

        if (sortType === 'Low-High') {
            sorted.sort((a, b) => {
                const priceA = a.onSale && a.offerPrice != null ? Number(a.offerPrice) : Number(a.price);
                const priceB = b.onSale && b.offerPrice != null ? Number(b.offerPrice) : Number(b.price);
                return priceA - priceB;
            });
        } else if (sortType === 'High-Low') {
            sorted.sort((a, b) => {
                const priceA = a.onSale && a.offerPrice != null ? Number(a.offerPrice) : Number(a.price);
                const priceB = b.onSale && b.offerPrice != null ? Number(b.offerPrice) : Number(b.price);
                return priceB - priceA;
            });
        } else {
            applyFilter();
            return;
        }
        setFilterProducts(sorted);
    }

    useEffect(applyFilter, [category, subCategory, search, showSearch, products, showOffersOnly]); 
    useEffect(sortProduct, [sortType, filterProducts.length]); 

    const openQuickView = product => {
        const maxQty = Number(product.stock) || 0;
        setActiveProduct(product);
        setSelectedFlavor(product.flavor?.[0] || null);
        setQty(maxQty > 0 ? 1 : 0); 
        setMainImageIndex(0); 
        document.body.style.overflow = 'hidden';
    };

    const closeQuickView = () => {
        setActiveProduct(null);
        setSelectedFlavor(null);
        setQty(1);
        setMainImageIndex(0); 
        document.body.style.overflow = '';
    };

    useEffect(() => {
        const escape = e => e.key === 'Escape' && closeQuickView();
        window.addEventListener('keydown', escape);
        return () => window.removeEventListener('keydown', escape);
    }, []);

    const handleQuickAdd = () => {
        if (!activeProduct || qty === 0 || !selectedFlavor) {
            toast.error("Please select a flavor and quantity.");
            return;
        }
        const priceToUse = activeProduct.onSale && activeProduct.offerPrice != null 
            ? activeProduct.offerPrice 
            : activeProduct.price;

        for (let i = 0; i < qty; i++) {
            addToCart(activeProduct.id, selectedFlavor, priceToUse); 
        }

        toast.success(`${activeProduct.name} added to cart`);
        closeQuickView();
    };

    const gridKey = `${filterProducts.length}-${sortType}-${category.join('|')}-${subCategory.join('|')}-${showOffersOnly}`;
    const maxStock = activeProduct ? Number(activeProduct.stock) : 0;
    const isOutOfStock = maxStock === 0;
    const isMaxQuantity = qty >= maxStock;
    const isOnSale = activeProduct?.onSale && activeProduct?.offerPrice != null;
    const displayPrice = isOnSale ? activeProduct.offerPrice : activeProduct?.price;
    const originalPrice = isOnSale ? activeProduct.price : null;

    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10'>

            {/* Left Filter Column */}
            <div className='min-w-60'>
                <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2 text-gray-500'>
                    Filters
                    <img className={`h-3 mt-2 sm:hidden ${showFilter ? 'rotate-180' : ''}`} src={assets.dropdown2_icon} alt='' />
                </p>

                {/* Offer Filter */}
                <div className={`${showFilter ? '' : 'hidden'} sm:block pl-5 py-4 mt-6 rounded-2xl shadow-lg backdrop-blur-xl bg-white/30 border border-gray-200 transition-all hover:bg-white/40`}>
                    <div className='flex flex-col gap-3 text-sm font-light text-gray-700'>
                        <label className='flex gap-2 items-center cursor-pointer'>
                            <input type='checkbox' className='w-4 h-4 accent-red-500' checked={showOffersOnly} onChange={(e) => setShowOffersOnly(e.target.checked)} />
                            <span className='select-none font-medium'>Show Offers Only</span>
                        </label>
                    </div>
                </div>

                {/* Categories Filter (RESTORED) */}
                <div className={`${showFilter ? '' : 'hidden'} sm:block pl-5 py-4 mt-6 rounded-2xl shadow-lg backdrop-blur-xl bg-white/30 border border-gray-200 transition-all hover:bg-white/40`}>
                    <p className='mb-3 text-sm font-medium text-gray-700'>Categories</p>
                    <div className='flex flex-col gap-3 text-sm font-light text-gray-700'>
                        {['Protein', 'Pre-workout', 'Creatine', 'Vitamins'].map(c => (
                            <label key={c} className='flex gap-2 items-center cursor-pointer'>
                                <input type='checkbox' value={c} onChange={toggleCategory} checked={category.includes(c)} className="w-4 h-4 accent-green-500" />
                                <span className='select-none'>{c}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Sub Categories Filter (RESTORED) */}
                <div className={`${showFilter ? '' : 'hidden'} sm:block pl-5 py-4 my-5 rounded-2xl shadow-lg backdrop-blur-xl bg-white/30 border border-gray-200 transition-all hover:bg-white/40`}>
                    <p className='mb-3 text-sm font-medium text-gray-700'>Sub Category</p>
                    <div className='flex flex-col gap-3 text-sm font-light text-gray-700'>
                        {['Whey', 'Casein', 'Stim', 'Non-stim'].map(s => (
                            <label key={s} className='flex gap-2 items-center cursor-pointer'>
                                <input type='checkbox' value={s} onChange={toggleSubCategory} checked={subCategory.includes(s)} className="w-4 h-4 accent-green-500" />
                                <span className='select-none'>{s}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Product Grid */}
            <div className='flex-1'>
                <div className='flex justify-between items-center mb-4'>
                    <Title text1={showOffersOnly ? 'Special' : 'All'} text2={showOffersOnly ? 'Offers' : 'Collections'} />
                    <select onChange={e => setSortType(e.target.value)} value={sortType} className='border-2 border-gray-100 text-sm px-2 py-1 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500'>
                        <option value='relevant'>Sort by: Relevance</option>
                        <option value='Low-High'>Sort by: Price Low to High</option>
                        <option value='High-Low'>Sort by: Price High to Low</option>
                    </select>
                </div>

                <motion.div key={gridKey} variants={gridContainer} initial='hidden' animate='show' className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                    {filterProducts.map((item) => (
                        <motion.div key={item.id} variants={gridItem} layout whileHover={{ y: -6 }} className='relative'>
                            <ProductItem 
                                {...item} 
                                currency={currency} 
                                product={item} 
                                openQuickView={openQuickView} 
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Quick View Modal */}
            <AnimatePresence>
                {activeProduct && (
                    <motion.div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4' onClick={closeQuickView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className='bg-white rounded-lg max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl' onClick={e => e.stopPropagation()} initial={{ y: 20, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.98 }}>
                            {/* Product Image Panel */}
                            <div className='p-4 flex flex-col gap-3 bg-gray-50'>
                                <div className='flex-1'>
                                    <img src={activeProduct.image?.[mainImageIndex] || "/placeholder.png"} alt={activeProduct.name} className='w-full h-80 object-cover rounded-md' />
                                </div>
                                <div className='flex gap-2'>
                                    {activeProduct.image?.slice(0, 4).map((src, i) => (
                                        <button key={i} onClick={() => setMainImageIndex(i)} className={`w-16 h-12 rounded overflow-hidden border ${mainImageIndex === i ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-200'}`}>
                                            <img src={src} className='w-full h-full object-cover' alt='' />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Product Info Panel */}
                            <div className='p-6 flex flex-col'>
                                <div className='flex items-start justify-between'>
                                    <div>
                                        <h2 className='text-2xl font-bold'>{activeProduct.name}</h2>
                                        <p className='text-sm text-gray-500 mt-1'>{activeProduct.category}</p>
                                    </div>
                                    <button onClick={closeQuickView} className='text-gray-500 hover:text-gray-800'><FiX size={22} /></button>
                                </div>
                                <p className='mt-4 text-gray-700 flex-1 text-sm'>{activeProduct.description}</p>
                                
                                <div className='mt-4 flex items-baseline gap-2'>
                                    {originalPrice && <span className='text-sm text-gray-500 line-through'>{currency}{Number(originalPrice).toFixed(2)}</span>}
                                    <div className={`text-xl font-bold ${isOnSale ? 'text-red-600' : 'text-green-600'}`}>{currency}{Number(displayPrice).toFixed(2)}</div>
                                </div>
                                <div className={`mt-2 text-xs font-semibold ${isOutOfStock ? 'text-red-500' : 'text-green-500'}`}>{isOutOfStock ? 'Out of Stock' : `In Stock: ${maxStock}`}</div>

                                <div className='mt-4'>
                                    <p className='text-xs font-medium mb-2 uppercase tracking-wide text-gray-500'>Flavor</p>
                                    <div className='flex gap-2 flex-wrap'>
                                        {activeProduct.flavor?.map(fl => (
                                            <button key={fl} onClick={() => setSelectedFlavor(fl)} className={`px-3 py-1 rounded-full border text-sm ${selectedFlavor === fl ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>{fl}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className='mt-6 flex items-center gap-3'>
                                    <div className='flex items-center border rounded-md overflow-hidden'>
                                        <button onClick={() => setQty(q => Math.max(1, q - 1))} className={`px-3 py-2 ${qty <= 1 || isOutOfStock ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`} disabled={qty <= 1 || isOutOfStock}><FiMinus /></button>
                                        <div className='px-4 py-2 min-w-[40px] text-center'>{qty}</div>
                                        <button onClick={() => setQty(q => Math.min(maxStock, q + 1))} className={`px-3 py-2 ${isMaxQuantity || isOutOfStock ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`} disabled={isMaxQuantity || isOutOfStock}><FiPlus /></button>
                                    </div>
                                    <button onClick={handleQuickAdd} disabled={isOutOfStock || qty === 0 || !selectedFlavor} className={`flex-1 px-5 py-2 rounded-md transition-all font-medium ${isOutOfStock || qty === 0 || !selectedFlavor ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
                                        {isOutOfStock ? 'Out of Stock' : `Add to cart`}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Collection;