import "./globals.css";
import NavBar from "../components/NavBar";
export const metadata = {
  title: "My E-commerce App",
  description: "An example e-commerce application built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <NavBar />

        <main className="flex-1">{children}</main>

        <footer className="bg-gray-800 text-white text-center p-4">
          © 2024 My E-commerce App
        </footer>
      </body>
    </html>
  );
}