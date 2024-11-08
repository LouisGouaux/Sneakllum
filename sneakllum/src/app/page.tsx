import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Section principale avec une grande image et un message d'accueil */}
      <section className="relative h-screen bg-cover bg-center w-full" style={{ backgroundImage: "url('https://images.pexels.com/photos/14595091/pexels-photo-14595091.jpeg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold">Découvrez les Sneakers qui Vous Ressemblent</h1>
          <p className="mt-4 text-lg md:text-2xl">Les dernières tendances en matière de sneakers pour homme, femme, et enfant.</p>
        </div>
      </section>

      {/* Section nouveautés */}
      <section className="py-12 bg-gray-100 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Nouveautés</h2>
          <div className="flex overflow-x-scroll space-x-4 scrollbar-hide">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="min-w-[200px] bg-white rounded-lg shadow-lg p-4">
                <Image src={`/images/sneaker-${index % 5 + 1}.jpg`} alt={`Nouveau produit ${index + 1}`} width={200} height={200} className="rounded-lg" />
                <h3 className="text-lg font-semibold mt-2">Nouveau produit {index + 1}</h3>
                <p className="text-gray-600">Prix: 100€</p>
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
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="min-w-[200px] bg-white rounded-lg shadow-lg p-4">
                <Image src={`/images/sneaker-bestseller-${index % 5 + 1}.jpg`} alt={`Best seller ${index + 1}`} width={200} height={200} className="rounded-lg" />
                <h3 className="text-lg font-semibold mt-2">Best Seller {index + 1}</h3>
                <p className="text-gray-600">Prix: 150€</p>
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
                <Image src="/images/category-man.jpg" alt="Homme" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Homme
                </div>
              </div>
            </Link>
            <Link href="/category/woman">
              <div className="w-60 h-80 relative group overflow-hidden rounded-lg shadow-lg bg-white">
                <Image src="/images/category-woman.jpg" alt="Femme" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Femme
                </div>
              </div>
            </Link>
            <Link href="/category/child">
              <div className="w-60 h-80 relative group overflow-hidden rounded-lg shadow-lg bg-white">
                <Image src="/images/category-child.jpg" alt="Enfant" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-110" />
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
