"use client";
import React, { useEffect, useState, useCallback } from "react";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";

interface Product {
    id: number;
    brand: string;
    name: string;
    price: number;
    image: string;
}

interface SearchPageProps {
    title: string;
}

export default function Admin({ title }: SearchPageProps) {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);

    // Filters State
    const [filters, setFilters] = useState({
        size: "",
        category: title,
        isNew: false,
    });

    // State for CSV upload
    const [csvFile, setCsvFile] = useState<File | null>(null);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams({
                page: currentPage.toString(),
                ...(filters.size && { size: filters.size }),
                ...(filters.category && { gender: filters.category }),
                ...(filters.isNew && { sort: "new" }),
            }).toString();

            const response = await fetch(
                `https://5b8cmbmlsw.preview.infomaniak.website/api/products?${query}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch products.");
            }

            const data = await response.json();
            setProducts(data.data);
            setTotalPages(data.meta.last_page);
        } catch (err) {
            setError("Failed to load products. Please try again later.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, filters]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = (filterName: string, value: unknown) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterName]: value,
        }));
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCsvFile(e.target.files[0]);
        }
    };

    const handleModifyStocks = async () => {
        if (!csvFile) {
            alert("Please select a CSV file before uploading.");
            return;
        }

        const formData = new FormData();
        formData.append("file", csvFile);

        try {
            const response = await fetch("https://5b8cmbmlsw.preview.infomaniak.website/api/product/stock", {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload stock CSV.");
            }

            alert("Stock updated successfully!");
            setCsvFile(null); // Reset file after successful upload
        } catch (err) {
            console.error(err);
            alert("An error occurred while uploading the CSV file.");
        }
    };

    const handleExportStocks = () => {
        // Logic for exporting stocks by CSV
        console.log("Export stocks by CSV clicked");
    };

    const handleAddProduct = () => {
        // Redirect to the add product page
        router.push("/admin/add-product");
    };

    return (
        <div className="w-screen p-6 flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Manage Products</h1>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div>
                    <Button
                        label="Modify stocks by CSV"
                        variant="secondary"
                        onClick={() => document.getElementById("csvInput")?.click()}
                    />
                    <input
                        id="csvInput"
                        type="file"
                        accept=".csv"
                        onChange={handleCsvFileChange}
                        className="hidden"
                    />
                    {csvFile && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">Selected file: {csvFile.name}</p>
                            <Button
                                label="Upload Stocks"
                                variant="primary"
                                onClick={handleModifyStocks}
                            />
                        </div>
                    )}
                </div>
                <Button
                    label="Export stocks by CSV"
                    variant="secondary"
                    onClick={handleExportStocks}
                />
                <Button
                    label="Add Product"
                    variant="primary"
                    onClick={handleAddProduct}
                />
            </div>

            {/* Filters Section */}
            <div className="mb-6 flex flex-wrap gap-4">
                <select
                    value={filters.size}
                    onChange={(e) => handleFilterChange("size", e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All Sizes</option>
                    <option value="20">20</option>
                    <option value="22">22</option>
                    <option value="24">24</option>
                    <option value="26">26</option>
                    <option value="28">28</option>
                    <option value="30">30</option>
                    <option value="32">32</option>
                    <option value="34">34</option>
                    <option value="36">36</option>
                    <option value="38">38</option>
                    <option value="40">40</option>
                    <option value="42">42</option>
                    <option value="44">44</option>
                </select>

                <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All Categories</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                    <option value="youth">Youth</option>
                    <option value="child">Child</option>
                    <option value="infant">Infant</option>
                </select>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={filters.isNew}
                        onChange={(e) => handleFilterChange("isNew", e.target.checked)}
                    />
                    <span>New Items</span>
                </label>
            </div>

            {/* Products Section */}
            {isLoading ? (
                <div className="text-center mt-10">Loading products...</div>
            ) : error ? (
                <div className="text-center mt-10 text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="p-4 border border-gray-200 rounded-lg shadow-md"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-40 object-cover rounded-md mb-4"
                            />
                            <h3 className="text-lg font-bold">{product.name}</h3>
                            <p className="text-gray-600">{product.brand}</p>
                            <p className="text-blue-600 font-semibold">
                                ${product.price / 100}
                            </p>
                            <Button
                                label="Edit product"
                                variant="primary"
                                className="mt-4 w-full"
                                onClick={() => router.push(`/product/?id=` + product.id)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border rounded-md ${
                        currentPage === 1
                            ? "bg-gray-300 text-gray-500"
                            : "bg-blue-600 text-white"
                    }`}
                >
                    Previous
                </button>
                <span className="font-semibold">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 border rounded-md ${
                        currentPage === totalPages
                            ? "bg-gray-300 text-gray-500"
                            : "bg-blue-600 text-white"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
