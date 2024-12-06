"use client";
import React, { useEffect, useState, useCallback } from "react";
import Button from "../../components/Button";
import { useRouter, usePathname } from "next/navigation";

interface Product {
    id: number;
    brand: string;
    name: string;
    price: number;
    image: string;
}

export default function SearchPage() {
    const router = useRouter();
    const pathname = usePathname();

    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);

    const getInitialFilters = () => {
        if (pathname === "/search/woman") {
            return { size: "", category: "women", isNew: false };
        } else if (pathname === "/search/man") {
            return { size: "", category: "men", isNew: false };
        } else if (pathname === "/search/child") {
            return { size: "", category: "child", isNew: false };
        } else if (pathname === "/search/new") {
            return { size: "", category: "", isNew: true };
        }
        return { size: "", category: "", isNew: false };
    };

    const [filters, setFilters] = useState(getInitialFilters);

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

    return (
        <div className="w-screen p-6 flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Search Results</h1>

            {/* Filters Section */}
            <div className="mb-6 flex flex-wrap gap-4">
                {/* Filter: Size */}
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

                {/* Filter: Category */}
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

                {/* Filter: New Items */}
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
                            <p className="text-blue-600 font-semibold">${product.price / 100}</p>
                            <Button
                                label="View Product"
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
                        currentPage === 1 ? "bg-gray-300 text-gray-500" : "bg-blue-600 text-white"
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
