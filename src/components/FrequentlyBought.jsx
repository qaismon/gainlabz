import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import API_BASE_URL from "../services/api";
import Title from "./Title";
import ProductItem from "./ProductItem";
import QuickView from "./QuickView";

function FrequentlyBought({ productId }) {
  const { currency } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    if (!productId) return;

    fetch(`${API_BASE_URL}/api/recommendations/product/${productId}?limit=5`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading || products.length === 0) return null;

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"Frequently Bought"} text2={"Together"} />
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

export default FrequentlyBought;
