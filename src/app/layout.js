import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-white`}>
        <Navbar />
        <Toaster position="top-right" reverseOrder={false} /> {/* ✅ Toast Notifications */}
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
