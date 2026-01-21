import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import QuickView from './QuickView' // Import our new component

function RelatedProducts({ category, subCategory }) {
    const { products, currency } = useContext(ShopContext)
    const [related, setRelated] = useState([])
    
    // Simple state to track which product is being viewed
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item) => category === item.category)
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory)
            setRelated(productsCopy.slice(0, 5))
        }
    }, [products, category, subCategory])

    return (
        <div className='my-24'>
            <div className='text-center text-3xl py-2'>
                <Title text1={"Related"} text2={"Products"} />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {related.map((item, index) => (
                    <ProductItem 
                        key={index} 
                        id={item._id} 
                        name={item.name} 
                        price={item.price} 
                        offerPrice={item.offerPrice}
                        onSale={item.onSale}
                        image={item.image}
                        currency={currency}
                        product={item} 
                        openQuickView={(p) => setQuickViewProduct(p)} 
                    />
                ))}
            </div>

            {/* Use the new QuickView component */}
            <QuickView 
                product={quickViewProduct} 
                isOpen={!!quickViewProduct} 
                onClose={() => setQuickViewProduct(null)} 
                currency={currency}
            />
        </div>
    )
}

export default RelatedProducts