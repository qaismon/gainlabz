import React, { useContext, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiX, FiPlus, FiMinus, FiEye, FiShoppingCart } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import Title from "./Title";

export default function Collection() {
  const { products = [], addToCart, currency } = useContext(ShopContext);
  const navigate = useNavigate();

  const [activeProduct, setActiveProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const latestFive = useMemo(() => {
    const list = [...products];
    list.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    return list.slice(0, 5);
  }, [products]);

  const openQuickView = (product) => {
    setActiveProduct(product);
    setMainImageIndex(0);
    setSelectedFlavor(Array.isArray(product.flavor) ? product.flavor[0] : null);
    setQty(Number(product.stock) > 0 ? 1 : 0);
    document.body.style.overflow = "hidden";
  };

  const closeQuickView = () => {
    setActiveProduct(null);
    document.body.style.overflow = "";
  };

  const confirmQuickviewAdd = () => {
    if (!activeProduct || qty === 0 || !selectedFlavor) return;
    for (let i = 0; i < qty; i++) addToCart(activeProduct.id, selectedFlavor);
    toast.success(`${activeProduct.name} added to cart`);
    closeQuickView();
  };

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4">
      <div className='text-center text-3xl py-8'>
        <Title text1={"Latest"} text2={"Collection"} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 gap-y-6'>
        {latestFive.map(product => (
          <motion.article key={product.id} className="group relative bg-white rounded-xl overflow-hidden ">
            <div className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer" onClick={() => openQuickView(product)}>
              <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white p-3 rounded-full shadow-xl text-gray-900 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <FiEye size={22} />
                </div>
              </div>
            </div>
            <div className="p-3 text-center">
              <h3 
                onClick={() => navigate(`/product/${product.id}`)}
                className="text-xs sm:text-sm font-medium text-gray-800 truncate cursor-pointer hover:underline hover:text-blue-600"
              >
                {product.name}
              </h3>
              <p className="text-sm font-bold text-gray-900 mt-1">{currency}{Number(product.price).toFixed(2)}</p>
            </div>
          </motion.article>
        ))}
      </div>

      <AnimatePresence>
        {activeProduct && <QuickViewModal activeProduct={activeProduct} mainImageIndex={mainImageIndex} setMainImageIndex={setMainImageIndex} closeQuickView={closeQuickView} currency={currency} selectedFlavor={selectedFlavor} setSelectedFlavor={setSelectedFlavor} qty={qty} setQty={setQty} confirmQuickviewAdd={confirmQuickviewAdd} themeColor="bg-black" />}
      </AnimatePresence>
    </div>
  );
}

// SHARED MODAL COMPONENT (Can be moved to a separate file later)
const QuickViewModal = ({ activeProduct, mainImageIndex, setMainImageIndex, closeQuickView, currency, selectedFlavor, setSelectedFlavor, qty, setQty, confirmQuickviewAdd, themeColor }) => {
    const maxStock = Number(activeProduct.stock) || 0;
    return (
        <motion.div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeQuickView}>
            <motion.div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: 'spring', damping: 25 }} onClick={(e) => e.stopPropagation()}>
                <div className="p-4 bg-gray-50">
                    <img src={activeProduct.image[mainImageIndex]} alt="" className="w-full aspect-square object-cover rounded-xl shadow-sm" />
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {activeProduct.image.map((src, i) => (
                            <button key={i} onClick={() => setMainImageIndex(i)} className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 ${mainImageIndex === i ? 'border-blue-500 scale-105' : 'border-transparent opacity-60'}`}>
                                <img src={src} className="w-full h-full object-cover rounded-md" />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{activeProduct.name}</h2>
                            <button onClick={closeQuickView} className="p-2 hover:bg-gray-100 rounded-full"><FiX size={20}/></button>
                        </div>
                        <p className="text-blue-600 font-bold text-xl mt-1">{currency}{Number(activeProduct.price).toFixed(2)}</p>
                        <p className="text-gray-500 text-sm mt-4 leading-relaxed">{activeProduct.description}</p>
                        <div className="mt-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Flavor</p>
                            <div className="flex gap-2 mt-2">
                                {activeProduct.flavor?.map(fl => (
                                    <button key={fl} onClick={() => setSelectedFlavor(fl)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedFlavor === fl ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}>{fl}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex items-center gap-4">
                        <div className="flex items-center bg-gray-100 rounded-xl p-1">
                            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2"><FiMinus /></button>
                            <span className="w-8 text-center font-bold">{qty}</span>
                            <button onClick={() => setQty(q => Math.min(maxStock, q + 1))} className="p-2"><FiPlus /></button>
                        </div>
                        <button onClick={confirmQuickviewAdd} disabled={maxStock === 0} className={`flex-1 ${themeColor} text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 disabled:bg-gray-300`}>
                            <FiShoppingCart /> Add to Cart
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};