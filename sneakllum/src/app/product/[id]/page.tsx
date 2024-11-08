'use client';
import { useParams } from 'next/navigation'

export default function ProductPage() {
    const params = useParams<{ id: number }>()
    console.log(params)
    return (
        <div>
            <h2>Product Details - {params.id}</h2>
            {/* Display product details based on the ID */}
        </div>
    );
}