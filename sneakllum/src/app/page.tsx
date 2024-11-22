"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  brand: string;
  image: string | null;
  price: number;
}

export default function HomePage() {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (ids: number[]): Promise<Product[]> => {
    try {
      const products = await Promise.all(
        ids.map(async (id) => {
          const response = await fetch(`https://5b8cmbmlsw.preview.infomaniak.website/api/products/${id}`);
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
          }
          return await response.json();
        })
      );
      return products;
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les produits.");
      return [];
    }
  };

  useEffect(() => {
    const newProductsIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const bestSellersIds = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    const fetchProductsData = async () => {
      try {
        const newProductsData = await fetchProducts(newProductsIds);
        setNewProducts(newProductsData);
        const bestSellersData = await fetchProducts(bestSellersIds);
        setBestSellers(bestSellersData);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les produits.");
      }
    };
    fetchProductsData();
  }, []);

  const getImageUrl = (image: string | null): string => {
    if (!image) {
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
    <div>
      {/* Section principale */}
      <section
        className="relative h-screen bg-cover bg-center w-full"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/14595091/pexels-photo-14595091.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold">Découvrez les Sneakers qui Vous Ressemblent</h1>
          <p className="mt-4 text-lg md:text-2xl">
            Les dernières tendances en matière de sneakers pour homme, femme, et enfant.
          </p>
        </div>
      </section>

      {/* Section nouveautés */}
      <section className="py-12 bg-gray-100 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Nouveautés</h2>
          <div className="flex overflow-x-scroll space-x-4 scrollbar-hide">
            {error && <p className="text-red-500">{error}</p>}
            {newProducts.map((product) => (
              <div key={product.id} className="min-w-[200px] bg-white rounded-lg shadow-lg p-4">
                <Image
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                <p className="text-gray-600">Prix: {product.price}€</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section best-sellers */}
      <section className="py-12 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Best Sellers</h2>
          <div className="flex overflow-x-scroll space-x-4 scrollbar-hide">
            {error && <p className="text-red-500">{error}</p>}
            {bestSellers.map((product) => (
              <div key={product.id} className="min-w-[200px] bg-white rounded-lg shadow-lg p-4">
                <Image
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                <p className="text-gray-600">Prix: {product.price}€</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section catégories */}
      <section className="py-12 bg-gray-100 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Explorez Nos Catégories</h2>
          <div className="flex justify-center space-x-6">
            <Link href="/category/man">
              <div className="w-60 h-80 relative group overflow-hidden rounded-lg shadow-lg bg-white">
                <Image
                  src="/images/category-man.jpg"
                  alt="Homme"
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Homme
                </div>
              </div>
            </Link>
            <Link href="/category/woman">
              <div className="w-60 h-80 relative group overflow-hidden rounded-lg shadow-lg bg-white">
                <Image
                  src="/images/category-woman.jpg"
                  alt="Femme"
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Femme
                </div>
              </div>
            </Link>
            <Link href="/category/child">
              <div className="w-60 h-80 relative group overflow-hidden rounded-lg shadow-lg bg-white">
                <Image
                  src="/images/category-child.jpg"
                  alt="Enfant"
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Enfant
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
