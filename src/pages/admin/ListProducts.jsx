import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ListProducts() {
    const { products, deleteProduct, currency } = useContext(ShopContext);
    const navigate = useNavigate();
    
    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete the product: "${name}"?`)) {
            const success = await deleteProduct(id);
            if (success) {
            }
        }
    };

    return (
        <div className='p-6 bg-white shadow-lg rounded-lg'>
            <h2 className='text-2xl font-bold mb-6'>All Products List ({products.length})</h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price ({currency})</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bestseller</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.length > 0 ? (
                            products.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img 
                                            src={item.image[0]} 
                                            alt={item.name} 
                                            className="w-12 h-12 object-cover rounded" 
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.category} ({item.subCategory || 'N/A'})
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {currency}{item.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.bestseller ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {item.bestseller ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button 
                                            onClick={() => navigate(`/admin/edit-product/${item.id}`)}
                                            className='text-blue-600 hover:text-blue-900 transition duration-150'
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id, item.name)}
                                            className='text-red-600 hover:text-red-900 transition duration-150'
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No products found. Check your server connection or add a new product.
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