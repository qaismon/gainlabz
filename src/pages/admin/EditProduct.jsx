import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';

function EditProduct() {
    const { products, updateProduct } = useContext(ShopContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const initialData = {
        name: '', price: '', stock: '', description: '', category: '', subCategory: '', image: [], flavor: '', bestseller: false
    };
    const [data, setData] = useState(initialData);
    const [newImageFile, setNewImageFile] = useState(null); 

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    useEffect(() => {
        const productToEdit = products.find(p => String(p.id) === String(id));

        if (productToEdit) {
            setData({
                ...productToEdit,
                price: productToEdit.price.toString(),
                stock: productToEdit.stock ? productToEdit.stock.toString() : '0', 
                image: Array.isArray(productToEdit.image) ? productToEdit.image : [], 
                flavor: Array.isArray(productToEdit.flavor) ? productToEdit.flavor.join(', ') : '',
            });
        } else if (products.length > 0) {
            toast.error("Product not found.");
            navigate('/admin/list-products');
        }
    }, [id, products, navigate]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = name === 'bestseller' ? event.target.checked : event.target.value;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleNewImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setNewImageFile(event.target.files[0]);
        } else {
            setNewImageFile(null);
        }
    };
    
    const handleDeleteImage = (indexToDelete) => {
        setData(prevData => ({
            ...prevData,
            image: prevData.image.filter((_, index) => index !== indexToDelete)
        }));
        toast.info("Image will be removed upon saving.");
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        let finalImageArray = [...data.image]; 

        try {
            // 1. Convert NEW Image File to Base64 and append it
            if (newImageFile) {
                const base64Image = await fileToBase64(newImageFile);
                finalImageArray.push(base64Image);
            }

            // 2. Prepare remaining data
            const flavorArray = data.flavor.split(',').map(f => f.trim()).filter(f => f.length > 0);
            
            const productToSend = {
                ...data,
                price: parseFloat(data.price),
                stock: parseInt(data.stock, 10) || 0, 
                flavor: flavorArray,
                image: finalImageArray 
            };

            // 3. Send update to context/server
            const result = await updateProduct(id, productToSend);
            
            if (result) {
                toast.success(`Product "${productToSend.name}" updated!`);
                navigate('/admin/list-products');
            } else {
                toast.error("Failed to update product. Check server connection.");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An unexpected error occurred during update.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto my-10'>
            <h2 className='text-2xl font-bold mb-6'>Edit Product: {data.name}</h2>
            
            <form onSubmit={onSubmitHandler} className='space-y-4'>
                
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Product Name' required className='w-full p-3 border rounded-md' />
                    <input name='price' onChange={onChangeHandler} value={data.price} type="number" step="0.01" placeholder='Price ($)' required className='w-full p-3 border rounded-md' />
                    <input 
                        name='stock' 
                        onChange={onChangeHandler} 
                        value={data.stock} 
                        type="number" 
                        min="0"
                        placeholder='Stock Quantity' 
                        required 
                        className='w-full p-3 border rounded-md bg-yellow-50 border-yellow-300' 
                    />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <select name="category" onChange={onChangeHandler} value={data.category} className='w-full p-3 border rounded-md'>
                        <option value="Protein">Protein</option>
                        <option value="Pre-workout">Pre-workout</option>
                        <option value="Creatine">Creatine</option>
                        <option value="Vitamins">Vitamins</option>
                    </select>
                    <select name="subCategory" onChange={onChangeHandler} value={data.subCategory} className='w-full p-3 border rounded-md'>
                        <option value="">Select Subcategory (Optional)</option>
                        <option value="Whey">Whey</option>
                        <option value="Stim">Stim</option>
                        <option value="Non-stim">Non-stim</option>
                    </select>
                </div>

                <textarea name='description' onChange={onChangeHandler} value={data.description} rows="3" placeholder='Product Description' required className='w-full p-3 border rounded-md'></textarea>
                
                <div className='p-4 border rounded-md bg-gray-50'>
                    <h3 className='text-lg font-semibold mb-3'>Image Management</h3>
                    
                    <p className='text-sm text-gray-600 mb-2'>Existing Images ({data.image.length}): Click 'X' to remove. <span className='font-bold text-red-500'>NOTE: Images must be Base64 for persistent saving.</span></p>
                    <div className='flex flex-wrap gap-4 mb-4'>
                        {data.image.map((imgSrc, index) => (
                            <div key={index} className='relative w-24 h-24 border rounded-md overflow-hidden group'>
                                <img 
                                    src={imgSrc} 
                                    alt={`Product ${index + 1}`} 
                                    className='w-full h-full object-cover'
                                />
                                <button
                                    type='button'
                                    onClick={() => handleDeleteImage(index)}
                                    className='absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity'
                                    aria-label="Delete image"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>

                    <hr className='my-3'/>

                    <label htmlFor="newProductImage" className='block text-gray-700 font-medium mb-1'>Upload New Image</label>
                    <input 
                        id="newProductImage"
                        type="file" 
                        accept=".jpg, .jpeg, .png"
                        onChange={handleNewImageChange}
                        className='w-full' 
                    />
                    {newImageFile && (
                        <div className='mt-3'>
                            <p className='text-sm text-gray-600'>New Image Preview (Will be saved as Base64):</p>
                            <img 
                                src={URL.createObjectURL(newImageFile)} 
                                alt="New Product Preview" 
                                className='w-24 h-24 object-cover rounded-md border mt-2'
                            />
                        </div>
                    )}
                </div>


                <input name='flavor' onChange={onChangeHandler} value={data.flavor} type="text" placeholder='Flavors (comma separated)' className='w-full p-3 border rounded-md' />
                
                <div className='flex items-center gap-3 p-3 border rounded-md'>
                    <input 
                        type="checkbox" 
                        name="bestseller" 
                        id="bestseller" 
                        checked={data.bestseller} 
                        onChange={onChangeHandler}
                        className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                    <label htmlFor="bestseller" className='text-gray-700'>Mark as Bestseller</label>
                </div>

                <button 
                    type='submit' 
                    disabled={loading}
                    className={`w-full bg-blue-600 text-white font-semibold p-3 rounded-md transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                >
                    {loading ? 'Updating Product...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}

export default EditProduct;