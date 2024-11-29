"use client";
import React, { useState } from "react";
import Button from "../../components/Button";

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export default function CheckoutPage() {
    const [cart, setCart] = useState<CartItem[]>([
        {
            id: 1,
            name: "Product A",
            price: 2500, // Price in cents
            quantity: 2,
            image: "https://via.placeholder.com/100",
        },
        {
            id: 2,
            name: "Product B",
            price: 1500,
            quantity: 1,
            image: "https://via.placeholder.com/100",
        },
    ]);

    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        address: "",
    });

    const handleChange = (field: string, value: string) => {
        setUserDetails((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCheckout = () => {
        if (!userDetails.name || !userDetails.email || !userDetails.address) {
            alert("Please fill out all fields before checking out.");
            return;
        }

        // Simulate sending data to server
        console.log("Checkout data:", { cart, userDetails });

        alert("Checkout successful! Thank you for your purchase.");
        setCart([]); // Clear the cart after checkout
    };

    const cartTotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <div className="w-screen h-screen p-6 flex flex-col">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {/* Cart Items */}
            {cart.length > 0 ? (
                <>
                    <div className="mb-6">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center border-b pb-4 mb-4"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-md mr-4"
                                />
                                <div className="flex-1">
                                    <h2 className="font-bold">{item.name}</h2>
                                    <p className="text-gray-600">Price: ${(item.price / 100).toFixed(2)}</p>
                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="font-semibold">
                                        Subtotal: ${(item.price * item.quantity / 100).toFixed(2)}
                                    </p>
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
                                <label className="block font-semibold mb-1">Name</label>
                                <input
                                    type="text"
                                    value={userDetails.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Email</label>
                                <input
                                    type="email"
                                    value={userDetails.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Address</label>
                                <textarea
                                    value={userDetails.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                        </form>
                    </div>

                    <Button
                        label="Complete Checkout"
                        variant="primary"
                        onClick={handleCheckout}
                        className="w-full"
                    />
                </>
            ) : (
                <div className="text-center mt-10 text-gray-600">
                    Your cart is empty. Add some items to proceed with checkout.
                </div>
            )}
        </div>
    );
}
