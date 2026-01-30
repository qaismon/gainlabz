import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';

function EditProduct() {
    const { products, updateProduct, isAdmin } = useContext(ShopContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [data, setData] = useState({
        name: '', price: '', stock: '', description: '', category: 'Protein', subCategory: '', image: [], flavor: '', bestseller: false
    });
    const [newImageFile, setNewImageFile] = useState(null); 

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    useEffect(() => {
        const productToEdit = products.find(p => String(p._id) === String(id));

        if (productToEdit) {
            setData({
                ...productToEdit,
                price: productToEdit.price.toString(),
                stock: productToEdit.stock ? productToEdit.stock.toString() : '0', 
                image: Array.isArray(productToEdit.image) ? productToEdit.image : [], 
                flavor: Array.isArray(productToEdit.flavor) ? productToEdit.flavor.join(', ') : '',
            });
        }
    }, [id, products]);

    const onChangeHandler = (event) => {
        const { name, value, type, checked } = event.target;
        setData(prevData => ({ 
            ...prevData, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleNewImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setNewImageFile(event.target.files[0]);
        }
    };
    
    const handleDeleteImage = (indexToDelete) => {
        setData(prevData => ({
            ...prevData,
            image: prevData.image.filter((_, index) => index !== indexToDelete)
        }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            let finalImageArray = [...data.image]; 

            if (newImageFile) {
                const base64Image = await fileToBase64(newImageFile);
                finalImageArray.push(base64Image);
            }

            const flavorArray = typeof data.flavor === 'string' 
                ? data.flavor.split(',').map(f => f.trim()).filter(f => f.length > 0)
                : data.flavor;
            
            const productToSend = {
                ...data,
                price: Number(data.price),
                stock: Number(data.stock), 
                flavor: flavorArray,
                image: finalImageArray 
            };

            const success = await updateProduct(id, productToSend);
            
            if (success) {
                navigate('/admin/list-products'); 
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto my-10'>
            <h2 className='text-2xl font-bold mb-6 text-gray-800'>Edit Product: {data.name}</h2>
            
            <form onSubmit={onSubmitHandler} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                        <label className='text-xs font-bold text-gray-500 uppercase'>Product Name</label>
                        <input name='name' onChange={onChangeHandler} value={data.name} type="text" required className='w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500' />
                    </div>
                    <div>
                        <label className='text-xs font-bold text-gray-500 uppercase'>Price ({products[0]?.currency || '$'})</label>
                        <input name='price' onChange={onChangeHandler} value={data.price} type="number" step="0.01" required className='w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500' />
                    </div>
                    <div>
                        <label className='text-xs font-bold text-gray-500 uppercase'>Stock Count</label>
                        <input name='stock' onChange={onChangeHandler} value={data.stock} type="number" required className='w-full p-3 border rounded-md bg-yellow-50 focus:ring-2 focus:ring-yellow-400' />
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <select name="category" onChange={onChangeHandler} value={data.category} className='w-full p-3 border rounded-md'>
                        <option value="Protein">Protein</option>
                        <option value="Pre-workout">Pre-workout</option>
                        <option value="Creatine">Creatine</option>
                        <option value="Vitamins">Vitamins</option>
                    </select>
                    <select name="subCategory" onChange={onChangeHandler} value={data.subCategory} className='w-full p-3 border rounded-md'>
                        <option value="">No Subcategory</option>
                        <option value="Whey">Whey</option>
                        <option value="Stim">Stim</option>
                        <option value="Non-stim">Non-stim</option>
                    </select>
                </div>

                <textarea name='description' onChange={onChangeHandler} value={data.description} rows="3" placeholder='Product Description' required className='w-full p-3 border rounded-md'></textarea>
                
                <div className='p-4 border rounded-md bg-gray-50'>
                    <h3 className='text-sm font-bold text-gray-700 mb-3 uppercase'>Gallery Management</h3>
                    <div className='flex flex-wrap gap-4 mb-4'>
                        {data.image.map((imgSrc, index) => (
                            <div key={index} className='relative w-20 h-20 border rounded-md overflow-hidden shadow-sm group'>
<img 
  src={imgSrc.startsWith('data:') ? imgSrc : `https://backend-node-mongo.onrender.com/${imgSrc}`} 
  alt="Product" 
  className='w-full h-full object-cover' 
  onError={(e) => { e.target.src = "fallback-image-url.png"; }} // Add a fallback
/>                               <button type='button' onClick={() => handleDeleteImage(index)} className='absolute top-0 right-0 bg-red-600 text-white w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>×</button>
                            </div>
                        ))}
                        <label className='w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 text-gray-400'>
                            <span className='text-xl'>+</span>
                            <input type="file" accept="image/*" onChange={handleNewImageChange} className='hidden' />
                        </label>
                    </div>
                   {/* Inside your Gallery Management map */}
{newImageFile && (
    <div className='relative w-20 h-20 border rounded-md overflow-hidden shadow-sm border-blue-500'>
        <img 
            src={URL.createObjectURL(newImageFile)} 
            alt="New Preview" 
            className='w-full h-full object-cover' 
        />
        <p className="absolute bottom-0 bg-blue-600 text-[8px] text-white w-full text-center">New</p>
    </div>
)}
                </div>

                <input name='flavor' onChange={onChangeHandler} value={data.flavor} type="text" placeholder='Flavors (e.g. Chocolate, Vanilla)' className='w-full p-3 border rounded-md' />
                
                <div className='flex items-center gap-3'>
                    <input type="checkbox" name="bestseller" id="bestseller" checked={data.bestseller} onChange={onChangeHandler} className='w-4 h-4' />
                    <label htmlFor="bestseller" className='text-gray-700 font-medium'>Mark as Bestseller</label>
                </div>

                <button type='submit' disabled={loading} className={`w-full bg-blue-600 text-white font-bold p-4 rounded-md uppercase tracking-wider transition ${loading ? 'opacity-50' : 'hover:bg-blue-700 shadow-md'}`}>
                    {loading ? 'Processing...' : 'Update Product'}
                </button>
            </form>
        </div>
    );
}

export default EditProduct;