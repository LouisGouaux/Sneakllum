export const metadata = {
  title: "My E-commerce App",
  description: "An example e-commerce application built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
          <body>
              <header>
                <h1>My E-commerce App</h1>
                {/* Add navigation links here */}
              </header>
              <main>{children}</main>
              <footer>© 2024 My E-commerce App</footer>
          </body>
      </html>
  );
}