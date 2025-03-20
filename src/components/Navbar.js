"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  // ✅ Function to fetch user details correctly
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();

      if (data.user) {
        setUser(data.user); // ✅ Fix: Extract `user` from API response
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  // ✅ Fetch user data when Navbar mounts
  useEffect(() => {
    fetchUser();

    // ✅ Listen for login/logout events
    const handleAuthChange = () => fetchUser();
    window.addEventListener("authChange", handleAuthChange);

    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    window.dispatchEvent(new Event("authChange")); // ✅ Notify all components
    router.push("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-slate-800 shadow-md">
      <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
        🚗 Carpooling
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/rides" className={cn("text-gray-700 dark:text-gray-300", pathname === "/rides" && "font-bold text-indigo-600")}>
          Available Rides
        </Link>
        <Link href="/dashboard" className={cn("text-gray-700 dark:text-gray-300", pathname === "/dashboard" && "font-bold text-indigo-600")}>
          Dashboard
        </Link>

        {/* ✅ Show Correct Role in Navbar */}
        {user && (
          <span className="text-gray-600 dark:text-gray-300 italic">
            You are a {user.role === "driver" ? "Driver" : "Rider"}
          </span>
        )}

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
          >
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
