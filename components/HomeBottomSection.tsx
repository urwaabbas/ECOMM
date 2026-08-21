"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HomeBottomSection() {
  const { data: session } = useSession();

  if (session?.user) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl bg-gray-900 px-6 py-12 text-center sm:px-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-300">
            Start Shopping
          </p>

          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            Ready to explore Haanli Bazaar?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-300">
            Create your free account and explore 60+ products across fashion,
            electronics, accessories and more.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              Create Account
            </Link>

            <Link
              href="/products"
              className="rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-gray-900"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}