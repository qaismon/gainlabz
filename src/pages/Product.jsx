import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'
import { toast } from 'react-toastify'


function Product() {
    const { productId } = useParams()
    const { products = [], currency, addToCart, cartItems } = useContext(ShopContext)

    const [productData, setProductData] = useState(null)
    const [image, setImage] = useState('')
    const [flavor, setFlavor] = useState('')
    const [qty, setQty] = useState(1) 

    const availableStock = productData ? Number(productData.stock) || 0 : 0;
    const currentCartQuantity = productData ? Number(cartItems[productId]?.[flavor]) || 0 : 0;
    const maxAddableQty = Math.max(0, availableStock - currentCartQuantity);
    const isInStock = availableStock > 0;

    useEffect(() => {
        if (!products || products.length === 0) return
        const p = products.find(item => String(item.id) === String(productId))
        if (p) {
            setProductData(p)
            setImage((p.image && p.image[0]) || '')
            setFlavor(Array.isArray(p.flavor) && p.flavor.length > 0 ? p.flavor[0] : '')
            setQty(1)
        } else {
            setProductData(null)
            setImage('')
            setFlavor('')
        }
    }, [products, productId])

    useEffect(() => {
        if (productData) { 
            if (qty > maxAddableQty && maxAddableQty > 0) {
                setQty(maxAddableQty);
            } else if (availableStock === 0) {
                setQty(0);
            } else if (qty === 0 && maxAddableQty > 0) {
                setQty(1);
            }
        }
    }, [maxAddableQty, availableStock, flavor, productData, qty]);


    if (!productData) {
        return <div className='py-10 text-center text-gray-500'>Product not found.</div>
    }

    const handleAddToCart = () => {
        if (!flavor) {
            toast.error("Please select a flavor.");
            return;
        }
        
        if (qty <= 0) {
            toast.error("Please select a valid quantity.");
            return;
        }

        addToCart(productData.id, flavor, qty);
    }


    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='flex gap-12 flex-col md:flex-row'>
                <div className='flex-1 flex gap-4'>
                    <div className='hidden md:flex flex-col gap-3 w-[18%]'>
                        {(productData.image || []).map((src, idx) => (
                            <button
                                key={idx}
                                onClick={() => setImage(src)}
                                className={`overflow-hidden rounded border ${image === src ? 'ring-2 ring-green-400' : ''}`}
                            >
                                <img src={src} alt={`${productData.name}-${idx}`} className='w-full h-20 object-cover' />
                            </button>
                        ))}
                    </div>

                    <div className='flex-1'>
                        <img src={image || '/placeholder.png'} alt={productData.name} className='w-full h-auto rounded' />
                    </div>

                </div>


                <div className='flex-1'>
                    <h1 className='text-2xl font-semibold'>{productData.name}</h1>

                    <div className='flex items-center gap-1 mt-2'>
                        <img src={assets.star_icon} alt="" className="w-4 h-4" />
                        <img src={assets.star_icon} alt="" className="w-4 h-4" />
                        <img src={assets.star_icon} alt="" className="w-4 h-4" />
                        <img src={assets.star_icon} alt="" className="w-4 h-4" />
                        <img src={assets.star_icon} alt="" className="w-4 h-4" />
                    </div>

                    <div className='mt-4 flex items-baseline gap-3'>
                        {(productData.onSale && productData.offerPrice) ? (
                            <>
                                <p className='text-4xl font-extrabold text-red-600'>
                                    {currency}{Number(productData.offerPrice).toFixed(2)}
                                </p>
                                <p className='text-xl font-semibold text-gray-500 line-through'>
                                    {currency}{Number(productData.price).toFixed(2)}
                                </p>
                                <span className="ml-2 text-md font-bold text-green-600">
                                    ({Math.round(((productData.price - productData.offerPrice) / productData.price) * 100)}% OFF)
                                </span>
                            </>
                        ) : (
                            <p className='text-3xl font-bold text-gray-900'>
                                {currency}{Number(productData.price || 0).toFixed(2)}
                            </p>
                        )}
                    </div>

                    <div className='mt-2'>
                        {isInStock ? (
                                <p className='text-green-600 font-semibold'>
                                    In Stock ({availableStock} units total)
                                    {currentCartQuantity > 0 && <span> - {currentCartQuantity} in cart</span>}
                                </p>
                            ) : (
                                <p className='text-red-600 font-semibold'>OUT OF STOCK ❌</p>
                            )}
                    </div>

                    <p className='mt-4 text-gray-600'>{productData.description}</p>

                    {Array.isArray(productData.flavor) && productData.flavor.length > 0 && (
                        <div className='mt-6'>
                            <p className='text-sm font-medium mb-2'>Select flavor</p>
                            <div className='flex gap-2 flex-wrap'>
                                {productData.flavor.map((f, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setFlavor(f)}
                                        disabled={!isInStock} 
                                        className={`px-4 py-2 border rounded ${flavor === f ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700'} ${!isInStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {isInStock && (
                        <>
                            <div className='mt-6 flex items-center gap-4'>
                                <p className='text-sm font-medium'>Quantity to Add</p>

                                <div className='flex items-center border rounded overflow-hidden'>
                                    <button
                                        type='button'
                                        disabled={qty <= 1} 
                                        onClick={() => setQty(q => Math.max(1, q - 1))}
                                        className={`px-3 py-2 ${qty <= 1 ? 'text-gray-400 cursor-not-allowed' : ''}`}
                                        aria-label="Decrease quantity"
                                    >
                                        -
                                    </button>
                                    <div className='px-4 py-2 min-w-[56px] text-center'>{qty}</div>
                                    <button
                                        type='button'
                                        disabled={qty >= maxAddableQty || !isInStock} 
                                        onClick={() => setQty(q => Math.min(maxAddableQty, q + 1))} 
                                        className={`px-3 py-2 ${(qty >= maxAddableQty || !isInStock) ? 'text-gray-400 cursor-not-allowed' : ''}`}
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                                {maxAddableQty < availableStock && maxAddableQty > 0 && (
                                    <span className='text-sm text-gray-500'>({maxAddableQty} remaining to add)</span>
                                )}
                            </div>

                            <div className='mt-6 flex items-center gap-4'>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={qty <= 0 || !flavor}
                                    className={`px-6 py-3 rounded-md transition ${qty <= 0 || !flavor ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
                                >
                                    ADD {qty} TO CART
                                </button>
                            </div>
                        </>
                    )} 
                    {!isInStock && (
                        <div className='mt-6'>
                            <div className='bg-red-500 text-white px-6 py-3 rounded-md font-semibold text-center'>
                                ❌ CURRENTLY UNAVAILABLE
                            </div>
                        </div>
                    )}

                    <div className='mt-6 text-sm text-gray-500'>
                        <p>100% Original Product.</p>
                        <p>Cash on Delivery.</p>
                        <p>Easy return and exchange policy within 7 days.</p>
                    </div>
                </div>
            </div>

            <div className='mt-12'>
                <div className='flex items-center gap-3'>
                    <b className='px-4 py-2 border border-gray-300 text-sm'>Description</b>
                </div>

                <div className='mt-4 p-6 border rounded text-sm text-gray-600'>
                    <p>{productData.longDescription || productData.description}</p>
                </div>
            </div>

            <div className='mt-10'>
                <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
            </div>

            <div className='fixed bottom-0 left-0 right-0 z-50 md:hidden'>
                <div className='bg-white border-t p-3 flex items-center justify-between'>
                    <div>
                        <div className='text-sm text-gray-500'>Price</div>
                        {(productData.onSale && productData.offerPrice) ? (
                            <div className='flex items-baseline gap-2'>
                                <span className='font-bold text-lg text-red-600'>
                                    {currency}{Number(productData.offerPrice).toFixed(2)}
                                </span>
                                <span className='text-xs text-gray-500 line-through'>
                                    {currency}{Number(productData.price).toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <div className='font-bold text-lg text-gray-900'>
                                {currency}{(Number(productData.price || 0)).toFixed(2)}
                            </div>
                        )}
                    </div>
                    
                    {isInStock && maxAddableQty > 0 ? (
                        <div className='flex items-center gap-3'>
                            <div className='flex items-center border rounded overflow-hidden'>
                                <button 
                                    onClick={() => setQty(q => Math.max(1, q - 1))} 
                                    disabled={qty <= 1}
                                    className={`px-3 py-2 ${qty <= 1 ? 'text-gray-400 cursor-not-allowed' : ''}`}>
                                    -
                                </button>
                                <div className='px-4'>{qty}</div>
                                <button 
                                    onClick={() => setQty(q => Math.min(maxAddableQty, q + 1))} 
                                    disabled={qty >= maxAddableQty} 
                                    className={`px-3 py-2 ${qty >= maxAddableQty ? 'text-gray-400 cursor-not-allowed' : ''}`}>
                                    +
                                </button>
                            </div>
                            <button 
                                onClick={handleAddToCart} 
                                disabled={qty <= 0 || !flavor}
                                className={`px-4 py-2 rounded ${qty <= 0 || !flavor ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white'}`}>
                                Add
                            </button>
                        </div>
                    ) : (
                        <div className='bg-red-500 text-white px-4 py-2 rounded font-semibold'>
                            OUT OF STOCK
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Product;