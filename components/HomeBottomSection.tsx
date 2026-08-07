"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HomeBottomSection() {
  const { data: session } = useSession();

  if (session?.user) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Ready to start shopping?
      </h2>
      <p className="text-gray-500 mb-6">
        Create a free account and explore 30+ products.
      </p>
      <Link
        href="/register"
        className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Get Started
      </Link>
    </section>
  );
}