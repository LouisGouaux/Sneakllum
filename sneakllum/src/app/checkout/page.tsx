"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext"; // Import du CartContext
import Button from "../../components/Button";

export default function CheckoutPage() {
  const { cart, fetchCart } = useCart(); // Récupère les données du panier depuis le CartContext
  const [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
  });

  // Récupère le panier dès que le composant est monté
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (field: string, value: string) => {
    setUserDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fonction pour valider la commande
  const handleCheckout = () => {
    if (!userDetails.firstname || !userDetails.lastname || !userDetails.email || !userDetails.phone || !userDetails.address) {
      alert("Please fill out all fields before checking out.");
      return;
    }

    // Simuler l'envoi des données au serveur
    console.log("Checkout data:", { cart, userDetails });

    alert("Checkout successful! Thank you for your purchase.");
  };

  // Calculer le total du panier
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity ?? 1), // Utilisation de 1 par défaut si quantity est null
    0
  );

  return (
    <div className="flex flex-col min-h-screen justify-center items-center p-6">
      <div className="w-full max-w-3xl text-left">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Cart Items */}
        {cart.length > 0 ? (
          <div className="w-full max-w-3xl">
            <div className="mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center border-b pb-4 mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h2 className="font-bold">{item.name}</h2>
                    <p className="text-gray-600">Price: ${(item.price / 100).toFixed(2)}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="font-semibold">Quantity: {item.quantity ?? 1}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Total */}
            <div className="mb-6 text-lg font-semibold">
              Total: ${(cartTotal / 100).toFixed(2)}
            </div>

            {/* Checkout Form */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Your Details</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="firstname" className="block font-semibold mb-1">First name</label>
                  <input
                    type="text"
                    id="firstname"
                    value={userDetails.firstname}
                    onChange={(e) => handleChange("firstname", e.target.value)}
                    className="border p-2 rounded w-full mx-auto"
                  />
                </div>
                <div>
                  <label htmlFor="lastname" className="block font-semibold mb-1">Last name</label>
                  <input
                    type="text"
                    id="lastname"
                    value={userDetails.lastname}
                    onChange={(e) => handleChange("lastname", e.target.value)}
                    className="border p-2 rounded w-full mx-auto"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={userDetails.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="border p-2 rounded w-full mx-auto"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block font-semibold mb-1">Phone number</label>
                  <input
                    type="text" // type="text" au lieu de "number" pour permettre plus de flexibilité avec les formats de téléphone
                    id="phone"
                    value={userDetails.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="border p-2 rounded w-full mx-auto"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block font-semibold mb-1">Address</label>
                  <textarea
                    id="address"
                    value={userDetails.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="border p-2 rounded w-full mx-auto"
                  />
                </div>
              </form>
            </div>

            <Button
              label="Complete Checkout"
              variant="primary"
              onClick={handleCheckout}
              className="w-full lg:w-1/4 mx-auto ml-0"
            />
          </div>
        ) : (
          <div className="text-center mt-10 text-gray-600">
            Your cart is empty. Add some items to proceed with checkout.
          </div>
        )}
      </div>
    </div>
  );
}
