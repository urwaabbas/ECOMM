"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useShopping } from "@/components/ShoppingProvider";
import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import UserNotificationBell from "@/components/UserNotificationBell";

interface MegaMenuSection {
  title: string;
  items: string[];
}

const megaMenus: Record<string, MegaMenuSection[]> = {
  "New & Featured": [
    {
      title: "Featured",
      items: ["All Featured"],
    },
    {
      title: "Shop Featured",
      items: ["Men", "Women", "Electronics", "Accessories"],
    },
  ],

  Men: [
    {
      title: "Clothing",
      items: ["Shirts", "T-Shirts", "Jackets", "Jeans", "Shop All"],
    },
    {
      title: "Shoes",
      items: ["Sneakers", "Casual Shoes", "Sports Shoes", "Shop All"],
    },
    {
      title: "Accessories",
      items: ["Bags", "Watches", "Sunglasses", "Shop All"],
    },
  ],

  Women: [
    {
      title: "Clothing",
      items: ["Dresses", "Tops", "Jackets", "Jeans", "Shop All"],
    },
    {
      title: "Shoes",
      items: ["Sneakers", "Heels", "Flats", "Shop All"],
    },
    {
      title: "Accessories",
      items: ["Bags", "Watches", "Sunglasses", "Shop All"],
    },
  ],

  Electronics: [
    {
      title: "Electronics",
      items: ["Laptops", "Phones", "Headphones", "Cameras", "Shop All"],
    },
    {
      title: "Accessories",
      items: ["Chargers", "Keyboards", "Power Banks"],
    },
  ],

  Accessories: [
    {
      title: "Accessories",
      items: ["Bags", "Watches", "Sunglasses", "Wallets", "Shop All"],
    },
  ],

  Sale: [
    {
      title: "Sale",
      items: ["All Sale", "Men", "Women", "Electronics", "Accessories"],
    },
  ],
};

const mainNavigation = [
  "New & Featured",
  "Men",
  "Women",
  "Electronics",
  "Accessories",
  "Sale",
];

function getMainNavigationHref(item: string) {
  if (item === "New & Featured") {
    return "/products?featured=true";
  }

  if (item === "Sale") {
    return "/products?sale=true";
  }

  return `/products?category=${encodeURIComponent(item)}`;
}

function getMegaMenuHref(menu: string, item: string) {
  if (menu === "New & Featured") {
    if (item === "All Featured") {
      return "/products?featured=true";
    }

    return `/products?category=${encodeURIComponent(item)}&featured=true`;
  }

  if (menu === "Sale") {
    if (item === "All Sale") {
      return "/products?sale=true";
    }

    return `/products?category=${encodeURIComponent(item)}&sale=true`;
  }

  if (item === "Shop All") {
    return `/products?category=${encodeURIComponent(menu)}`;
  }

  return `/products?category=${encodeURIComponent(
    menu,
  )}&subcategory=${encodeURIComponent(item)}`;
}

