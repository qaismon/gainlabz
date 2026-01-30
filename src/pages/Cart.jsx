import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import API_BASE_URL from "../services/api";

/* ---------- IMAGE HELPER (Fixed for 414 & Nested Arrays) ---------- */
const getImageUrl = (src) => {
  // 1. Handle nested array if present
  let cleanSrc = Array.isArray(src) ? src[0] : src;
  
  // 2. String safety check
  if (!cleanSrc || typeof cleanSrc !== 'string') return "/placeholder.png";
  
  // 3. Base64 or Full URL Check (Fixes 414)
  if (cleanSrc.startsWith("data:") || cleanSrc.startsWith("http")) return cleanSrc;

  // 4. Fallback for static files
  const BASE_DOMAIN = API_BASE_URL.replace("/api", "");
  const finalPath = cleanSrc.startsWith("/") ? cleanSrc : "/" + cleanSrc;
  return `${BASE_DOMAIN}${finalPath}`;
};

function Cart() {
  const {
    products = [],
    currency,
    cartItems,
    updateQuantity,
    navigate,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  /* ---------- BUILD CART LIST ---------- */
  useEffect(() => {
    const tempData = [];

    for (const productId in cartItems) {
      for (const flavor in cartItems[productId]) {
        const qty = cartItems[productId][flavor];
        if (qty > 0) {
          tempData.push({
            id: productId,
            flavor,
            quantity: qty,
          });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-6">
        <Title text1={"Your"} text2={"Cart"} />
      </div>

      {/* ---------- CART ITEMS ---------- */}
      <div>
        {cartData.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            Your cart is empty
          </p>
        )}

        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => String(product._id) === String(item.id)
          );

          if (!productData) return null;

          // 🔥 Flatten image extraction to handle the nested array bug
          const rawImage = productData.image;
          let imageSrc = Array.isArray(rawImage) ? rawImage[0] : rawImage;
          
          // Secondary flatten if the first element was also an array
          if (Array.isArray(imageSrc)) {
            imageSrc = imageSrc[0];
          }

          return (
            <div
              key={index}
              className="py-4 border-b text-gray-700 grid grid-cols-[4fr_1fr_0.5fr] items-center gap-4"
            >
              {/* PRODUCT */}
              <div className="flex items-start gap-4">
                <img
                  className="w-16 sm:w-20 rounded shadow-sm border border-gray-100"
                  src={getImageUrl(imageSrc)}
                  alt={productData.name}
                  onError={(e) => { e.target.src = "/placeholder.png"; }}
                />

                <div>
                  <p className="text-sm sm:text-lg font-medium text-gray-800">
                    {productData.name}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <p className="font-semibold">
                      {currency}
                      {Number(
                        productData.onSale
                          ? productData.offerPrice
                          : productData.price
                      ).toFixed(2)}
                    </p>

                    <span className="px-2 py-1 border bg-slate-50 rounded text-xs text-gray-600">
                      {item.flavor}
                    </span>
                  </div>
                </div>
              </div>

              {/* QUANTITY */}
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => {
                   const val = Number(e.target.value);
                   if (val > 0) {
                     updateQuantity(item.id, item.flavor, val);
                   }
                }}
                className="border max-w-[70px] px-2 py-1 rounded-md text-center focus:ring-1 focus:ring-black outline-none"
              />

              {/* REMOVE */}
              <div className="flex justify-center">
                <img
                  onClick={() =>
                    updateQuantity(item.id, item.flavor, 0)
                  }
                  className="w-4 sm:w-5 cursor-pointer hover:opacity-70 transition-opacity"
                  src={assets.bin_icon}
                  alt="Remove"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- TOTAL ---------- */}
      {cartData.length > 0 && (
        <div className="flex justify-end my-20">
          <div className="w-full sm:w-[450px]">
            <CartTotal />

            <div className="w-full text-end">
              <button
                onClick={() => navigate("/place-order")}
                className="bg-black text-white text-sm my-8 px-8 py-4 rounded font-bold hover:bg-gray-800 active:scale-95 transition-all shadow-lg"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;