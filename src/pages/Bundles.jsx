import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import API_BASE_URL from '../services/api';
import Title from '../components/Title';
import { FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';

function Bundles() {
  const { currency, addToCart, isLoggedIn, setBundleDiscount, navigate } = useContext(ShopContext);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/bundles/active`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setBundles(data.bundles);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getItemPrice = (product) => {
    if (!product || !product.price) return 0;
    return product.onSale && product.offerPrice != null ? Number(product.offerPrice) : Number(product.price);
  };

  const calcPrice = (bundle) => {
    let total = 0;
    bundle.products.forEach(({ product, quantity }) => {
      total += getItemPrice(product) * quantity;
    });
    const discounted = total - (total * (bundle.discountPercent || 0)) / 100;
    return { original: total, discounted };
  };

  const addBundleToCart = (bundle) => {
    if (!isLoggedIn) { navigate('/login'); return; }
    let totalOriginal = 0;
    bundle.products.forEach(({ product, quantity }) => {
      if (!product) return;
      addToCart(product._id, "Default", quantity);
      totalOriginal += getItemPrice(product) * quantity;
    });
    const totalDiscounted = totalOriginal - (totalOriginal * (bundle.discountPercent || 0)) / 100;
    const savings = totalOriginal - totalDiscounted;
    setBundleDiscount(savings);
    toast.success(`${bundle.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto py-20 px-4">
        <div className="text-center text-3xl py-8"><Title text1={"Value"} text2={"Bundles"} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (bundles.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto py-20 px-4 text-center">
        <Title text1={"Value"} text2={"Bundles"} />
        <p className="text-gray-400 mt-6">No bundles available right now. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4">
      <div className="text-center text-3xl py-8">
        <Title text1={"Value"} text2={"Bundles"} />
        <p className="text-gray-500 text-sm mt-2">Curated stacks at a discounted price</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) => {
          const { original, discounted } = calcPrice(bundle);
          return (
            <div key={bundle._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
              {bundle.image ? (
                <div className="h-48 overflow-hidden bg-gray-50">
                  <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.className = 'h-48 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center'; }} />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl mb-1">🎁</p>
                    <p className="text-green-700 font-black text-lg">{bundle.products.length} Items</p>
                  </div>
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-800">{bundle.name}</h3>
                {bundle.description && <p className="text-sm text-gray-500 mt-2 flex-1">{bundle.description}</p>}

                <div className="mt-4 space-y-1.5">
                  {bundle.products.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold flex items-center justify-center">{p.quantity}</span>
                      {p.product?.name || 'Unknown'}
                      <span className="text-xs text-gray-400 ml-auto">{currency}{getItemPrice(p.product).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    {bundle.discountPercent > 0 && (
                      <span className="text-sm text-gray-400 line-through block leading-none">{currency}{original.toFixed(2)}</span>
                    )}
                    <span className="text-2xl font-black text-green-600">{currency}{discounted.toFixed(2)}</span>
                    {bundle.discountPercent > 0 && (
                      <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">-{bundle.discountPercent}%</span>
                    )}
                  </div>
                  <button
                    onClick={() => addBundleToCart(bundle)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-all active:scale-95"
                  >
                    <FiShoppingCart /> Add Bundle
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Bundles;
