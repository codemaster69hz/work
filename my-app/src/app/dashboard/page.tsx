/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ME_QUERY } from "../../graphql/queries";
import { redirect } from "next/navigation";
import Slider from "../../components/sliderforSeller";
import TopHeader from "../../components/TopHeader";
import Footer from "../../components/Footer";
import SearchBar from "../../components/SearchBar";

export default function Dashboard() {
  const { data, loading } = useQuery(ME_QUERY);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [sortDate, setSortDate] = useState<"asc" | "desc" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!data?.me) {
    redirect("/auth/selllogin");
  }

  // Filter products by search term
  const filteredProducts = data.me.products.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by price
  if (sortOrder === "asc") {
    filteredProducts.sort((a: { price: number; }, b: { price: number; }) => a.price - b.price);
  } else if (sortOrder === "desc") {
    filteredProducts.sort((a: { price: number; }, b: { price: number; }) => b.price - a.price);
  }

  // Sort by date
  if (sortDate === "asc") {
    filteredProducts.sort((a: { createdAt: any; }, b: { createdAt: any; }) => Number(a.createdAt) - Number(b.createdAt));
  } else if (sortDate === "desc") {
    filteredProducts.sort((a: { createdAt: any; }, b: { createdAt: any; }) => Number(b.createdAt) - Number(a.createdAt));
  }

  const toggleSort = () => {
    setSortOrder((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
    );
    setSortDate((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
    );
  };

  const renderSortIcon = () => {
    if (sortOrder === "asc" || sortDate === "asc") return "↑";
    if (sortOrder === "desc" || sortDate === "desc") return "↓";
    return "⇅";
  };

  return (
    <>
      <TopHeader />
      {/* <MiddleHeader /> */}
      <SearchBar onSellerSearch={setSearchTerm} />
      <div className="h-screen flex flex-col bg-gray-50">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Slider/>
          {/* Main Content */}
          <main className="flex-1 p-6 bg-white overflow-x-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome, {data.me.username}!
            </h1>
            <p className="text-gray-600 mb-4">
              Email: {data.me.email} | Verified:{" "}
              <span
                className={
                  data.me.isEmailVerified ? "text-green-600" : "text-red-600"
                }
              >
                {data.me.isEmailVerified ? "Yes" : "No"}
              </span>
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Products
            </h2>

            {filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="min-w-[1000px] bg-white shadow-md rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 font-semibold">
                      <tr>
                        <th className="p-3">Sr No</th>
                        <th className="p-3">Image</th>
                        <th className="p-3">Name</th>
                        <th
                          className="p-3 cursor-pointer select-none"
                          onClick={toggleSort}
                        >
                          Created At{" "}
                          <span className="ml-1">{renderSortIcon()}</span>
                        </th>
                        <th
                          className="p-3 cursor-pointer select-none"
                          onClick={toggleSort}
                        >
                          Price ($) <span className="ml-1">{renderSortIcon()}</span>
                        </th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {filteredProducts.map((product: any, idx: number) => (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="p-3">{idx + 1}</td>
                          <td className="p-3">
                            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md text-xs text-gray-400">
                              Image
                            </div>
                          </td>
                          <td className="p-3 font-medium">{product.name}</td>
                          <td className="p-3">
                            {new Date(Number(product.createdAt)).toLocaleDateString()}
                          </td>
                          <td className="p-3 font-semibold">${product.price}</td>
                          <td className="p-3">{product.category?.name || "-"}</td>
                          <td className="p-3 space-x-2">
                            <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs transition">
                              Edit
                            </button>
                            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs transition">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No products found.</p>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
