import Link from "next/link";
import Newsletter from "@/components/Newsletter";

export default function Footer() {
  return (
    <>
      <Newsletter />
      <footer className="mt-auto bg-gray-900 text-gray-400">
        <div className="mx-auto max-w-6xl px-6 py-14">

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                Haanli Bazaar
              </h3>
              <p className="text-sm leading-relaxed">
                Pakistan&apos;s trusted online marketplace. Free shipping nationwide and 7-day returns on every order.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Shop</h3>
              <div className="flex flex-col gap-2.5">
                <Link href="/products" className="text-sm hover:text-white transition">
                  All Products
                </Link>
                <Link href="/cart" className="text-sm hover:text-white transition">
                  Cart
                </Link>
                <Link href="/wishlist" className="text-sm hover:text-white transition">
                  Wishlist
                </Link>
                <Link href="/contact" className="text-sm hover:text-white transition">
                  Contact Us
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Account</h3>
              <div className="flex flex-col gap-2.5">
                <Link href="/profile" className="text-sm hover:text-white transition">
                  My Profile
                </Link>
                <Link href="/orders" className="text-sm hover:text-white transition">
                  My Orders
                </Link>
                <Link href="/login" className="text-sm hover:text-white transition">
                  Login
                </Link>
                <Link href="/register" className="text-sm hover:text-white transition">
                  Register
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Get in Touch</h3>
              <div className="flex flex-col gap-2.5 text-sm">
                <span>Pakistan</span>
                <a href="mailto:urwaabbasahssan@gmail.com" className="hover:text-white transition break-all">
                  urwaabbasahssan@gmail.com
                </a>
                <a href="https://haanlibazaar.vercel.app" className="hover:text-white transition">
                  haanlibazaar.vercel.app
                </a>
              </div>
            </div>

          </div>

          <div className="mt-12 border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Haanli Bazaar. All Rights Reserved.
            </p>
            <p className="text-xs text-gray-500">
              Developed by Urwa Abbas
            </p>
          </div>

        </div>
      </footer>
    </>
  );
}