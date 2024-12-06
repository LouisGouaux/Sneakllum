"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface CartItem {
    id: number;
    size?: { id: number; value: number } | null;
    color?: { id: number; value: string } | null;
    size_id?: number | null;
    color_id?: number | null;
    quantity: number | null;
    name: string;
    price: number;
    image: string;
}

interface RawCartItem {
    id: number;
    size?: { id: number; value: number } | null;
    color?: { id: number; value: string } | null;
    quantity?: number | null;
    name?: string;
    price?: number;
    image?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => Promise<void>;
    updateQuantity: (id: number, sizeId: number | null, colorId: number | null, quantity: number) => void;
    removeFromCart: (id: number, sizeId: number | null, colorId: number | null, quantity?: number | null) => void;
    clearCart: () => void;
    fetchCart: () => Promise<void>;
    loading: boolean;
    transferCartToDb: (token: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    const mapRawCartData = (data: RawCartItem[]): CartItem[] =>
        data.map((item): CartItem => ({
            id: item.id,
            size: item.size ?? null,
            color: item.color ?? null,
            size_id: item.size?.id ?? null,
            color_id: item.color?.id ?? null,
            quantity: item.quantity ?? null,
            name: item.name ?? "Unknown",
            price: item.price ?? 0,
            image: item.image ?? "",
        }));

    const fetchCart = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCart(mapRawCartData(storedCart));
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("https://5b8cmbmlsw.preview.infomaniak.website/api/basket", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                const data: RawCartItem[] = await response.json();
                setCart(mapRawCartData(data));
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const transferCartToDb = useCallback(async (token: string) => {
    const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart") || "[]");

    const cartToSend = cartFromLocalStorage.map((item: CartItem) => ({
        product_id: item.id,
        size_id: item.size_id,
        color_id: item.color_id,
        quantity: item.quantity ?? 1,
    }));

    if (cartToSend.length > 0) {
        console.log("Transfert du panier vers la DB avec les bonnes données", cartToSend);
        try {
            const response = await fetch("https://5b8cmbmlsw.preview.infomaniak.website/api/basket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify(cartToSend),
            });

            if (response.ok) {
                console.log("Panier ajouté à la DB avec succès");
                localStorage.removeItem("cart");
                fetchCart();
            } else {
                const errorText = await response.text();
                console.error("Erreur lors de l'envoi du panier à la DB:", errorText);
            }
        } catch (error) {
            console.error("Erreur pendant le transfert du panier vers la DB :", error);
        }
    }
}, [fetchCart]);

    const addToCart = useCallback(
        async (item: CartItem) => {
            const token = localStorage.getItem("token");
            if (!token) {
                const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
                localStorage.setItem("cart", JSON.stringify([...currentCart, item]));
                return;
            }

            const payload = [
                {
                    product_id: item.id,
                    size_id: item.size_id,
                    color_id: item.color_id,
                    quantity: item.quantity ?? 1,
                },
            ];

            try {
                const response = await fetch("https://5b8cmbmlsw.preview.infomaniak.website/api/basket", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) await fetchCart();
            } catch (error) {
                console.error("Error adding item to cart:", error);
            }
        },
        [fetchCart]
    );

    const updateQuantity = useCallback(
    async (id: number, sizeId: number | null, colorId: number | null, quantity: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = currentCart.map((item: CartItem) =>
        item.id === id && item.size_id === sizeId && item.color_id === colorId
          ? { ...item, quantity }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      return;
    }

    const payload = [{ product_id: id, size_id: sizeId, color_id: colorId, quantity }];

    try {
      const response = await fetch("https://5b8cmbmlsw.preview.infomaniak.website/api/basket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  },
  [fetchCart]
);

    const removeFromCart = useCallback(
        async (id: number, sizeId: number | null, colorId: number | null, quantity: number | null = 1) => {
            const token = localStorage.getItem("token");
            if (!token || !colorId) return;

            const payload = [{ product_id: id, size_id: sizeId ?? null, color_id: colorId, quantity }];

            try {
                const response = await fetch("https://5b8cmbmlsw.preview.infomaniak.website/api/basket", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) await fetchCart();
            } catch (error) {
                console.error("Error removing item:", error);
            }
        },
        [fetchCart]
    );

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                fetchCart,
                loading,
                transferCartToDb,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider.");
    }
    return context;
};
