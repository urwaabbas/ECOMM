# E-commerce Project Folder Structure

This is a clean overview of the main folders and files in the project.

```text
Ecomm/
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
│   │   ├── forgot-password/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── register/
│   │   ├── reset-password/
│   │   ├── seed/
│   │   ├── upload/
│   │   ├── verify-email/
│   │   ├── webhook/
│   │   └── wishlist/
│   ├── cart/
│   ├── checkout/
│   ├── forgot-password/
│   ├── login/
│   ├── orders/
│   ├── payment/
│   │   ├── fail/
│   │   └── success/
│   ├── products/
│   │   └── [id]/
│   ├── register/
│   ├── reset-password/
│   ├── wishlist/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AdminSidebar.tsx
│   ├── ConditionalLayout.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── Providers.tsx
│   ├── ShoppingActions.tsx
│   └── ShoppingProvider.tsx
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
│   ├── invoice.ts
│   ├── product-image.ts
│   └── seed.ts
├── middleware/
│   └── middleware.ts
├── models/
│   ├── Cart.ts
│   ├── Category.ts
│   ├── Order.ts
│   ├── Product.ts
│   ├── User.ts
│   └── Wishlist.ts
├── public/
│   └── images.jfif
├── services/
│   ├── auth.service.ts
│   ├── category.service.ts
│   └── product.service.ts
├── types/
│   └── next-auth.d.ts
├── validations/
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── README.md
└── tmp_products*.json
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
