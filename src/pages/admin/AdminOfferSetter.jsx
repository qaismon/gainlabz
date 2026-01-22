import React, { useContext, useState, useMemo } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import { FiSearch, FiChevronDown, FiTag, FiPercent, FiTrash2, FiCheck } from 'react-icons/fi';

function AdminOfferSetter() {
    const { products, currency, updateProduct, isAdmin } = useContext(ShopContext);
    
    const [editPrices, setEditPrices] = useState({}); 
    const [isLoadingId, setIsLoadingId] = useState(null); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); 
    const [sortType, setSortType] = useState('name-asc'); 

    if (!isAdmin) {
        return <div className="p-6 text-center text-red-600 font-bold uppercase tracking-widest">Access Denied. Admins Only.</div>;
    }

    const handleInputChange = (productId, value) => {
        setEditPrices(prev => ({ ...prev, [productId]: value }));
    };

    const handleSetOffer = async (product) => {
        const newPriceInput = editPrices[product._id];
        const offerPrice = Number(newPriceInput);
        const originalPrice = Number(product.price);

        if (isNaN(offerPrice) || offerPrice <= 0 || offerPrice >= originalPrice) {
            toast.error(`Invalid price for ${product.name}. Must be less than ${currency}${originalPrice.toFixed(2)}.`);
            return;
        }

        setIsLoadingId(product._id);
        const success = await updateProduct(product._id, { onSale: true, offerPrice: offerPrice });
        if (success) toast.success(`Offer set for ${product.name}`);
        setIsLoadingId(null);
    };
    
    const handleRemoveOffer = async (productId, productName) => {
        if (!window.confirm(`Remove offer for ${productName}?`)) return;
        setIsLoadingId(productId);
        const success = await updateProduct(productId, { onSale: false, offerPrice: null });
        if (success) {
            toast.info(`Offer removed from ${productName}`);
            setEditPrices(prev => {
                const newState = { ...prev };
                delete newState[productId];
                return newState;
            });
        }
        setIsLoadingId(null);
    };

    const filteredAndSortedProducts = useMemo(() => {
        let list = [...products];
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            list = list.filter(p => p.name.toLowerCase().includes(lowerCaseSearch) || p.category?.toLowerCase().includes(lowerCaseSearch));
        }
        if (filterStatus === 'onSale') list = list.filter(p => p.onSale);
        else if (filterStatus === 'noOffer') list = list.filter(p => !p.onSale);

        list.sort((a, b) => {
            const priceA = a.onSale ? Number(a.offerPrice) : Number(a.price);
            const priceB = b.onSale ? Number(b.offerPrice) : Number(b.price);
            if (sortType === 'price-asc') return priceA - priceB;
            if (sortType === 'price-desc') return priceB - priceA;
            return a.name.localeCompare(b.name);
        });
        return list;
    }, [products, searchTerm, filterStatus, sortType]);

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">OFFER MANAGEMENT</h1>
                    <p className="text-sm text-gray-500">Apply discounts and manage sales prices</p>
                </div>
                
                {/* Filters Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2.5 pl-10 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
                        />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="appearance-none w-full p-2.5 border border-gray-200 rounded-xl bg-white shadow-sm outline-none text-sm"
                        >
                            <option value="all">All Statuses</option>
                            <option value="onSale">Currently On Sale</option>
                            <option value="noOffer">Regular Price</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    
                    <div className="relative">
                        <select
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value)}
                            className="appearance-none w-full p-2.5 border border-gray-200 rounded-xl bg-white shadow-sm outline-none text-sm"
                        >
                            <option value="name-asc">Sort: Name (A-Z)</option>
                            <option value="price-asc">Sort: Price (Low-High)</option>
                            <option value="price-desc">Sort: Price (High-Low)</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Original</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Current Status</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">New Offer ({currency})</th>
                                <th className="px-6 py-4 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAndSortedProducts.map((product) => (
                                <tr key={product._id} className={`${product.onSale ? 'bg-red-50/30' : ''} hover:bg-gray-50 transition-colors`}>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-800">{product.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{product.category}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{currency}{product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        {product.onSale ? (
                                            <div className="flex flex-col">
                                                <span className="text-red-600 font-black text-sm">{currency}{product.offerPrice.toFixed(2)}</span>
                                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded w-fit font-bold">
                                                    {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                                                </span>
                                            </div>
                                        ) : <span className="text-gray-400 text-xs italic">Regular Price</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="number"
                                            value={editPrices[product._id] ?? ''}
                                            onChange={(e) => handleInputChange(product._id, e.target.value)}
                                            className="w-28 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleSetOffer(product)}
                                                disabled={isLoadingId === product._id || !editPrices[product._id]}
                                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-200 transition-all shadow-sm active:scale-95"
                                                title="Update Offer"
                                            >
                                                {isLoadingId === product._id ? '...' : <FiCheck size={18} />}
                                            </button>
                                            {product.onSale && (
                                                <button
                                                    onClick={() => handleRemoveOffer(product._id, product.name)}
                                                    className="p-2 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-all"
                                                    title="Remove Offer"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                    {filteredAndSortedProducts.map((product) => (
                        <div key={product._id} className={`p-4 rounded-2xl border ${product.onSale ? 'border-red-100 bg-red-50/20' : 'border-gray-100 bg-white'} shadow-sm`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.category}</span>
                                    <h3 className="font-bold text-gray-800">{product.name}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Base Price</p>
                                    <p className="font-bold text-gray-600">{currency}{product.price.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white/50 p-3 rounded-xl mb-4 border border-black/5">
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Active Offer</p>
                                    {product.onSale ? (
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-black text-red-600">{currency}{product.offerPrice}</span>
                                            <span className="text-xs font-bold text-red-400">-{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%</span>
                                        </div>
                                    ) : <p className="text-sm text-gray-400 italic">None</p>}
                                </div>
                                <div className="w-px h-8 bg-gray-200" />
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">New Price</p>
                                    <div className="relative">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{currency}</span>
                                        <input
                                            type="number"
                                            value={editPrices[product._id] ?? ''}
                                            onChange={(e) => handleInputChange(product._id, e.target.value)}
                                            className="w-full pl-6 pr-2 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-red-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSetOffer(product)}
                                    disabled={isLoadingId === product._id || !editPrices[product._id]}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm disabled:bg-gray-300"
                                >
                                    <FiCheck /> {isLoadingId === product._id ? 'UPDATING...' : 'APPLY OFFER'}
                                </button>
                                {product.onSale && (
                                    <button
                                        onClick={() => handleRemoveOffer(product._id, product.name)}
                                        className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
                                    >
                                        <FiTrash2 />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredAndSortedProducts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 italic">No products found matching filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminOfferSetter;