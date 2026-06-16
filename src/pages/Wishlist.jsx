import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import API_BASE_URL from "../services/api";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import QuickView from "../components/QuickView";
import { FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";

function Wishlist() {
  const { userToken, currency, toggleWishlist } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    if (!userToken) { setLoading(false); return; }
    fetch(`${API_BASE_URL}/api/wishlist`, {
      headers: { Authorization: `Bearer ${userToken}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setProducts(data.products || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userToken]);

  if (!userToken) {
    return (
      <div className="max-w-[1200px] mx-auto py-20 px-4 text-center">
        <FiHeart size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Save Your Favorites</h2>
        <p className="text-gray-500 mb-6">Sign in to create and view your wishlist.</p>
        <Link
          to="/login"
          className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto py-20 px-4">
        <div className="text-center text-3xl py-8">
          <Title text1={"My"} text2={"Wishlist"} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <article key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-3 text-center space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto py-20 px-4 text-center">
        <FiHeart size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-6">Start adding items you love!</p>
        <Link
          to="/collections"
          className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4">
      <div className="text-center text-3xl py-8">
        <Title text1={"My"} text2={"Wishlist"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {products.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            name={item.name}
            price={item.price}
            offerPrice={item.offerPrice}
            onSale={item.onSale}
            image={item.image}
            currency={currency}
            product={item}
            openQuickView={(p) => setQuickViewProduct(p)}
          />
        ))}
      </div>

      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        currency={currency}
      />
    </div>
  );
}

export default Wishlist;
