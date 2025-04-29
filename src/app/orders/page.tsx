"use client";
import React, { useState } from "react";

// Dummy Types
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
  // Dummy orders
  const [orders, setOrders] = useState<OrderResponse[]>([
    {
      orderId: "order123",
      customerId: "cust001",
      restaurantId: "rest001",
      deliveryId: "del001",
      status: "Pending",
      totalPrice: 29.99,
      items: [
        { menuId: "menu001", quantity: 2, price: 9.99 },
        { menuId: "menu002", quantity: 1, price: 10.01 },
      ],
    },
    {
      orderId: "order124",
      customerId: "cust002",
      restaurantId: "rest002",
      deliveryId: "del002",
      status: "Pending",
      totalPrice: 19.99,
      items: [
        { menuId: "menu003", quantity: 1, price: 19.99 },
      ],
    },
  ]);

  const handleAcceptOrder = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: "Accepted" } : order
      )
    );
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Orders Page</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Total Price</th>
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
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    {order.status === "Pending" ? (
                      <button
                        onClick={() => handleAcceptOrder(order.orderId)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Accept Order
                      </button>
                    ) : (
                      <span className="text-green-600 font-semibold">Accepted</span>
                    )}
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
