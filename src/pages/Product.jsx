import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'
import { toast } from 'react-toastify'


function Product() {
  const { productId } = useParams()
  const { products = [], currency, addToCart } = useContext(ShopContext)

  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState('')
  const [flavor, setFlavor] = useState('')
  const [qty, setQty] = useState(1)

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

  if (!productData) {
    return <div className='py-10 text-center text-gray-500'>Product not found.</div>
  }

  const handleAddToCart = () => {
    if (!flavor) {
      toast.error("Please select a flavor.");
      return;
    }

    const success = addToCart(productData.id, flavor, qty);
    if (success) {
      toast.success(`${productData.name} (${flavor}) x${qty} added to cart`);
    } else {
      toast.error("Could not add item to cart.");
    }
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

          <p className='text-3xl font-bold mt-4'>{currency}{Number(productData.price || 0).toFixed(2)}</p>

          <p className='mt-4 text-gray-600'>{productData.description}</p>

          {Array.isArray(productData.flavor) && productData.flavor.length > 0 && (
            <div className='mt-6'>
              <p className='text-sm font-medium mb-2'>Select flavor</p>
              <div className='flex gap-2 flex-wrap'>
                {productData.flavor.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setFlavor(f)}
                    className={`px-4 py-2 border rounded ${flavor === f ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className='mt-6 flex items-center gap-4'>
            <p className='text-sm font-medium'>Quantity</p>

            <div className='flex items-center border rounded overflow-hidden'>
              <button
                type='button'
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className='px-3 py-2'
                aria-label="Decrease quantity"
              >
                -
              </button>
              <div className='px-4 py-2 min-w-[56px] text-center'>{qty}</div>
              <button
                type='button'
                onClick={() => setQty(q => q + 1)}
                className='px-3 py-2'
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className='mt-6 flex items-center gap-4'>
            <button
              onClick={handleAddToCart}
              className='bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition'
            >
              ADD TO CART
            </button>

          </div>

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
            <div className='text-sm text-gray-500'>Total</div>
            <div className='font-bold'>{currency}{(Number(productData.price || 0) * qty).toFixed(2)}</div>
            </div>
          <div className='flex items-center gap-3'>
            <div className='flex items-center border rounded overflow-hidden'>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} className='px-3 py-2'>-</button>
              <div className='px-4'>{qty}</div>
              <button onClick={()=>setQty(q=>q+1)} className='px-3 py-2'>+</button>
            </div>

            <button onClick={handleAddToCart} className='bg-black text-white px-4 py-2 rounded'>Add</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product