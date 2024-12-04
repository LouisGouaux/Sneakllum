"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../../../components/Button";

interface Variant {
    id: number; // Add ID for existing variants
    code: string; // Unique variant code
    color: string;
    size: string;
    stock: number;
}

export default function EditProduct() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get("id"); // Assuming the product ID is passed as a query param

    const [product, setProduct] = useState({
        code: "", // Product code (not editable)
        name: "",
        brand: "",
        gender: "",
        releaseDate: "",
        releaseYear: "",
        image: null as File | null, // For updating the image
        currentImage: "", // URL for the current image
        description: "",
        marketPrice: "",
        price: "",
    });

    const [variants, setVariants] = useState<Variant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`);
                if (!response.ok) throw new Error("Failed to fetch product details.");

                const data = await response.json();
                setProduct({
                    code: data.code,
                    name: data.name,
                    brand: data.brand,
                    gender: data.gender,
                    releaseDate: data.releaseDate,
                    releaseYear: data.releaseYear,
                    description: data.description,
                    marketPrice: data.marketPrice,
                    price: data.price,
                    currentImage: data.image,
                    image: null, // Initialize as null
                });
                setVariants(data.variants || []);
            } catch (error) {
                console.error(error);
                alert("Failed to load product details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) fetchProduct();
    }, [productId]);

    const handleProductChange = (field: string, value: unknown) => {
        setProduct((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleVariantChange = (index: number, field: string, value: string | number) => {
        setVariants((prev) =>
            prev.map((variant, i) =>
                i === index ? { ...variant, [field]: value } : variant
            )
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleProductChange("image", e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!variants.some((v) => v.color && v.size && v.stock > 0)) {
            alert("Please ensure at least one valid variant exists.");
            return;
        }

        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("brand", product.brand);
        formData.append("gender", product.gender);
        formData.append("releaseDate", product.releaseDate);
        formData.append("releaseYear", product.releaseYear);
        formData.append("description", product.description);
        formData.append("marketPrice", product.marketPrice);
        formData.append("price", product.price);

        if (product.image) {
            formData.append("image", product.image);
        }

        formData.append("variants", JSON.stringify(variants));

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                alert("Product updated successfully!");
                router.push("/admin");
            } else {
                throw new Error("Failed to update product.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while updating the product.");
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="w-screen p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
                <div>
                    <label className="block font-semibold">Product Code</label>
                    <input
                        type="text"
                        value={product.code}
                        className="border p-2 rounded w-full bg-gray-100"
                        readOnly
                    />
                </div>
                <div>
                    <label className="block font-semibold">Name</label>
                    <input
                        type="text"
                        value={product.name}
                        onChange={(e) => handleProductChange("name", e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Brand</label>
                    <input
                        type="text"
                        value={product.brand}
                        onChange={(e) => handleProductChange("brand", e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Image</label>
                    {product.currentImage && (
                        <img
                            src={product.currentImage}
                            alt="Current product"
                            className="w-full h-40 object-cover rounded mb-2"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                {/* Other fields */}
                <div>
                    <h3 className="text-xl font-semibold mb-2">Product Variants</h3>
                    {variants.map((variant, index) => (
                        <div
                            key={variant.id}
                            className="flex flex-wrap gap-4 items-center mb-4 border p-4 rounded-md"
                        >
                            <div className="flex-1">
                                <label className="block font-semibold">Variant Code</label>
                                <input
                                    type="text"
                                    value={variant.code}
                                    className="border p-2 rounded w-full bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block font-semibold">Color</label>
                                <input
                                    type="text"
                                    value={variant.color}
                                    onChange={(e) =>
                                        handleVariantChange(index, "color", e.target.value)
                                    }
                                    className="border p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block font-semibold">Size</label>
                                <input
                                    type="text"
                                    value={variant.size}
                                    onChange={(e) =>
                                        handleVariantChange(index, "size", e.target.value)
                                    }
                                    className="border p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block font-semibold">Stock</label>
                                <input
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) =>
                                        handleVariantChange(index, "stock", parseInt(e.target.value))
                                    }
                                    className="border p-2 rounded w-full"
                                    required
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <Button label="Save Changes" variant="primary" type="submit" />
            </form>
        </div>
    );
}
