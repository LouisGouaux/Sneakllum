"use client";
import { useUser } from "../../context/UserContext"; // Importer le hook useUser
import { useRouter } from "next/navigation"; // Pour rediriger après déconnexion

export default function Logout() {
  const { logout } = useUser(); // Récupérer la fonction logout du contexte
  const router = useRouter();

  // Fonction de déconnexion
  const handleLogout = () => {
    logout(); // Appeler logout pour réinitialiser le contexte et nettoyer le localStorage
    router.push("/login"); // Rediriger vers la page de connexion
  };

  return (
    <div>
      <button onClick={handleLogout} className="btn-logout">
        Logout
      </button>
    </div>
  );
}
