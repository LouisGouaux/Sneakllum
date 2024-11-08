
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
}

export default function ProductPage() {
    const product: Product = {
        brand: "Nike",
        colorway: "White/Black",
        estimatedMarketValue: 150,
        gender: "Unisex",
        image: "https://image.goat.com/attachments/product_template_pictures/images/095/297/756/original/1203A430_001.png.png",
        name: "Nike Air Force 1",
    };

    return (
        <div className='flex w-screen h-screen flex-row'>
            <div className='flex h-screen justify-center items-center w-2/4'>
                <img
                    src={product.image}
                    alt={product.name}
                    className="flex h-fit justify-center items-center  object-cover"
                />
            </div>
            <div className="flex flex-col justify-start mt-11 ml-11">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-lg text-gray-600 mb-4">{product.brand}</p>

                    <p className="text-sm font-semibold text-gray-500">Colorway: <span className="text-gray-700">{product.colorway}</span></p>
                    <p className="text-sm font-semibold text-gray-500">Gender: <span className="text-gray-700">{product.gender}</span></p>
                    <p className="text-lg font-semibold mt-4">Market Value: <span className="text-blue-600">${product.estimatedMarketValue}</span></p>
                </div>


                <div className="mt-6 flex  flex-col justify-between	">
                    <Button label="Buy Now" variant="primary" className='mt-6'/>
                    <Button label="Add to Cart" variant="secondary" className='mt-6'/>
                </div>
            </div>
        </div>
    );
}
