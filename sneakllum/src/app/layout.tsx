import "./globals.css";
import NavBar from "../components/NavBar";
export const metadata = {
  title: "My E-commerce App",
  description: "An example e-commerce application built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="fr">
      <body>
        {/* Ajout de la barre de navigation ici */}
        <NavBar />

        {/* Le contenu principal de la page */}
        <main className='flex justify-center'>{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center p-4">
          © 2024 My E-commerce App
        </footer>
      </body>
    </html>
  );
}