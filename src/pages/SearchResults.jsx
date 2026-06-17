import React, { useContext, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import Title from "../components/Title";

function SearchResults() {
  const { searchProductAPI } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(async (p) => {
    if (!query.trim()) return;
    setLoading(true);
    setPage(p);
    const data = await searchProductAPI(query, p);
    if (data.success) {
      setResults(data.results || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 0);
    } else {
      setResults([]);
      setTotalCount(0);
    }
    setLoading(false);
  }, [query, searchProductAPI]);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const loadPage = (p) => {
    fetchPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!query.trim()) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20">
        <p className="text-6xl mb-4">🔍</p>
        <p className="text-xl font-bold text-gray-700">Enter a search term</p>
        <p className="text-sm text-gray-400 mt-1">Use the search bar above to find products</p>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-[1200px] mx-auto px-4">
      <div className="mb-8">
        <Title text1={"SEARCH"} text2={"RESULTS"} />
        <p className="text-sm text-gray-500 mt-2">
          {loading ? "Searching..." : `${totalCount} result${totalCount !== 1 ? "s" : ""} for "${query}"`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-100 rounded-lg mb-3" />
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center py-20">
          <p className="text-6xl mb-4">😕</p>
          <p className="text-xl font-bold text-gray-700">No results found</p>
          <p className="text-sm text-gray-400 mt-1 max-w-md">
            We couldn't find any products matching "{query}". Try different keywords or browse our collections.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((item) => (
              <ProductItem
                key={item._id}
                _id={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                offerPrice={item.offerPrice}
                onSale={item.onSale}
                image={item.image}
                product={item}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              <button
                onClick={() => loadPage(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => loadPage(p)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                    p === page
                      ? "bg-green-600 text-white shadow-md"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => loadPage(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchResults;
