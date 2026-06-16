import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import API_BASE_URL from "../services/api";
import { FiEye } from "react-icons/fi";

const getImageUrl = (src) => {
  if (!src || typeof src !== 'string') return "/placeholder.png";
  if (src.startsWith("data:") || src.startsWith("http")) return src;
  const BASE_DOMAIN = API_BASE_URL.replace("/api", "");
  return `${BASE_DOMAIN}/${src}`;
};

function RecommendedForYou() {
  const { userToken, currency } = useContext(ShopContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userToken) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/recommendations/user?limit=8`, {
      headers: { Authorization: `Bearer ${userToken}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userToken]);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
        <button
          onClick={() => navigate("/collection")}
          className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => {
          let rawImage = product.image;
          let imageSrc = Array.isArray(rawImage) ? rawImage[0] : rawImage;
          if (Array.isArray(imageSrc)) imageSrc = imageSrc[0];

          return (
            <div
              key={product._id}
              className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-50">
                <img
                  src={getImageUrl(imageSrc)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "/placeholder.png"; }}
                />
                <div className="hidden sm:flex absolute inset-0 pointer-events-none items-center justify-center">
                  <button className="pointer-events-auto bg-white p-3 rounded-full shadow-xl text-gray-900 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100 hover:text-green-600">
                    <FiEye size={22} />
                  </button>
                </div>
              </div>

              <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-sm sm:text-base truncate font-medium text-gray-800 hover:text-green-600">
                  {product.name}
                </h3>
                <div className="text-sm font-medium flex flex-col mt-auto pt-1">
                  {product.onSale && product.offerPrice != null ? (
                    <>
                      <span className="text-[10px] text-gray-400 line-through leading-none">
                        {currency}{Number(product.price || 0).toFixed(2)}
                      </span>
                      <span className="text-base font-bold text-red-600">
                        {currency}{Number(product.offerPrice || 0).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-base font-bold text-gray-900">
                      {currency}{Number(product.price || 0).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecommendedForYou;
