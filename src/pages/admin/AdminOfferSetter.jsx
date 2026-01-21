import React, { useContext, useState, useEffect, useMemo } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

function AdminOfferSetter() {
    const { products, currency, updateProduct, isAdmin } = useContext(ShopContext);
    
    // State for local editing
    const [editPrices, setEditPrices] = useState({}); 
    const [isLoadingId, setIsLoadingId] = useState(null); 

    // New State for Filtering, Sorting, and Searching
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'onSale', 'noOffer'
    const [sortType, setSortType] = useState('name-asc'); // 'name-asc', 'price-desc', 'price-asc'

    if (!isAdmin) {
        return <div className="p-6 text-center text-red-600 font-bold">Access Denied. Only Administrators can manage offers.</div>;
    }

    // --- Handlers ---
    
    const handleInputChange = (productId, value) => {
        setEditPrices(prev => ({ ...prev, [productId]: value }));
    };

    const handleSetOffer = async (product) => {
        const newPriceInput = editPrices[product._id];
        const offerPrice = Number(newPriceInput);
        const originalPrice = Number(product.price);

        if (isNaN(offerPrice) || offerPrice <= 0 || offerPrice >= originalPrice) {
            toast.error(`Invalid price for ${product.name}. Must be a positive number less than ${currency}${originalPrice.toFixed(2)}.`);
            return;
        }

        setIsLoadingId(product._id);
        
        const offerPayload = {
            onSale: true,
            offerPrice: offerPrice
        };

        const success = await updateProduct(product._id, offerPayload);

        if (success) {
            toast.success(`Offer of ${currency}${offerPrice.toFixed(2)} set for ${product.name}.`);
        }
        
        setIsLoadingId(null);
    };
    
    const handleRemoveOffer = async (productId, productName) => {
        if (!window.confirm(`Are you sure you want to remove the sale offer for ${productName}?`)) {
            return;
        }
        
        setIsLoadingId(productId);
        
        const removePayload = {
            onSale: false,
            offerPrice: null 
        };
        
        const success = await updateProduct(productId, removePayload);
        
        if (success) {
            toast.info(`Offer removed from ${productName}.`);
            setEditPrices(prev => {
                const newState = { ...prev };
                delete newState[productId]; 
                return newState;
            });
        }
        
        setIsLoadingId(null);
    };

    // Filtering, Sorting, and Searching Logic using useMemo
    const filteredAndSortedProducts = useMemo(() => {
        let list = [...products];

        // 1. Search Filter
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            list = list.filter(product => 
                product.name.toLowerCase().includes(lowerCaseSearch) ||
                product.category?.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // 2. Status Filter
        if (filterStatus === 'onSale') {
            list = list.filter(product => product.onSale);
        } else if (filterStatus === 'noOffer') {
            list = list.filter(product => !product.onSale);
        }

        // 3. Sort
        list.sort((a, b) => {
            const priceA = a.onSale ? Number(a.offerPrice) : Number(a.price);
            const priceB = b.onSale ? Number(b.offerPrice) : Number(b.price);
            
            if (sortType === 'price-asc') {
                return priceA - priceB;
            } else if (sortType === 'price-desc') {
                return priceB - priceA;
            } else { // 'name-asc' (default)
                return a.name.localeCompare(b.name);
            }
        });

        return list;
    }, [products, searchTerm, filterStatus, sortType]);


    // --- Render Logic ---
    
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 border-b pb-2">Offer Management Panel</h1>
            
            {/* Filter, Sort, Search Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
                
                {/* Search Input */}
                <div className="relative w-full sm:w-1/4">
                    <input
                        type="text"
                        placeholder="Search product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Status Filter */}
                <div className="relative w-full sm:w-1/5">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="appearance-none w-full p-2 border border-gray-300 rounded-lg bg-white pr-8 text-sm focus:ring-red-500 focus:border-red-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="onSale">On Offer</option>
                        <option value="noOffer">No Offer</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                
                {/* Sort By */}
                <div className="relative w-full sm:w-1/5">
                    <select
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                        className="appearance-none w-full p-2 border border-gray-300 rounded-lg bg-white pr-8 text-sm focus:ring-red-500 focus:border-red-500"
                    >
                        <option value="name-asc">Sort: Name (A-Z)</option>
                        <option value="price-asc">Sort: Price Low</option>
                        <option value="price-desc">Sort: Price High</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>
            {/* End Controls */}
            
            {/* 🛑 REMOVED overflow-x-auto from here: */}
            <div className="bg-white rounded-lg shadow"> 
                <table className="min-w-full divide-y divide-gray-200 table-fixed"> {/* Added table-fixed to help column widths */}
                    <thead className="bg-gray-100">
                        <tr>
                            {/* Set explicit widths for better control */}
                            <th className="px-3 py-3 w-4/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                            <th className="px-3 py-3 w-1/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cat.</th>
                            <th className="px-3 py-3 w-1/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-3 py-3 w-2/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer Status</th>
                            <th className="px-3 py-3 w-2/12 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Set New ({currency})</th>
                            <th className="px-3 py-3 w-2/12 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredAndSortedProducts.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No products match your current filters.
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedProducts.map((product) => (
                                <tr key={product._id} className={product.onSale ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}>
                                    
                                    {/* 🛑 REMOVED whitespace-nowrap and adjusted padding/text size for smaller columns */}
                                    <td className="px-3 py-3 text-sm font-medium text-gray-900 overflow-hidden text-ellipsis">{product.name}</td>
                                    
                                    <td className="px-3 py-3 text-sm text-gray-500 overflow-hidden text-ellipsis">{product.category}</td>
                                    
                                    <td className="px-3 py-3 text-sm font-medium">
                                        {currency}{Number(product.price).toFixed(2)}
                                    </td>
                                    
                                    <td className="px-3 py-3 text-sm">
                                        {product.onSale ? (
                                            <span className="text-red-600 font-semibold text-xs"> {/* Reduced text size */}
                                                {currency}{Number(product.offerPrice).toFixed(2)} ({Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF)
                                            </span>
                                        ) : (
                                            <span className="text-gray-500 text-sm">No Offer</span>
                                        )}
                                    </td>
                                    
                                    <td className="px-3 py-3">
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Price" // Shorter placeholder
                                            value={editPrices[product._id] ?? ''}
                                            onChange={(e) => handleInputChange(product._id, e.target.value)}
                                            className="p-1 border border-gray-300 rounded-md w-24 text-xs" // Reduced width/size
                                            disabled={isLoadingId === product._id}
                                        />
                                    </td>
                                    
                                    <td className="px-3 py-3 text-right text-sm font-medium">
                                        <div className="flex space-x-1 justify-center">
                                            <button
                                                onClick={() => handleSetOffer(product)}
                                                disabled={
                                                    isLoadingId === product._id || 
                                                    !editPrices[product._id] || 
                                                    Number(editPrices[product._id]) <= 0 || 
                                                    Number(editPrices[product._id]) >= Number(product.price)
                                                }
                                                className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-red-600 disabled:bg-gray-400 transition"
                                            >
                                                {isLoadingId === product._id ? '...' : 'Set'} {/* Shorter button text */}
                                            </button>

                                            {product.onSale && (
                                                <button
                                                    onClick={() => handleRemoveOffer(product._id, product.name)}
                                                    disabled={isLoadingId === product._id}
                                                    className="px-2 py-1 bg-gray-300 text-gray-700 text-xs font-semibold rounded-md shadow-sm hover:bg-gray-400 disabled:bg-gray-400 transition"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminOfferSetter;