"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
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
      items: ["New Arrivals", "Best Sellers", "Trending", "Latest Products"],
    },
    {
      title: "Shop",
      items: ["Fashion", "Electronics", "Accessories", "Deals"],
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
      items: ["Sneakers", "Casual Shoes", "Sports Shoes", "Shop All"],
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
      items: ["Chargers", "Cases", "Keyboards", "Power Banks"],
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
      items: ["Today's Deals", "Best Discounts", "Clearance", "Shop All Sale"],
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

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount, wishlistCount } = useShopping();

  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [helpOpen, setHelpOpen] = useState(false);
  const [topAccountOpen, setTopAccountOpen] = useState(false);

  const helpRef = useRef<HTMLDivElement>(null);
  const topAccountRef = useRef<HTMLDivElement>(null);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      router.push("/products");
      return;
    }

    router.push(`/products?search=${encodeURIComponent(value)}`);

    setMenuOpen(false);
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
    setMegaMenu(null);
    setHelpOpen(false);
    setTopAccountOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* TOP UTILITY BAR */}

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

          {/* LOGGED IN USER */}

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
              {/* NOT LOGGED IN */}

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

      {/* MAIN NAVBAR */}

      <nav
        className="relative border-b border-gray-100 bg-white"
        onMouseLeave={() => setMegaMenu(null)}
      >
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-4 md:px-6">
          {/* LOGO */}

          <Link
            href="/"
            className="shrink-0 text-xl font-black tracking-tight text-indigo-600"
          >
            Haanli Bazaar
          </Link>

          {/* DESKTOP CATEGORIES */}

          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {mainNavigation.map((item) => (
              <button
                key={item}
                type="button"
                onMouseEnter={() => setMegaMenu(item)}
                onFocus={() => setMegaMenu(item)}
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
            {/* SEARCH */}

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

            {/* SEARCH ICON FOR MEDIUM SCREENS */}

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

            {/* WISHLIST */}

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

            {/* CART */}

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

            {/* NOTIFICATIONS */}

            {session?.user && <UserNotificationBell />}
          </div>

          {/* MOBILE CONTROLS */}

          <div className="flex items-center gap-1 md:hidden">
            {session?.user && <UserNotificationBell />}

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-800 transition hover:bg-gray-100"
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
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-800 transition hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* MEGA MENU */}

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
                        href="/products"
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

        {/* MOBILE MENU */}

        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-5 pb-6 pt-4 md:hidden">
            {/* MOBILE SEARCH */}

            <form onSubmit={handleSearch} className="relative mb-5">
              <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-600"
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
                placeholder="Search products"
                className="h-12 w-full rounded-full bg-gray-100 pl-12 pr-4 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-200"
              />
            </form>

            {/* MOBILE SHOPPING LINKS */}

            <div className="border-b border-gray-100 pb-4">
              {mainNavigation.map((item) => (
                <Link
                  key={item}
                  href="/products"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between py-3 text-lg font-semibold ${
                    item === "Sale" ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {item}

                  <span className="text-xl font-normal text-gray-400">›</span>
                </Link>
              ))}
            </div>

            {/* MOBILE ACCOUNT LINKS */}

            <div className="space-y-1 pt-4">
              <Link
                href="/orders"
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm font-medium text-gray-700"
              >
                Order Status
              </Link>

              <Link
                href="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-2.5 text-sm font-medium text-gray-700"
              >
                Wishlist
                {wishlistCount > 0 && (
                  <span className="rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm font-medium text-gray-700"
              >
                Help & Contact
              </Link>

              {session?.user ? (
                <>
                  <div className="my-3 border-t border-gray-100" />

                  <p className="pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Account
                  </p>

                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block py-2.5 text-sm font-medium text-gray-700"
                  >
                    Profile
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="block py-2.5 text-sm font-medium text-gray-700"
                  >
                    Orders
                  </Link>

                  {(
                    session.user as {
                      role?: string;
                    }
                  )?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2.5 text-sm font-semibold text-indigo-600"
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
                    className="block py-2.5 text-sm font-medium text-red-500"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-4">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-full border border-gray-300 py-2.5 text-center text-sm font-semibold text-gray-800"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-full bg-gray-900 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Join Us
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
