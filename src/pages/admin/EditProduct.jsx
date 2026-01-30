import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import API_BASE_URL from "../../services/api"; // Added for dynamic domain

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

    /* ---------------- DATA NORMALIZATION (FLATTENING) ---------------- */
    useEffect(() => {
        const productToEdit = products.find(p => String(p._id) === String(id));

        if (productToEdit) {
            // Flatten arrays immediately when loading into state
            const flatImages = Array.isArray(productToEdit.image) ? productToEdit.image.flat() : [];
            const flatFlavors = Array.isArray(productToEdit.flavor) ? productToEdit.flavor.flat() : [];

            setData({
                ...productToEdit,
                price: productToEdit.price.toString(),
                stock: productToEdit.stock ? productToEdit.stock.toString() : '0', 
                image: flatImages, 
                flavor: flatFlavors.join(', '),
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

            // Clean flavors before sending
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
                toast.success("Product updated successfully!");
                setNewImageFile(null); // Clear pending image
                navigate('/admin/list-products'); 
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    // Helper for rendering image previews
    const getPreviewUrl = (src) => {
        if (!src) return "/placeholder.png";
        if (src.startsWith('data:') || src.startsWith('http')) return src;
        const BASE_DOMAIN = API_BASE_URL.replace("/api", "");
        return `${BASE_DOMAIN}${src.startsWith("/") ? src : "/" + src}`;
    };

    return (
        <div className='p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto my-10 border border-gray-100'>
            <h2 className='text-2xl font-bold mb-6 text-gray-800'>Edit Product: <span className="text-blue-600">{data.name}</span></h2>
            
            <form onSubmit={onSubmitHandler} className='space-y-4 text-left'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                        <label className='text-xs font-bold text-gray-500 uppercase'>Product Name</label>
                        <input name='name' onChange={onChangeHandler} value={data.name} type="text" required className='w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500' />
                    </div>
                    <div>
                        <label className='text-xs font-bold text-gray-500 uppercase'>Price</label>
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
                        {/* EXISTING IMAGES */}
                        {data.image.map((imgSrc, index) => (
                            <div key={index} className='relative w-20 h-20 border rounded-md overflow-hidden shadow-sm group'>
                                <img 
                                    src={getPreviewUrl(imgSrc)} 
                                    alt="Product" 
                                    className='w-full h-full object-cover' 
                                    onError={(e) => { e.target.src = "/placeholder.png"; }}
                                />
                                <button type='button' onClick={() => handleDeleteImage(index)} className='absolute top-0 right-0 bg-red-600 text-white w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>×</button>
                            </div>
                        ))}

                        {/* PENDING NEW IMAGE PREVIEW */}
                        {newImageFile && (
                            <div className='relative w-20 h-20 border rounded-md overflow-hidden shadow-sm border-blue-500'>
                                <img 
                                    src={URL.createObjectURL(newImageFile)} 
                                    alt="New Preview" 
                                    className='w-full h-full object-cover' 
                                />
                                <div className="absolute bottom-0 bg-blue-600 text-[8px] text-white w-full text-center py-0.5 uppercase font-bold">New</div>
                                <button type='button' onClick={() => setNewImageFile(null)} className='absolute top-0 right-0 bg-gray-800 text-white w-5 h-5 flex items-center justify-center text-xs'>×</button>
                            </div>
                        )}

                        <label className='w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 text-gray-400'>
                            <span className='text-xl'>+</span>
                            <input type="file" accept="image/*" onChange={handleNewImageChange} className='hidden' />
                        </label>
                    </div>
                </div>

                <div>
                    <label className='text-xs font-bold text-gray-500 uppercase'>Flavors (Comma Separated)</label>
                    <input name='flavor' onChange={onChangeHandler} value={data.flavor} type="text" placeholder='e.g. Chocolate, Vanilla, Strawberry' className='w-full p-3 border rounded-md' />
                </div>
                
                <div className='flex items-center gap-3 py-2'>
                    <input type="checkbox" name="bestseller" id="bestseller" checked={data.bestseller} onChange={onChangeHandler} className='w-4 h-4 rounded text-blue-600 focus:ring-blue-500' />
                    <label htmlFor="bestseller" className='text-gray-700 font-medium cursor-pointer'>Mark as Bestseller</label>
                </div>

                <button type='submit' disabled={loading} className={`w-full bg-gray-900 text-white font-bold p-4 rounded-md uppercase tracking-wider transition ${loading ? 'opacity-50' : 'hover:bg-blue-700 shadow-md active:scale-95'}`}>
                    {loading ? 'Processing...' : 'Update Product'}
                </button>
            </form>
        </div>
    );
}

export default EditProduct;