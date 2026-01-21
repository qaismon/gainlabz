import React from "react";
import { FiX, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/api";

/* ---------------- IMAGE URL HELPER ---------------- */
const getImageUrl = (src) => {
  if (!src) return "/placeholder.png";
  if (src.startsWith("http")) return src;

  const BASE_DOMAIN = API_BASE_URL.replace("/api", "");
  return `${BASE_DOMAIN}${src.startsWith("/") ? src : "/" + src}`;
};

const QuickView = ({ product, isOpen, onClose, currency = "$" }) => {
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  /* ---------------- IMAGE NORMALIZATION ---------------- */
  const imageSrc = Array.isArray(product.image)
    ? product.image[0]
    : product.image;

  /* ---------------- ANIMATIONS ---------------- */
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { opacity: 0, y: 40, scale: 0.92 }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-600"
          >
            <FiX size={20} />
          </button>

          <div className="flex flex-col md:flex-row">
            {/* IMAGE */}
            <div className="w-full md:w-1/2 bg-gray-50 h-72 md:h-[500px] overflow-hidden">
              <img
                src={getImageUrl(imageSrc)}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
              />
            </div>

            {/* CONTENT */}
            <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
              {product.category && (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full mb-4">
                  {product.category}
                </span>
              )}

              <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                {product.name}
              </h2>

              {/* PRICE */}
              <div className="flex items-center gap-4 my-6">
                <span className="text-4xl font-black text-gray-900">
                  {currency}
                  {Number(
                    product.onSale ? product.offerPrice : product.price
                  ).toFixed(2)}
                </span>

                {product.onSale && (
                  <span className="text-xl text-gray-400 line-through">
                    {currency}
                    {Number(product.price).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-gray-500 leading-relaxed">
                {product.description ||
                  "Premium formula engineered for maximum performance and recovery."}
              </p>

              {/* FLAVORS */}
              {Array.isArray(product.flavor) && product.flavor.length > 0 && (
                <div className="mt-8">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-3">
                    Flavors
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.flavor.map((f) => (
                      <span
                        key={f}
                        className="px-4 py-2 bg-gray-50 border rounded-xl text-xs font-bold"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="mt-10">
                <button
                  onClick={() => {
                    navigate(`/product/${product._id}`);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-3 w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-600 transition"
                >
                  View Full Details
                  <FiArrowRight />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickView;
