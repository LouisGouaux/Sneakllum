import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["image.goat.com", "localhost"], // Ajoutez ici le domaine autorisé
  },
};

export default nextConfig;