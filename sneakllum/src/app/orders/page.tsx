"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  order_number: string;
  products: Product[];
  total_amount: number;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  user_phone: string;
  status?: string;
}

export default function OrdersPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const { token } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      const fetchUserOrders = async () => {
        try {
          const response = await fetch("https://5b8cmbmlsw.preview.infomaniak.website/api/user/orders", {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserOrders(data.data);
          } else {
            console.error("Failed to fetch user orders.");
          }
        } catch (error) {
          console.error("Error fetching user orders:", error);
        }
      };
      fetchUserOrders();
    }
  }, [token]);

  const handleSearchOrder = async () => {
    if (!orderNumber || !userLastName) {
      alert("Please enter a valid order number and last name.");
      return;
    }

    try {
      const response = await fetch(
        `https://5b8cmbmlsw.preview.infomaniak.website/api/orders?order_number=${orderNumber}&user_last_name=${userLastName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data.data);
        router.push(`/order/${orderNumber}`);
      } else {
        console.error("Order not found.");
        alert("Order not found.");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order Search and History</h1>

      {/* Order Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter your order number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Enter your last name"
          value={userLastName}
          onChange={(e) => setUserLastName(e.target.value)}
          className="border p-2 rounded w-full mt-4"
        />
        <Button
          label="Search Order"
          onClick={handleSearchOrder}
          variant="primary"
          className="mt-4"
        />
      </div>

      {/* Display Order Details */}
      {orderDetails && (
        <div className="mb-6 p-4 bg-white border rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          <p><strong>Order Number:</strong> {orderDetails.order_number}</p>
          <p><strong>Customer Name:</strong> {orderDetails.user_first_name} {orderDetails.user_last_name}</p>
          <p><strong>Email:</strong> {orderDetails.user_email}</p>
          <p><strong>Phone:</strong> {orderDetails.user_phone}</p>
          <p><strong>Total:</strong> ${(orderDetails.total_amount / 100).toFixed(2)}</p>

          <h3 className="text-lg font-semibold mt-4 mb-2">Products:</h3>
          <ul>
            {orderDetails.products.map((product) => (
              <li key={product.id} className="mb-4 p-4 bg-gray-100 border rounded">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded mb-2" />
                <p><strong>Name:</strong> {product.name}</p>
                <p><strong>Quantity:</strong> {product.quantity}</p>
                <p><strong>Price:</strong> ${(product.price / 100).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display User Order History */}
      {userOrders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Your Order History</h2>
          <ul>
            {userOrders.map((order) => (
              <li key={order.order_number} className="mb-4 p-4 bg-gray-100 border rounded">
                <p><strong>Order Number:</strong> {order.order_number}</p>
                <p><strong>Customer Name:</strong> {order.user_first_name} {order.user_last_name}</p>
                <p><strong>Total:</strong> ${(order.total_amount / 100).toFixed(2)}</p>
                <Button
                  label="View Order"
                  onClick={() => {
                    setOrderNumber(order.order_number);
                    setUserLastName(order.user_last_name);
                    handleSearchOrder();
                  }}
                  variant="secondary"
                  className="mt-2"
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Message when there are no orders */}
      {userOrders.length === 0 && token && (
        <div className="text-center text-gray-600">
          You have no past orders.
        </div>
      )}

      {/* Message when user is not logged in */}
      {!token && (
        <div className="text-center text-gray-600">
          Please <a href="/login" className="text-blue-500">login</a> to view your order history.
        </div>
      )}
    </div>
  );
}
