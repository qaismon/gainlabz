import React, { useState, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
    const { addProduct } = useContext(ShopContext);
    const navigate = useNavigate();

    const initialData = {
        name: '', 
        price: '', 
        description: '', 
        category: 'Protein', 
        subCategory: '', 
        image: '', 
        flavor: '', 
        bestseller: false
    };
    
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null); 

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = name === 'bestseller' ? event.target.checked : event.target.value;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImageFile(event.target.files[0]);
        } else {
            setImageFile(null);
        }
    };
    
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!imageFile) {
            toast.error("Please select a product image.");
            setLoading(false);
            return;
        }

        try {
            
            const base64Image = await fileToBase64(imageFile);

            
            const flavorArray = data.flavor.split(',').map(f => f.trim()).filter(f => f.length > 0);
            
            const productToSend = {
                ...data,
                
                price: parseFloat(data.price), 
                flavor: flavorArray,
                
                image: [base64Image] 
            };
            
            
            const result = await addProduct(productToSend);
            
            if (result) {
                toast.success(`Product "${productToSend.name}" added!`);
                setData(initialData); 
                setImageFile(null); 
                
                document.getElementById('productImage').value = '';
                navigate('/admin/list-products');
            }
        } catch (error) {
            console.error("Image processing or add product error:", error);
            toast.error("Failed to process image or add product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-6 bg-white shadow-lg rounded-lg'>
            <h2 className='text-2xl font-bold mb-6'>Add New Product</h2>
            
            <form onSubmit={onSubmitHandler} className='space-y-4'>
                
                
                <div className='grid grid-cols-2 gap-4'>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Product Name' required className='w-full p-3 border rounded-md' />
                    <input name='price' onChange={onChangeHandler} value={data.price} type="number" step="0.01" placeholder='Price ($)' required className='w-full p-3 border rounded-md' />
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
                        <option value="Stim">Stimulant</option>
                        <option value="Non-stim">Non-Stimulant</option>
                    </select>
                </div>

                
                <textarea name='description' onChange={onChangeHandler} value={data.description} rows="3" placeholder='Product Description' required className='w-full p-3 border rounded-md'></textarea>

                
                <div className='border p-3 rounded-md'>
                    <label htmlFor="productImage" className='block text-gray-700 font-medium mb-1'>Product Image (JPG/PNG)</label>
                    <input 
                        id="productImage"
                        type="file" 
                        accept=".jpg, .jpeg, .png"
                        onChange={handleImageChange}
                        required
                        className='w-full' 
                    />
                    
                    {imageFile && (
                        <div className='mt-3'>
                            <img 
                                src={URL.createObjectURL(imageFile)} 
                                alt="Product Preview" 
                                className='w-32 h-32 object-cover rounded-md border'
                            />
                        </div>
                    )}
                </div>

                
                <input name='flavor' onChange={onChangeHandler} value={data.flavor} type="text" placeholder='Flavors (e.g., Vanilla, Chocolate - comma separated)' className='w-full p-3 border rounded-md' />
                
                
                <div className='flex items-center gap-3 p-3 border rounded-md'>
                    <input 
                        type="checkbox" 
                        name="bestseller" 
                        id="bestseller" 
                        checked={data.bestseller} 
                        onChange={onChangeHandler}
                        className='w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500'
                    />
                    <label htmlFor="bestseller" className='text-gray-700 font-medium'>Mark as Bestseller</label>
                </div>

                <button 
                    type='submit' 
                    disabled={loading}
                    className={`w-full bg-green-500 text-white font-semibold p-3 rounded-md transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                >
                    {loading ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
}

export default AddProduct;