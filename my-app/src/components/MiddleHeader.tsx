"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingCart, Heart } from "lucide-react";

export default function MiddleHeader() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?query=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white">
      <Link href="/" className="text-4xl font-bold text-gray-800">
        Jewelry Store
      </Link>

      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 flex-1 max-w-6xl mx-6"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-3 w-full rounded-full border border-gray-700 focus:outline-none text-base"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-9 py-4 rounded-full hover:bg-blue-700 text-md flex items-center gap-1"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </form>

      <div className="flex items-center gap-4">
        <Link href="/wishlist" className="hover:text-blue-600">
          <Heart className="w-5 h-5" />
        </Link>
        <Link href="/cart" className="hover:text-blue-600">
          <ShoppingCart className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
