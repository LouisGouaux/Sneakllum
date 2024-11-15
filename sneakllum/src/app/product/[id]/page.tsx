"use client";
import React from "react";
import Button from "../../../components/Button";

interface Product {
    brand: string;
    colorway: string;
    estimatedMarketValue: number;
    gender: string;
    image: string;
    name: string;
    description: string;
}

export default function ProductPage() {
    const product: Product = {
        brand: "Nike",
        colorway: "White/Black",
        estimatedMarketValue: 150,
        gender: "Unisex",
        image: "https://image.goat.com/attachments/product_template_pictures/images/095/297/756/original/1203A430_001.png.png",
        name: "Nike Air Force 1",
        description: "The Nike Air Force 1 is a timeless sneaker featuring a sleek design, premium materials, and unparalleled comfort, making it a must-have for all sneaker enthusiasts.",
    };

    const recommendedProducts = [
        {
            id: 1,
            name: "Adidas Ultraboost",
            image: "https://via.placeholder.com/150",
            price: 180,
        },
        {
            id: 2,
            name: "Puma RS-X",
            image: "https://via.placeholder.com/150",
            price: 120,
        },
        {
            id: 3,
            name: "Reebok Nano",
            image: "https://via.placeholder.com/150",
            price: 100,
        },
    ];

    return (
        <div className="w-screen h-screen flex flex-col overflow-y-auto">
            {/* Main Product Section */}
            <div className="flex flex-row w-full h-2/3">
                <div className="flex justify-end items-start w-2/4">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-fit w-8/12 object-cover"
                    />
                </div>
                <div className="flex flex-col justify-start mt-11 ml-11 w-2/4">
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-lg text-gray-600 mb-4">{product.brand}</p>

                    <p className="text-sm font-semibold text-gray-500">
                        Colorway: <span className="text-gray-700">{product.colorway}</span>
                    </p>
                    <p className="text-sm font-semibold text-gray-500">
                        Gender: <span className="text-gray-700">{product.gender}</span>
                    </p>
                    <p className="text-lg font-semibold mt-4">
                        Market Value: <span className="text-blue-600">${product.estimatedMarketValue}</span>
                    </p>
                    <p className="text-sm text-gray-700 mt-6 w-5/12">{product.description}</p>

                    <div className="mt-6 flex flex-col space-y-4 w-5/12">
                        <Button label="Buy Now" variant="primary" />
                        <Button label="Add to Cart" variant="secondary" />
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
                            {/*<button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                                View Product
                            </button>*/}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
