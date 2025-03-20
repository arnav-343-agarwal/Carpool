"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#4A00E0] to-[#8E2DE2] text-white">
      <motion.h1 
        className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
      >
        Ride Together, Save More 🚗
      </motion.h1>
      <p className="text-lg md:text-xl text-center max-w-2xl mb-6 opacity-90 leading-relaxed">
        Find rides near you, save money, and help reduce traffic congestion. A smart, privacy-focused ride-sharing solution.
      </p>
      <div className="flex space-x-6">
        <Button asChild variant="outline" className="border-white text-indigo-900 hover:bg-white hover:text-indigo-600 transition duration-300 px-6 py-3 text-lg">
          <Link href="/rides">Find a Ride</Link>
        </Button>
        <Button asChild variant="default" className="bg-white text-indigo-600 hover:bg-gray-200 transition duration-300 px-6 py-3 text-lg">
          <Link href="/create-ride">Offer a Ride</Link>
        </Button>
      </div>
    </main>
  );
}
