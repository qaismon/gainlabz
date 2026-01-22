import React, { useContext, useState, useEffect, forwardRef } from "react";
import { motion } from "framer-motion";
import { FiEye } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import Title from "./Title";
import QuickView from "./QuickView";
import API_BASE_URL from "../services/api";

const getImageUrl = (src) => {
  if (!src) return "/placeholder.png";
  if (src.startsWith("http")) return src;

  const BASE_DOMAIN = API_BASE_URL.replace("/api", "");
  return `${BASE_DOMAIN}/${src}`;
};

const BestSeller = forwardRef((props, ref) => {
  const { products = [], currency } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const navigate = useNavigate();

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    if (products && products.length > 0) {
      const best = products.filter(item => Boolean(item.bestseller));
      setBestSeller(best.slice(0, 5));
    }
  }, [products]);

  return (
    <div ref={ref} className="my-10 max-w-[1200px] mx-auto px-4">
      <div className="text-center text-3xl py-8">
        <Title text1={"Best"} text2={"Sellers"} />
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 gap-y-6">
        {bestSeller.map(product => {
          const imageSrc = Array.isArray(product.image)
            ? product.image[0]
            : product.image;

          return (
            <motion.article
              key={product._id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* IMAGE */}
              <div
                className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
                onClick={() => setQuickViewProduct(product)}
              >
                <img
                  src={getImageUrl(imageSrc)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* HOVER OVERLAY */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white p-3 rounded-full shadow-xl text-gray-900 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <FiEye size={22} />
                  </div>
                </div>
              </div>

              {/* INFO */}
              <div className="p-3 text-center">
                <h3
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="text-xs sm:text-sm font-medium text-gray-800 truncate cursor-pointer hover:underline hover:text-green-600"
                >
                  {product.name}
                </h3>
                <p className="text-sm font-bold text-green-600 mt-1">
                  {currency}{Number(product.price).toFixed(2)}
                </p>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* QUICK VIEW */}
      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        currency={currency}
      />
    </div>
  );
});

export default BestSeller;
