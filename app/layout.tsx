import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shopando | متجر إلكتروني شامل",
  description: "تم التصميم والتطوير بواسطة شركة HEADIX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}