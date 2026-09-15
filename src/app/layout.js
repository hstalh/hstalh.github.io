import "./globals.css";

export const metadata = {
  title: "Bandy Shootout",
  description: "Best-of-5 bandy shootout game built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
