"use client";

import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Product {
    id: number;
    brand: string;
    name: string;
    story: string;
    gender: string;
    image: string;
    market_price: number;
    price: number;
    sizes: { id: number; value: number }[];
    colors: { id: number; value: string }[];
}

interface CartItem {
    id: number;
    size_id?: number;
    color_id?: number;
    size?: { id: number; value: number } | null;
    color?: { id: number; value: string } | null;
    quantity: number;
    name: string;
    price: number;
    image: string;
}

export default function ProductPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
    const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const router = useRouter();
    const { addToCart } = useCart();

    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await fetch(
                        `https://5b8cmbmlsw.preview.infomaniak.website/api/products/${id}`
                    );

                    if (!response.ok) {
                        throw new Error("Failed to fetch product data.");
                    }

                    const data: Product = await response.json();
                    setProduct(data);
                } catch (err) {
                    setError("Failed to load product. Please try again later.");
                    console.error(err);
                }
            };

            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = () => {
    if (!selectedSizeId || !selectedColorId || !product) {
        alert("Please select both a size and a color.");
        return;
    }

    setIsAddingToCart(true);

    const selectedSize = product.sizes.find((size) => size.id === selectedSizeId) || null;
    const selectedColor = product.colors.find((color) => color.id === selectedColorId) || null;

    if (!selectedSize || !selectedColor) {
        alert("Invalid size or color selection.");
        setIsAddingToCart(false);
        return;
    }

    const cartItem: CartItem = {
        id: product.id,
        size: selectedSize,
        color: selectedColor,
        size_id: selectedSizeId,
        color_id: selectedColorId,
        quantity: 1,
        name: product.name,
        price: product.price,
        image: product.image,
    };

    console.log("CartItem being passed to addToCart:", cartItem);
    addToCart(cartItem);

    setIsAddingToCart(false);
};

    if (!product && !error) {
        return <div className="text-center mt-10">Loading product...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    const handleBuyNow = () => {
        if (!selectedSizeId || !selectedColorId || !product) {
            alert("Please select both a size and a color.");
            return;
        }

        setIsAddingToCart(true);

        const selectedSize = product.sizes.find((size) => size.id === selectedSizeId) || null;
        const selectedColor = product.colors.find((color) => color.id === selectedColorId) || null;

        if (!selectedSize || !selectedColor) {
            alert("Invalid size or color selection.");
            setIsAddingToCart(false);
            return;
        }

        const cartItem: CartItem = {
            id: product.id,
            size: selectedSize,
            color: selectedColor,
            size_id: selectedSizeId,
            color_id: selectedColorId,
            quantity: 1,
            name: product.name,
            price: product.price,
            image: product.image,
        };

        addToCart(cartItem).then(() => {
            router.push("/cart"); // Redirection vers la page du panier
        });

        setIsAddingToCart(false);
    };

    if (!product && !error) {
        return <div className="text-center mt-10">Loading product...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return product ? (
        <div className="w-screen flex flex-col overflow-y-auto p-6 lg:px-8">
            <div className="flex flex-col lg:flex-row w-full h-auto lg:h-2/3 gap-8">
                <div className="flex justify-center lg:justify-end items-start w-full lg:w-1/2">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full lg:w-3/4 object-cover"
                />
                </div>
                <div className="flex flex-col justify-start w-full lg:w-1/2">
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{product.brand}</p>
                <p className="text-sm font-semibold text-gray-500">
                    Gender: <span className="text-gray-700">{product.gender}</span>
                </p>
                <p className="text-lg font-semibold mt-4">
                    Market Value:{" "}
                    <span className="text-blue-600">${product.market_price}</span>
                </p>
                <p className="text-lg font-semibold mt-4">
                    Price: <span className="text-blue-600">${product.price}</span>
                </p>
                <p className="text-sm text-gray-700 mt-6">{product.story}</p>
                <div className="mt-6">
                    <h3 className="text-lg font-bold mb-2">Select Color:</h3>
                    <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color) => (
                        <button
                        key={color.id}
                        onClick={() => setSelectedColorId(color.id)}
                        className={`px-4 py-2 border rounded-md ${
                            selectedColorId === color.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                        >
                        {color.value}
                        </button>
                    ))}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-bold mb-2">Select Size:</h3>
                    <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                        <button
                        key={size.id}
                        onClick={() => setSelectedSizeId(size.id)}
                        className={`px-4 py-2 border rounded-md ${
                            selectedSizeId === size.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                        >
                        {size.value}
                        </button>
                    ))}
                    </div>
                </div>
                <div className="mt-6 flex flex-col space-y-4 lg:w-5/12">
                    <Button
                    label={isAddingToCart ? "Buying..." : "Buy now"}
                    variant="primary"
                    disabled={!selectedSizeId || !selectedColorId || isAddingToCart}
                    onClick={handleBuyNow}
                    icon={isAddingToCart ? <FaCheck /> : null}
                    />
                    <Button
                    label={isAddingToCart ? "Adding..." : "Add to Cart"}
                    variant="secondary"
                    disabled={!selectedSizeId || !selectedColorId || isAddingToCart}
                    onClick={handleAddToCart}
                    icon={isAddingToCart ? <FaCheck /> : null}
                    />
                </div>
                </div>
            </div>
        </div>
    ) : null;
}