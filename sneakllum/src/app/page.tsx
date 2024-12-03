"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  brand: string;
  image: string | null;
  price: number;
}

export default function HomePage() {
  const router = useRouter();
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProductsFromAPI = async (url: string): Promise<Product[]> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des produits");
      }
      const jsonResponse = await response.json();
      if (jsonResponse && Array.isArray(jsonResponse.data)) {
        return jsonResponse.data;
      }
      throw new Error("Format inattendu de la réponse de l'API");
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les produits.");
      return [];
    }
  };

  const fetchProductsData = useCallback(async () => {
    try {
      const newProductsData = await fetchProductsFromAPI(
        "https://5b8cmbmlsw.preview.infomaniak.website/api/products?sort=new"
      );
      setNewProducts(newProductsData.slice(0, 10));

      const allProductsData = await fetchProductsFromAPI(
        "https://5b8cmbmlsw.preview.infomaniak.website/api/products"
      );
      const bestSellersData = allProductsData.slice(0, 10);
      setBestSellers(bestSellersData);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les produits.");
    }
  }, []);

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  const getImageUrl = (image: string | null): string => {
    if (!image || image === "[]" || image === "true" || image === "false") {
      return "/images/default-image.jpg";
    }
    try {
      const url = new URL(image, window.location.origin);
      return url.href;
    } catch {
      console.error("URL mal formée : ", image);
      return "/images/default-image.jpg";
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Section principale */}
      <section
        className="relative h-[calc(100vh-4rem)] bg-cover bg-center w-screen"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/14595091/pexels-photo-14595091.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            Découvrez les Sneakers qui Vous Ressemblent
          </h1>
          <p className="mt-4 text-lg md:text-2xl">
            Les dernières tendances en matière de sneakers pour homme, femme, et enfant.
          </p>
        </div>
      </section>

      {/* Section nouveautés */}
      <section className="py-12 bg-gray-100 w-screen">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Nouveautés</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {error && <p className="text-red-500">{error}</p>}
            {newProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg p-4"
                onClick={() => router.push(`/product/?id=` + product.id)}
              >
                <Image
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="rounded-lg w-full"
                />
                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                <p className="text-gray-600">{product.brand}</p>
                <p className="text-blue-600 font-semibold">{product.price}€</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section best-sellers */}
      <section className="py-12 bg-gray-50 w-screen">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Best Sellers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {error && <p className="text-red-500">{error}</p>}
            {bestSellers.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg p-4"
                onClick={() => router.push(`/product/?id=` + product.id)}
              >
                <Image
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="rounded-lg w-full"
                />
                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                <p className="text-gray-600">{product.brand}</p>
                <p className="text-blue-600 font-semibold">{product.price}€</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section catégories */}
      <section className="py-12 bg-gray-100 w-screen">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Explorez Nos Catégories</h2>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            <Link
              href="/search/man"
              className="relative w-full sm:w-[calc(50%-1rem)] lg:w-[25%] max-w-[215px] h-80"
            >
              <Image
                src="https://images.pexels.com/photos/9604303/pexels-photo-9604303.jpeg"
                alt="Homme"
                fill
                className="object-cover rounded-lg transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold opacity-0 hover:opacity-100 transition-opacity">
                Homme
              </div>
            </Link>
            <Link
              href="/search/woman"
              className="relative w-full sm:w-[calc(50%-1rem)] lg:w-[25%] max-w-[215px] h-80"
            >
              <Image
                src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg"
                alt="Femme"
                fill
                className="object-cover rounded-lg transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold opacity-0 hover:opacity-100 transition-opacity">
                Femme
              </div>
            </Link>
            <Link
              href="/search/child"
              className="relative w-full sm:w-[calc(50%-1rem)] lg:w-[25%] max-w-[215px] h-80"
            >
              <Image
                src="https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Enfant"
                fill
                className="object-cover rounded-lg transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold opacity-0 hover:opacity-100 transition-opacity">
                Enfant
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
