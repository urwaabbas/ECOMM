// lib/seed.ts

export const initialProducts = [
  // =========================
  // MEN
  // =========================

  {
    name: "Oxford Cotton Shirt",
    description:
      "A clean everyday Oxford shirt made from soft cotton with a regular fit, button-down collar, and long sleeves.",
    price: 49.99,
    discountPrice: null,
    category: "Men",
    subcategory: "Shirts",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    stock: 24,
    isFeatured: true,
  },

  {
    name: "Classic Casual Shirt",
    description:
      "A versatile men's casual shirt with a comfortable fit, lightweight fabric, and simple styling for everyday wear.",
    price: 44.99,
    discountPrice: 37.99,
    category: "Men",
    subcategory: "Shirts",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85",
    stock: 18,
    isFeatured: false,
  },

  {
    name: "Essential Cotton T-Shirt",
    description:
      "A soft crew-neck cotton T-shirt designed for everyday comfort with a clean, minimal look and regular fit.",
    price: 24.99,
    discountPrice: null,
    category: "Men",
    subcategory: "T-Shirts",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    stock: 40,
    isFeatured: true,
  },

  {
    name: "Relaxed Fit T-Shirt",
    description:
      "A relaxed men's T-shirt with a soft feel, breathable construction, and slightly oversized everyday silhouette.",
    price: 29.99,
    discountPrice: 24.99,
    category: "Men",
    subcategory: "T-Shirts",
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=85",
    stock: 32,
    isFeatured: false,
  },

  {
    name: "Classic Denim Jacket",
    description:
      "A timeless denim jacket with a structured collar, button closure, chest pockets, and a comfortable everyday fit.",
    price: 79.99,
    discountPrice: null,
    category: "Men",
    subcategory: "Jackets",
    image:
      "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?auto=format&fit=crop&w=900&q=85",
    stock: 16,
    isFeatured: true,
  },

  {
    name: "Lightweight Windbreaker",
    description:
      "A lightweight windbreaker designed for cool and windy weather with a comfortable fit and practical outer layer.",
    price: 89.99,
    discountPrice: 69.99,
    category: "Men",
    subcategory: "Jackets",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85",
    stock: 14,
    isFeatured: false,
  },

  {
    name: "Straight Fit Denim Jeans",
    description:
      "Classic straight-fit denim jeans with a comfortable mid-rise waist and durable construction for everyday use.",
    price: 59.99,
    discountPrice: null,
    category: "Men",
    subcategory: "Jeans",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85",
    stock: 28,
    isFeatured: false,
  },

  {
    name: "Slim Fit Dark Jeans",
    description:
      "Modern slim-fit denim jeans with a dark wash, clean finish, and slight stretch for improved everyday comfort.",
    price: 64.99,
    discountPrice: 54.99,
    category: "Men",
    subcategory: "Jeans",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85",
    stock: 21,
    isFeatured: false,
  },

  {
    name: "Urban Knit Sneakers",
    description:
      "Lightweight knit sneakers with breathable uppers, cushioned soles, and a modern design for casual everyday wear.",
    price: 94.99,
    discountPrice: null,
    category: "Men",
    subcategory: "Sneakers",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    stock: 19,
    isFeatured: true,
  },

  {
    name: "Everyday Low-Top Sneakers",
    description:
      "Comfortable low-top sneakers with a clean profile and cushioned sole designed for everyday casual outfits.",
    price: 84.99,
    discountPrice: 69.99,
    category: "Men",
    subcategory: "Sneakers",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85",
    stock: 22,
    isFeatured: false,
  },

  {
    name: "Classic Leather Casual Shoes",
    description:
      "Smart casual leather shoes with a clean silhouette, comfortable inner lining, and durable rubber outsole.",
    price: 109.99,
    discountPrice: null,
    category: "Men",
    subcategory: "Casual Shoes",
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&q=85",
    stock: 13,
    isFeatured: false,
  },

  {
    name: "Performance Sports Trainers",
    description:
      "Lightweight sports trainers with breathable construction, responsive cushioning, and reliable grip for active use.",
    price: 119.99,
    discountPrice: 99.99,
    category: "Men",
    subcategory: "Sports Shoes",
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=85",
    stock: 17,
    isFeatured: true,
  },

  {
    name: "Minimal Leather Backpack",
    description:
      "A streamlined everyday backpack with a spacious main compartment, secure pockets, and room for a laptop.",
    price: 89.99,
    discountPrice: null,
    category: "Men",
    subcategory: "Bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    stock: 12,
    isFeatured: false,
  },

  {
    name: "Minimal Steel Wrist Watch",
    description:
      "A clean analog wrist watch with a minimalist dial, stainless steel case, and versatile everyday styling.",
    price: 129.99,
    discountPrice: 109.99,
    category: "Men",
    subcategory: "Watches",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
    stock: 15,
    isFeatured: true,
  },

  {
    name: "Polarized Aviator Sunglasses",
    description:
      "Classic aviator sunglasses with polarized lenses, lightweight metal frames, and UV protection for everyday wear.",
    price: 54.99,
    discountPrice: 44.99,
    category: "Men",
    subcategory: "Sunglasses",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",
    stock: 30,
    isFeatured: false,
  },

  // =========================
  // WOMEN
  // =========================

  {
    name: "Floral Summer Midi Dress",
    description:
      "A lightweight floral midi dress with a flattering waistline, soft fabric, and flowing silhouette for warm-weather occasions.",
    price: 69.99,
    discountPrice: null,
    category: "Women",
    subcategory: "Dresses",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",
    stock: 24,
    isFeatured: true,
  },

  {
    name: "Elegant Satin Evening Dress",
    description:
      "A refined satin evening dress with a smooth finish, elegant neckline, and graceful silhouette for dinners and special occasions.",
    price: 119.99,
    discountPrice: 99.99,
    category: "Women",
    subcategory: "Dresses",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85",
    stock: 14,
    isFeatured: true,
  },

  {
    name: "Casual Ribbed Knit Dress",
    description:
      "A comfortable ribbed knit dress with a clean fitted shape and versatile styling for casual daytime or evening wear.",
    price: 59.99,
    discountPrice: 49.99,
    category: "Women",
    subcategory: "Dresses",
    image:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=85",
    stock: 20,
    isFeatured: false,
  },

  {
    name: "Classic Cotton Blouse",
    description:
      "A lightweight cotton blouse with a soft texture, relaxed fit, and simple styling for workdays and casual outfits.",
    price: 44.99,
    discountPrice: null,
    category: "Women",
    subcategory: "Tops",
    image:
      "https://images.unsplash.com/photo-1564257577054-641f35e1c2f3?auto=format&fit=crop&w=900&q=85",
    stock: 32,
    isFeatured: false,
  },

  {
    name: "Relaxed Everyday Top",
    description:
      "A versatile relaxed-fit top made with lightweight fabric for comfortable everyday styling across multiple seasons.",
    price: 34.99,
    discountPrice: 29.99,
    category: "Women",
    subcategory: "Tops",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
    stock: 38,
    isFeatured: true,
  },

  {
    name: "Cropped Denim Jacket",
    description:
      "A modern cropped denim jacket with classic button detailing and a versatile shape designed for easy layering.",
    price: 74.99,
    discountPrice: null,
    category: "Women",
    subcategory: "Jackets",
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=85",
    stock: 18,
    isFeatured: true,
  },

  {
    name: "Tailored Casual Blazer",
    description:
      "A polished women's blazer with clean tailoring, a comfortable lining, and a versatile fit for office or casual styling.",
    price: 94.99,
    discountPrice: 79.99,
    category: "Women",
    subcategory: "Jackets",
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=900&q=85",
    stock: 15,
    isFeatured: false,
  },

  {
    name: "High-Rise Straight Jeans",
    description:
      "High-rise denim jeans with a timeless straight-leg silhouette and slight stretch for comfortable everyday wear.",
    price: 64.99,
    discountPrice: null,
    category: "Women",
    subcategory: "Jeans",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85",
    stock: 27,
    isFeatured: false,
  },

  {
    name: "Relaxed Wide-Leg Jeans",
    description:
      "Modern wide-leg denim jeans with a comfortable high waist and relaxed silhouette for effortless casual outfits.",
    price: 69.99,
    discountPrice: 57.99,
    category: "Women",
    subcategory: "Jeans",
    image:
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=900&q=85",
    stock: 21,
    isFeatured: true,
  },

  {
    name: "Everyday White Sneakers",
    description:
      "Clean low-top sneakers with cushioned insoles and a versatile white finish designed to pair easily with everyday outfits.",
    price: 79.99,
    discountPrice: 64.99,
    category: "Women",
    subcategory: "Sneakers",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85",
    stock: 26,
    isFeatured: true,
  },

  {
    name: "Classic Pointed Heels",
    description:
      "Elegant pointed-toe heels with a balanced heel height and refined silhouette designed for formal and evening outfits.",
    price: 89.99,
    discountPrice: null,
    category: "Women",
    subcategory: "Heels",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85",
    stock: 16,
    isFeatured: false,
  },

  {
    name: "Comfort Ballet Flats",
    description:
      "Simple ballet flats with a soft inner lining, flexible sole, and timeless silhouette for comfortable everyday styling.",
    price: 59.99,
    discountPrice: 49.99,
    category: "Women",
    subcategory: "Flats",
    image:
      "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=85",
    stock: 23,
    isFeatured: false,
  },

  {
    name: "Structured Leather Handbag",
    description:
      "A structured everyday handbag with a spacious interior, secure closure, and polished design for work or casual use.",
    price: 109.99,
    discountPrice: 89.99,
    category: "Women",
    subcategory: "Bags",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
    stock: 14,
    isFeatured: true,
  },

  {
    name: "Rose Gold Minimal Watch",
    description:
      "A refined analog wrist watch featuring a minimalist dial, slim case, and elegant rose-gold styling for everyday wear.",
    price: 119.99,
    discountPrice: null,
    category: "Women",
    subcategory: "Watches",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85",
    stock: 17,
    isFeatured: true,
  },

  {
    name: "Oversized Fashion Sunglasses",
    description:
      "Oversized sunglasses with UV-protective lenses and a lightweight frame designed for stylish everyday sun protection.",
    price: 49.99,
    discountPrice: 39.99,
    category: "Women",
    subcategory: "Sunglasses",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",
    stock: 31,
    isFeatured: false,
  },

  // =========================
  // ELECTRONICS
  // =========================

  {
    name: "ProBook 14 Laptop",
    description:
      "A slim 14-inch everyday laptop with a crisp display, fast solid-state storage, and reliable performance for work, study, and entertainment.",
    price: 899.99,
    discountPrice: 799.99,
    category: "Electronics",
    subcategory: "Laptops",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
    stock: 12,
    isFeatured: true,
  },

  {
    name: "CreatorBook Pro Laptop",
    description:
      "A premium performance laptop designed for creative work, multitasking, and productivity with a high-resolution display and spacious storage.",
    price: 1299.99,
    discountPrice: null,
    category: "Electronics",
    subcategory: "Laptops",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85",
    stock: 8,
    isFeatured: true,
  },

  {
    name: "Nova X Smartphone",
    description:
      "A modern smartphone featuring a bright edge-to-edge display, powerful cameras, fast performance, and all-day battery life.",
    price: 749.99,
    discountPrice: 699.99,
    category: "Electronics",
    subcategory: "Phones",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85",
    stock: 20,
    isFeatured: true,
  },

  {
    name: "Pulse Pro Smartphone",
    description:
      "A sleek everyday smartphone with a responsive display, dependable battery life, sharp photography, and fast wireless connectivity.",
    price: 599.99,
    discountPrice: null,
    category: "Electronics",
    subcategory: "Phones",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85",
    stock: 18,
    isFeatured: false,
  },

  {
    name: "Premium Wireless Headphones",
    description:
      "Over-ear wireless headphones with rich sound, active noise cancellation, comfortable ear cushions, and up to 40 hours of battery life.",
    price: 299.99,
    discountPrice: 249.99,
    category: "Electronics",
    subcategory: "Headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    stock: 24,
    isFeatured: true,
  },

  {
    name: "Studio Over-Ear Headphones",
    description:
      "Comfortable over-ear headphones designed for detailed listening with balanced audio, padded ear cups, and a durable adjustable headband.",
    price: 179.99,
    discountPrice: null,
    category: "Electronics",
    subcategory: "Headphones",
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=85",
    stock: 17,
    isFeatured: false,
  },

  {
    name: "Compact Wireless Earbuds",
    description:
      "Compact true wireless earbuds with clear audio, touch controls, a portable charging case, and a secure everyday fit.",
    price: 99.99,
    discountPrice: 79.99,
    category: "Electronics",
    subcategory: "Headphones",
    image:
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=900&q=85",
    stock: 36,
    isFeatured: true,
  },

  {
    name: "Mirrorless Creator Camera",
    description:
      "A compact mirrorless camera with interchangeable lens support, high-resolution photography, and smooth video recording for creators.",
    price: 1099.99,
    discountPrice: 999.99,
    category: "Electronics",
    subcategory: "Cameras",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
    stock: 9,
    isFeatured: true,
  },

  {
    name: "Classic Digital Camera",
    description:
      "An easy-to-use digital camera with sharp image quality, manual controls, dependable autofocus, and a lightweight travel-friendly body.",
    price: 749.99,
    discountPrice: null,
    category: "Electronics",
    subcategory: "Cameras",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=85",
    stock: 11,
    isFeatured: false,
  },

  {
    name: "65W USB-C Fast Charger",
    description:
      "A compact USB-C wall charger delivering up to 65 watts of fast charging for compatible laptops, tablets, phones, and accessories.",
    price: 49.99,
    discountPrice: 39.99,
    category: "Electronics",
    subcategory: "Chargers",
    image:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=85",
    stock: 42,
    isFeatured: false,
  },

  {
    name: "Dual-Port Travel Charger",
    description:
      "A lightweight dual-port charging adapter designed to charge two compatible devices while keeping your travel setup simple.",
    price: 34.99,
    discountPrice: null,
    category: "Electronics",
    subcategory: "Chargers",
    image:
      "https://images.unsplash.com/photo-1600490722773-35753aea6332?auto=format&fit=crop&w=900&q=85",
    stock: 50,
    isFeatured: false,
  },

  {
    name: "Ergonomic Mechanical Keyboard",
    description:
      "A responsive mechanical keyboard with tactile switches, wireless connectivity, comfortable key spacing, and customizable backlighting.",
    price: 129.99,
    discountPrice: 109.99,
    category: "Electronics",
    subcategory: "Keyboards",
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=85",
    stock: 25,
    isFeatured: true,
  },

  {
    name: "Compact Wireless Keyboard",
    description:
      "A slim wireless keyboard with quiet keys, compact dimensions, reliable connectivity, and a clean layout for home or office desks.",
    price: 69.99,
    discountPrice: null,
    category: "Electronics",
    subcategory: "Keyboards",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",
    stock: 31,
    isFeatured: false,
  },

  {
    name: "20000mAh Fast Power Bank",
    description:
      "A high-capacity portable power bank with fast charging support, multiple device ports, and enough capacity for extended travel.",
    price: 59.99,
    discountPrice: 49.99,
    category: "Electronics",
    subcategory: "Power Banks",
    image:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=85",
    stock: 34,
    isFeatured: true,
  },

  {
    name: "Slim 10000mAh Power Bank",
    description:
      "A compact portable battery with a slim profile, dependable charging capacity, and convenient USB connectivity for everyday carry.",
    price: 39.99,
    discountPrice: null,
    category: "Electronics",
    subcategory: "Power Banks",
    image:
      "https://images.unsplash.com/photo-1594843665794-446ce915d840?auto=format&fit=crop&w=900&q=85",
    stock: 47,
    isFeatured: false,
  },

    // =========================
  // ACCESSORIES
  // =========================

  {
    name: "Classic Leather Backpack",
    description:
      "A refined everyday backpack with a spacious main compartment, padded laptop sleeve, adjustable straps, and durable leather-inspired finish.",
    price: 89.99,
    discountPrice: null,
    category: "Accessories",
    subcategory: "Bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    stock: 22,
    isFeatured: true,
  },

  {
    name: "Minimal Canvas Tote Bag",
    description:
      "A lightweight canvas tote with a spacious interior and comfortable handles for shopping, work, and everyday essentials.",
    price: 39.99,
    discountPrice: 32.99,
    category: "Accessories",
    subcategory: "Bags",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85",
    stock: 34,
    isFeatured: false,
  },

  {
    name: "Compact Crossbody Bag",
    description:
      "A compact crossbody bag with an adjustable shoulder strap, secure closure, and practical compartments for everyday essentials.",
    price: 59.99,
    discountPrice: null,
    category: "Accessories",
    subcategory: "Bags",
    image:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=85",
    stock: 27,
    isFeatured: true,
  },

  {
    name: "Premium Travel Duffel Bag",
    description:
      "A spacious travel duffel with reinforced handles, adjustable shoulder strap, and multiple compartments for weekend trips and gym use.",
    price: 99.99,
    discountPrice: 84.99,
    category: "Accessories",
    subcategory: "Bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    stock: 16,
    isFeatured: false,
  },

  {
    name: "Classic Silver Wrist Watch",
    description:
      "A timeless analog wrist watch with a clean dial, stainless steel case, and polished bracelet suitable for everyday or formal wear.",
    price: 149.99,
    discountPrice: null,
    category: "Accessories",
    subcategory: "Watches",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
    stock: 18,
    isFeatured: true,
  },

  {
    name: "Minimal Black Dial Watch",
    description:
      "A modern minimalist watch featuring a clean black dial, slim case, and comfortable strap for versatile everyday styling.",
    price: 119.99,
    discountPrice: 99.99,
    category: "Accessories",
    subcategory: "Watches",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85",
    stock: 20,
    isFeatured: false,
  },

  {
    name: "Luxury Chronograph Watch",
    description:
      "A sophisticated chronograph watch with detailed subdials, polished metal construction, and a premium design for formal occasions.",
    price: 229.99,
    discountPrice: 199.99,
    category: "Accessories",
    subcategory: "Watches",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=85",
    stock: 11,
    isFeatured: true,
  },

  {
    name: "Classic Leather Strap Watch",
    description:
      "An elegant analog watch featuring a traditional leather strap, simple hour markers, and a versatile design for daily wear.",
    price: 99.99,
    discountPrice: null,
    category: "Accessories",
    subcategory: "Watches",
    image:
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=900&q=85",
    stock: 23,
    isFeatured: false,
  },

  {
    name: "Polarized Classic Sunglasses",
    description:
      "Versatile polarized sunglasses with lightweight frames, UV protection, and a classic silhouette suitable for everyday use.",
    price: 54.99,
    discountPrice: null,
    category: "Accessories",
    subcategory: "Sunglasses",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",
    stock: 38,
    isFeatured: true,
  },

  {
    name: "Modern Square Sunglasses",
    description:
      "Bold square-frame sunglasses with UV-protective lenses and a lightweight construction designed for contemporary everyday styling.",
    price: 64.99,
    discountPrice: 49.99,
    category: "Accessories",
    subcategory: "Sunglasses",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=85",
    stock: 29,
    isFeatured: false,
  },

  {
    name: "Retro Round Sunglasses",
    description:
      "Retro-inspired round sunglasses featuring tinted UV-protective lenses and lightweight frames for a distinctive casual look.",
    price: 49.99,
    discountPrice: 39.99,
    category: "Accessories",
    subcategory: "Sunglasses",
    image:
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=900&q=85",
    stock: 33,
    isFeatured: false,
  },

  {
    name: "Premium Aviator Sunglasses",
    description:
      "Classic aviator sunglasses with a slim metal frame, polarized lenses, and full UV protection for comfortable outdoor wear.",
    price: 69.99,
    discountPrice: null,
    category: "Accessories",
    subcategory: "Sunglasses",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",
    stock: 25,
    isFeatured: true,
  },

  {
    name: "Classic Leather Bifold Wallet",
    description:
      "A slim bifold wallet with multiple card slots, a spacious cash compartment, and a clean leather-inspired finish.",
    price: 44.99,
    discountPrice: null,
    category: "Accessories",
    subcategory: "Wallets",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85",
    stock: 41,
    isFeatured: false,
  },

  {
    name: "Slim Card Holder Wallet",
    description:
      "A compact card holder designed for minimal everyday carry with multiple card slots and a slim pocket-friendly profile.",
    price: 29.99,
    discountPrice: 24.99,
    category: "Accessories",
    subcategory: "Wallets",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85",
    stock: 48,
    isFeatured: true,
  },

  {
    name: "Premium Zip Wallet",
    description:
      "A practical zip-around wallet with organized card compartments, secure coin storage, and a refined everyday design.",
    price: 59.99,
    discountPrice: 49.99,
    category: "Accessories",
    subcategory: "Wallets",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85",
    stock: 30,
    isFeatured: false,
  },
];
