import React, { useContext, useState, useEffect, forwardRef } from "react";
import { motion } from "framer-motion";
import { FiEye } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import Title from "./Title";
import QuickView from "./QuickView";
import API_BASE_URL from "../services/api";

/* ---------------- FIXED IMAGE URL HELPER ---------------- */
const getImageUrl = (src) => {
  // 1. Flatten the double-nested array bug [[ 'path.jpg' ]]
  let cleanSrc = Array.isArray(src) ? src[0] : src;
  if (Array.isArray(cleanSrc)) cleanSrc = cleanSrc[0];

  // 2. Safety check: must be a string
  if (!cleanSrc || typeof cleanSrc !== 'string') return "/placeholder.png";

  // 3. Base64 or Full URL Check (Prevents 414 Error)
  if (cleanSrc.startsWith("data:") || cleanSrc.startsWith("http")) return cleanSrc;

  // 4. Static backend path logic
  const BASE_DOMAIN = API_BASE_URL.replace("/api", "");
  const finalPath = cleanSrc.startsWith("/") ? cleanSrc : `/${cleanSrc}`;
  return `${BASE_DOMAIN}${finalPath}`;
};

const OfferProducts = forwardRef((props, ref) => {
  const { products = [], currency } = useContext(ShopContext);
  const [offerProducts, setOfferProducts] = useState([]);
  const navigate = useNavigate();

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    if (products && products.length > 0) {
      const onSale = products.filter(
        item => Boolean(item.onSale) && item.offerPrice != null
      );
      setOfferProducts(onSale.slice(0, 10));
    }
  }, [products]);

  if (offerProducts.length === 0) return null;

  return (
    <div ref={ref} className="my-10 max-w-[1200px] mx-auto px-4">
      <div className="text-center text-3xl py-8">
        <Title text1={"FLASH"} text2={"SALE OFFERS"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 gap-y-6">
        {offerProducts.map(product => {
          // 🔥 Handle potential double-nested array during extraction
          const rawImage = product.image;
          let imageSrc = Array.isArray(rawImage) ? rawImage[0] : rawImage;

          return (
            <motion.article
              key={product._id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* SALE BADGE */}
              <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
                SALE
              </div>

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
                  onError={(e) => { e.target.src = "/placeholder.png"; }}
                />

                {/* HOVER OVERLAY */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white p-3 rounded-full shadow-xl text-gray-900 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <FiEye size={22} />
                  </div>
                </div>
              </div>

              {/* INFO */}
              <div className="p-3 text-center">
                <h3
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="text-xs sm:text-sm font-medium text-gray-800 truncate cursor-pointer hover:underline hover:text-red-600"
                >
                  {product.name}
                </h3>

                <div className="mt-1 flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 line-through">
                    {currency}{Number(product.price || 0).toFixed(2)}
                  </span>
                  <span className="text-sm font-bold text-red-600">
                    {currency}{Number(product.offerPrice || 0).toFixed(2)}
                  </span>
                </div>
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

export default OfferProducts;