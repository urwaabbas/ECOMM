import Link from "next/link";
import Newsletter from "@/components/Newsletter";

export default function Footer() {
  return (
    <>
      <Newsletter />
      <footer className="mt-auto bg-gray-900 text-gray-400">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="mb-2 font-bold text-white">Haanli Bazaar</h3>
              <p className="text-sm">Online Shopping Store</p>
            </div>

            <div>
              <h3 className="mb-2 font-bold text-white">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <Link href="/products" className="text-sm transition hover:text-white">
                  Products
                </Link>
                <Link href="/cart" className="text-sm transition hover:text-white">
                  Cart
                </Link>
                <Link href="/wishlist" className="text-sm transition hover:text-white">
                  Wishlist
                </Link>
                <Link href="/contact" className="text-sm transition hover:text-white">
                  Contact Us
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 font-bold text-white">Account</h3>
              <div className="flex flex-col gap-2">
                <Link href="/profile" className="text-sm transition hover:text-white">
                  Profile
                </Link>
                <Link href="/login" className="text-sm transition hover:text-white">
                  Login
                </Link>
                <Link href="/register" className="text-sm transition hover:text-white">
                  Register
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-800 pt-6 text-center text-xs">
            © {new Date().getFullYear()} Haanli Bazaar. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
}