"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineSearch, AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { useUser } from "../context/UserContext";
import UserProfileMenu from "../components/UserProfileMenu";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
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
            setSuggestions(data || []);
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

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setIsSuggestionsVisible(false);
  };

  return (
      <header className="bg-white text-black shadow p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">Sneakllum</h1>
          </Link>

          <button
              className="lg:hidden block text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span>☰</span>
          </button>

          <ul
              className={`lg:flex space-x-6 flex-1 justify-center ${
                  isMenuOpen ? "flex" : "hidden"
              }`}
          >
            <li>
              <Link
                  href="/search/new"
                  className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
              >
                Nouveau en ce moment
              </Link>
            </li>
            <li>
              <Link
                  href="/search/man"
                  className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
              >
                Homme
              </Link>
            </li>
            <li>
              <Link
                  href="/search/woman"
                  className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
              >
                Femme
              </Link>
            </li>
            <li>
              <Link
                  href="/search/child"
                  className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
              >
                Enfant
              </Link>
            </li>
            <li>
              <Link
                  href="/search/offers"
                  className="font-medium border-b-2 border-transparent hover:border-black hover:font-semibold hover:pb-1 transition-all"
              >
                Offres
              </Link>
            </li>
          </ul>

          <div className="flex items-center space-x-4 mr-4 relative">
            <div className="relative w-64">
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
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </li>
                    ))}
                  </ul>
              )}
            </div>
          </div>

          <div className="flex space-x-6">
            <Link href="/cart" className="hover:text-black transition-all">
              <AiOutlineShoppingCart className="text-2xl" />
            </Link>

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
