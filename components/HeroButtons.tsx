"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HeroButtons() {
  const { data: session } = useSession();

  return (
    <div className="mt-8 flex gap-4 justify-center">
      <Link
        href="/products"
        className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        Shop Now
      </Link>
      {!session?.user && (
        <Link
          href="/register"
          className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-700 transition"
        >
          Create Account
        </Link>
      )}
    </div>
  );
}