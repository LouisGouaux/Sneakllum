"use client";

import { useState } from "react";
import Link from "next/link"; 

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-blue-500 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold">My E-commerce App</h1>
        
        {/* Hamburger Icon for small screens */}
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="text-2xl">☰</span>
        </button>

        {/* Desktop Links */}
        <ul className={`lg:flex space-x-6 ${isMenuOpen ? 'flex' : 'hidden'} lg:flex`}>
          <li>
            <Link href="/" className="hover:text-yellow-300 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/shop" className="hover:text-yellow-300 transition-colors">
              Shop
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-yellow-300 transition-colors">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-yellow-300 transition-colors">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
