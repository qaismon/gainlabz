import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";
import API_BASE_URL from "../services/api";
import { ChevronRight, ShoppingBag, Minus, Plus, CheckCircle, AlertCircle } from 'lucide-react';

function Product() {
  const { productId } = useParams();
  const { products = [], currency, addToCart, cartItems } =
    useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [flavor, setFlavor] = useState("");
  const [qty, setQty] = useState(1);

  /* ---------------- FIXED IMAGE URL HELPER ---------------- */
  const getImageUrl = (src) => {
    // 1. Flatten nested array if necessary
    let cleanSrc = Array.isArray(src) ? src[0] : src;
    
    // 2. String safety check
    if (!cleanSrc || typeof cleanSrc !== 'string') return "/placeholder.png";
    
    // 3. Base64 or Full URL Check (Fixes 414)
    if (cleanSrc.startsWith("data:") || cleanSrc.startsWith("http")) return cleanSrc;

    // 4. Standard File path logic
    const BASE_DOMAIN = API_BASE_URL.replace("/api", "");
    const finalPath = cleanSrc.startsWith('/') ? cleanSrc : `/${cleanSrc}`;
    return `${BASE_DOMAIN}${finalPath}`;
  };

  const availableStock = productData
    ? Number(productData.stock) || 0
    : 0;

  const currentCartQuantity = productData
    ? Number(cartItems[productData._id]?.[flavor]) || 0
    : 0;

  const maxAddableQty = Math.max(
    0,
    availableStock - currentCartQuantity
  );

  const isInStock = availableStock > 0;

  useEffect(() => {
    if (!products.length) return;

    const found = products.find(
      (item) => String(item._id) === String(productId)
    );

    if (!found) {
      setProductData(null);
      return;
    }

    setProductData(found);
    
    // Flatten initial image if it's nested
    const initialImg = Array.isArray(found.image?.[0]) ? found.image[0][0] : found.image?.[0];
    setImage(initialImg || "");
    
    setFlavor(found.flavor?.[0] || "");
    setQty(1);
  }, [products, productId]);

  useEffect(() => {
    if (!productData) return;

    if (availableStock === 0) {
      setQty(0);
      return;
    }

    if (qty > maxAddableQty && maxAddableQty > 0) {
      setQty(maxAddableQty);
    }

    if (qty <= 0 && maxAddableQty > 0) {
      setQty(1);
    }
  }, [qty, maxAddableQty, availableStock, productData]);

  if (!productData) {
    return (
      <div className="py-10 text-center text-gray-500">
        Product not found.
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!flavor) {
      toast.error("Please select a flavor.");
      return;
    }

    if (qty <= 0) {
      toast.error("Invalid quantity.");
      return;
    }

    addToCart(productData._id, flavor, qty);
    toast.success("Added to cart!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-12 flex-col md:flex-row">
        {/* ---------- IMAGES ---------- */}
        <div className="flex-1 flex gap-4">
          <div className="hidden md:flex flex-col gap-3 w-[18%]">
            {(productData.image || []).map((src, idx) => (
              <button
                key={idx}
                onClick={() => setImage(Array.isArray(src) ? src[0] : src)}
                className={`rounded border overflow-hidden transition-all ${
                  image === (Array.isArray(src) ? src[0] : src) ? "ring-2 ring-green-400 border-transparent" : "border-gray-200"
                }`}
              >
                <img
                  src={getImageUrl(src)}
                  alt={`${productData.name}-${idx}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>

          <div className="flex-1">
            <img
              src={getImageUrl(image)}
              alt={productData.name}
              className="w-full rounded-lg shadow-sm border border-gray-100"
            />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">{productData.name}</h1>

          <div className="mt-4">
            {productData.onSale && productData.offerPrice ? (
              <>
                <p className="text-4xl font-extrabold text-red-600">
                  {currency}
                  {Number(productData.offerPrice).toFixed(2)}
                </p>
                <p className="text-lg line-through text-gray-500">
                  {currency}
                  {Number(productData.price).toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-3xl font-bold">
                {currency}
                {Number(productData.price).toFixed(2)}
              </p>
            )}
          </div>

          <p className="mt-2 font-semibold">
            {isInStock ? (
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle size={16} /> In Stock ({availableStock})
                {currentCartQuantity > 0 && ` • ${currentCartQuantity} in cart`}
              </span>
            ) : (
              <span className="text-red-600 flex items-center gap-1">
                <AlertCircle size={16} /> OUT OF STOCK
              </span>
            )}
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            {productData.description}
          </p>

          {productData.flavor?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Select Flavor</p>
              <div className="flex gap-2 flex-wrap">
                {productData.flavor.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFlavor(f)}
                    className={`px-4 py-2 border rounded transition-all ${
                      flavor === f
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isInStock && (
            <>
              <div className="mt-8 mb-6">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Quantity</p>
                <div className="flex items-center gap-6 p-2 bg-gray-50 rounded-3xl w-fit border border-gray-100 shadow-sm">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm hover:shadow-md transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus size={18} className="text-gray-600" />
                  </button>

                  <span className="text-xl font-black w-8 text-center tabular-nums text-gray-800">
                    {qty}
                  </span>

                  <button
                    onClick={() => setQty((q) => Math.min(maxAddableQty, q + 1))}
                    disabled={qty >= maxAddableQty}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm hover:shadow-md transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} className="text-green-600" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={qty <= 0 || !flavor}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-green-100 flex items-center justify-center gap-3 transition-all active:scale-95 group"
              >
                <ShoppingBag className="group-hover:animate-bounce" size={20} />
                ADD TO BAG — {currency}{((productData.offerPrice || productData.price) * qty).toFixed(2)}
              </button>
              
              {currentCartQuantity > 0 && (
                <p className="mt-4 text-center text-xs font-bold text-gray-400">
                  You already have {currentCartQuantity} in your bag.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-16 border-t border-gray-100 pt-10">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  );
}

export default Product;