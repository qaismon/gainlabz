// src/pages/Collection.jsx
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'
import { FiX, FiMinus, FiPlus } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

// Grid animation variants
const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06
    }
  }
}

const gridItem = {
  hidden: { opacity: 0, y: 18, scale: 0.995 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.36, ease: [0.2, 0.9, 0.2, 1] }
  },
  exit: { opacity: 0, y: 12, transition: { duration: 0.22 } }
}

function Collection() {
  const { products = [], search, showSearch, addToCart, currency } =
    useContext(ShopContext)

  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')

  // Quick view
  const [activeProduct, setActiveProduct] = useState(null)
  const [selectedFlavor, setSelectedFlavor] = useState(null)
  const [qty, setQty] = useState(1)

  function toggleCategory(e) {
    const v = e.target.value
    setCategory(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    )
  }

  function toggleSubCategory(e) {
    const v = e.target.value
    setSubCategory(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    )
  }

  function applyFilter() {
    let list = [...products]

    if (category.length > 0) {
      list = list.filter(item => category.includes(item.category))
    }
    if (subCategory.length > 0) {
      list = list.filter(item => subCategory.includes(item.subCategory))
    }
    if (showSearch && search) {
      list = list.filter(item =>
        (item.name || '')
          .toLowerCase()
          .includes((search || '').toLowerCase())
      )
    }

    setFilterProducts(list)
  }

  function sortProduct() {
    let sorted = [...filterProducts]

    if (sortType === 'Low-High') {
      sorted.sort((a, b) => Number(a.price) - Number(b.price))
    } else if (sortType === 'High-Low') {
      sorted.sort((a, b) => Number(b.price) - Number(a.price))
    } else {
      applyFilter()
      return
    }

    setFilterProducts(sorted)
  }

  useEffect(applyFilter, [category, subCategory, search, showSearch, products])
  useEffect(sortProduct, [sortType])

  const openQuickView = product => {
    setActiveProduct(product)
    setSelectedFlavor(product.flavor?.[0] || null)
    setQty(1)
    document.body.style.overflow = 'hidden'
  }

  const closeQuickView = () => {
    setActiveProduct(null)
    setSelectedFlavor(null)
    setQty(1)
    document.body.style.overflow = ''
  }

  useEffect(() => {
    const escape = e => e.key === 'Escape' && closeQuickView()
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [])

  const handleQuickAdd = () => {
    if (!activeProduct) return
    const flavor =
      selectedFlavor ||
      (Array.isArray(activeProduct.flavor)
        ? activeProduct.flavor[0]
        : 'Default')

    for (let i = 0; i < qty; i++) {
      addToCart(activeProduct.id, flavor)
    }

    toast.success(`${activeProduct.name} (${flavor}) x${qty} added to cart`)
    closeQuickView()
  }

  const gridKey = `${filterProducts.length}-${sortType}-${category.join(
    '|'
  )}-${subCategory.join('|')}`

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10'>

      {/* ---------------- FILTERS (NOW GLASSMORPHISM) ---------------- */}
      <div className='min-w-60'>

        <p
          onClick={() => setShowFilter(!showFilter)}
          className='my-2 text-xl flex items-center cursor-pointer gap-2 text-white'
        >
          Filters
          <img
            className={`h-3 mt-2 sm:hidden ${
              showFilter ? 'rotate-180' : ''
            }`}
            src={assets.dropdown2_icon}
            alt=''
          />
        </p>

      {/* CATEGORIES */}
<div
  className={`
    pl-5 py-4 mt-6 rounded-2xl shadow-lg
    backdrop-blur-xl bg-white/30 border border-gray-200
    transition-all hover:bg-white/40
    ${showFilter ? '' : 'hidden'} sm:block
  `}
>
  <p className='mb-3 text-sm font-medium text-gray-700'>Categories</p>

  <div className='flex flex-col gap-3 text-sm font-light text-gray-700'>
    {['Protein', 'Pre-workout', 'Creatine', 'Vitamins'].map(c => (
      <label key={c} className='flex gap-2 items-center cursor-pointer'>
        <input
          type='checkbox'
          className='w-4 h-4 accent-green-500'
          value={c}
          onChange={toggleCategory}
        />
        <span className='select-none'>{c}</span>
      </label>
    ))}
  </div>
</div>

{/* SUB CATEGORY */}
<div
  className={`
    pl-5 py-4 my-5 rounded-2xl shadow-lg
    backdrop-blur-xl bg-white/30 border border-gray-200
    transition-all hover:bg-white/40
    ${showFilter ? '' : 'hidden'} sm:block
  `}
>
  <p className='mb-3 text-sm font-medium text-gray-700'>Sub Category</p>

  <div className='flex flex-col gap-3 text-sm font-light text-gray-700'>
    {['Whey', 'Casein', 'Stim', 'Non-stim'].map(s => (
      <label key={s} className='flex gap-2 items-center cursor-pointer'>
        <input
          type='checkbox'
          className='w-4 h-4 accent-green-500'
          value={s}
          onChange={toggleSubCategory}
        />
        <span className='select-none'>{s}</span>
      </label>
    ))}
  </div>
</div>

      </div>

      {/* ---------------- PRODUCTS SECTION ---------------- */}
      <div className='flex-1'>
        <div className='flex justify-between items-center mb-4'>
          <Title text1={'All'} text2={'Collections'} />

          <select
            onChange={e => setSortType(e.target.value)}
            value={sortType}
            className='border-2 border-gray-100 text-sm px-2 rounded-md'
          >
            <option value='relevant'>Sort by: Relevance</option>
            <option value='Low-High'>Sort by: Low to High</option>
            <option value='High-Low'>Sort by: High to Low</option>
          </select>
        </div>

        {/* ---------- ANIMATED GRID ---------- */}
        <motion.div
          key={gridKey}
          variants={gridContainer}
          initial='hidden'
          animate='show'
          className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'
        >
          {filterProducts.map((item, index) => (
            <motion.div
              key={item.id}
              variants={gridItem}
              layout
              whileHover={{ y: -6, scale: 1.02 }}
              className='relative'
            >
              <ProductItem
                name={item.name}
                id={item.id}
                price={item.price}
                image={item.image}
              />

              <button
                onClick={() => openQuickView(item)}
                className='absolute right-2 bottom-2 bg-gray-100/80 backdrop-blur-md px-2 py-1 rounded text-xs cursor-pointer shadow'
              >
                Quick view
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ---------------- QUICK VIEW MODAL ---------------- */}
      {activeProduct && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'
          onClick={closeQuickView}
        >
          <div
            className='bg-white rounded-lg max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden'
            onClick={e => e.stopPropagation()}
          >
            {/* LEFT IMAGES */}
            <div className='p-4 flex flex-col gap-3'>
              <div className='flex-1'>
                <img
                  src={activeProduct.image[0]}
                  alt=''
                  className='w-full h-80 object-cover rounded-md'
                />
              </div>

              <div className='flex gap-2'>
                {activeProduct.image.slice(0, 4).map((src, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const imgs = [...activeProduct.image]
                      const t = imgs[0]
                      imgs[0] = imgs[i]
                      imgs[i] = t
                      setActiveProduct({ ...activeProduct, image: imgs })
                    }}
                    className='w-16 h-12 rounded overflow-hidden border'
                  >
                    <img
                      src={src}
                      className='w-full h-full object-cover'
                      alt=''
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className='p-6 flex flex-col'>
              <div className='flex items-start justify-between'>
                <div>
                  <h2 className='text-2xl font-bold'>
                    {activeProduct.name}
                  </h2>
                  <p className='text-sm text-gray-500 mt-1'>
                    {activeProduct.category}
                  </p>
                </div>
                <button
                  onClick={closeQuickView}
                  className='text-gray-500 hover:text-gray-800'
                >
                  <FiX size={22} />
                </button>
              </div>

              <p className='mt-4 text-gray-700'>
                {activeProduct.description}
              </p>

              <div className='mt-4'>
                <div className='text-xl font-bold text-green-600'>
                  {currency}
                  {Number(activeProduct.price).toFixed(2)}
                </div>
              </div>

              {/* FLAVORS */}
              <div className='mt-4'>
                <p className='text-sm font-medium mb-2'>Choose flavor</p>
                <div className='flex gap-2 flex-wrap'>
                  {activeProduct.flavor?.map(fl => (
                    <button
                      key={fl}
                      onClick={() => setSelectedFlavor(fl)}
                      className={`px-3 py-1 rounded-full border ${
                        selectedFlavor === fl
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-gray-700'
                      }`}
                    >
                      {fl}
                    </button>
                  ))}
                </div>
              </div>

              {/* QTY + ADD */}
              <div className='mt-6 flex items-center gap-3'>
                <div className='flex items-center border rounded-md overflow-hidden'>
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className='px-3 py-2'
                  >
                    <FiMinus />
                  </button>
                  <div className='px-4 py-2 min-w-[44px] text-center'>
                    {qty}
                  </div>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className='px-3 py-2'
                  >
                    <FiPlus />
                  </button>
                </div>

                <button
                  onClick={handleQuickAdd}
                  className='bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md'
                >
                  Add {qty} to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Collection
