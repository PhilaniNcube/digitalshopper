"use client";

import React, { useState, useEffect, useRef } from "react";
import { useField } from "@payloadcms/ui";
import { Search, X, Plus, Loader2 } from "lucide-react";

type Product = {
  id: string;
  title: string;
  supplierSku: string;
  price: number;
  featuredImage?: string | null;
};

export default function FeaturedProductsField({ path }: { path: string }) {
  const { value, setValue } = useField<string[]>({ path });
  const selectedIds = Array.isArray(value) ? value : [];

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load details for already selected IDs on mount/change
  useEffect(() => {
    if (selectedIds.length === 0) {
      setSelectedProducts([]);
      return;
    }

    // Only fetch details if we don't have them all loaded
    const missingIds = selectedIds.filter(
      (id) => !selectedProducts.some((p) => p.id === id)
    );

    if (missingIds.length === 0) {
      // We already have all details, but ensure the order matches selectedIds
      const ordered = selectedIds
        .map((id) => selectedProducts.find((p) => p.id === id))
        .filter(Boolean) as Product[];
      
      // Prevent infinite loop by checking if order actually changed
      if (JSON.stringify(ordered.map((o) => o.id)) !== JSON.stringify(selectedProducts.map((s) => s.id))) {
        setSelectedProducts(ordered);
      }
      return;
    }

    const fetchDetails = async () => {
      setIsLoadingDetails(true);
      try {
        const res = await fetch(`/api/products/list?ids=${selectedIds.join(",")}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedProducts(data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch featured product details:", err);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [value]); // run when the field value (ids array) changes

  // Search products when query changes (debounced)
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/list?q=${encodeURIComponent(searchQuery)}&pageSize=10`);
        if (res.ok) {
          const data = await res.json();
          // Filter out already selected products from search results
          const filtered = (data.items || []).filter(
            (item: Product) => !selectedIds.includes(item.id)
          );
          setSearchResults(filtered);
        }
      } catch (err) {
        console.error("Product search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, value]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addProduct = (product: Product) => {
    const nextIds = [...selectedIds, product.id];
    setValue(nextIds);
    setSelectedProducts([...selectedProducts, product]);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const removeProduct = (id: string) => {
    const nextIds = selectedIds.filter((x) => x !== id);
    setValue(nextIds);
    setSelectedProducts(selectedProducts.filter((x) => x.id !== id));
  };

  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(priceCents / 100);
  };

  return (
    <div className="field-type w-full mb-6 font-sans">
      <div className="mb-2">
        <span className="text-sm font-semibold text-neutral-300 block mb-1">
          Featured Products
        </span>
        <span className="text-xs text-neutral-400">
          Search and link products from the database to feature in this article.
        </span>
      </div>

      {/* Selected Products List */}
      <div className="space-y-2 mb-3">
        {selectedProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              {product.featuredImage ? (
                <img
                  src={product.featuredImage}
                  alt={product.title}
                  className="w-12 h-12 rounded object-cover bg-neutral-900 border border-neutral-700"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[10px] text-neutral-500">
                  No Image
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-neutral-100 line-clamp-1 max-w-md">
                  {product.title}
                </h4>
                <div className="flex gap-3 text-xs text-neutral-400 mt-0.5">
                  <span>SKU: {product.supplierSku}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeProduct(product.id)}
              className="p-1.5 rounded-md text-neutral-400 hover:text-red-400 hover:bg-neutral-700 transition-colors"
              title="Remove product link"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {isLoadingDetails && (
          <div className="flex items-center justify-center py-4 text-xs text-neutral-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading selected products...
          </div>
        )}

        {!isLoadingDetails && selectedProducts.length === 0 && (
          <div className="text-center py-6 border border-dashed border-neutral-700 rounded-lg text-xs text-neutral-500 bg-neutral-800/20">
            No products featured yet. Search below to add one.
          </div>
        )}
      </div>

      {/* Search Input Box */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products by title or SKU..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {showDropdown && (searchQuery.length >= 2 || searchResults.length > 0) && (
          <div className="absolute z-50 w-full mt-1.5 rounded-lg border border-neutral-700 bg-neutral-900 shadow-xl max-h-60 overflow-y-auto">
            {isSearching && searchResults.length === 0 && (
              <div className="py-4 text-center text-xs text-neutral-500">
                Searching database...
              </div>
            )}

            {!isSearching && searchResults.length === 0 && searchQuery.length >= 2 && (
              <div className="py-4 text-center text-xs text-neutral-500">
                No matching products found.
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="p-1 space-y-0.5">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addProduct(product)}
                    className="w-full flex items-center justify-between text-left p-2 rounded hover:bg-neutral-800 text-neutral-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {product.featuredImage ? (
                        <img
                          src={product.featuredImage}
                          alt={product.title}
                          className="w-8 h-8 rounded object-cover bg-neutral-950"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-neutral-950 flex items-center justify-center text-[8px] text-neutral-600">
                          N/A
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-medium block truncate max-w-[280px]">
                          {product.title}
                        </span>
                        <span className="text-[10px] text-neutral-500 block leading-tight">
                          SKU: {product.supplierSku}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-emerald-400">
                        {formatPrice(product.price)}
                      </span>
                      <div className="p-1 rounded bg-neutral-800 text-neutral-400 group-hover:text-neutral-200">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
