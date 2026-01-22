import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem'; 
import QuickView from '../components/QuickView';
import { motion } from 'framer-motion';

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

    const toggleCategory = (e) => {
        const v = e.target.value;
        setCategory(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
    };

    const toggleSubCategory = (e) => {
        const v = e.target.value;
        setSubCategory(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
    };

    const applyFilterAndSort = useCallback(() => {
        if (!products || !Array.isArray(products)) {
            setFilterProducts([]);
            return;
        }

        let list = [...products];

        if (showSearch && search) {
            list = list.filter(item =>
                (item.name || '').toLowerCase().includes((search || '').toLowerCase())
            );
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

        // Sorting
        if (sortType === 'Low-High') {
            list.sort((a, b) => {
                const priceA = a.onSale && a.offerPrice != null ? Number(a.offerPrice) : Number(a.price);
                const priceB = b.onSale && b.offerPrice != null ? Number(b.offerPrice) : Number(b.price);
                return priceA - priceB;
            });
        } else if (sortType === 'High-Low') {
            list.sort((a, b) => {
                const priceA = a.onSale && a.offerPrice != null ? Number(a.offerPrice) : Number(a.price);
                const priceB = b.onSale && b.offerPrice != null ? Number(b.offerPrice) : Number(b.price);
                return priceB - priceA;
            });
        }

        setFilterProducts(list);
    }, [products, category, subCategory, search, showSearch, showOffersOnly, sortType]);

    useEffect(() => {
        applyFilterAndSort();
    }, [applyFilterAndSort]);

    const gridKey = `grid-${filterProducts.length}-${sortType}`;

    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 px-4'>
            {/* Left Filter Column */}
            <div className='min-w-60'>
                <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2 text-gray-500 font-bold'>
                    FILTERS
                    <img className={`h-3 sm:hidden ${showFilter ? 'rotate-180' : ''}`} src={assets.dropdown2_icon} alt='' />
                </p>

                <div className={`${showFilter ? '' : 'hidden'} sm:block pl-5 py-4 mt-6 rounded-2xl shadow-lg bg-white border border-gray-100`}>
                    <div className='flex flex-col gap-3 text-sm text-gray-700'>
                        <label className='flex gap-2 items-center cursor-pointer'>
                            <input type='checkbox' className='w-4 h-4 accent-red-500' checked={showOffersOnly} onChange={(e) => setShowOffersOnly(e.target.checked)} />
                            <span className='select-none font-bold text-red-600 uppercase tracking-tighter'>Flash Sale Only</span>
                        </label>
                    </div>
                </div>

                <div className={`${showFilter ? '' : 'hidden'} sm:block pl-5 py-4 mt-6 rounded-2xl shadow-lg bg-white border border-gray-100`}>
                    <p className='mb-3 text-sm font-bold text-gray-700 uppercase'>Categories</p>
                    <div className='flex flex-col gap-3 text-sm text-gray-700'>
                        {['Protein', 'Pre-workout', 'Creatine', 'Vitamins'].map(c => (
                            <label key={c} className='flex gap-2 items-center cursor-pointer'>
                                <input type='checkbox' value={c} onChange={toggleCategory} checked={category.includes(c)} className="w-4 h-4 accent-green-600" />
                                <span className='select-none font-medium'>{c}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={`${showFilter ? '' : 'hidden'} sm:block pl-5 py-4 my-5 rounded-2xl shadow-lg bg-white border border-gray-100`}>
                    <p className='mb-3 text-sm font-bold text-gray-700 uppercase'>Sub Category</p>
                    <div className='flex flex-col gap-3 text-sm text-gray-700'>
                        {['Whey', 'Casein', 'Stim', 'Non-stim'].map(s => (
                            <label key={s} className='flex gap-2 items-center cursor-pointer'>
                                <input type='checkbox' value={s} onChange={toggleSubCategory} checked={subCategory.includes(s)} className="w-4 h-4 accent-green-600" />
                                <span className='select-none font-medium'>{s}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Product Grid */}
            <div className='flex-1'>
                <div className='flex justify-between items-center mb-6'>
                    <Title text1={showOffersOnly ? 'SPECIAL' : 'ALL'} text2={showOffersOnly ? 'OFFERS' : 'COLLECTIONS'} />
                    <select onChange={e => setSortType(e.target.value)} value={sortType} className='border-2 border-gray-100 text-sm px-4 py-2 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 bg-white font-medium'>
                        <option value='relevant'>Relevance</option>
                        <option value='Low-High'>Price: Low to High</option>
                        <option value='High-Low'>Price: High to Low</option>
                    </select>
                </div>

                <motion.div key={gridKey} variants={gridContainer} initial='hidden' animate='show' className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8'>
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
                </motion.div>

                {filterProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className='text-gray-400 font-medium'>No products found in this category.</p>
                    </div>
                )}
            </div>

            {/* QuickView Modal */}
            <QuickView 
                product={quickViewProduct} 
                isOpen={!!quickViewProduct} 
                onClose={() => setQuickViewProduct(null)} 
                currency={currency}
            />
        </div>
    );
}

export default Collection;