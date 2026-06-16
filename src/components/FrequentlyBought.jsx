import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import API_BASE_URL from "../services/api";

const getImageUrl = (src) => {
  if (!src || typeof src !== 'string') return "/placeholder.png";
  if (src.startsWith("data:") || src.startsWith("http")) return src;
  const BASE_DOMAIN = API_BASE_URL.replace("/api", "");
  return `${BASE_DOMAIN}/${src}`;
};

function FrequentlyBought({ productId }) {
  const { currency } = useContext(ShopContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    fetch(`${API_BASE_URL}/api/recommendations/product/${productId}?limit=4`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-100 pt-10">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Bought Together</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
              <div className="relative h-40 sm:h-44 overflow-hidden bg-gray-50">
                <img
                  src={getImageUrl(imageSrc)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "/placeholder.png"; }}
                />
              </div>

              <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-sm truncate font-medium text-gray-800 hover:text-green-600">
                  {product.name}
                </h3>
                <div className="text-sm font-medium flex flex-col mt-auto pt-1">
                  {product.onSale && product.offerPrice != null ? (
                    <>
                      <span className="text-[10px] text-gray-400 line-through leading-none">
                        {currency}{Number(product.price || 0).toFixed(2)}
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        {currency}{Number(product.offerPrice || 0).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-gray-900">
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

export default FrequentlyBought;
