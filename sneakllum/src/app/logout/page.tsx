"use client";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";

export default function Logout() {
  const { logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div>
      <button onClick={handleLogout} className="btn-logout">
        Logout
      </button>
    </div>
  );
}
