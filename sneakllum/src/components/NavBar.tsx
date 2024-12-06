"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineSearch, AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { useUser } from "../context/UserContext";
import UserProfileMenu from "../components/UserProfileMenu";
import { useRouter } from "next/navigation";

interface ProductSuggestion {
  id: number;
  name: string;
}

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [user]);

  // Fetch suggestions based on the search query
  useEffect(() => {
    if (searchQuery.length > 3) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `https://5b8cmbmlsw.preview.infomaniak.website/api/products/search?query=${encodeURIComponent(
              searchQuery
            )}`
          );
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data.data.slice(0, 5).map((product: ProductSuggestion) => ({
              id: product.id,
              name: product.name,
            })));
            setIsSuggestionsVisible(true);
          } else {
            console.error("Failed to fetch suggestions.");
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  }, [searchQuery]);

  // Handle search bar interactions
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion: ProductSuggestion) => {
    setSearchQuery("");
    setIsSuggestionsVisible(false);
    router.push(`/product?id=` + suggestion.id);
  };

  const navigationLinks = [
    { label: "Nouveau en ce moment", href: "/search/new" },
    { label: "Homme", href: "/search/man" },
    { label: "Femme", href: "/search/woman" },
    { label: "Enfant", href: "/search/child" },
    { label: "Commandes", href: "/orders" },
  ];

  if (user?.isAdmin) {
    navigationLinks.push({ label: "Admin", href: "/admin" });
  }

  return (
    <header className="bg-white text-black shadow p-4">
      <nav className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
          Sneakllum
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden block text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col justify-center items-center gap-6">
            <button
              className="absolute top-4 right-4 text-2xl"
              onClick={() => setIsMenuOpen(false)}
            >
              ✕
            </button>
            {navigationLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-xl font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Navigation Links */}
        <ul className="hidden lg:flex items-center space-x-6">
          {navigationLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search Bar and Icons */}
        <div className="hidden lg:flex items-center space-x-4 relative w-64">
          <div className="relative w-full">
            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
            <input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={handleSearchInput}
              className="pl-10 pr-4 py-2 w-full border rounded-full focus:outline-none"
            />
            {/* Suggestions Dropdown */}
            {isSuggestionsVisible && suggestions.length > 0 && (
              <ul className="absolute left-0 top-12 w-full bg-white border shadow-lg rounded-md z-10">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* User and Cart Icons */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          <Link href="/cart" className="hover:text-black transition-all">
            <AiOutlineShoppingCart className="text-2xl" />
          </Link>

          {/* User Icon */}
          {user && user.name ? (
            <UserProfileMenu />
          ) : (
            <Link href="/login" className="hover:text-black transition-all">
              <AiOutlineUser className="text-2xl" />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
