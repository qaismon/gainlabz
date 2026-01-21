import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import API_BASE_URL from "../services/api";

/* ---------- IMAGE HELPER ---------- */
const getImageUrl = (src) => {
  if (!src) return "/placeholder.png";
  if (src.startsWith("http")) return src;

  const BASE_DOMAIN = API_BASE_URL.replace("/api", "");
  return `${BASE_DOMAIN}${src.startsWith("/") ? src : "/" + src}`;
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

          const imageSrc = Array.isArray(productData.image)
            ? productData.image[0]
            : productData.image;

          return (
            <div
              key={index}
              className="py-4 border-b text-gray-700 grid grid-cols-[4fr_1fr_0.5fr] items-center gap-4"
            >
              {/* PRODUCT */}
              <div className="flex items-start gap-4">
                <img
                  className="w-16 sm:w-20 rounded"
                  src={getImageUrl(imageSrc)}
                  alt={productData.name}
                />

                <div>
                  <p className="text-sm sm:text-lg font-medium">
                    {productData.name}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <p>
                      {currency}
                      {Number(
                        productData.onSale
                          ? productData.offerPrice
                          : productData.price
                      ).toFixed(2)}
                    </p>

                    <span className="px-2 py-1 border bg-slate-50 rounded">
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
                onChange={(e) =>
                  updateQuantity(
                    item.id,
                    item.flavor,
                    Number(e.target.value)
                  )
                }
                className="border max-w-[70px] px-2 py-1 rounded-md text-center"
              />

              {/* REMOVE */}
              <img
                onClick={() =>
                  updateQuantity(item.id, item.flavor, 0)
                }
                className="w-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="Remove"
              />
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
                className="bg-black text-white text-sm my-8 px-8 py-3 rounded-md hover:bg-gray-800"
              >
                PROCEED TO PAYMENT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
