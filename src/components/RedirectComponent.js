"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectComponent({ to }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to); // ✅ Replaces history entry, preventing back navigation
  }, [to, router]);

  return null; // ✅ Doesn't render anything, just handles redirection
}
