import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Link from "next/link";

export default function Footer(){
  return(
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">

        <div className="grid grid-cols-3 gap-8">

          <div>
            <h3 className="text-white font-bold mb-2">Haanli Bazaar</h3>
            <p className="text-sm">
              Online Shopping Store 
            </p>

          </div>
          
          <div>
            <h3 className="text-white font-bold mb-2 ">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link href="product" className="text-sm hover:text-white transition">
              Products
              </Link>

              <Link href="cart" className="text-sm hover:text-white transition">
              Cart
              </Link>
              <Link href="wishlist" className="text-sm hover:text-white transition">
              Wishlist
              </Link>

            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2">Account</h3>
            <div className="flex flex-col gap-2">
              <Link href="login" className="text-sm hover:text-white transition">Login</Link>
              <Link href="register" className="text-sm hover:text-white transition">SignIn</Link>


            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
          © {new Date().getFullYear()}Haanli Bazaar . All Rights are Reserved.
        </div>
      </div>

    </footer>
  );
};

