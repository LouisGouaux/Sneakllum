import type { NextApiRequest, NextApiResponse } from 'next';

export interface Product {
  id: number;
  brand: string;
  name: string;
  story: string;
  gender: string;
  image: string;
  market_price: number;
  price: number;
  sizes: { id: number; value: number }[];
  colors: { id: number; value: string }[];
}

// Fonction générique pour récupérer des données depuis une URL
const fetchDataFromAPI = async (url: string): Promise<unknown> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données');
    }
    const jsonResponse = await response.json();
    return jsonResponse.data || jsonResponse; // Retourner les données si disponibles
  } catch (err) {
    console.error(err);
    throw new Error('Impossible de charger les données.');
  }
};

// Fonction pour récupérer un produit spécifique en fonction de son ID
const fetchProductFromAPI = async (id: string): Promise<Product> => {
  const url = `https://5b8cmbmlsw.preview.infomaniak.website/api/products/${id}`;
  const data = await fetchDataFromAPI(url);

  if (isProduct(data)) {
    return data; // On peut être sûr que data est un Product ici
  }

  throw new Error('Produit non valide');
};

// Fonction pour récupérer tous les produits (nouveaux et best-sellers)
const fetchProductsFromAPI = async (): Promise<{ newProducts: Product[]; bestSellers: Product[] }> => {
  const newProductsData = await fetchDataFromAPI("https://5b8cmbmlsw.preview.infomaniak.website/api/products/new");
  const allProductsData = await fetchDataFromAPI("https://5b8cmbmlsw.preview.infomaniak.website/api/products");

  // Vérification que les données sont des tableaux de Product
  if (Array.isArray(newProductsData) && newProductsData.every(isProduct)) {
    const newProducts = newProductsData.slice(0, 10);
    const bestSellers = Array.isArray(allProductsData) && allProductsData.every(isProduct)
      ? allProductsData.slice(0, 10)
      : [];

    return { newProducts, bestSellers };
  }

  throw new Error('Format inattendu des données');
};

// Fonction de vérification de type pour Product
const isProduct = (data: unknown): data is Product => {
  // Vérification que 'data' est bien un objet et correspond à un produit
  return (
    typeof data === 'object' && data !== null &&
    'id' in data && typeof (data as Product).id === 'number' &&
    'brand' in data && typeof (data as Product).brand === 'string' &&
    'name' in data && typeof (data as Product).name === 'string' &&
    'sizes' in data && Array.isArray((data as Product).sizes) &&
    'colors' in data && Array.isArray((data as Product).colors)
  );
};

// API Handler pour récupérer un produit spécifique ou des produits généraux
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Récupérer l'ID du produit passé dans l'URL

  if (id) {
    // Si un ID est passé, on récupère le produit spécifique
    if (typeof id === 'string') {
      try {
        const product = await fetchProductFromAPI(id);
        return res.status(200).json(product);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Une erreur inconnue est survenue.' });
      }
    } else {
      return res.status(400).json({ message: 'ID du produit invalide.' });
    }
  } else {
    // Si aucun ID n'est passé, on retourne les produits (nouveaux et best-sellers)
    try {
      const { newProducts, bestSellers } = await fetchProductsFromAPI();
      return res.status(200).json({ newProducts, bestSellers });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Une erreur inconnue est survenue.' });
    }
  }
}
