"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
    const handleAuthChange = () => fetchUser();
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white dark:bg-slate-900 shadow-md">
      <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        🚗 Carpooling
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/rides" className={cn("text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition", pathname === "/rides" && "font-bold")}>
          Available Rides
        </Link>
        <Link href="/dashboard" className={cn("text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition", pathname === "/dashboard" && "font-bold")}>
          Dashboard
        </Link>

        {user && (
          <span className="text-gray-600 dark:text-gray-400 italic">
            {user.role === "driver" ? "🚘 Driver" : "🛺 Rider"}
          </span>
        )}

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-500 transition duration-300"
          >
            Logout
          </button>
        ) : (
          <>
            <Link href="/signup" className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-500 transition duration-300">
              Sign Up
            </Link>
            <Link href="/login" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-500 transition duration-300">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
