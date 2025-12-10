import React, { useContext, useState, useMemo } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ListProducts() {
    const { products, deleteProduct, currency } = useContext(ShopContext);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [stockFilter, setStockFilter] = useState('All');
    const [offerFilter, setOfferFilter] = useState('All'); 
    const [sortBy, setSortBy] = useState('Name_ASC');

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete the product: "${name}"?`)) {
            const success = await deleteProduct(id);
            if (success) {
                // Assuming deleteProduct handles success/error toasts internally or elsewhere
            }
        }
    };

    const uniqueCategories = useMemo(() => {
        const categories = products.map(p => p.category).filter(Boolean);
        return ['All', ...new Set(categories)];
    }, [products]);

    const filteredAndSortedProducts = useMemo(() => {
        let currentProducts = [...products]; // Use a copy of products

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
                    const priceA = a.onSale && a.offerPrice !== undefined && a.offerPrice !== null ? Number(a.offerPrice) : Number(a.price);
                    const priceB = b.onSale && b.offerPrice !== undefined && b.offerPrice !== null ? Number(b.offerPrice) : Number(b.price);
                    valA = priceA;
                    valB = priceB;
                } else {
                    valA = a.name.toLowerCase();
                    valB = b.name.toLowerCase();
                }

                if (direction === 'ASC') {
                    return valA < valB ? -1 : valA > valB ? 1 : 0;
                } else {
                    return valA > valB ? -1 : valA < valB ? 1 : 0;
                }
            });
        }

        return currentProducts;
    }, [products, searchTerm, categoryFilter, stockFilter, offerFilter, sortBy]);


    return (
        <div className='p-4 bg-white shadow-md rounded-lg'>
            <h2 className='text-xl font-bold mb-4'>Product List ({filteredAndSortedProducts.length} of {products.length})</h2>
            
            <div className="flex flex-wrap gap-2 mb-4 items-center text-sm">
                
                <input
                    type="text"
                    placeholder="Search name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-1 border border-gray-300 rounded-lg w-full sm:w-auto flex-grow min-w-[150px]"
                />
                
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="p-1 border border-gray-300 rounded-lg text-xs"
                >
                    <option value="All">All Categories</option>
                    {uniqueCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="p-1 border border-gray-300 rounded-lg text-xs"
                >
                    <option value="All">Stock Status</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>

                <select
                    value={offerFilter}
                    onChange={(e) => setOfferFilter(e.target.value)}
                    className="p-1 border border-gray-300 rounded-lg text-xs"
                >
                    <option value="All">Offer Status</option>
                    <option value="On Sale">On Sale</option>
                    <option value="Not On Sale">Not On Sale</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-1 border border-gray-300 rounded-lg text-xs"
                >
                    <option value="Name_ASC">Sort: Name (A-Z)</option>
                    <option value="Price_ASC">Sort: Price (L-H)</option>
                    <option value="Price_DESC">Sort: Price (H-L)</option>
                </select>
            </div>

            {/* 🛑 Removed overflow-x-auto and ensured full width */}
            <div> 
                <table className="min-w-full divide-y divide-gray-200 **table-fixed**"> 
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Applied width classes to distribute space and reduce padding */}
                            <th className="px-1 py-2 w-[5%] text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Img</th>
                            <th className="px-2 py-2 w-[25%] text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-2 py-2 w-[12%] text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cat.</th>
                            <th className="px-2 py-2 w-[15%] text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price ({currency})</th>
                            <th className="px-2 py-2 w-[8%] text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-2 py-2 w-[10%] text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th> 
                            <th className="px-2 py-2 w-[10%] text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bestseller</th>
                            <th className="px-2 py-2 w-[15%] text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedProducts.length > 0 ? (
                            filteredAndSortedProducts.map((item) => (
                                <tr key={item.id}>
                                    
                                    {/* Removed whitespace-nowrap from all td's */}
                                    <td className="px-1 py-3 text-sm">
                                        <img 
                                            src={item.image[0]} 
                                            className="w-7 h-7 object-cover rounded" // Slightly smaller image
                                        />
                                    </td>
                                    
                                    <td className="px-2 py-3 text-sm font-medium text-gray-900 overflow-hidden text-ellipsis">{item.name}</td>
                                    
                                    <td className="px-2 py-3 text-sm text-gray-500">
                                        {item.category}
                                    </td>
                                    
                                    <td className="px-2 py-3 text-sm text-gray-500">
                                        <span className={item.onSale ? 'line-through text-red-400 mr-1 text-xs' : 'font-medium text-sm'}>
                                            {currency}{Number(item.price).toFixed(2)}
                                        </span>
                                        {item.onSale && (
                                            <span className="font-semibold text-green-600 text-xs">
                                                {currency}{Number(item.offerPrice).toFixed(2)}
                                            </span>
                                        )}
                                    </td>
                                    
                                    <td className="px-2 py-3 text-sm font-medium text-gray-900">{item.stock}</td>
                                    
                                    <td className="px-2 py-3 text-center text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.onSale ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {item.onSale ? 'SALE' : 'No'}
                                        </span>
                                    </td>
                                    
                                    <td className="px-2 py-3 text-center text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.bestseller ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {item.bestseller ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    
                                    <td className="px-2 py-3 text-center text-sm font-medium flex justify-center space-x-1">
                                        <button 
                                            onClick={() => navigate(`/admin/edit-product/${item.id}`)}
                                            className='text-blue-600 hover:text-blue-900 transition duration-150 text-xs'
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id, item.name)}
                                            className='text-red-600 hover:text-red-900 transition duration-150 text-xs'
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="px-3 py-3 text-center text-sm text-gray-500">
                                    No products found matching the current criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListProducts;