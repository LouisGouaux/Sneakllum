import { useRouter } from 'next/navigation';

export default function ProductPage() {
    const router = useRouter();
    const { id } = router.query; // This retrieves the product ID from the route

    return (
        <div>
            <h2>Product Details - {id}</h2>
            {/* Display product details based on the ID */}
        </div>
    );
}