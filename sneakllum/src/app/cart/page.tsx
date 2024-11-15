"use client";
import React, { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { IoTrashBin } from "react-icons/io5";

interface CartItem {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: "Nike Air Force 1",
            image: "https://via.placeholder.com/150",
            price: 150,
            quantity: 1,
        },
        {
            id: 2,
            name: "Nike Air Max 270",
            image: "https://via.placeholder.com/150",
            price: 180,
            quantity: 1,
        },
    ]);

    const updateQuantity = (id: number, quantity: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="col-span-2">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between border-b border-gray-200 py-4"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1 ml-4">
                                <h2 className="text-lg font-bold">{item.name}</h2>
                                <p className="text-gray-600">${item.price}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    label="-"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    variant="secondary"
                                    className="px-2 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
                                />
                                <Input
                                    type="number"
                                    className="w-16 text-center border border-gray-300 rounded-lg"
                                    variant="secondary"
                                    value={item.quantity.toString()}
                                    onChange={(e) =>
                                        updateQuantity(item.id, parseInt(e.target.value, 10))
                                    }
                                />
                                <Button
                                    label="+"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    variant="secondary"
                                    className="px-2 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
                                />
                            </div>
                            <Button
                                icon={<IoTrashBin />}
                                onClick={() => removeItem(item.id)}
                                variant="alert"
                            />test
                        </div>
                    ))}
                </div>

                {/* Summary Section */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="flex justify-between text-gray-700 mb-2">
                        <p>Subtotal</p>
                        <p>${totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-gray-700 mb-2">
                        <p>Shipping</p>
                        <p>Free</p>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                        <p>Total</p>
                        <p>${totalPrice.toFixed(2)}</p>
                    </div>
                    <Button label="Checkout" variant="primary" className="w-full mt-6" />
                </div>
            </div>
        </div>
    );
}
