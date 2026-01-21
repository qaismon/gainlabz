import React, { useContext, useState, useMemo } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE_URL from '../../services/api';

function ListProducts() {
    const { products, deleteProduct, currency } = useContext(ShopContext);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [stockFilter, setStockFilter] = useState('All');
    const [offerFilter, setOfferFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Name_ASC');

    const handleDelete = async (id, name) => {
        const confirmToast = toast(
            ({ closeToast }) => (
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
            ), { autoClose: false }
        );
    };

    const uniqueCategories = useMemo(() => {
        const categories = products.map(p => p.category).filter(Boolean);
        return ['All', ...new Set(categories)];
    }, [products]);

    const filteredAndSortedProducts = useMemo(() => {
        let currentProducts = [...products];

        if (searchTerm) {
            currentProducts = currentProducts.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
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
        <div className='p-6 bg-gray-50 min-h-screen'>
            <div className='max-w-7xl mx-auto bg-white shadow-sm rounded-2xl border border-gray-100 p-6'>
                
                {/* Header */}
                <div className='flex justify-between items-center mb-8'>
                    <div>
                        <h2 className='text-2xl font-black text-gray-800 tracking-tight'>PRODUCT INVENTORY</h2>
                        <p className='text-sm text-gray-500 font-medium'>Showing {filteredAndSortedProducts.length} items</p>
                    </div>
                    <button 
                        onClick={() => navigate('/admin/add-product')}
                        className='bg-green-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-orange-700 transition-all shadow-md active:scale-95'
                    >
                        + ADD NEW PRODUCT
                    </button>
                </div>

                {/* Filters Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm transition-all"
                    />
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="p-2 border border-gray-200 rounded-lg text-sm outline-none">
                        <option value="All">All Categories</option>
                        {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="p-2 border border-gray-200 rounded-lg text-sm outline-none">
                        <option value="All">Stock Status</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                    <select value={offerFilter} onChange={(e) => setOfferFilter(e.target.value)} className="p-2 border border-gray-200 rounded-lg text-sm outline-none">
                        <option value="All">Offer Status</option>
                        <option value="On Sale">On Sale</option>
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border border-gray-200 rounded-lg text-sm outline-none">
                        <option value="Name_ASC">Sort: Name (A-Z)</option>
                        <option value="Price_ASC">Sort: Price (L-H)</option>
                        <option value="Price_DESC">Sort: Price (H-L)</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-100 text-[11px] uppercase tracking-widest text-gray-400 font-black">
                                <th className="px-4 py-4 text-left">Product</th>
                                <th className="px-4 py-4 text-left">Category</th>
                                <th className="px-4 py-4 text-left">Price</th>
                                <th className="px-4 py-4 text-left">Stock</th>
                                <th className="px-4 py-4 text-center">Badges</th>
                                <th className="px-4 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAndSortedProducts.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-4">
                                            
                                            <span className="font-bold text-gray-800 text-sm group-hover:text-orange-600 transition-colors">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase">{item.category}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            {item.onSale ? (
                                                <>
                                                    <span className="text-xs text-gray-400 line-through">{currency}{item.price.toFixed(2)}</span>
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
                                            {item.onSale && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-black">SALE</span>}
                                            {item.bestseller && <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full font-black">BEST</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => navigate(`/admin/edit-product/${item._id}`)} className="text-blue-500 hover:text-blue-700 font-bold text-xs uppercase">Edit</button>
                                            <button onClick={() => handleDelete(item._id, item.name)} className="text-red-400 hover:text-red-600 font-bold text-xs uppercase">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ListProducts;