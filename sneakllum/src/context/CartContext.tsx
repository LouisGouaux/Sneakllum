"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Cart item type
interface CartItem {
    id: number;
    name: string;
    price: number;
    size: number;
    quantity: number;
    image: string;
    color: string;
}

// Cart context type
interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    updateQuantity: (id: number, size: number, quantity: number) => void;
    removeFromCart: (id: number, size: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (i) => i.id === item.id && i.size === item.size
            );
            if (existingItem) {
                return prevCart.map((i) =>
                    i.id === item.id && i.size === item.size
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prevCart, item];
        });
    };

    const updateQuantity = (id: number, size: number, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id && item.size === size
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            )
        );
    };

    const removeFromCart = (id: number, size: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id || item.size !== size));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the cart

export const useCart = () => {

    const context = useContext(CartContext);

    if (!context) {

        throw new Error("useCart must be used within a CartProvider");

    }

    return context;

};