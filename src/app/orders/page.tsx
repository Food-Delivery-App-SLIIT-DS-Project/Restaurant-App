"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  getOrdersByRestaurantId,
  updateOrderStatus,
  setOrderPreparing,
  setOrderWaitingForPickup,
} from "../api/orderApi";

interface OrderItem {
  menuId: string;
  quantity: number;
  price: number;
}

interface OrderResponse {
  orderId: string;
  customerId: string;
  restaurantId: string;
  deliveryId: string;
  status: string;
  totalPrice: number;
  items: OrderItem[];
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  let restaurantId: string | null = null;

  try {
    const raw = Cookies.get("restaurantIds") || "[]";
    const restaurantIds = JSON.parse(raw);
    if (Array.isArray(restaurantIds) && restaurantIds.length > 0) {
      restaurantId = restaurantIds[0];
    } else {
      throw new Error("No restaurant ID found");
    }
  } catch (e) {
    console.error("Failed to parse restaurantIds from cookies", e);
    restaurantId = null;
  }

  const fetchOrders = async () => {
    if (!restaurantId) {
      setError("Restaurant ID not available.");
      setLoading(false);
      return;
    }

    try {
      const data = await getOrdersByRestaurantId(restaurantId);
      setOrders(data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderLocally = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "Accepted");
      updateOrderLocally(orderId, "Accepted");
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const handlePreparing = async (orderId: string) => {
    try {
      await setOrderPreparing(orderId);
      updateOrderLocally(orderId, "PREPARING");
    } catch (err) {
      console.error("Failed to set order to PREPARING:", err);
    }
  };

  const handleWaitingForPickup = async (orderId: string) => {
    try {
      await setOrderWaitingForPickup(orderId);
      updateOrderLocally(orderId, "WAITING_FOR_PICKUP");
    } catch (err) {
      console.error("Failed to set order to WAITING_FOR_PICKUP:", err);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Orders Page</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : orders && orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Total Price</th>
                <th className="py-2 px-4 border-b">Items</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="text-center">
                  <td className="py-2 px-4 border-b">{order.orderId}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        order.status === "Accepted"
                          ? "bg-green-100 text-green-700"
                          : order.status === "PREPARING"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "WAITING_FOR_PICKUP"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    Rs.{order.totalPrice.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    <ul className="list-disc ml-4">
                      {order.items?.map((item, index) => (
                        <li key={index}>
                          <span className="font-medium">{item.menuId}</span> - Qty:{" "}
                          {item.quantity}
                        </li>
                      )) || <li>No items</li>}
                    </ul>
                  </td>
                  <td className="py-2 px-4 border-b space-y-2">
                    {order.status === "Pending" && (
                      <button
                        onClick={() => handleAcceptOrder(order.orderId)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm block w-full"
                      >
                        Accept
                      </button>
                    )}
                    <button
                      onClick={() => handlePreparing(order.orderId)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm block w-full"
                    >
                      Accept and Prepare
                    </button>
                    <button
                      onClick={() => handleWaitingForPickup(order.orderId)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm block w-full"
                    >
                      Set to Pickup
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
