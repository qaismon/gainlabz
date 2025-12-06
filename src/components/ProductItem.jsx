import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router'

function ProductItem({id,image,name, price}) {
   const {currency}= useContext(ShopContext)
  return (
    <Link className='rounded-md text-gray-700 cursor-pointer' to={`/product/${id}`}>
        <div className='overflow-hidden rounded-2xl'>
            <img className='hover:scale-110 transition ease-in-out ' src={image[0]}/>
        </div>
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem