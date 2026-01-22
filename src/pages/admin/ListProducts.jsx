import React, { useContext, useState, useMemo } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, Edit3, Trash2, Search, Filter } from 'lucide-react';

function ListProducts() {
    const { products, deleteProduct, currency } = useContext(ShopContext);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [stockFilter, setStockFilter] = useState('All');
    const [offerFilter, setOfferFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Name_ASC');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const handleDelete = async (id, name) => {
        toast(({ closeToast }) => (
            <div className="p-1">
                <p className="text-sm font-bold mb-2">Delete "{name.slice(0, 20)}..."?</p>
                <div className="flex gap-2">
                    <button 
                        onClick={async () => {
                            const success = await deleteProduct(id);
                            if (success) toast.success("Deleted!");
                            closeToast();
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    >
                        Delete
                    </button>
                    <button onClick={closeToast} className="bg-gray-200 px-3 py-1 rounded text-xs">Cancel</button>
                </div>
            </div>
        ), { autoClose: false });
    };

    const uniqueCategories = useMemo(() => {
        const categories = products.map(p => p.category).filter(Boolean);
        return ['All', ...new Set(categories)];
    }, [products]);

    const filteredAndSortedProducts = useMemo(() => {
        let currentProducts = [...products];
        if (searchTerm) {
            currentProducts = currentProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (categoryFilter !== 'All') {
            currentProducts = currentProducts.filter(p => p.category === categoryFilter);
        }
        if (stockFilter !== 'All') {
            currentProducts = currentProducts.filter(p => {
                const inStock = Number(p.stock) > 0;
                return stockFilter === 'In Stock' ? inStock : !inStock;
            });
        }
        if (offerFilter !== 'All') {
            currentProducts = currentProducts.filter(p => {
                const onSale = Boolean(p.onSale);
                return offerFilter === 'On Sale' ? onSale : !onSale;
            });
        }
        if (sortBy) {
            const [field, direction] = sortBy.split('_');
            currentProducts.sort((a, b) => {
                let valA, valB;
                if (field === 'Price') {
                    valA = a.onSale ? Number(a.offerPrice) : Number(a.price);
                    valB = b.onSale ? Number(b.offerPrice) : Number(b.price);
                } else {
                    valA = a.name.toLowerCase();
                    valB = b.name.toLowerCase();
                }
                return direction === 'ASC' ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
            });
        }
        return currentProducts;
    }, [products, searchTerm, categoryFilter, stockFilter, offerFilter, sortBy]);

    return (
        <div className='p-3 md:p-6 bg-gray-50 min-h-screen'>
            <div className='max-w-7xl mx-auto bg-white shadow-sm rounded-2xl border border-gray-100 p-4 md:p-6'>
                
                {/* Header - Stacked on Mobile */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8'>
                    <div>
                        <h2 className='text-xl md:text-2xl font-black text-gray-800 tracking-tight uppercase'>Inventory</h2>
                        <p className='text-xs md:text-sm text-gray-500 font-medium'>Showing {filteredAndSortedProducts.length} items</p>
                    </div>
                    <button 
                        onClick={() => navigate('/admin/add-product')}
                        className='w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 sm:py-2 rounded-xl font-bold text-sm hover:bg-green-700 transition-all shadow-md active:scale-95'
                    >
                        <Plus size={18} />
                        <span>ADD PRODUCT</span>
                    </button>
                </div>

                {/* Filters Section */}
                <div className="mb-6 space-y-3">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm transition-all shadow-sm"
                            />
                        </div>
                        <button 
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="lg:hidden p-2.5 bg-gray-100 rounded-xl text-gray-600 border border-gray-200"
                        >
                            <Filter size={20} />
                        </button>
                    </div>

                    {/* Desktop Filters Grid / Mobile Collapsible */}
                    <div className={`${showMobileFilters ? 'grid' : 'hidden'} lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100`}>
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="p-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none">
                            <option value="All">All Categories</option>
                            {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="p-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none">
                            <option value="All">Stock Status</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                        <select value={offerFilter} onChange={(e) => setOfferFilter(e.target.value)} className="p-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none">
                            <option value="All">Offer Status</option>
                            <option value="On Sale">On Sale</option>
                        </select>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none">
                            <option value="Name_ASC">Sort: Name (A-Z)</option>
                            <option value="Price_ASC">Sort: Price (L-H)</option>
                            <option value="Price_DESC">Sort: Price (H-L)</option>
                        </select>
                    </div>
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-100 text-[11px] uppercase tracking-widest text-gray-400 font-black">
                                <th className="px-4 py-4 text-left">Product</th>
                                <th className="px-4 py-4 text-left">Category</th>
                                <th className="px-4 py-4 text-left">Price</th>
                                <th className="px-4 py-4 text-left">Stock</th>
                                <th className="px-4 py-4 text-center">Status</th>
                                <th className="px-4 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAndSortedProducts.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-4 py-4">
                                        <span className="font-bold text-gray-800 text-sm group-hover:text-orange-600 transition-colors">{item.name}</span>
                                    </td>
                                    <td className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase">{item.category}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            {item.onSale ? (
                                                <>
                                                    <span className="text-[10px] text-gray-400 line-through">{currency}{item.price.toFixed(2)}</span>
                                                    <span className="text-sm font-bold text-green-600">{currency}{item.offerPrice.toFixed(2)}</span>
                                                </>
                                            ) : (
                                                <span className="text-sm font-bold text-gray-800">{currency}{item.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`text-xs font-bold ${item.stock <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                                            {item.stock} <span className="font-normal text-gray-400">units</span>
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center gap-2">
                                            {item.onSale && <span className="bg-red-100 text-red-600 text-[9px] px-2 py-0.5 rounded-full font-black">SALE</span>}
                                            {item.bestseller && <span className="bg-yellow-100 text-yellow-700 text-[9px] px-2 py-0.5 rounded-full font-black">BEST</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => navigate(`/admin/edit-product/${item._id}`)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit3 size={16}/></button>
                                            <button onClick={() => handleDelete(item._id, item.name)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                    {filteredAndSortedProducts.map((item) => (
                        <div key={item._id} className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="max-w-[70%]">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.category}</p>
                                    <h3 className="font-bold text-gray-800 leading-tight">{item.name}</h3>
                                </div>
                                <div className="flex gap-1">
                                    {item.onSale && <span className="bg-red-500 text-white text-[8px] px-2 py-1 rounded-md font-black">SALE</span>}
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Price</p>
                                    <div className="flex items-center gap-2">
                                        {item.onSale ? (
                                            <>
                                                <span className="text-lg font-black text-green-600">{currency}{item.offerPrice}</span>
                                                <span className="text-xs text-gray-400 line-through">{currency}{item.price}</span>
                                            </>
                                        ) : (
                                            <span className="text-lg font-black text-gray-800">{currency}{item.price}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Stock</p>
                                    <p className={`font-bold ${item.stock <= 5 ? 'text-red-500' : 'text-gray-700'}`}>{item.stock} Units</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-gray-50">
                                <button 
                                    onClick={() => navigate(`/admin/edit-product/${item._id}`)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs"
                                >
                                    <Edit3 size={14} /> EDIT
                                </button>
                                <button 
                                    onClick={() => handleDelete(item._id, item.name)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-xs"
                                >
                                    <Trash2 size={14} /> DELETE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredAndSortedProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-sm italic">No products found matching your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListProducts;