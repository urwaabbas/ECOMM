"use client";

import { useShopping } from "@/components/ShoppingProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPricePKR } from "@/lib/utilis";

type PaymentMethod = "stripe" | "cod";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { cartItems, clearCart } = useShopping();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [step, setStep] = useState<"shipping" | "billing" | "review">(
    "shipping",
  );

  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.discountPrice || item.price) * item.quantity;
  }, 0);

  const validateShipping = () => {
    if (!name || !email || !phone || !address || !city) {
      alert("Please fill in all shipping details");
      return false;
    }
    return true;
  };

  const validateBilling = () => {
    if (sameAsShipping) return true;
    if (!billingName || !billingAddress || !billingCity || !billingPhone) {
      alert("Please fill in all billing details");
      return false;
    }
    return true;
  };

  const handleShippingNext = () => {
    if (!validateShipping()) return;
    if (paymentMethod === "cod") {
      setStep("billing");
    } else {
      handleStripePayment();
    }
  };

  const handleBillingNext = () => {
    if (!validateBilling()) return;
    setStep("review");
  };

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          shippingInfo: { name, email, phone, address, city },
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCODOrder = async () => {
    setLoading(true);
    try {
      const finalBilling = sameAsShipping
        ? { name, address, city, phone }
        : {
            name: billingName,
            address: billingAddress,
            city: billingCity,
            phone: billingPhone,
          };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingInfo: { name, email, phone, address, city },
          billingInfo: finalBilling,
          paymentMethod: "cod",
          shipping: 0,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/orders?cod=success&orderId=${data.order._id}`);
      } else {
        alert(data.error || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("COD order error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-600 mb-4">Please login to checkout</p>
        <Link
          href="/login"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Login
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <Link
          href="/products"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>

        <div className="flex items-center gap-2 mb-6">
          {["shipping", "billing", "review"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step === s
                    ? "bg-indigo-600 text-white"
                    : ["shipping", "billing", "review"].indexOf(step) > i
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {["shipping", "billing", "review"].indexOf(step) > i
                  ? "✓"
                  : i + 1}
              </div>
              <span
                className={`text-xs font-medium capitalize ${step === s ? "text-indigo-600" : "text-gray-400"}`}
              >
                {s}
              </span>
              {i < 2 && <div className="h-px w-6 bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Order Summary
          </h2>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-sm"
              >
                <span className="text-gray-600">
                  {item.title} x {item.quantity}
                </span>
                <span className="text-gray-900 font-medium">
                  {formatPricePKR(
                    (item.discountPrice || item.price) * item.quantity,
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-indigo-600">
              {formatPricePKR(total)}
            </span>
          </div>
        </div>

        {step === "shipping" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Shipping Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House No, Street, Area"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Lahore, Karachi, Islamabad..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Payment Method
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("stripe")}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition ${
                    paymentMethod === "stripe"
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">
                    Pay Online
                  </span>
                  <span className="text-xs text-gray-400">
                    Visa, Mastercard
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition ${
                    paymentMethod === "cod"
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">
                    Cash on Delivery
                  </span>
                  <span className="text-xs text-gray-400">
                    Pay when delivered
                  </span>
                </button>
              </div>
            </div>

            <button
              onClick={handleShippingNext}
              disabled={loading}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : paymentMethod === "cod"
                  ? "Continue to Billing →"
                  : "Pay Now with Card"}
            </button>
          </div>
        )}

        {step === "billing" && paymentMethod === "cod" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Billing Information
            </h2>

            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                id="sameAsShipping"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
                className="h-4 w-4 text-indigo-600 rounded"
              />
              <label
                htmlFor="sameAsShipping"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Billing address same as shipping address
              </label>
            </div>

            {!sameAsShipping && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    placeholder="Billing name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={billingPhone}
                    onChange={(e) => setBillingPhone(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Address
                  </label>
                  <input
                    type="text"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    placeholder="House No, Street, Area"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={billingCity}
                    onChange={(e) => setBillingCity(e.target.value)}
                    placeholder="City"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep("shipping")}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleBillingNext}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                Review Order →
              </button>
            </div>
          </div>
        )}

        {step === "review" && paymentMethod === "cod" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Review Your Order
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Shipping To
                </p>
                <p className="text-sm font-semibold text-gray-900">{name}</p>
                <p className="text-sm text-gray-600">
                  {address}, {city}
                </p>
                <p className="text-sm text-gray-600">{phone}</p>
                <p className="text-sm text-gray-600">{email}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Billing Address
                </p>
                {sameAsShipping ? (
                  <p className="text-sm text-gray-600">
                    Same as shipping address
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-900">
                      {billingName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {billingAddress}, {billingCity}
                    </p>
                    <p className="text-sm text-gray-600">{billingPhone}</p>
                  </>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <svg
                    className="h-4 w-4 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-sm font-bold text-gray-900">
                    Cash on Delivery
                  </p>
                </div>
                <p className="text-xs text-gray-700">
                  You will pay{" "}
                  <strong className="text-indigo-600">
                    {formatPricePKR(total)}
                  </strong>{" "}
                  in cash when your order is delivered.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep("billing")}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleCODOrder}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place COD Order"}
              </button>
            </div>
          </div>
        )}

        <Link
          href="/cart"
          className="block text-center text-sm text-gray-500 mt-4 hover:text-indigo-600 transition"
        >
          ← Back to Cart
        </Link>
      </div>
    </div>
  );
}
