# E-commerce Project Folder Structure

This is a clean overview of the main folders and files in the project.

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
│   │   ├── login/
│   │   ├── orders/
│   │   ├── products/
│   │   └── users/
│   ├── api/
│   │   ├── admin/
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
│   ├── checkout/
│   ├── contact/
│   ├── favicon.ico
│   ├── forgot-password/
│   ├── globals.css
│   ├── layout.tsx
│   ├── login/
│   ├── orders/
│   ├── page.tsx
│   ├── payment/
│   │   ├── fail/
│   │   └── success/
│   ├── products/
│   │   └── [id]/
│   ├── profile/
│   ├── register/
│   ├── reset-password/
│   └── wishlist/
├── components/
│   ├── AdminSidebar.tsx
│   ├── ChatBox.tsx
│   ├── ConditionalLayout.tsx
│   ├── Footer.tsx
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
│   ├── invoice.ts
│   ├── product-image.ts
│   ├── push-notification.ts
│   └── seed.ts
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
│   └── firebase-messaging-sw.js
├── services/
│   ├── auth.service.ts
│   ├── category.service.ts
│   └── product.service.ts
├── types/
│   └── next-auth.d.ts
├── validations/
```

## What each folder is for

- app/: Main Next.js app routes, pages, and API endpoints.
- components/: Reusable UI components and providers.
- controllers/: Logic handlers for API requests.
- services/: Business logic for auth, products, categories, etc.
- models/: Database schemas/models.
- lib/: Shared utilities such as DB connection, bcrypt, email, invoice, and seeding.
- middleware/: Request middleware and guards.
- public/: Static assets.
- types/: TypeScript type definitions.
- validations/: Input validation logic.
- config/: Project configuration files.
- helpers/: Extra helper functions.

## Quick understanding

- Frontend pages live in app/.
- Backend/API routes live in app/api/.
- Data models live in models/.
- Core application logic is split between controllers/ and services/.
