import React, { useContext, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiPlus, FiMinus } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import Title from "./Title";

export default function Collection() {
  const { products = [], addToCart, currency } = useContext(ShopContext);

  const [activeProduct, setActiveProduct] = useState(null); 
  const [qty, setQty] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(null); 

  const latestFive = useMemo(() => {
    const list = (products || []).slice();
    list.sort((a, b) => {
      const ad = a.date || a.createdAt || a.id;
      const bd = b.date || b.createdAt || b.id;
      return String(bd).localeCompare(String(ad));
    });
    return list.slice(0, 5);
  }, [products]);

  const openQuickView = (product) => {
    const maxQty = Number(product.stock) || 0;

    setActiveProduct(product);
    const defaultFlavor = Array.isArray(product.flavor) && product.flavor.length > 0 ? product.flavor[0] : null;
    setSelectedFlavor(defaultFlavor);
    setQty(maxQty > 0 ? 1 : 0);
    document.body.style.overflow = "hidden";
  };

  const closeQuickView = () => {
    setActiveProduct(null);
    setSelectedFlavor(null);
    setQty(1);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { closeQuickView(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onGridAddToCart = (product) => {
    const flavors = Array.isArray(product.flavor) ? product.flavor : [];
    
    if (Number(product.stock) === 0) {
      toast.error(`${product.name} is currently out of stock.`);
      return;
    }

    if (flavors.length <= 1) {
      const flavor = flavors[0] || "Default";
      try {
        addToCart(product.id, flavor);
        toast.success(`${product.name} (${flavor}) added to cart`);
      } catch (err) {
        toast.error("Couldn't add to cart");
      }
      return;
    }
    
    openQuickView(product);
  };

  const confirmQuickviewAdd = () => {
    if (!activeProduct || qty === 0 || !selectedFlavor) return;
    
    if (qty > activeProduct.stock) {
        toast.error(`Cannot add ${qty} items. Only ${activeProduct.stock} left in stock.`);
        return;
    }

    const flavor = selectedFlavor || (Array.isArray(activeProduct.flavor) ? activeProduct.flavor[0] : "Default");
    for (let i = 0; i < (Number(qty) || 1); i++) {
      try {
        addToCart(activeProduct.id, flavor);
      } catch (err) {
        toast.error("Couldn't add to cart");
        return;
      }
    }
    toast.success(`${activeProduct.name} (${flavor}) x${qty} added to cart`);
    closeQuickView();
  };

  const cardVariants = {
    rest: { y: 0, boxShadow: "0 0px 0px rgba(0,0,0,0.04)" },
    hover: { y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }
  };

    const maxStock = activeProduct ? Number(activeProduct.stock) : 0;
    const isOutOfStock = maxStock === 0;
    const isMaxQuantity = qty >= maxStock;

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4">
      <div className='text-center text-3xl py-8'>
                <Title text1={"Latest"} text2={"Collection"} />
            </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {latestFive.map(product => (
          <motion.article
            key={product.id}
            className="bg-white rounded-lg overflow-hidden cursor-pointer"
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={cardVariants}
          >
            <div className="relative">
              <img
                src={(product.image && product.image[0]) || "/placeholder.png"}
                alt={product.name}
                className="hover:scale-110 transition ease-in-out"
                loading="lazy"
                onClick={() => openQuickView(product)}
              />
            </div>

            <div className="p-3">
              <h3 className="pt-3 pb-1 text-sm">{product.name}</h3>

              <div className="flex items-center justify-between mt-3">
                <div className="text-sm font-medium">
                  {currency}{Number(product.price || 0).toFixed(2)}
                </div>

                <button
                  onClick={() => openQuickView(product)}
                  className="text-sm bg-gray-100 px-3 py-1 rounded-md"
                >
                  Quick view
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      
      <AnimatePresence>
        {activeProduct && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
          >
            <motion.div
              className="bg-white rounded-lg max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden"
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
              
              <div className="p-4 flex flex-col gap-3">
                <div className="flex-1">
                  <img
                    src={(activeProduct.image && activeProduct.image[0]) || "/placeholder.png"}
                    alt={activeProduct.name}
                    className="w-full h-80 object-cover rounded-md"
                  />
                </div>
                <div className="flex gap-2">
                  {(activeProduct.image || []).slice(0, 4).map((src, i) => (
                    <button key={i} onClick={() => {
                      const newImgs = [...(activeProduct.image || [])];
                      const temp = newImgs[0];
                      newImgs[0] = newImgs[i];
                      newImgs[i] = temp;
                      setActiveProduct(p => ({ ...p, image: newImgs }));
                    }} className="w-16 h-12 rounded overflow-hidden border">
                      <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              
              <div className="p-6 flex flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{activeProduct.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{activeProduct.category || ""}</p>
                  </div>
                  <button onClick={closeQuickView} className="text-gray-500 hover:text-gray-800">
                    <FiX size={22} />
                  </button>
                </div>

                <div className="mt-4 flex-1">
                  <p className="text-gray-700">{activeProduct.description || "No description available."}</p>

                  <div className="mt-4">
                    <div className="text-xl font-bold text-green-600">{currency}{Number(activeProduct.price || 0).toFixed(2)}</div>
                    <div className="text-sm text-gray-500 mt-1">Inclusive of taxes (if any)</div>
                  </div>
                    <div className={`mt-2 font-semibold ${isOutOfStock ? 'text-red-500' : 'text-green-500'}`}>
                        {isOutOfStock ? 'Currently Out of Stock' : `In Stock: ${maxStock}`}
                    </div>
                </div>

                
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Choose flavor</div>
                  <div className="flex gap-2 flex-wrap">
                    {(activeProduct.flavor || []).map(fl => (
                      <button
                        key={fl}
                        onClick={() => setSelectedFlavor(fl)}
                        className={`px-3 py-1 rounded-full border ${selectedFlavor === fl ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700'}`}
                      >
                        {fl}
                      </button>
                    ))}
                  </div>
                </div>

                
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button 
                        onClick={() => setQty(q => Math.max(1, q - 1))} 
                        className={`px-3 py-2 ${qty <= 1 ? 'text-gray-400 cursor-not-allowed' : ''}`}
                        disabled={qty <= 1}
                    >
                      <FiMinus />
                    </button>
                    <div className="px-4 py-2 min-w-[44px] text-center">{qty}</div>
                    <button 
                        onClick={() => setQty(q => Math.min(maxStock, q + 1))} 
                        className={`px-3 py-2 ${isMaxQuantity || isOutOfStock ? 'text-gray-400 cursor-not-allowed' : ''}`}
                        disabled={isMaxQuantity || isOutOfStock}
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <button
                    onClick={confirmQuickviewAdd}
                    className={`
                        px-5 py-2 rounded-md transition-all font-medium
                        ${isOutOfStock || qty === 0 || !selectedFlavor 
                            ? 'bg-gray-400 cursor-not-allowed text-white' 
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }
                    `}
                    disabled={isOutOfStock || qty === 0 || !selectedFlavor}
                  >
                    {isOutOfStock ? 'Out of Stock' : `Add ${qty} to cart`}
                  </button>
                </div>

               
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}