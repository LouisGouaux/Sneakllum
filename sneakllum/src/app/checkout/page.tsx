"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, fetchCart } = useCart();
  const { token } = useUser();
  const [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
  });
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleChange = (field: string, value: string) => {
    setUserDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckout = async () => {
    if (
      !userDetails.firstname ||
      !userDetails.lastname ||
      !userDetails.email ||
      !userDetails.phone ||
      !userDetails.address
    ) {
      alert("Please fill out all fields before checking out.");
      return;
    }

    const orderData = {
      user_first_name: userDetails.firstname,
      user_last_name: userDetails.lastname,
      user_email: userDetails.email,
      user_phone: userDetails.phone,
      shipping_address: userDetails.address,
    };

    const url = token
      ? "https://5b8cmbmlsw.preview.infomaniak.website/api/user/orders"
      : "https://5b8cmbmlsw.preview.infomaniak.website/api/orders";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          "Accept": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderNumber(data.data.order_number);
        setShowModal(true);
      } else {
        const errorText = await response.text();
        console.error("Error during checkout:", errorText);
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity ?? 1),
    0
  );

  const handleModalClose = () => {
    router.push(`/orders`);
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center p-6">
      <div className="w-full max-w-3xl text-left">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Cart Items */}
        {cart.length > 0 ? (
          <div className="w-full max-w-3xl">
            <div className="mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center border-b pb-4 mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h2 className="font-bold">{item.name}</h2>
                    <p className="text-gray-600">Price: ${(item.price / 100).toFixed(2)}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Total */}
            <div className="mb-6 text-lg font-semibold">
              Total: ${(cartTotal / 100).toFixed(2)}
            </div>

            {/* Checkout Form */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Your Details</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="firstname" className="block font-semibold mb-1">First name</label>
                  <input
                    type="text"
                    id="firstname"
                    value={userDetails.firstname}
                    onChange={(e) => handleChange("firstname", e.target.value)}
                    className="border p-2 rounded w-full mx-auto"
                  />
                </div>
                <div>
                  <label htmlFor="lastname" className="block font-semibold mb-1">Last name</label>
                  <input
                    type="text"
                    id="lastname"
                    value={userDetails.lastname}
                    onChange={(e) => handleChange("lastname", e.target.value)}
                    className="border p-2 rounded w-full mx-auto"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={userDetails.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="border p-2 rounded w-full mx-auto"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block font-semibold mb-1">Phone number</label>
                  <input
                    type="text"
                    id="phone"
                    value={userDetails.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="border p-2 rounded w-full mx-auto"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block font-semibold mb-1">Address</label>
                  <textarea
                    id="address"
                    value={userDetails.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="border p-2 rounded w-full mx-auto"
                  />
                </div>
              </form>
            </div>

            <Button
              label="Complete Checkout"
              variant="primary"
              onClick={handleCheckout}
              className="w-full lg:w-1/4 mx-auto ml-0"
            />
          </div>
        ) : (
          <div className="text-center mt-10 text-gray-600">
            Your cart is empty. Add some items to proceed with checkout.
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Order Confirmation</h2>
            <p className="text-lg mb-4">Your order has been successfully placed!</p>
            <p className="text-sm text-gray-500 mb-4">
              Order number: <span className="font-semibold">{orderNumber}</span>
            </p>
            <Button
              label="Close"
              variant="secondary"
              onClick={handleModalClose}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
