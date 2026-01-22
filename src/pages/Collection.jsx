import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem'; 
import QuickView from '../components/QuickView';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronRight, X } from 'lucide-react'; // Using Lucide for cleaner icons

// ... Animations (gridContainer, gridItem) stay the same

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
    const { products = [], search, showSearch, currency } = useContext(ShopContext);

    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relevant');
    const [showOffersOnly, setShowOffersOnly] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    // Helpers
    const toggleCategory = (v) => setCategory(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
    const toggleSubCategory = (v) => setSubCategory(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
    
    const clearFilters = () => {
        setCategory([]);
        setSubCategory([]);
        setShowOffersOnly(false);
    };

    // ... applyFilterAndSort Logic stays the same ...
    const applyFilterAndSort = useCallback(() => {
        if (!products || !Array.isArray(products)) {
            setFilterProducts([]);
            return;
        }
        let list = [...products];
        if (showSearch && search) {
            list = list.filter(item => (item.name || '').toLowerCase().includes((search || '').toLowerCase()));
        }
        if (showOffersOnly) {
            list = list.filter(item => item.onSale && item.offerPrice != null);
        }
        if (category.length > 0) {
            list = list.filter(item => category.includes(item.category));
        }
        if (subCategory.length > 0) {
            list = list.filter(item => subCategory.includes(item.subCategory));
        }
        if (sortType === 'Low-High') {
            list.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
        } else if (sortType === 'High-Low') {
            list.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
        }
        setFilterProducts(list);
    }, [products, category, subCategory, search, showSearch, showOffersOnly, sortType]);

    useEffect(() => {
        applyFilterAndSort();
    }, [applyFilterAndSort]);

    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-12 pt-10 px-4 max-w-7xl mx-auto'>
            
            {/* --- NEW STYLED FILTER SIDEBAR --- */}
            <div className='min-w-[240px]'>
                <div 
                    onClick={() => setShowFilter(!showFilter)} 
                    className='flex items-center justify-between cursor-pointer sm:cursor-default group mb-4'
                >
                    <div className='flex items-center gap-2'>
                        <Filter size={20} className="text-gray-800" />
                        <p className='text-xl font-black tracking-widest text-gray-800'>FILTERS</p>
                    </div>
                    <img className={`h-3 sm:hidden transition-transform ${showFilter ? 'rotate-180' : ''}`} src={assets.dropdown2_icon} alt='' />
                </div>

                {/* Filter Container */}
                <div className={`${showFilter ? 'block' : 'hidden'} sm:block transition-all duration-300`}>
                    
                    {/* Clear Filters Button */}
                    {(category.length > 0 || subCategory.length > 0 || showOffersOnly) && (
                        <button 
                            onClick={clearFilters}
                            className="text-xs font-bold text-red-500 mb-4 flex items-center gap-1 hover:underline"
                        >
                            <X size={14} /> CLEAR ALL
                        </button>
                    )}

                    <div className='bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden'>
                        
                        {/* Flash Sale Section */}
                        <div className='p-5 bg-red-50/50 border-b border-gray-100'>
                            <label className='flex gap-3 items-center cursor-pointer group'>
                                <div className="relative flex items-center">
                                    <input 
                                        type='checkbox' 
                                        className='peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-red-200 checked:bg-red-500 transition-all' 
                                        checked={showOffersOnly} 
                                        onChange={(e) => setShowOffersOnly(e.target.checked)} 
                                    />
                                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </span>
                                </div>
                                <span className='font-black text-red-600 text-xs uppercase tracking-tight group-hover:text-red-700'>Flash Sale</span>
                            </label>
                        </div>

                        {/* Categories Section */}
                        <div className='p-6 border-b border-gray-50'>
                            <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-4'>Categories</p>
                            <div className='flex flex-col gap-3'>
                                {['Protein', 'Pre-workout', 'Creatine', 'Vitamins'].map(c => (
                                    <label key={c} className='flex gap-3 items-center cursor-pointer group'>
                                        <input 
                                            type='checkbox' 
                                            className='h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer accent-green-600' 
                                            onChange={() => toggleCategory(c)} 
                                            checked={category.includes(c)} 
                                        />
                                        <span className={`text-sm transition-colors ${category.includes(c) ? 'text-gray-900 font-bold' : 'text-gray-500 group-hover:text-gray-700'}`}>{c}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Sub Category Section */}
                        <div className='p-6'>
                            <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-4'>Types</p>
                            <div className='flex flex-col gap-3'>
                                {['Whey', 'Casein', 'Stim', 'Non-stim'].map(s => (
                                    <label key={s} className='flex gap-3 items-center cursor-pointer group'>
                                        <input 
                                            type='checkbox' 
                                            className='h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer accent-green-600' 
                                            onChange={() => toggleSubCategory(s)} 
                                            checked={subCategory.includes(s)} 
                                        />
                                        <span className={`text-sm transition-colors ${subCategory.includes(s) ? 'text-gray-900 font-bold' : 'text-gray-500 group-hover:text-gray-700'}`}>{s}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Product Grid */}
            <div className='flex-1'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
                    <Title text1={showOffersOnly ? 'SPECIAL' : 'ALL'} text2={showOffersOnly ? 'OFFERS' : 'COLLECTIONS'} />
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-xs font-bold text-gray-400 uppercase">Sort By:</span>
                        <select 
                            onChange={e => setSortType(e.target.value)} 
                            value={sortType} 
                            className='flex-1 md:flex-none border border-gray-200 text-sm px-4 py-2.5 rounded-2xl cursor-pointer focus:ring-2 focus:ring-green-500/20 bg-white font-bold text-gray-700 outline-none shadow-sm'
                        >
                            <option value='relevant'>Most Relevant</option>
                            <option value='Low-High'>Price: Low to High</option>
                            <option value='High-Low'>Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* ... Rest of the grid and empty state ... */}
                <motion.div key={`grid-${filterProducts.length}-${sortType}`} variants={gridContainer} initial='hidden' animate='show' className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-10'>
                    <AnimatePresence mode='popLayout'>
                        {filterProducts.map((item) => (
                            <motion.div key={item._id} variants={gridItem} layout className='relative'>
                                <ProductItem 
                                    {...item} 
                                    currency={currency} 
                                    product={item} 
                                    openQuickView={(p) => setQuickViewProduct(p)} 
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filterProducts.length === 0 && (
                    <div className="text-center py-32 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <p className='text-gray-400 font-medium'>We couldn't find any products matching those filters.</p>
                        <button onClick={clearFilters} className="mt-4 text-green-600 font-bold underline">Show everything</button>
                    </div>
                )}
            </div>

            <QuickView product={quickViewProduct} isOpen={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} currency={currency} />
        </div>
    );
}

export default Collection;