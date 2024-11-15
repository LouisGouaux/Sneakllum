"use client";
import React, { useState } from "react";
import Button from "../../components/Button";

interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    color: string;
    size: string;
    sex: string;
}

const dummyProducts: Product[] = [
    { id: 1, name: "Nike Air Max", image: "https://via.placeholder.com/150", price: 120, color: "red", size: "M", sex: "male" },
    { id: 2, name: "Adidas Ultraboost", image: "https://via.placeholder.com/150", price: 150, color: "blue", size: "L", sex: "female" },
    { id: 3, name: "Puma RS-X", image: "https://via.placeholder.com/150", price: 100, color: "black", size: "S", sex: "male" },
    { id: 4, name: "Reebok Nano", image: "https://via.placeholder.com/150", price: 130, color: "white", size: "M", sex: "female" },
];

export default function SearchPage() {
    const [filters, setFilters] = useState({
        color: "",
        size: "",
        sex: "",
    });

    const [filteredProducts, setFilteredProducts] = useState(dummyProducts);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));

        // Filter products based on selected filters
        const updatedProducts = dummyProducts.filter((product) => {
            const matchesColor = !filters.color || product.color === filters.color;
            const matchesSize = !filters.size || product.size === filters.size;
            const matchesSex = !filters.sex || product.sex === filters.sex;

            return matchesColor && matchesSize && matchesSex;
        });

        setFilteredProducts(updatedProducts);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Search Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Filter Sidebar */}
                <div className="col-span-1 bg-gray-100 p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg font-bold mb-4">Filters</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Color</label>
                        <select
                            name="color"
                            value={filters.color}
                            onChange={handleFilterChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">All</option>
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                            <option value="black">Black</option>
                            <option value="white">White</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Size</label>
                        <select
                            name="size"
                            value={filters.size}
                            onChange={handleFilterChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">All</option>
                            <option value="S">Small</option>
                            <option value="M">Medium</option>
                            <option value="L">Large</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sex</label>
                        <select
                            name="sex"
                            value={filters.sex}
                            onChange={handleFilterChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">All</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                {/* Product List */}
                <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="border p-4 rounded-lg shadow-lg">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                            <h2 className="text-lg font-bold">{product.name}</h2>
                            <p className="text-gray-600">${product.price}</p>
                            <p className="text-sm text-gray-500">Color: {product.color}</p>
                            <p className="text-sm text-gray-500">Size: {product.size}</p>
                            <p className="text-sm text-gray-500">Sex: {product.sex}</p>
                            <Button
                                label="Add to Cart"
                                className="mt-4"
                                variant="primary"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
