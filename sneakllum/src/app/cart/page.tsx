"use client";
import React from "react";
import Button from "../../components/Button";
import GrouppedButtons from "../../components/GrouppedButtons";
import Input from "../../components/Input";
import { IoTrashBin } from "react-icons/io5";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart } = useCart(); // Use context

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="col-span-2">
                    {cart.length > 0 ? (
                        cart.map((item) => (
                            <div
                                key={`${item.id}-${item.size}`}
                                className="flex items-center justify-between border-b border-gray-200 py-4"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1 ml-4">
                                    <h2 className="text-lg font-bold">{item.name}</h2>
                                    <p className="text-gray-600">
                                        ${item.price} - Size: {item.size}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <GrouppedButtons>
                                        <Button
                                            label="-"
                                            onClick={() =>
                                                updateQuantity(item.id, item.size, item.quantity - 1)
                                            }
                                            variant="secondary"
                                            className="px-2 py-1"
                                        />
                                        <Input
                                            type="number"
                                            className="w-16 text-center"
                                            variant="secondary"
                                            value={item.quantity.toString()}
                                            onChange={(e) =>
                                                updateQuantity(
                                                    item.id,
                                                    item.size,
                                                    parseInt(e.target.value, 10)
                                                )
                                            }
                                        />
                                        <Button
                                            label="+"
                                            onClick={() =>
                                                updateQuantity(item.id, item.size, item.quantity + 1)
                                            }
                                            variant="secondary"
                                            className="px-2 py-1"
                                        />
                                    </GrouppedButtons>
                                </div>
                                <Button
                                    icon={<IoTrashBin />}
                                    onClick={() => removeFromCart(item.id, item.size)}
                                    variant="alert"
                                    className="w-10 h-10 ml-2"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Your cart is empty.</p>
                    )}
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
