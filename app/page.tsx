import Link from "next/link";

const features = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    desc: "Optimized for speed with Next.js App Router and server-side rendering.",
  },
  {
    icon: "🔐",
    title: "Secure Auth",
    desc: "JWT-based authentication with email verification and protected routes.",
  },
  {
    icon: "🛒",
    title: "Smart Cart",
    desc: "Persistent cart and wishlist synced to your account across devices.",
  },
  {
    icon: "📦",
    title: "Rich Catalog",
    desc: "30+ curated products across Electronics, Apparel, Fitness & Home.",
  },
  {
    icon: "🔍",
    title: "Search & Filter",
    desc: "Real-time search with category filters and price sorting built in.",
  },
  {
    icon: "📱",
    title: "Fully Responsive",
    desc: "Seamless experience across mobile, tablet, and desktop screens.",
  },
];

const categories = [
  { name: "Electronics", emoji: "💻", count: 7 },
  { name: "Apparel", emoji: "👗", count: 8 },
  { name: "Home & Living", emoji: "🏠", count: 8 },
  { name: "Fitness", emoji: "💪", count: 7 },
];

const stats = [
  { value: "30+", label: "Products" },
  { value: "4", label: "Categories" },
  { value: "100%", label: "Secure" },
  { value: "Free", label: "Shipping" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-indigo-950 via-indigo-800 to-indigo-600 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/20 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Now Live — Full Stack E-Commerce Platform
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-none">
            Where Style Meets
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white mt-2">
              Tradition.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-indigo-200 max-w-xl leading-relaxed">
            Discover premium products across Electronics, Apparel, Fitness, and Home — built with Next.js, MongoDB, and NextAuth.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl text-sm hover:bg-indigo-50 transition shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Shop Now →
            </Link>
            <Link
              href="/register"
              className="border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-sm hover:bg-white/10 transition backdrop-blur-sm"
            >
              Create Account
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-2xl">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs font-semibold text-indigo-300 mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Browse by Category</p>
            <h2 className="text-3xl font-black text-gray-900">Shop What You Love</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href="/products"
                className="group bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-indigo-300 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <h3 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{cat.count} products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Built to Impress</p>
            <h2 className="text-3xl font-black text-gray-900">Everything a Modern Store Needs</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm">
              Production-grade features built with Next.js 15, TypeScript, MongoDB, and NextAuth.js.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl mb-4 group-hover:border-indigo-200 transition shadow-sm">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK BADGE ─────────────────────────────── */}
      <section className="bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Tech Stack</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Next.js 15", "TypeScript", "MongoDB", "Mongoose", "NextAuth.js", "Tailwind CSS", "Vercel", "Node.js", "bcrypt", "Nodemailer"].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-gray-800 text-gray-300 text-xs font-bold rounded-full border border-gray-700 hover:border-indigo-500 hover:text-white transition"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Ready to explore the store?
          </h2>
          <p className="text-indigo-200 mb-8 text-sm leading-relaxed">
            Sign up for free, verify your email, and start shopping — cart and wishlist are synced to your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl text-sm hover:bg-indigo-50 transition shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/products"
              className="border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-sm hover:bg-white/10 transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}