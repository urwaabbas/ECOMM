"use client";

import { useEffect, useState } from "react";
import { useShopping } from "@/components/ShoppingProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPricePKR } from "@/lib/utilis";

type PaymentMethod = "stripe" | "cod";
type CheckoutStep = "shipping" | "billing" | "review";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { cartItems } = useShopping();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");

  const [step, setStep] = useState<CheckoutStep>("shipping");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setName((current) => current || session.user?.name || "");

      setEmail((current) => current || session.user?.email || "");
    }
  }, [session]);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
    0,
  );

  const originalTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalSavings = Math.max(originalTotal - subtotal, 0);

  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const validateShipping = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim()
    ) {
      alert("Please fill in all delivery information.");
      return false;
    }

    return true;
  };

  const validateBilling = () => {
    if (sameAsShipping) return true;

    if (
      !billingName.trim() ||
      !billingAddress.trim() ||
      !billingCity.trim() ||
      !billingPhone.trim()
    ) {
      alert("Please fill in all billing information.");
      return false;
    }

    return true;
  };

  const handleShippingNext = () => {
    if (!validateShipping()) return;

    if (paymentMethod === "stripe") {
      handleStripePayment();
      return;
    }

    setStep("billing");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          shippingInfo: {
            name,
            email,
            phone,
            address,
            city,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to start payment.");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Unable to start Stripe checkout.");
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
        ? {
            name,
            address,
            city,
            phone,
          }
        : {
            name: billingName,
            address: billingAddress,
            city: billingCity,
            phone: billingPhone,
          };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingInfo: {
            name,
            email,
            phone,
            address,
            city,
          },
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
      <div className="min-h-[70vh] bg-[#f7f7f7] px-4 py-16">
        <div className="mx-auto max-w-lg border border-gray-200 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-7 w-7 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.7}
                d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m7-10a4 4 0 100-8 4 4 0 000 8zm8-3v6m3-3h-6"
              />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-950">
            Login Required
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please sign in before continuing to checkout.
          </p>

          <Link
            href={`/login?callbackUrl=${encodeURIComponent("/checkout")}`}
            className="mt-6 inline-flex min-w-44 justify-center bg-gray-950 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#f7f7f7] px-4 py-16">
        <div className="mx-auto max-w-lg border border-gray-200 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-7 w-7 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.7}
                d="M3 3h2l2.4 10.2a2 2 0 002 1.55h7.8a2 2 0 001.95-1.55L21 6H7"
              />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-950">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add products before starting checkout.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex min-w-44 justify-center bg-gray-950 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-6">
          <Link
            href="/cart"
            className="text-sm font-medium text-gray-500 transition hover:text-indigo-600"
          >
            ← Back to Cart
          </Link>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
            Checkout
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Complete your delivery and payment information.
          </p>
        </div>

        {/* PROGRESS */}

        <div className="mb-6 border border-gray-200 bg-white px-5 py-4">
          {paymentMethod === "stripe" ? (
            /* STRIPE FLOW: Delivery → Secure Payment */
            <div className="flex items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-950 text-xs font-bold text-white">
                  1
                </div>

                <span className="hidden text-sm font-semibold text-gray-950 sm:block">
                  Delivery
                </span>

                <div className="mx-3 h-px flex-1 bg-gray-200 sm:mx-5" />
              </div>

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-400">
                  2
                </div>

                <span className="hidden text-sm font-semibold text-gray-400 sm:block">
                  Secure Payment
                </span>
              </div>
            </div>
          ) : (
            /* COD FLOW: Delivery → Billing → Review */
            <div className="flex items-center gap-2 sm:gap-4">
              {[
                {
                  key: "shipping",
                  label: "Delivery",
                },
                {
                  key: "billing",
                  label: "Billing",
                },
                {
                  key: "review",
                  label: "Review",
                },
              ].map((item, index) => {
                const order = ["shipping", "billing", "review"];

                const currentIndex = order.indexOf(step);

                const complete = currentIndex > index;
                const active = step === item.key;

                return (
                  <div
                    key={item.key}
                    className="flex min-w-0 flex-1 items-center gap-2"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        complete
                          ? "bg-emerald-600 text-white"
                          : active
                            ? "bg-gray-950 text-white"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {complete ? "✓" : index + 1}
                    </div>

                    <span
                      className={`hidden text-sm font-semibold sm:block ${
                        active
                          ? "text-gray-950"
                          : complete
                            ? "text-emerald-600"
                            : "text-gray-400"
                      }`}
                    >
                      {item.label}
                    </span>

                    {index < 2 && (
                      <div
                        className={`ml-auto h-px flex-1 ${
                          complete ? "bg-emerald-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* LEFT */}

          <div className="min-w-0 space-y-5">
            {/* SHIPPING */}

            {step === "shipping" && (
              <section className="border border-gray-200 bg-white p-5 sm:p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-950">
                    Delivery Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Enter the address where you want your order delivered.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03XX-XXXXXXX"
                      className="w-full border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      City
                    </label>

                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Lahore, Karachi, Islamabad..."
                      className="w-full border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Street Address
                    </label>

                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House No, Street, Area"
                      className="w-full border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900"
                    />
                  </div>
                </div>

                {/* PAYMENT METHOD */}

                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-950">
                    Payment Method
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Choose how you want to pay for your order.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("stripe")}
                      className={`flex items-center gap-4 border p-4 text-left transition ${
                        paymentMethod === "stripe"
                          ? "border-gray-950 bg-gray-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          paymentMethod === "stripe"
                            ? "bg-gray-950 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
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
                            strokeWidth={1.8}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-950">
                          Pay Online
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Secure payment with Stripe
                        </p>
                      </div>

                      {paymentMethod === "stripe" && (
                        <span className="ml-auto text-lg font-bold text-gray-950">
                          ✓
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex items-center gap-4 border p-4 text-left transition ${
                        paymentMethod === "cod"
                          ? "border-gray-950 bg-gray-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          paymentMethod === "cod"
                            ? "bg-gray-950 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
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
                            strokeWidth={1.8}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                          />
                        </svg>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-950">
                          Cash on Delivery
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Pay when your order arrives
                        </p>
                      </div>

                      {paymentMethod === "cod" && (
                        <span className="ml-auto text-lg font-bold text-gray-950">
                          ✓
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleShippingNext}
                  disabled={loading}
                  className="mt-7 w-full bg-gray-950 px-5 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : paymentMethod === "cod"
                      ? "Continue to Billing"
                      : "Proceed to Secure Payment"}
                </button>
              </section>
            )}

            {/* BILLING */}

            {step === "billing" && paymentMethod === "cod" && (
              <section className="border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="text-xl font-bold text-gray-950">
                  Billing Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Confirm the billing details for this order.
                </p>

                <label className="mt-6 flex cursor-pointer items-center gap-3 border border-gray-200 bg-gray-50 p-4">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    Billing address is the same as delivery address
                  </span>
                </label>

                {!sameAsShipping && (
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Full Name
                      </label>

                      <input
                        type="text"
                        value={billingName}
                        onChange={(e) => setBillingName(e.target.value)}
                        placeholder="Billing name"
                        className="w-full border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none focus:border-gray-900"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        value={billingPhone}
                        onChange={(e) => setBillingPhone(e.target.value)}
                        placeholder="03XX-XXXXXXX"
                        className="w-full border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none focus:border-gray-900"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        City
                      </label>

                      <input
                        type="text"
                        value={billingCity}
                        onChange={(e) => setBillingCity(e.target.value)}
                        placeholder="City"
                        className="w-full border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none focus:border-gray-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Billing Address
                      </label>

                      <input
                        type="text"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        placeholder="House No, Street, Area"
                        className="w-full border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none focus:border-gray-900"
                      />
                    </div>
                  </div>
                )}

                {sameAsShipping && (
                  <div className="mt-5 border border-gray-200 p-4">
                    <p className="text-sm font-semibold text-gray-950">
                      {name}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {address}, {city}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">{phone}</p>
                  </div>
                )}

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="border border-gray-300 bg-white px-5 py-4 text-sm font-semibold text-gray-700 hover:border-gray-900"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    onClick={handleBillingNext}
                    className="bg-gray-950 px-5 py-4 text-sm font-bold text-white hover:bg-indigo-600"
                  >
                    Review Order →
                  </button>
                </div>
              </section>
            )}

            {/* REVIEW */}

            {step === "review" && paymentMethod === "cod" && (
              <section className="border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="text-xl font-bold text-gray-950">
                  Review Your Order
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Check your information before placing the order.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="border border-gray-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                      Delivery To
                    </p>

                    <p className="mt-3 text-sm font-bold text-gray-950">
                      {name}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {address}, {city}
                    </p>

                    <p className="text-sm text-gray-600">{phone}</p>

                    <p className="text-sm text-gray-600">{email}</p>
                  </div>

                  <div className="border border-gray-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                      Billing
                    </p>

                    {sameAsShipping ? (
                      <>
                        <p className="mt-3 text-sm font-bold text-gray-950">
                          {name}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          Same as delivery address
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mt-3 text-sm font-bold text-gray-950">
                          {billingName}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          {billingAddress}, {billingCity}
                        </p>

                        <p className="text-sm text-gray-600">{billingPhone}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-5 border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                      />
                    </svg>

                    <div>
                      <p className="text-sm font-bold text-gray-950">
                        Cash on Delivery
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        You will pay <strong>{formatPricePKR(total)}</strong>{" "}
                        when your order is delivered.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("billing")}
                    className="border border-gray-300 bg-white px-5 py-4 text-sm font-semibold text-gray-700 hover:border-gray-900"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    onClick={handleCODOrder}
                    disabled={loading}
                    className="bg-gray-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:opacity-50"
                  >
                    {loading ? "Placing Order..." : "Place COD Order"}
                  </button>
                </div>
              </section>
            )}

            {/* PACKAGE / ITEMS */}

            <section className="border border-gray-200 bg-white">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <div>
                  <h2 className="text-base font-bold text-gray-950">
                    Package 1 of 1
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Shipped by Haanli Bazaar
                  </p>
                </div>

                <span className="text-xs font-semibold text-emerald-600">
                  Free Delivery
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => {
                  const itemPrice = item.discountPrice || item.price;

                  const discountPercent =
                    item.discountPrice && item.discountPrice < item.price
                      ? Math.round(
                          ((item.price - item.discountPrice) / item.price) *
                            100,
                        )
                      : null;

                  return (
                    <div key={item.productId} className="flex gap-4 p-4 sm:p-5">
                      <Link
                        href={`/products/${item.productId}`}
                        className="relative h-24 w-24 shrink-0 overflow-hidden bg-gray-100"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-2xl text-gray-300">
                            📦
                          </div>
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                          <div>
                            <Link href={`/products/${item.productId}`}>
                              <h3 className="text-sm font-semibold text-gray-950 hover:text-indigo-600">
                                {item.title}
                              </h3>
                            </Link>

                            <p className="mt-1 text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>

                          <div className="sm:text-right">
                            <p className="text-base font-bold text-gray-950">
                              {formatPricePKR(itemPrice * item.quantity)}
                            </p>

                            {discountPercent !== null && (
                              <p className="mt-1 text-xs font-semibold text-red-600">
                                {discountPercent}% OFF
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ORDER SUMMARY */}

          <aside>
            <div className="border border-gray-200 bg-white p-5 lg:sticky lg:top-28">
              <h2 className="text-xl font-bold text-gray-950">Order Summary</h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">
                    Items Total ({totalQuantity})
                  </span>

                  <span className="font-semibold text-gray-950">
                    {formatPricePKR(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Delivery Fee</span>

                  <span className="font-semibold text-emerald-600">Free</span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Savings</span>

                    <span className="font-semibold text-red-600">
                      -{formatPricePKR(totalSavings)}
                    </span>
                  </div>
                )}
              </div>

              <div className="my-5 border-t border-gray-200" />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-base font-bold text-gray-950">Total</p>

                  <p className="mt-1 text-xs text-gray-400">
                    Final order amount
                  </p>
                </div>

                <p className="text-2xl font-bold text-gray-950">
                  {formatPricePKR(total)}
                </p>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.7}
                      d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 10-6 0v2c0 1.657 1.343 3 3 3zm-6 0h12v9H6v-9z"
                    />
                  </svg>

                  <div>
                    <p className="text-sm font-semibold text-gray-950">
                      Secure Checkout
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Payments are handled securely.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.7}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>

                  <div>
                    <p className="text-sm font-semibold text-gray-950">
                      Order Review
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Check your details before placing your order.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
