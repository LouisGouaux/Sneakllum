"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../components/Button";
import { useUser } from "../../../context/UserContext";


interface Variant {
    color: string;
    size_id: string;
    stock: number;
}

interface Size {
    id: number;
    value: number;
}

export default function AddProduct() {
    const router = useRouter();
    const { token } = useUser();

    const [product, setProduct] = useState({
        name: "",
        brand: "",
        gender: "",
        releaseDate: "",
        releaseYear: "",
        image: null as File | null, // File type for the image field
        description: "",
        marketPrice: "",
        price: "",
    });

    const [variants, setVariants] = useState<Variant[]>([
        { color: "", size_id: "", stock: 0 },
    ]);
    const [sizes, setSizes] = useState<Size[]>([]);

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

    const addVariant = () => {
        setVariants((prev) => [...prev, { color: "", size_id: "", stock: 0 }]);
    };

    const removeVariant = (index: number) => {
        if (variants.length > 1) {
            setVariants((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: At least 1 variant must have valid data
        if (!variants.some((v) => v.color && v.size_id && v.stock > 0)) {
            alert("Please add at least one valid variant.");
            return;
        }

        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("brand", product.brand);
        formData.append("gender", product.gender);
        formData.append("release_date", product.releaseDate);
        formData.append("release_year", product.releaseYear);
        formData.append("story", product.description);
        formData.append("market_price", product.marketPrice);
        formData.append("price", product.price);

        // Append image file
        if (product.image) {
            formData.append("image", product.image);
        }

        // Append variants as JSON
        formData.append("variants", JSON.stringify(variants));
        /*for (var value of formData.values()) {
            console.log(value);
        }*/
        try {
            const response = await fetch("https://5b8cmbmlsw.preview.infomaniak.website/api/products", {
                method: "POST",
                headers: {
                    /*'Content-Type': "multipart/form-data",*/
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: formData,
            });

            if (response.ok) {
                alert("Product added successfully!");
                router.push("/admin");
            } else {
                throw new Error("Failed to add product.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while adding the product.");
        }
    };
    const fetchSizes = async () => {
        try {
            const response = await fetch("https://5b8cmbmlsw.preview.infomaniak.website/api/sizes");
            if (response.ok) {
                const data = await response.json();
                setSizes(data.data); // Set the sizes array
            } else {
                console.error("Failed to fetch sizes");
            }
        } catch (err) {
            console.error("Error fetching sizes:", err);
        }
    };

    useEffect(() => {
        fetchSizes();
    }, []);

    return (
        <div className="w-screen p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Add New Product</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
                {/* Product Fields */}
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
                    <label className="block font-semibold">Gender</label>
                    <select
                        value={product.gender}
                        onChange={(e) => handleProductChange("gender", e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="unisex">Unisex</option>
                        <option value="youth">Youth</option>
                        <option value="child">Child</option>
                        <option value="infant">Infant</option>
                    </select>
                </div>
                <div>
                    <label className="block font-semibold">Release Date</label>
                    <input
                        type="date"
                        value={product.releaseDate}
                        onChange={(e) => handleProductChange("releaseDate", e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Release Year</label>
                    <input
                        type="number"
                        value={product.releaseYear}
                        onChange={(e) => handleProductChange("releaseYear", e.target.value)}
                        className="border p-2 rounded w-full"
                        min={1900}
                        max={new Date().getFullYear()}
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Image</label>
                    <input
                        type="file"
                        onChange={(e) =>
                            handleProductChange("image", e.target.files ? e.target.files[0] : null)
                        }
                        accept="image/*"
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Description</label>
                    <textarea
                        value={product.description}
                        onChange={(e) => handleProductChange("description", e.target.value)}
                        className="border p-2 rounded w-full"
                        rows={4}
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Market Price</label>
                    <input
                        type="number"
                        value={product.marketPrice}
                        onChange={(e) => handleProductChange("marketPrice", e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Price</label>
                    <input
                        type="number"
                        value={product.price}
                        onChange={(e) => handleProductChange("price", e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>

                {/* Variants Section */}
                <div>
                    <h3 className="text-xl font-semibold mb-2">Product Variants</h3>
                    {variants.map((variant, index) => (
                        <div
                            key={index}
                            className="flex flex-wrap gap-4 items-center mb-4 border p-4 rounded-md"
                        >
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
                                <select
                                    value={variant.size_id}
                                    onChange={(e) =>
                                        handleVariantChange(index, "size_id", e.target.value)
                                    }
                                    className="border p-2 rounded w-full"
                                    required
                                >
                                    <option value="">Select Size</option>
                                    {sizes.map((size) => (
                                        <option key={size.id} value={size.id}>
                                            {size.value}
                                        </option>
                                    ))}
                                </select>
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
                            <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <Button label="Add Variant" variant="secondary" onClick={addVariant} />
                </div>

                {/* Submit Button */}
                <Button label="Add Product" variant="primary" type="submit" />
            </form>
        </div>
    );
}