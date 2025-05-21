"use client";

import { CATEGORY_BY_SLUG, GET_PARENT_CATEGORIES } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BottomHeader() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  // Query for all categories or a specific one
  const { data, loading, error } = useQuery(
    categorySlug ? CATEGORY_BY_SLUG : GET_PARENT_CATEGORIES,
    {
      variables: categorySlug ? { slug: categorySlug } : undefined,
      fetchPolicy: "cache-first",
    }
  );

  // Set active category when data changes
  useEffect(() => {
    if (categorySlug && data?.categoryBySlug) {
      setActiveCategory(data.categoryBySlug.slug);
    } else {
      setActiveCategory(null);
    }
  }, [categorySlug, data]);

  // Handle scroll navigation
  const handleScroll = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const scrollAmount = 200; // Adjust scroll amount as needed
      const newPosition = direction === 'right' 
        ? scrollPosition + scrollAmount
        : scrollPosition - scrollAmount;
      
      navRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  // Handle loading and error states
  if (loading) return <div className="h-12 bg-white"></div>;
  if (error) {
    console.error("Error fetching categories:", error);
    return <div className="h-12 bg-white text-red-500">Error loading categories</div>;
  }

  // Get categories to display
  const categoriesToDisplay = categorySlug && data?.categoryBySlug
    ? [data.categoryBySlug]
    : data?.parentCategories || [];

  return (
    <div className="relative bg-white">
      {/* Left scroll button */}
      <button 
        onClick={() => handleScroll('left')}
        className="absolute left-0 top-0 h-full w-8 flex items-center justify-center bg-white z-10 hover:bg-gray-50"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>

      {/* Navigation container */}
      <div 
        ref={navRef}
        className="flex justify-center items-center pb-3 gap-x-6 md:gap-x-8 px-10 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide"
      >
        <Link 
          href="/products" 
          className={`hover:underline ${!activeCategory ? "text-gray-900 font-semibold" : "text-gray-800"}`}
        >
          All Products
        </Link>
        
        {categoriesToDisplay.map((cat: { slug: string; name: string }) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className={`hover:underline ${activeCategory === cat.slug ? "text-blue-600" : "text-gray-800 font-semibold"}`}
          >
            {cat.name}
          </Link>
        ))}
        
      </div>

      {/* Right scroll button */}
      <button 
        onClick={() => handleScroll('right')}
        className="absolute right-0 top-0 h-full w-8 flex items-center justify-center bg-white z-10 hover:bg-gray-50"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
}