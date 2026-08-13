# E-commerce Project Folder Structure

This is the current project structure as it exists in the workspace.

```text
Ecomm/
├── .env
├── .gitattributes
├── .gitignore
├── .next/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── package-lock.json
├── package.json
├── next-env.d.ts
├── next.config.ts
├── tsconfig.json
├── tsconfig.tsbuildinfo
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
│   │   ├── chat/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── newsletter/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   └── page.tsx
│   │   └── users/
│   │       └── page.tsx
│   ├── api/
│   │   ├── admin/
│   │   │   ├── fcm-token/
│   │   │   ├── newsletter/
│   │   │   ├── notifications/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   └── ...
│   │   ├── ai/
│   │   │   └── chat/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── categories/
│   │   ├── checkout/
│   │   ├── contact/
│   │   ├── forgot-password/
│   │   ├── newsletter/
│   │   ├── notifications/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── register/
│   │   ├── reset-password/
│   │   ├── seed/
│   │   ├── test-email/
│   │   ├── upload/
│   │   ├── user/
│   │   ├── verify-email/
│   │   ├── webhook/
│   │   └── wishlist/
│   ├── cart/
│   │   └── page.tsx
│   ├── checkout/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── forgot-password/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── orders/
│   │   └── page.tsx
│   ├── page.tsx
│   ├── payment/
│   │   ├── fail/
│   │   └── success/
│   ├── products/
│   │   ├── page.tsx
│   │   └── [id]/
│   ├── profile/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── reset-password/
│   │   └── page.tsx
│   └── wishlist/
│       └── page.tsx
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
│   ├── groq.ts
│   ├── invoice.ts
│   ├── product-image.ts
│   ├── push-notification.ts
│   ├── seed.ts
│   └── utilis.ts
├── middleware/
│   └── middleware.ts
├── models/
│   ├── Cart.ts
│   ├── Category.ts
│   ├── Contact.ts
│   ├── Newsletter.ts
│   ├── Notification.ts
│   ├── Order.ts
│   ├── Product.ts
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
├── types/
│   └── next-auth.d.ts
├── validations/
├── node_modules/
└── .next/
```

## Project structure summary

- app/: main frontend routes and Next.js pages
- app/api/: API route groups for auth, products, orders, notifications, checkout, upload, and more
- components/: reusable UI and provider components
- components/admin/: admin-specific dashboard and assistant utilities
- controllers/: API handlers and request logic
- services/: business-layer services for auth, categories, and products
- models/: Mongo/Mongoose schemas
- lib/: shared utilities, database, auth helpers, email, notifications, and integrations
- middleware/: request middleware
- public/: static assets and PWA-related files
- types/: TypeScript declarations
- validations/: validation logic and schema checks
- config/: project config folders
- helpers/: supporting helper utilities

## Quick understanding

- Frontend pages live in app/
- Backend endpoints are under app/api/
- Database models live in models/
- Business logic is split between controllers/ and services/
- Shared utilities and integrations live in lib/
