/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@apollo/client";
import { GET_USER_ORDERS, WE_QUERY } from "../../../graphql/queries";
import { useCurrency } from "../../../providers/CurrencyContext";
// import { convertPrice } from "../../../lib/currencyConverter";
import { formatCurrency } from "../../../lib/formatCurrency";
import TopHeader from "../../../components/TopHeader";
import MiddleHeader from "../../../components/MiddleHeader";
import Footer from "../../../components/Footer";
import Link from "next/link";
// import Slider from "../../../components/sliderforSeller";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserOrdersIdPage(){
  const { currency } = useCurrency();
  // const params = useParams();
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  // const orderId = typeof params?.orderId === "string" ? params.orderId[0] : null;
  const orderId = useParams()?.id?? null;
  const  { data, loading, error } = useQuery(GET_USER_ORDERS, {
    variables: { id: orderId },
    skip: !orderId
  });
  const  { data: addressData } = useQuery(WE_QUERY);
  const order = data?.getOrder;
  const addresses = addressData?.we?.addresses || [];

  useEffect(() => {
      const date = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
      setDeliveryDate(date.toLocaleDateString());
    }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">
        Failed to load orders: {error.message}
      </div>
    );
  }

  return (
    <>
      <TopHeader />
      <MiddleHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* <Slider /> */}
          <header className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                <p className="mt-1 text-sm text-gray-500">
                  View your order information and tracking status
                </p>
              </div>
              <Link
                href="/orders"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                ← Back to all orders
              </Link>
            </div>
          </header>

          {!order ? (
            <section className="text-center py-16">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No order found</h3>
              <p className="mt-1 text-sm text-gray-500">
                We couldn&apos;t find any order matching this ID: {orderId}
              </p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Browse Products
                </Link>
              </div>
            </section>
          ) : (
            <section className="px-6 py-5">
              <div className="flex flex-col md:flex-row md:justify-between gap-6">
                {/* Order Info */}
                <div className="flex-1">
                  <header className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-gray-900">
                      {/* Order #{order.id.slice(-8).toUpperCase()} */}
                    </h2>
                  </header>

                  <section className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h3>
                    <ul className="divide-y divide-gray-200">
                      {order.items.map((item: any) => (
                        <li key={item.id} className="py-3 flex items-start">
                          <div className="w-16 h-16 bg-gray-200 rounded-md mr-4" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product.name}
                            </p>
                            {item.variation?.size && (
                              <p className="text-xs text-gray-500 mt-1">Size: {item.variation.size}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(item.price, currency)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Total</p>
                        <p>{formatCurrency(order.total, currency)}</p>
                      </div>
                    </div>
                  </section>

                  <section className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Shipping Information</h3>
                    {addresses.length > 0 ? (
                      addresses.map((addr: any, index: number) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {addr.streetAddress}
                                {addr.streetAddress2 && `, ${addr.streetAddress2}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {addr.city}, {addr.state}, {addr.country} {addr.zipcode}
                              </p>
                            </div>
                            <Link
                              href={`/address/updateaddress?id=${addr.id}`}
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">No shipping address found</p>
                        <Link
                          href="/address"
                          className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Add shipping address
                        </Link>
                      </div>
                    )}
                  </section>
                </div>

                {/* Order Timeline & Support */}
                <aside className="md:w-64 lg:w-80 space-y-4">
                  <section className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Order Timeline</h3>
                    <ul className="-mb-8">
                      {[
                        { label: "Order placed", description: new Date(order.createdAt).toLocaleDateString(), done: true },
                        { label: "Processing", description: "Your order is being prepared", done: false },
                        { label: "Shipped", description: "Your order is on the way", done: false },
                        {
                          label: "Delivered",
                          description: `Expected by ${deliveryDate}`
                        },
                      ].map((step, idx) => (
                        <li key={idx} className="relative pb-8">
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-6 w-6 rounded-full flex items-center justify-center ${
                                  step.done ? "bg-indigo-600 text-white" : "bg-gray-300 text-gray-500"
                                }`}
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={step.done ? "M5 13l4 4L19 7" : "M12 8v4l3 3"}
                                  />
                                </svg>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-0.5">
                              <p className="text-sm text-gray-900">
                                <span className="font-medium">{step.label}</span>
                              </p>
                              <p className="text-xs text-gray-500">{step.description}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Need Help?</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      If you have any questions about your order, please contact our customer service.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Contact Support
                    </Link>
                  </section>
                </aside>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};
