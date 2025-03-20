"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Function to check if user is logged in
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      setIsLoggedIn(!!data.user);
    } catch {
      setIsLoggedIn(false);
    }
  };

  // ✅ Fetch auth status when Navbar mounts
  useEffect(() => {
    checkAuth();
    
    // ✅ Listen for login/logout events
    const handleAuthChange = () => checkAuth();
    window.addEventListener("authChange", handleAuthChange);

    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChange")); // ✅ Notify all components
    router.push("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-slate-800 shadow-md">
      <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
        🚗 Carpooling
      </Link>
      <div className="space-x-4">
        <Link href="/rides" className={cn("text-gray-700 dark:text-gray-300", pathname === "/rides" && "font-bold text-indigo-600")}>
          Available Rides
        </Link>
        <Link href="/dashboard" className={cn("text-gray-700 dark:text-gray-300", pathname === "/dashboard" && "font-bold text-indigo-600")}>
          Dashboard
        </Link>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500">
            Logout
          </button>
        ) : (
          <>
            <Link href="/signup" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500">
              Sign Up
            </Link>
            <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
