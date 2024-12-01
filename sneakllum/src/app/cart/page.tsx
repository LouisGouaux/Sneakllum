"use client";
import React, { useEffect, useState, useMemo } from "react";
import Button from "../../components/Button";
import GrouppedButtons from "../../components/GrouppedButtons";
import Input from "../../components/Input";
import { IoTrashBin } from "react-icons/io5";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

function debounce<T extends (...args: Parameters<T>) => void>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

export default function CartPage() {
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, fetchCart, loading } = useCart();
    const [localQuantities, setLocalQuantities] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        if (!loading) {
            const initialQuantities: { [key: string]: number } = {};
            cart.forEach((item) => {
                const key = `${item.id}-${item.size?.id}-${item.color?.id}`;
                initialQuantities[key] = item.quantity ?? 1;
            });
            setLocalQuantities(initialQuantities);
        }
    }, [cart, loading]);

    const debouncedQuantitySubmit = useMemo(
        () =>
            debounce(
                (itemId: number, sizeId: number | null, colorId: number | null, quantity: number): void => {
                    updateQuantity(itemId, sizeId, colorId, quantity);
                },
                500
            ),
        [updateQuantity]
    );

    const handleQuantityChange = (key: string, value: number) => {
        setLocalQuantities((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const filteredCart = cart.filter((item) => item.id !== -1);
    const totalPrice = filteredCart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-2">
                        {filteredCart.length > 0 ? (
                            filteredCart.map((item) => {
                                const key = `${item.id}-${item.size?.id}-${item.color?.id}`;
                                const localQuantity = localQuantities[key] ?? item.quantity ?? 1;

                                return (
                                    <div
                                        key={key}
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
                                                ${item.price} - Size: {item.size?.value} - Color: {item.color?.value}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <GrouppedButtons>
                                                <Button
                                                    label="-"
                                                    onClick={() => {
                                                        const newQuantity = Math.max(localQuantity - 1, 1);
                                                        handleQuantityChange(key, newQuantity);
                                                        updateQuantity(
                                                            item.id,
                                                            item.size?.id ?? null,
                                                            item.color?.id ?? null,
                                                            newQuantity
                                                        );
                                                    }}
                                                    variant="secondary"
                                                    className="px-2 py-1"
                                                />
                                                <Input
                                                    type="number"
                                                    className="w-16 text-center"
                                                    variant="secondary"
                                                    value={localQuantities[key]?.toString() || (item.quantity || 1).toString()}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value, 10);
                                                        if (!isNaN(value)) {
                                                            handleQuantityChange(key, value);
                                                            debouncedQuantitySubmit(item.id, item.size?.id ?? null, item.color?.id ?? null, value);
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    label="+"
                                                    onClick={() => {
                                                        const newQuantity = localQuantity + 1;
                                                        handleQuantityChange(key, newQuantity);
                                                        updateQuantity(
                                                            item.id,
                                                            item.size?.id ?? null,
                                                            item.color?.id ?? null,
                                                            newQuantity
                                                        );
                                                    }}
                                                    variant="secondary"
                                                    className="px-2 py-1"
                                                />
                                            </GrouppedButtons>
                                        </div>
                                        <Button
                                            icon={<IoTrashBin />}
                                            onClick={() =>
                                                removeFromCart(
                                                    item.id,
                                                    item.size?.id ?? null,
                                                    item.color?.id ?? null,
                                                    item.quantity ?? 1
                                                )
                                            }
                                            variant="alert"
                                            className="w-10 h-10 ml-2"
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500">Your cart is empty.</p>
                        )}
                    </div>
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
                        <Button
                            label="Checkout"
                            variant="primary"
                            className="w-full mt-6"
                            onClick={() => router.push(`/checkout`)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
