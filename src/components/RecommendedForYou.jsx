import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import API_BASE_URL from "../services/api";
import { FiEye } from "react-icons/fi";
import Title from "./Title";

const getImageUrl = (src) => {
  let cleanSrc = Array.isArray(src) ? src[0] : src;
  if (Array.isArray(cleanSrc)) cleanSrc = cleanSrc[0];
  if (!cleanSrc || typeof cleanSrc !== 'string') return "/placeholder.png";
  if (cleanSrc.startsWith("data:") || cleanSrc.startsWith("http")) return cleanSrc;
  const BASE_DOMAIN = API_BASE_URL.replace("/api", "");
  const finalPath = cleanSrc.startsWith("/") ? cleanSrc : `/${cleanSrc}`;
  return `${BASE_DOMAIN}${finalPath}`;
};

const LIMIT = 5;

function RecommendedForYou() {
  const { userToken, currency } = useContext(ShopContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        if (userToken) {
          const res = await fetch(`${API_BASE_URL}/api/recommendations/user?limit=${LIMIT}`, {
            headers: { Authorization: `Bearer ${userToken}` }
          });
          const data = await res.json();
          if (data.success && data.products?.length) {
            setProducts(data.products);
            setLoading(false);
            return;
          }
        }

        const res = await fetch(`${API_BASE_URL}/api/recommendations/popular?limit=${LIMIT}`);
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch {}
      setLoading(false);
    };

    fetchRecommended();
  }, [userToken]);

  if (!loading && products.length === 0) return null;

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4">
      <div className="text-center text-3xl py-8">
        <Title text1={"Recommended"} text2={"For You"} />
      </div>

      {loading ? (
        <div>
          <p className="text-center text-gray-400 text-sm mb-6 animate-pulse">
            Digging through the shelves for your next favorite...
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 gap-y-6">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <article
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 text-center space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 gap-y-6">
          {products.map((product) => {
            let rawImage = product.image;
            let imageSrc = Array.isArray(rawImage) ? rawImage[0] : rawImage;

            return (
              <article
                key={product._id}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div
                  className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={getImageUrl(imageSrc)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => { e.target.src = "/placeholder.png"; }}
                  />

                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white p-3 rounded-full shadow-xl text-gray-900 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <FiEye size={22} />
                    </div>
                  </div>
                </div>

                <div className="p-3 text-center">
                  <h3
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="text-xs sm:text-sm font-medium text-gray-800 truncate cursor-pointer hover:underline hover:text-green-600"
                  >
                    {product.name}
                  </h3>

                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {product.onSale && product.offerPrice != null ? (
                      <>
                        <span className="text-[10px] text-gray-400 line-through mr-1">
                          {currency}{Number(product.price || 0).toFixed(2)}
                        </span>
                        <span className="text-red-600">
                          {currency}{Number(product.offerPrice || 0).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      `${currency}${Number(product.price || 0).toFixed(2)}`
                    )}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecommendedForYou;
