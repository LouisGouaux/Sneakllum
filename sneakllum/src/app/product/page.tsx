"use client";
import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { FaCheck } from "react-icons/fa";

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

export default function ProductPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<number | null>(null); // For selected size
    const [quantity, setQuantity] = useState<number>(0); // For quantity
    const [selectedColor, setSelectedColor] = useState<string | null>(null); // State for selected color

    const { addToCart } = useCart(); // Use Cart Context

    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    // Fetch product data from the API
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
                    const data = await response.json();
                    setProduct(data);
                } catch (err) {
                    setError("Failed to load product. Please try again later.");
                    console.error(err);
                }
            };

            fetchProduct();
        }
    }, [id]);

    // Show loading or error states
    if (!product && !error) {
        return <div className="text-center mt-10">Loading product...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    const handleAddToCart = () => {
        if (selectedSize && selectedColor) {
            addToCart({
                id: product?.id ?? 0,
                name: product?.name ?? "",
                price: product?.price ?? 0,
                size: selectedSize,
                color: selectedColor,
                quantity: quantity + 1,
                image: product?.image ?? "",
            });
            setQuantity(quantity + 1);
        } else {
            alert("Please select a size and color.");
        }
    };

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
    };

    const recommendedProducts = [
        { id: 1, name: "Adidas Ultraboost", image: "https://via.placeholder.com/150", price: 180 },
        { id: 2, name: "Puma RS-X", image: "https://via.placeholder.com/150", price: 120 },
        { id: 3, name: "Reebok Nano", image: "https://via.placeholder.com/150", price: 100 },
    ];

    // Handle size selection
    const handleSizeSelect = (size: number) => {
        setSelectedSize(size);
    };

    return (
        <div className="w-screen h-screen flex flex-col overflow-y-auto">
            {/* Main Product Section */}
            <div className="flex flex-row w-full h-2/3">
                <div className="flex justify-end items-start w-2/4">
                    <img
                        src={product?.image ?? ""}
                        alt={product?.name ?? "Product Image"}
                        className="h-fit w-8/12 object-cover"
                    />
                </div>
                <div className="flex flex-col justify-start mt-11 ml-11 w-2/4">
                    <h1 className="text-3xl font-bold mb-2">{product?.name ?? "Product Name"}</h1>
                    <p className="text-lg text-gray-600 mb-4">{product?.brand ?? "Brand Name"}</p>
                    <p className="text-sm font-semibold text-gray-500">
                        Gender: <span className="text-gray-700">{product?.gender ?? "Unisex"}</span>
                    </p>
                    <p className="text-lg font-semibold mt-4">
                        Market Value: <span className="text-blue-600">${product?.market_price ?? 0}</span>
                    </p>
                    <p className="text-lg font-semibold mt-4">
                        Price: <span className="text-blue-600">${product?.price ?? 0}</span>
                    </p>
                    <p className="text-sm text-gray-700 mt-6 w-5/12">{product?.story ?? "No story available."}</p>
                    <div className="mt-6">
                        <h3 className="text-lg font-bold mb-2">Select Color:</h3>
                        <div className="flex gap-2 flex-wrap w-6/12">
                            {product?.colors?.map((color) => (
                                <button
                                    key={color.id}
                                    onClick={() => handleColorSelect(color.value)}
                                    className={`px-4 py-2 border rounded-md ${
                                        selectedColor === color.value
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    {color.value}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Selection */}
                    <div className="mt-6">
                        <h3 className="text-lg font-bold mb-2">Select Size:</h3>
                        <div className="flex gap-2 flex-wrap w-6/12">
                            {product?.sizes?.map((size) => (
                                <button
                                    key={size.id}
                                    onClick={() => handleSizeSelect(size.value)}
                                    className={`px-4 py-2 border rounded-md ${
                                        selectedSize === size.value
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    {size.value}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col space-y-4 w-5/12">
                        <Button
                            label="Buy Now"
                            variant="primary"
                            disabled={!selectedSize} // Disable if no size is selected
                        />
                        <Button
                            label={quantity > 0 ? "Added to Cart. View all items." : "Add to Cart"}
                            variant={quantity > 0 ? "primary" : "secondary"}
                            disabled={!selectedSize || !selectedColor}
                            onClick={handleAddToCart}
                            icon={quantity > 0 ? <FaCheck /> : null}
                        />
                    </div>
                </div>
            </div>

            {/* Recommended Products Slider */}
            <div className="mt-12 px-6 flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
                <div className="flex space-x-6 overflow-x-scroll scrollbar-hide flex-row justify-center">
                    {recommendedProducts.map((item) => (
                        <div
                            key={item.id}
                            className="flex-shrink-0 w-64 p-4 border border-gray-200 rounded-lg shadow-md"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-40 object-cover rounded-md mb-4"
                            />
                            <h3 className="text-lg font-bold">{item.name}</h3>
                            <p className="text-blue-600 font-semibold">${item.price}</p>
                            <Button
                                label="View Product"
                                variant="primary"
                                className="mt-4 w-full"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