export default function Navbar() {
  const { data: session } = useSession();

  const { cartCount, wishlistCount } = useShopping();

  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  const [megaMenu, setMegaMenu] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [mobileActiveMenu, setMobileActiveMenu] = useState("Men");

  const [helpOpen, setHelpOpen] = useState(false);

  const [topAccountOpen, setTopAccountOpen] = useState(false);

  const helpRef = useRef<HTMLDivElement>(null);

  const topAccountRef = useRef<HTMLDivElement>(null);

  const mobileSearchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      router.push("/products");
    } else {
      router.push(`/products?search=${encodeURIComponent(value)}`);
    }

    setMenuOpen(false);
    setMobileSearchOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setHelpOpen(false);
      }

      if (
        topAccountRef.current &&
        !topAccountRef.current.contains(event.target as Node)
      ) {
        setTopAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMobileSearchOpen(false);
    setMegaMenu(null);
    setHelpOpen(false);
    setTopAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!mobileSearchOpen) return;

    const timer = setTimeout(() => {
      mobileSearchRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [mobileSearchOpen]);

  return (
    <header
      className={`sticky top-0 bg-white ${menuOpen ? "z-[10000]" : "z-50"}`}
    >
      {/* ================================================= */}
      {/* DESKTOP TOP UTILITY BAR */}
      {/* ================================================= */}

      <div className="hidden border-b border-gray-100 bg-gray-50 md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-end px-6 text-xs font-semibold text-gray-900">
          {/* HELP */}

          <div
            ref={helpRef}
            className="relative"
            onMouseEnter={() => {
              setHelpOpen(true);
              setTopAccountOpen(false);
            }}
            onMouseLeave={() => {
              setHelpOpen(false);
            }}
          >
            <button
              type="button"
              onClick={() => {
                setHelpOpen((current) => !current);

                setTopAccountOpen(false);
              }}
              className="px-4 py-2 transition hover:text-gray-500"
            >
              Help
            </button>

            {helpOpen && (
              <div className="absolute right-0 top-9 z-[160] w-64 rounded-b-2xl bg-white px-6 py-5 shadow-xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Help
                </h3>

                <div className="space-y-4">
                  <Link
                    href="/orders"
                    onClick={() => setHelpOpen(false)}
                    className="block text-sm font-medium text-gray-600 transition hover:text-black"
                  >
                    Order Status
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setHelpOpen(false)}
                    className="block text-sm font-medium text-gray-600 transition hover:text-black"
                  >
                    Shipping & Delivery
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setHelpOpen(false)}
                    className="block text-sm font-medium text-gray-600 transition hover:text-black"
                  >
                    Returns
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setHelpOpen(false)}
                    className="block text-sm font-medium text-gray-600 transition hover:text-black"
                  >
                    Order Cancellation
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setHelpOpen(false)}
                    className="block text-sm font-medium text-gray-600 transition hover:text-black"
                  >
                    Contact Us
                  </Link>

                  <Link
                    href="/products"
                    onClick={() => setHelpOpen(false)}
                    className="block text-sm font-medium text-gray-600 transition hover:text-black"
                  >
                    Promotions & Discounts
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setHelpOpen(false)}
                    className="block text-sm font-medium text-gray-600 transition hover:text-black"
                  >
                    Product Advice
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setHelpOpen(false)}
                    className="block text-sm font-medium text-gray-600 transition hover:text-black"
                  >
                    Send Us Feedback
                  </Link>
                </div>
              </div>
            )}
          </div>

          <span className="h-4 w-px bg-gray-300" />

          {/* DESKTOP ACCOUNT */}

          {session?.user ? (
            <div
              ref={topAccountRef}
              className="relative flex items-center"
              onMouseEnter={() => {
                setTopAccountOpen(true);
                setHelpOpen(false);
              }}
              onMouseLeave={() => {
                setTopAccountOpen(false);
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setTopAccountOpen((current) => !current);

                  setHelpOpen(false);
                }}
                className="px-4 py-2 text-gray-700 transition hover:text-black"
              >
                Hi, {session.user.name?.split(" ")[0] || "User"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTopAccountOpen((current) => !current);

                  setHelpOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center text-gray-900 transition hover:text-gray-500"
                aria-label="Account"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM5 21a7 7 0 0114 0"
                  />
                </svg>
              </button>

              {topAccountOpen && (
                <div className="absolute right-0 top-9 z-[160] w-64 rounded-b-2xl bg-white px-6 py-5 shadow-xl">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Account
                  </h3>

                  <div className="space-y-4">
                    <Link
                      href="/profile"
                      onClick={() => setTopAccountOpen(false)}
                      className="block text-sm font-medium text-gray-600 transition hover:text-black"
                    >
                      Profile
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setTopAccountOpen(false)}
                      className="block text-sm font-medium text-gray-600 transition hover:text-black"
                    >
                      Orders
                    </Link>

                    <Link
                      href="/wishlist"
                      onClick={() => setTopAccountOpen(false)}
                      className="block text-sm font-medium text-gray-600 transition hover:text-black"
                    >
                      Favorites
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setTopAccountOpen(false)}
                      className="block text-sm font-medium text-gray-600 transition hover:text-black"
                    >
                      Account Settings
                    </Link>

                    {(
                      session.user as {
                        role?: string;
                      }
                    )?.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setTopAccountOpen(false)}
                        className="block text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="block w-full text-left text-sm font-medium text-gray-600 transition hover:text-black"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/register"
                className="px-4 py-2 transition hover:text-gray-500"
              >
                Join Us
              </Link>

              <span className="h-4 w-px bg-gray-300" />

              <Link
                href="/login"
                className="px-4 py-2 transition hover:text-gray-500"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* MAIN NAVBAR */}
      {/* ================================================= */}

      <nav
        className="relative border-b border-gray-100 bg-white"
        onMouseLeave={() => setMegaMenu(null)}
      >
        {/* ================================================= */}
        {/* DESKTOP NAVBAR — UNCHANGED STYLE */}
        {/* ================================================= */}

        <div className="mx-auto hidden min-h-20 max-w-7xl items-center justify-between gap-6 px-6 md:flex">
          {/* LOGO */}

          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Haanli Bazaar Home"
          >
            <Image
              src="/haanlibazaar_logo.png"
              alt="Haanli Bazaar"
              width={220}
              height={50}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* DESKTOP CATEGORIES */}

          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {mainNavigation.map((item) => (
              <button
                key={item}
                type="button"
                onMouseEnter={() => setMegaMenu(item)}
                onFocus={() => setMegaMenu(item)}
                onClick={() => {
                  router.push(getMainNavigationHref(item));

                  setMegaMenu(null);
                }}
                className={`relative px-3 py-7 text-sm font-semibold transition xl:text-[15px] ${
                  item === "Sale"
                    ? "text-red-600"
                    : "text-gray-900 hover:text-indigo-600"
                }`}
              >
                {item}

                {megaMenu === item && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gray-900" />
                )}
              </button>
            ))}
          </div>

          {/* DESKTOP ACTIONS */}

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <form onSubmit={handleSearch} className="relative hidden xl:block">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="h-11 w-52 rounded-full bg-gray-100 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-500 hover:bg-gray-200 focus:bg-white focus:ring-2 focus:ring-gray-200 2xl:w-64"
              />
            </form>

            <button
              type="button"
              onClick={() => router.push("/products")}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-800 transition hover:bg-gray-100 xl:hidden"
              title="Search"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <Link
              href="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-800 transition hover:bg-gray-100"
              title="Wishlist"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>

              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[9px] font-bold text-white">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-800 transition hover:bg-gray-100"
              title="Cart"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {session?.user && <UserNotificationBell />}
          </div>
        </div>

        {/* ================================================= */}
        {/* ZARA-INSPIRED MOBILE HEADER */}
        {/* ================================================= */}

        <div className="relative flex h-16 items-center justify-between px-4 md:hidden">
          {/* HAMBURGER */}

          <button
            type="button"
            onClick={() => {
              setMenuOpen(true);
              setMobileSearchOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center text-gray-950"
            aria-label="Open navigation"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 7h16M4 17h16"
              />
            </svg>
          </button>

          {/* CENTER LOGO */}

          <Link
            href="/"
            aria-label="Haanli Bazaar Home"
            className="absolute left-1/2 -translate-x-1/2"
          >
            <Image
              src="/haanlibazaar_logo.png"
              alt="Haanli Bazaar"
              width={180}
              height={42}
              priority
              className="h-9 w-auto max-w-[145px] object-contain"
            />
          </Link>

          {/* RIGHT ACTIONS */}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen((current) => !current);

                setMenuOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center text-gray-950"
              aria-label="Search"
            >
              <svg
                className="h-[22px] w-[22px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center text-gray-950"
              aria-label="Cart"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 7h14l-1 13H6L5 7zm3 0V5a4 4 0 018 0v2"
                />
              </svg>

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-950 px-1 text-[9px] font-bold text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH */}

        {mobileSearchOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <svg
                className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                ref={mobileSearchRef}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Haanli Bazaar"
                className="h-11 w-full border-b border-gray-950 bg-transparent pl-8 pr-10 text-base text-gray-950 outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setMobileSearchOpen(false);
                }}
                className="absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-gray-500"
                aria-label="Close search"
              >
                ×
              </button>
            </form>
          </div>
        )}

        {/* ================================================= */}
        {/* DESKTOP MEGA MENU */}
        {/* ================================================= */}

        {megaMenu && megaMenus[megaMenu] && (
          <div className="absolute left-0 right-0 top-full hidden border-t border-gray-100 bg-white shadow-lg lg:block">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-12 px-8 py-9 md:grid-cols-3 lg:grid-cols-4">
              {megaMenus[megaMenu].map((section) => (
                <div key={section.title}>
                  <h3 className="mb-4 text-sm font-semibold text-gray-900">
                    {section.title}
                  </h3>

                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <Link
                        key={item}
                        href={getMegaMenuHref(megaMenu, item)}
                        onClick={() => setMegaMenu(null)}
                        className="block text-sm text-gray-500 transition hover:text-gray-900"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ================================================= */}
      {/* ZARA-INSPIRED FULL-SCREEN MOBILE MENU */}
      {/* ================================================= */}

      {menuOpen && (
  <div className="fixed inset-0 z-[10001] overflow-y-auto bg-white md:hidden">
          {/* MENU HEADER */}

          <div className="sticky top-0 z-10 bg-white">
            <div className="relative flex h-16 items-center justify-between border-b border-gray-100 px-4">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-gray-950"
                aria-label="Close navigation"
              >
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <Image
                src="/haanlibazaar_logo.png"
                alt="Haanli Bazaar"
                width={170}
                height={40}
                className="absolute left-1/2 h-8 w-auto max-w-[140px] -translate-x-1/2 object-contain"
              />

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setMobileSearchOpen((current) => !current)}
                  className="flex h-10 w-10 items-center justify-center text-gray-950"
                  aria-label="Search"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="m21 21-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="relative flex h-10 w-10 items-center justify-center text-gray-950"
                  aria-label="Cart"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 7h14l-1 13H6L5 7zm3 0V5a4 4 0 018 0v2"
                    />
                  </svg>

                  {cartCount > 0 && (
                    <span className="absolute right-0 top-0 text-[10px] font-semibold text-gray-950">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* SEARCH INSIDE MENU */}

            {mobileSearchOpen && (
              <div className="border-b border-gray-100 px-5 py-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    ref={mobileSearchRef}
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search products"
                    className="h-11 w-full border-b border-gray-900 bg-transparent pr-10 text-base text-gray-950 outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    aria-label="Submit search"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="m21 21-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            )}

            {/* DEPARTMENT TABS */}

            <div className="overflow-x-auto border-b border-gray-100">
              <div className="flex min-w-max px-5">
                {mainNavigation.map((item) => {
                  const active = mobileActiveMenu === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setMobileActiveMenu(item)}
                      className={`relative whitespace-nowrap px-4 py-5 text-[15px] font-medium uppercase tracking-wide ${
                        item === "Sale"
                          ? active
                            ? "text-red-600"
                            : "text-red-500"
                          : active
                            ? "text-gray-950"
                            : "text-gray-500"
                      }`}
                    >
                      {item}

                      {active && (
                        <span
                          className={`absolute bottom-0 left-4 right-4 h-0.5 ${
                            item === "Sale" ? "bg-red-600" : "bg-gray-950"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MENU CONTENT */}

          <div className="px-6 pb-12 pt-8">
            {/* CURRENT DEPARTMENT */}

            <div className="flex items-start gap-5">
              <p className="shrink-0 pt-1 text-xs font-medium text-gray-400">
                01 |
              </p>

              <div className="flex-1">
                <Link
                  href={getMainNavigationHref(mobileActiveMenu)}
                  onClick={() => setMenuOpen(false)}
                  className={`text-2xl font-semibold tracking-tight ${
                    mobileActiveMenu === "Sale"
                      ? "text-red-600"
                      : "text-gray-950"
                  }`}
                >
                  {mobileActiveMenu}
                </Link>

                <Link
                  href={getMainNavigationHref(mobileActiveMenu)}
                  onClick={() => setMenuOpen(false)}
                  className="mt-5 block text-sm font-semibold uppercase tracking-[0.12em] text-gray-950"
                >
                  View All
                </Link>
              </div>
            </div>

            {/* SUBCATEGORY SECTIONS */}

            <div className="mt-10 space-y-12">
              {megaMenus[mobileActiveMenu]?.map((section, sectionIndex) => (
                <section key={section.title} className="flex items-start gap-5">
                  <p className="shrink-0 pt-1 text-xs font-medium text-gray-400">
                    {String(sectionIndex + 2).padStart(2, "0")} |
                  </p>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">
                      {section.title}
                    </h3>

                    <div className="mt-5 space-y-5">
                      {section.items.map((item) => (
                        <Link
                          key={item}
                          href={getMegaMenuHref(mobileActiveMenu, item)}
                          onClick={() => setMenuOpen(false)}
                          className={`block text-lg font-normal tracking-tight ${
                            item === "All Sale"
                              ? "text-red-500"
                              : "text-gray-800"
                          }`}
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* ACCOUNT / SERVICES */}

            <div className="mt-14 border-t border-gray-200 pt-8">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Your Haanli
              </p>

              <div className="divide-y divide-gray-100">
                <Link
                  href="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-4 text-base text-gray-900"
                >
                  <span>Favourites</span>

                  <span className="text-sm text-gray-500">{wishlistCount}</span>
                </Link>

                <Link
                  href="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 text-base text-gray-900"
                >
                  Orders
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 text-base text-gray-900"
                >
                  Help & Contact
                </Link>

                {session?.user && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-base text-gray-900">
                      Notifications
                    </span>

                    <UserNotificationBell />
                  </div>
                )}
              </div>
            </div>

            {/* ACCOUNT */}

            {session?.user ? (
              <div className="mt-10 border-t border-gray-200 pt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Account
                </p>

                <p className="mt-4 text-lg font-medium text-gray-950">
                  Hi, {session.user.name?.split(" ")[0] || "User"}
                </p>

                <div className="mt-5 space-y-4">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block text-base text-gray-700"
                  >
                    Profile
                  </Link>

                  {(
                    session.user as {
                      role?: string;
                    }
                  )?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block text-base font-medium text-indigo-600"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);

                      signOut();
                    }}
                    className="block text-left text-base text-red-500"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-10 grid grid-cols-2 gap-3 border-t border-gray-200 pt-8">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-12 items-center justify-center border border-gray-950 text-sm font-semibold text-gray-950"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-12 items-center justify-center bg-gray-950 text-sm font-semibold text-white"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
