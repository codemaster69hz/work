/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@apollo/client";
import { GET_EVERY_ORDER_BY_USER } from "../../graphql/queries";
import { formatCurrency } from "../../lib/formatCurrency";
import { useCurrency } from "../../providers/CurrencyContext";
import TopHeader from "../../components/TopHeader";
import MiddleHeader from "../../components/MiddleHeader";
import Footer from "../../components/Footer";
import Link from "next/link";

const UserOrdersPage = () => {
  const { currency } = useCurrency();
  const { data, loading, error } = useQuery(GET_EVERY_ORDER_BY_USER);

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
        Failed to load orders. Please try again later.
      </div>
    );
  }

  const orders = data?.getOrders || [];

  return (
    <>
      <TopHeader />
      <MiddleHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="mt-1 text-sm text-gray-500">
              View your order history and track current shipments
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
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
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No orders yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by placing your first order.
              </p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map((order: any) => (
                <div key={order.id} className="px-6 py-5 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center">
                        <h2 className="text-lg font-medium text-gray-900 mr-3">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </h2>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(order.total, currency)}
                      </p>
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View details
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="sr-only">Items</h3>
                    <ul className="divide-y divide-gray-200">
                      {order.items.slice(0, 2).map((item: any) => (
                        <li key={item.id} className="py-4 flex">
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
                            
                          </div>
                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {item.product.name}
                              </h4>
                              {item.variation?.size && (
                                <p className="mt-1 text-sm text-gray-500">
                                  Size: {item.variation.size}
                                </p>
                              )}
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <p className="text-gray-500">
                                Qty: {item.quantity}
                              </p>
                              <p className="font-medium text-gray-900">
                                {formatCurrency(item.price, currency)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {order.items.length > 2 && (
                      <div className="mt-2 text-sm text-gray-500">
                        +{order.items.length - 2} more items
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:justify-between">
                    <div className="text-sm">
                      {/* <p className="text-gray-500">
                        <span className="font-medium">Shipping address:</span>{" "}
                        {order.shippingAddress.street}, {order.shippingAddress.city}
                      </p> */}
                    </div>
                    <div className="mt-3 sm:mt-0">
                      <Link
                        href={`/orders/${order.id}/track`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Track order
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserOrdersPage;