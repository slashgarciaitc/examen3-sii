import { Archivo, Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata = {
  title: "SII ITC",
  description: "Consulta de información académica del ITC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${publicSans.variable} ${archivo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
