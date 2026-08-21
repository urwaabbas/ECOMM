# E-commerce Project Folder Structure

This is the current source structure. Generated folders such as `.next/` and
dependencies in `node_modules/` are intentionally omitted.

```text
Ecomm/
├── .env
├── .gitattributes
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── package-lock.json
├── package.json
├── next-env.d.ts
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── structure.md
├── tmp_products.json
├── tmp_products_filter.json
├── tmp_products_filter2.json
├── app/
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── chat/page.tsx
│   │   ├── login/page.tsx
│   │   ├── newsletter/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── products/page.tsx
│   │   ├── reviews/page.tsx
│   │   └── users/page.tsx
│   ├── api/
│   │   ├── admin/
│   │   │   ├── fcm-token/route.ts
│   │   │   ├── newsletter/route.ts
│   │   │   ├── notifications/route.ts
│   │   │   ├── orders/route.ts
│   │   │   ├── products/route.ts
│   │   │   ├── reviews/route.ts
│   │   │   ├── search/route.ts
│   │   │   ├── stats/route.ts
│   │   │   └── users/route.ts
│   │   ├── ai/chat/route.ts
│   │   ├── auth/[...nextauth]/options.ts
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── cart/route.ts
│   │   ├── categories/route.ts
│   │   ├── checkout/route.ts
│   │   ├── contact/route.ts
│   │   ├── forgot-password/route.ts
│   │   ├── newsletter/route.ts
│   │   ├── notifications/route.ts
│   │   ├── orders/route.ts
│   │   ├── products/route.ts
│   │   ├── products/notifications/route.ts
│   │   ├── products/[id]/route.ts
│   │   ├── register/route.ts
│   │   ├── reset-password/route.ts
│   │   ├── reviews/[productId]/route.ts
│   │   ├── seed/route.ts
│   │   ├── test-email/route.ts
│   │   ├── upload/route.ts
│   │   ├── user/change-password/route.ts
│   │   ├── user/fcm-token/route.ts
│   │   ├── user/link-google/route.ts
│   │   ├── user/profile/route.ts
│   │   ├── verify-email/route.ts
│   │   ├── verify-reset-otp/route.ts
│   │   ├── webhook/route.ts
│   │   └── wishlist/route.ts
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── contact/page.tsx
│   ├── favicon.ico
│   ├── forgot-password/page.tsx
│   ├── globals.css
│   ├── icon.svg
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── orders/page.tsx
│   ├── page.tsx
│   ├── payment/fail/page.tsx
│   ├── payment/success/page.tsx
│   ├── products/page.tsx
│   ├── products/[id]/page.tsx
│   ├── profile/page.tsx
│   ├── register/page.tsx
│   ├── reset-password/page.tsx
│   ├── verify-email/page.tsx
│   └── wishlist/page.tsx
├── components/
│   ├── admin/
│   │   ├── AdminChatBell.tsx
│   │   ├── AdminNotificationBell.tsx
│   │   ├── AdminSearch.tsx
│   │   └── AiAssistant.tsx
│   ├── AdminSidebar.tsx
│   ├── ChatBox.tsx
│   ├── ConditionalLayout.tsx
│   ├── CustomerReviews.tsx
│   ├── FeaturedProductsCarousel.tsx
│   ├── Footer.tsx
│   ├── HeroButtons.tsx
│   ├── HomeBottomSection.tsx
│   ├── Navbar.tsx
│   ├── Newsletter.tsx
│   ├── NotificationManager.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── Providers.tsx
│   ├── ShoppingActions.tsx
│   ├── ShoppingProvider.tsx
│   └── UserNotificationBell.tsx
├── config/
├── controllers/
│   ├── auth.controller.ts
│   ├── category.controller.ts
│   └── product.controller.ts
├── helpers/
├── lib/
│   ├── bcrypt.ts
│   ├── db.ts
│   ├── email.ts
│   ├── fcm.ts
│   ├── firebase-admin.ts
│   ├── firebase.ts
│   ├── gemini.ts
│   ├── groq.ts
│   ├── invoice.ts
│   ├── product-image.ts
│   ├── push-notification.ts
│   ├── seed.ts
│   └── utilis.ts
├── middleware/middleware.ts
├── models/
│   ├── Cart.ts
│   ├── Category.ts
│   ├── Contact.ts
│   ├── Newsletter.ts
│   ├── Notification.ts
│   ├── Order.ts
│   ├── Product.ts
│   ├── Review.ts
│   ├── User.ts
│   └── Wishlist.ts
├── public/
│   ├── easy-return.png
│   ├── file.svg
│   ├── firebase-messaging-sw.js
│   ├── free-shipping.png
│   ├── globe.svg
│   ├── hero.png
│   ├── images.jpg
│   ├── next.svg
│   ├── secure-img.png
│   ├── vercel.svg
│   └── window.svg
├── services/
│   ├── auth.service.ts
│   ├── category.service.ts
│   └── product.service.ts
├── types/next-auth.d.ts
└── validations/
```

## Project structure summary

- `app/`: main frontend routes and Next.js pages
- `app/api/`: API route handlers for authentication, products, orders, notifications, checkout, uploads, and more
- `components/`: reusable UI and provider components
- `components/admin/`: admin dashboard, search, notification, and assistant components
- `controllers/`: API handlers and request logic
- `services/`: business-layer services for authentication, categories, and products
- `models/`: MongoDB/Mongoose schemas
- `lib/`: shared utilities, database access, authentication helpers, email, notifications, and integrations
- `middleware/`: request middleware
- `public/`: static assets and Firebase messaging service worker
- `types/`: TypeScript declarations
- `validations/`: validation logic and schema checks
- `config/` and `helpers/`: project configuration and supporting utilities

## Quick understanding

- Frontend pages live in `app/`
- Backend endpoints are under `app/api/`
- Database models live in `models/`
- Business logic is split between `controllers/` and `services/`
- Shared utilities and integrations live in `lib/`
