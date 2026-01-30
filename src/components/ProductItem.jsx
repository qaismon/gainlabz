import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import API_BASE_URL from "../services/api";

/* ---------------- IMAGE URL HELPER ---------------- */
const getImageUrl = (src) => {
  // 1. Safety check: if src is null, undefined, or not a string
  if (!src || typeof src !== 'string') return "/placeholder.png";

  // 2. If it's Base64, return exactly as is (FIXES 414 ERROR)
  if (src.startsWith("data:")) return src;

  // 3. If it's already a full URL, return it
  if (src.startsWith("http")) return src;

  // 4. Fallback for static uploads
  const BASE_DOMAIN = API_BASE_URL.replace("/api", "");
  return `${BASE_DOMAIN}/${src}`;
};

function ProductItem({
  _id,
  id,
  name,
  price,
  offerPrice,
  onSale,
  image,
  currency = "$",
  openQuickView,
  product
}) {
  const navigate = useNavigate();

  // Normalize image: use the passed 'image' prop or fall back to 'product.image'
  const imageArray = Array.isArray(image) ? image : (product?.image || []);
  // 🔥 Normalize image (Handling the double-nested array bug)
let rawImage = image || product?.image;

// 1. If it's an array, get the first element
let imageSrc = Array.isArray(rawImage) ? rawImage[0] : rawImage;

// 2. If it's STILL an array (the nested array bug), get the first element of THAT
if (Array.isArray(imageSrc)) {
    imageSrc = imageSrc[0];
}

// Now imageSrc is definitely a string (e.g., "uploads/whey1.jpg")

  const productId = _id || id;


  return (
    <div className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      
      {/* IMAGE CONTAINER */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-50">
        {onSale && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
            SALE
          </span>
        )}

        {/* IMAGE → PRODUCT PAGE */}
        <div
          className="relative w-full h-full cursor-pointer"
          onClick={() => navigate(`/product/${productId}`)}
        >
          {/* Use the helper function here to prevent the crash and 414 error */}
          <img 
            src={getImageUrl(imageSrc)} 
            alt={name} 
            className="w-full h-full object-cover rounded"
            onError={(e) => { e.target.src = "/placeholder.png"; }}
          />
        </div>

        {/* DESKTOP QUICK VIEW */}
        <div className="hidden sm:flex absolute inset-0 pointer-events-none items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="pointer-events-auto bg-white p-3 rounded-full shadow-xl text-gray-900 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100 hover:text-green-600"
          >
            <FiEye size={22} />
          </button>
        </div>
      </div>

      {/* DETAILS */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-1 pt-2">
          <h3
            onClick={() => navigate(`/product/${productId}`)}
            className="text-sm sm:text-base truncate font-medium text-gray-800 cursor-pointer hover:text-green-600 hover:underline flex-1"
          >
            {name}
          </h3>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="sm:hidden p-1.5 text-gray-500 border border-gray-200 rounded-md active:bg-gray-100 active:text-green-600"
          >
            <FiEye size={18} />
          </button>
        </div>

        {/* PRICE */}
        <div className="text-sm font-medium flex flex-col mt-auto pt-1">
          {onSale && offerPrice != null ? (
            <>
              <span className="text-[10px] text-gray-400 line-through leading-none">
                {currency}{Number(price || 0).toFixed(2)}
              </span>
              <span className="text-base font-bold text-red-600">
                {currency}{Number(offerPrice || 0).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-gray-900">
              {currency}{Number(price || 0).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductItem;