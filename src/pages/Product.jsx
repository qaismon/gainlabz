import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";
import API_BASE_URL from "../services/api";

function Product() {
  const { productId } = useParams();
  const { products = [], currency, addToCart, cartItems } =
    useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [flavor, setFlavor] = useState("");
  const [qty, setQty] = useState(1);

 const getImageUrl = (src) => {
  if (!src) return "/placeholder.png";
  if (src.startsWith("http")) return src;

  const BASE_DOMAIN = API_BASE_URL.replace("/api", "");

  return `${BASE_DOMAIN}/${src}`;
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
    setImage(found.image?.[0] || "");
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

  /* ---------------- UI ---------------- */
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-12 flex-col md:flex-row">
        {/* ---------- IMAGES ---------- */}
        <div className="flex-1 flex gap-4">
          <div className="hidden md:flex flex-col gap-3 w-[18%]">
            {(productData.image || []).map((src, idx) => (
              <button
                key={idx}
                onClick={() => setImage(src)}
                className={`rounded border ${
                  image === src ? "ring-2 ring-green-400" : ""
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
              className="w-full rounded"
            />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{productData.name}</h1>

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
              <span className="text-green-600">
                In Stock ({availableStock})
                {currentCartQuantity > 0 &&
                  ` • ${currentCartQuantity} in cart`}
              </span>
            ) : (
              <span className="text-red-600">OUT OF STOCK</span>
            )}
          </p>

          <p className="mt-4 text-gray-600">
            {productData.description}
          </p>

          {productData.flavor?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">
                Select Flavor
              </p>
              <div className="flex gap-2 flex-wrap">
                {productData.flavor.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFlavor(f)}
                    className={`cursor-pointer px-4 py-2 border rounded ${
                      flavor === f
                        ? "bg-green-500 text-white"
                        : ""
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
              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={() =>
                    setQty((q) => Math.max(1, q - 1))
                  }
                  disabled={qty <= 1}
                >
                  −
                </button>

                <span>{qty}</span>

                <button
                  onClick={() =>
                    setQty((q) =>
                      Math.min(maxAddableQty, q + 1)
                    )
                  }
                  disabled={qty >= maxAddableQty}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={qty <= 0 || !flavor}
                className="mt-6 bg-black text-white px-6 py-3 rounded cursor-pointer"
              >
                ADD {qty} TO CART
              </button>
            </>
          )}
        </div>
      </div>

      {/* ---------- RELATED ---------- */}
      <div className="mt-10">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  );
}

export default Product;
