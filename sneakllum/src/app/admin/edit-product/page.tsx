"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";


interface Variant {
    id: number;
    color: { id: number; value: string };
    size: { id: number; value: number };
    stock: number;
}

interface Size {
    id: number;
    value: number;
}
interface Product {
    id: number;
    brand: string;
    name: string;
    price: number;
    image: string;
    gender: string,
    releaseDate: string,
    releaseYear: string,
    description: string,
    marketPrice: number,
}
interface EditProduct {
    brand: string;
    name: string;
    price: number;
    gender: string,
    releaseYear: string,
    description: string,
    marketPrice: number,
}
export default function EditProduct() {
    const { token } = useUser();

    const searchParams = useSearchParams();
    const productId = searchParams.get("id"); // Assuming the ID is passed as a query parameter
    const [product, setProduct] = useState<Product>({
        id: 0,
        name: "",
        brand: "",
        gender: "",
        releaseDate: "",
        releaseYear: "",
        description: "",
        marketPrice: 0,
        price: 0,
        image: "",
    });
    const [variants, setVariants] = useState<Variant[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // For handling modal visibility
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isEditVariantModalOpen, setIsEditVariantModalOpen] = useState(false);
    const [isRemoveVariantModalOpen, setIsRemoveVariantModalOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const [variantToEdit, setVariantToEdit] = useState<Variant | null>(null);
    const [variantToRemove, setVariantToRemove] = useState<Variant | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [productEditData, setProductEditData] = useState<EditProduct>({
        name: "",
        brand:"",
        gender: "",
        releaseYear:  "",
        marketPrice: 0, // Use 0 instead of null
        price:0, // Use 0 instead of null
        description: "",
    });

    useEffect(() => {
        if (productId) {
            fetchProduct();
            fetchSizes();
        }
        // eslint-disable-next-line
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(
                `https://5b8cmbmlsw.preview.infomaniak.website/api/products/${productId}`
            );
            if (response.ok) {
                const data = await response.json();
                setProduct({
                    id: data.id,
                    name: data.name,
                    brand: data.brand,
                    gender: data.gender,
                    releaseDate: data.release_date || "",
                    releaseYear: data.release_year || "",
                    description: data.story || "",
                    marketPrice: data.market_price,
                    price: data.price,
                    image: data.image,
                });
                setVariants(data.variants || []);

                // Set the productEditData to pre-fill the modal fields
                setProductEditData({
                    name: data.name || "",
                    brand: data.brand || "",
                    gender: data.gender || "",
                    releaseYear: data.release_year || "",
                    marketPrice: data.market_price || 0, // Use 0 instead of null
                    price: data.price || 0, // Use 0 instead of null
                    description: data.story || "",
                });

            } else {
                console.error("Failed to fetch product data.");
            }
        } catch (error) {
            console.error("Error fetching product data:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const fetchSizes = async () => {
        try {
            const response = await fetch("https://5b8cmbmlsw.preview.infomaniak.website/api/sizes");
            if (response.ok) {
                const data = await response.json();
                setSizes(data.data);
                console.log(sizes)
            } else {
                console.error("Failed to fetch sizes.");
            }
        } catch (error) {
            console.error("Error fetching sizes:", error);
        }
    };


    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setProductEditData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSave = async () => {
        const apiUrl = `https://5b8cmbmlsw.preview.infomaniak.website/api/products/${product.id}`; // Replace 'id' with the actual product ID

        // Map productEditData fields to API-compliant format
        const payload = {
            name: productEditData.name,
            brand: productEditData.brand,
            gender: productEditData.gender,
            release_date: product.releaseDate,
            release_year: productEditData.releaseYear, // Map releaseYear to release_year
            market_price: productEditData.marketPrice, // Map marketPrice to market_price
            price: productEditData.price,
            story: productEditData.description,
        };

        try {
            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify(payload), // Use the mapped payload
            });

            if (!response.ok) {
                throw new Error(`Failed to update product: ${response.statusText}`);
            }

            const updatedProduct = await response.json();
            console.log("Product updated successfully:", updatedProduct);

            // Close the modal after saving
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error updating product:", error);
            // Optionally display an error message to the user
        }
    };
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedImage(file || null); // Set the selected image file or null
    };

    const handleImageUpload = async () => {
        if (!selectedImage) {
            alert("Please select an image to upload.");
            return;
        }

        const apiUrl = `https://5b8cmbmlsw.preview.infomaniak.website/api/products/${product.id}/images`; // Replace 'product.id' with the actual product ID

        const formData = new FormData();
        formData.append("image", selectedImage, "updateImage.png"); // Append the image file with the key 'image'

        try {
            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: formData, // Use FormData for the request body
            });

            if (!response.ok) {
                throw new Error(`Failed to upload image: ${response.statusText}`);
            }

            const updatedImageResponse = await response.json();
            console.log("Image uploaded successfully:", updatedImageResponse);

            // Optionally update the UI with the new image
            setProduct((prevProduct) => ({
                ...prevProduct,
                image: updatedImageResponse.image, // Assuming the API returns the updated image URL
            }));

            setIsImageModalOpen(false); // Close the modal after uploading
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Image upload failed. Please try again.");
        }
    };



    const handleCancel = () => {
        // Reset the edit data to current product data
        setProductEditData({
            name: product?.name || "",
            brand: product?.brand || "",
            gender: product?.gender || "",
            releaseYear: product?.releaseYear || "",
            marketPrice: product?.marketPrice || 0,
            price: product?.price || 0,
            description: product?.description || ""
        });
        setIsModalOpen(false); // Close the modal without saving
    };
    const handleImageModalCancel = () => {
        setIsImageModalOpen(false);
    };
    const handleEditVariant = (variant: Variant) => {
        setVariantToEdit(variant);
        setIsEditVariantModalOpen(true);
    };

    const handleRemoveVariant = (variant: Variant) => {
        setVariantToRemove(variant);
        setIsRemoveVariantModalOpen(true);
    };

    const handleCancelEditVariant = () => {
        setVariantToEdit(null);
        setIsEditVariantModalOpen(false);
    };

    const handleCancelRemoveVariant = () => {
        setVariantToRemove(null);
        setIsRemoveVariantModalOpen(false);
    };

    const handleCancelAdd = () => {
        setShowAddModal(false); // Close the modal and return to edit product page
    };

    const handleConfirmAdd = () => {
        console.log("New variant added"); // Placeholder for adding variant logic
        setShowAddModal(false);
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found!</div>;
    }

    return (
        <div className="w-screen p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">View Product</h1>

            <form className="w-full max-w-2xl space-y-6">
                {/* Product Fields */}
                <div>
                    <label className="block font-semibold">Product ID</label>
                    <input
                        type="text"
                        value={product.id}
                        readOnly
                        className="border p-2 rounded w-full bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Name</label>
                    <input
                        type="text"
                        value={product.name}
                        readOnly
                        className="border p-2 rounded w-full bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Brand</label>
                    <input
                        type="text"
                        value={product.brand}
                        readOnly
                        className="border p-2 rounded w-full bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Gender</label>
                    <input
                        type="text"
                        value={product.gender}
                        readOnly
                        className="border p-2 rounded w-full bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Release Year</label>
                    <input
                        type="text"
                        value={product.releaseYear}
                        readOnly
                        className="border p-2 rounded w-full bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Market Price</label>
                    <input
                        type="text"
                        value={product.marketPrice}
                        readOnly
                        className="border p-2 rounded w-full bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Price</label>
                    <input
                        type="text"
                        value={product.price}
                        readOnly
                        className="border p-2 rounded w-full bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Description</label>
                    <textarea
                        value={product.description}
                        readOnly
                        className="border p-2 rounded w-full bg-gray-100"
                    ></textarea>
                </div>

                {/* Edit Product Button */}
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Edit Product
                    </button>
                </div>

                {/* Other Fields after Edit Button */}

                <div>
                    <label className="block font-semibold">Image</label>
                    <img
                        src={product.image}
                        alt="Product"
                        className="max-w-full h-auto rounded-md"
                    />
                    <button
                        type="button"
                        onClick={() => setIsImageModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                    >
                        Edit Image
                    </button>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Product Variants</h3>
                    {variants.map((variant, index) => (
                        <div
                            key={index}
                            className="flex flex-col gap-4 border p-4 rounded-md mb-4"
                        >
                            {/* Variant ID */}
                            <div>
                                <label className="block font-semibold">Variant ID</label>
                                <input
                                    type="text"
                                    value={variant.id}
                                    readOnly
                                    className="border p-2 rounded w-full bg-gray-100"
                                />
                            </div>

                            {/* Color */}
                            <div>
                                <label className="block font-semibold">Color</label>
                                <input
                                    type="text"
                                    value={variant.color.value}
                                    readOnly
                                    className="border p-2 rounded w-full bg-gray-100"
                                />
                            </div>

                            {/* Size */}
                            <div>
                                <label className="block font-semibold">Size</label>
                                <input
                                    type="text"
                                    value={variant.size.value}
                                    readOnly
                                    className="border p-2 rounded w-full bg-gray-100"
                                />
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block font-semibold">Stock</label>
                                <input
                                    type="text"
                                    value={variant.stock}
                                    readOnly
                                    className="border p-2 rounded w-full bg-gray-100"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleEditVariant(variant)}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleRemoveVariant(variant)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    {/* Add New Variant Button */}
                    <div className="mt-6">
                        <button
                            type="button"
                            className="bg-blue-500 text-white px-6 py-2 rounded"
                            onClick={() => setShowAddModal(true)}
                        >
                            Add New Variant
                        </button>
                    </div>
                </div>

                <div>
                   {/* <Button type="button" onClick={() => router.push("/admin")}>
                        Back
                    </Button>*/}
                </div>
            </form>

            {/* Edit Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Edit Product Details</h2>

                        {/* Name Field */}
                        <div>
                            <label className="block">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={productEditData.name}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>

                        {/* Brand Field */}
                        <div>
                            <label className="block">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={productEditData.brand}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>

                        {/* Gender Field (Dropdown) */}
                        <div>
                            <label className="block">Gender</label>
                            <select
                                name="gender"
                                value={productEditData.gender}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            >
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                                <option value="unisex">Unisex</option>
                                <option value="youth">Youth</option>
                                <option value="child">Child</option>
                                <option value="infant">Infant</option>
                            </select>
                        </div>


                        {/* Release Year Field (Numeric with Min/Max) */}
                        <div>
                            <label className="block">Release Year</label>
                            <input
                                type="number"
                                name="releaseYear"
                                value={productEditData.releaseYear}
                                onChange={handleInputChange}
                                min={1900}
                                max={new Date().getFullYear()}
                                className="border p-2 rounded w-full"
                            />
                        </div>

                        {/* Market Price Field (Numeric, no negatives) */}
                        <div>
                            <label className="block">Market Price</label>
                            <input
                                type="number"
                                name="marketPrice"
                                value={productEditData.marketPrice}
                                onChange={handleInputChange}
                                min={0}
                                className="border p-2 rounded w-full"
                            />
                        </div>

                        {/* Price Field (Numeric, no negatives) */}
                        <div>
                            <label className="block">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={productEditData.price}
                                onChange={handleInputChange}
                                min={0}
                                className="border p-2 rounded w-full"
                            />
                        </div>

                        {/* Description Field */}
                        <div>
                            <label className="block">Description</label>
                            <textarea
                                name="description"
                                value={productEditData.description}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="mt-4 flex justify-between">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Image Edit Modal */}
            {isImageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Edit Product Image</h2>

                        {/* Display current image */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">Current Image</label>
                            <img
                                src={product.image}
                                alt="Current Product"
                                className="max-w-full h-auto rounded-md"
                            />
                        </div>

                        {/* File input for image selection */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">Select New Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                            />
                        </div>

                        {/* Modal Buttons */}
                        <div className="mt-4 flex justify-between">
                            <button
                                type="button"
                                onClick={handleImageModalCancel}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleImageUpload}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Edit Variant Modal */}
            {isEditVariantModalOpen && variantToEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Edit Variant</h2>
                        <div>
                            <label>Color</label>
                            <input
                                type="text"
                                value={variantToEdit.color.value}
                                className="border p-2 rounded w-full"
                                readOnly
                            />
                        </div>
                        <div>
                            <label>Size</label>
                            <input
                                type="text"
                                value={variantToEdit.size.value}
                                className="border p-2 rounded w-full"
                                readOnly
                            />
                        </div>
                        <div>
                            <label>Stock</label>
                            <input
                                type="number"
                                value={variantToEdit.stock}
                                className="border p-2 rounded w-full"
                                readOnly
                            />
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={handleCancelEditVariant}
                            >
                                Cancel
                            </button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove Variant Modal */}
            {isRemoveVariantModalOpen && variantToRemove && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">
                            Are you sure you want to delete this variant?
                        </h2>
                        <div className="mt-4 flex justify-between">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={handleCancelRemoveVariant}
                            >
                                Cancel
                            </button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Add New Variant</h2>
                        <div className="mb-4">
                            <label className="block font-semibold">Color</label>
                            <input
                                type="text"
                                placeholder="Enter color"
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold">Size</label>
                            <input
                                type="number"
                                placeholder="Enter size"
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold">Stock</label>
                            <input
                                type="number"
                                placeholder="Enter stock"
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button
                                type="button"
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={handleCancelAdd}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleConfirmAdd}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
