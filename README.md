# Teslo Shop

E-commerce demo built with the modern Next.js stack. It serves as a learning
project for App Router, React Server Components, strict TypeScript, Tailwind
CSS v4, Prisma ORM, and a hexagonal (Ports & Adapters) architecture.

## Stack

| Layer      | Tech                                                       |
| ---------- | ---------------------------------------------------------- |
| Framework  | [Next.js 16.3](https://nextjs.org) (App Router, Turbopack) |
| UI         | React 19, React Server Components + Client Islands         |
| Styling    | Tailwind CSS v4 (`@theme` design tokens)                   |
| State      | Zustand 5 (isolated behind an adapter)                     |
| Data       | Prisma ORM 7 (`@prisma/adapter-pg` + `pg`), PostgreSQL     |
| Validation | Zod 4                                                      |
| Carousel   | Swiper 14                                                  |
| Icons      | react-icons (`io5`)                                        |
| Language   | TypeScript strict                                          |

## Architecture

The project follows a **hexagonal (Ports & Adapters)** layout to keep UI, the
domain core, and infrastructure decoupled. Dependency arrows always point
inward: `infrastructure → application → domain`.

```
modules/    Domain core — entities, ports, use cases, adapters
ui/         Internal UI library — components + feature modules (barrels)
src/        Next.js application — routes (App Router)
```

### `modules/` — the domain core

| Module                    | Purpose                                                         |
| ------------------------- | --------------------------------------------------------------- |
| `modules/products`        | Product domain: entities, driven port, use case, Prisma adapter |
| `modules/shared/ui-state` | UI state (sidebar): Zustand isolated behind a port              |

**`modules/products`** follows the hexagonal layout:

```
domain/
  model/        Entities (Product, Category, ProductImage, Size, Gender)
  error/        Domain exceptions (ProductAlreadyExists, CategoryNotExists...)
  ports/drivens/ Driven ports — the contracts the infrastructure must fulfill
application/
  usecases/     Orchestration (HandleProductsUseCase)
infrastructure/
  adapters/out/ Prisma adapter (PrismaProductsHandler → implements port)
  config/       Factories and wiring
```

Only **infrastructure** touches Prisma. The **domain** declares the contract
(`ForHandleProducts`), the **application** orchestrates it
(`HandleProductsUseCase`), and the **adapter** implements it
(`PrismaProductsHandler`).

**`modules/shared/ui-state`** uses the same pattern for browser state: the UI
consumes a driven port through a public barrel, never the Zustand store.

### Data layer (Prisma 7)

Connection configuration follows the Prisma 7 conventions:

```
prisma.config.ts                                            ← tooling (root)
modules/products/infrastructure/adapters/out/
  HandleProducts/persistence/prisma/schema.prisma           ← schema
  HandleProducts/persistence/prisma/migrations/             ← (pending)
  HandleProducts/prisma-products-handler.ts                 ← adapter
```

- The **URL for Migrate** lives in `prisma.config.ts`, `datasource.url`.
- The **connection at runtime** is passed to the `PrismaClient` constructor
  as an adapter (`PrismaPg`) — never in the schema file.
- Generated client output: `src/generated/prisma` (gitignored).

### `ui/` — presentation only

Components are exported through **barrels** (`ui/index.ts` +
`ui/features/*/index.ts`) so consumers never use deep imports. The library
follows a **Server-first** approach:

- Pages and static containers are Server Components.
- Interactive pieces are small Client Component "islands"
  (e.g. `ProductSlideshow`, `QuantitySelector`, `SidebarWrapper`).

### Screens (App Router)

| Route                      | Description                           |
| -------------------------- | ------------------------------------- |
| `/`                        | Home — product grid                   |
| `/product/[slug]`          | Product detail (slideshow, size, qty) |
| `/products`                | Products listing                      |
| `/category/[id]`           | Category listing                      |
| `/cart`                    | Cart with live totals                 |
| `/checkout/address`        | Address form                          |
| `/checkout`                | Order review (verify order)           |
| `/orders`                  | Order list (demo data)                |
| `/orders/[id]`             | Order detail                          |
| `/auth/login`              | Sign in                               |
| `/auth/new-account`        | Sign up                               |
| `/terminos` + `/politicas` | Legal pages (Colombian context)       |
| `/empty`                   | Empty state demo                      |
| `/admin`                   | Admin placeholder                     |

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url> teslo-shop
cd teslo-shop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the environment

Copy the template and fill in your database credentials:

```bash
cp .env-template .env
```

Edit `.env` (values must match `docker-compose.yml` if you use the local
PostgreSQL container):

```bash
DB_USER=postgres
DB_NAME=teslo-shop
DB_PASSWORD=123456
DATABASE_URL="postgresql://postgres:123456@localhost:5432/teslo-shop?schema=public"
```

### 4. Start PostgreSQL (Docker)

```bash
docker compose up -d
```

### 5. Run Prisma commands

Migrations and the client are generated relative to your local setup, so run
them once after cloning:

```bash
# Apply pending migrations to create the schema and tables
npx prisma migrate dev

# Generate the Prisma Client into src/generated/prisma
npx prisma generate
```

### 6. Seed the database (optional but recommended)

Populates the catalog — 4 categories, 52 products and 104 product images:

```bash
npm run seed
```

> ⚠️ `npm run seed` **resets** the database first (`deleteAll`), then inserts
> the catalog. It is meant to be re-run whenever you want fresh demo data.

### 7. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev          # development server (Turbopack)
npm run build        # production build (type-check + static generation)
npm start            # run the production build
npm run lint         # ESLint (Next.js config)
npm run seed         # reset + insert demo catalog (tsx runner)
```

## Prisma commands

The schema lives inside the module, so Prisma reads the paths from
`prisma.config.ts` (root).

```bash
# Validate the schema (no DB needed)
npx prisma validate

# Reformat the schema file
npx prisma format

# Generate the Prisma Client into src/generated/prisma
npx prisma generate

# Create a new migration from schema changes
npx prisma migrate dev --name <migration-name>

# Apply pending migrations / sync dev DB with the schema
npx prisma migrate dev

# Show migration status (applied vs pending)
npx prisma migrate status

# Interactive DB browser
npx prisma studio

# Reset the dev database (drops, re-applies migrations, runs seed)
npx prisma migrate reset
```

> **Prisma 7 note**: `npx prisma generate` regenerates the client into
> `src/generated/prisma` (gitignored). The runtime connection uses the
> `PrismaPg` adapter inside `prisma.ts` — the URL never lives in the schema.

## Design conventions

- **Design tokens** live in `src/app/globals.css` under Tailwind v4 `@theme`
  (`--color-primary`: `#274494` family).
- Global button classes `.btn-primary` / `.btn-secondary`.
- Lists/status use pill badges with the primary palette; inputs use a shared
  focus ring.
- Animations are CSS-only and respect `prefers-reduced-motion`.
- UI copy is Spanish; code and identifiers are English.

## Project structure

```
teslo-shop/
├── prisma.config.ts
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── next.config.ts
├── .env / .env-template
├── .gitignore
├── modules/
│   ├── products/
│   │   ├── domain/
│   │   │   ├── model/
│   │   │   │   ├── category.ts
│   │   │   │   ├── commands/
│   │   │   │   │   ├── category-save-command.ts
│   │   │   │   │   ├── product-save-command.ts
│   │   │   │   │   └── product-image-save-command.ts
│   │   │   │   ├── gender.ts
│   │   │   │   ├── product.ts
│   │   │   │   ├── productImage.ts
│   │   │   │   └── size.ts
│   │   │   ├── error/
│   │   │   │   ├── category-already-exists-exception.ts
│   │   │   │   ├── category-not-exists-exception.ts
│   │   │   │   ├── product-already-exists-exception.ts
│   │   │   │   └── product-not-exists-exception.ts
│   │   │   └── ports/
│   │   │       └── drivens/
│   │   │           └── for-handle-products.ts
│   │   ├── application/
│   │   │   └── usecases/
│   │   │       └── handle-products-use-case.ts
│   │   └── infrastructure/
│   │       ├── adapters/
│   │       │   └── out/
│   │       │       └── HandleProducts/
│   │       │           ├── prisma-products-handler.ts
│   │       │           └── persistence/
│   │       │               └── prisma/
│   │       │                   └── schema.prisma
│   │       └── config/
│   │           └── factory/
│   └── shared/
│       └── ui-state/
│           ├── index.ts
│           ├── domain/
│           │   └── ports/
│           │       └── for-sidebar-state.ts
│           ├── application/
│           │   └── usecases/
│           │       └── handle-sidebar-state-use-case.ts
│           └── infrastructure/
│               ├── adapters/
│               │   └── out/
│               │       └── SidebarState/
│               │           ├── sidebar-store.ts
│               │           └── zustand-sidebar-adapter.ts
│               └── config/
│                   └── factory/
│                       └── handle-sidebar-state-use-case-factory.ts
├── ui/
│   ├── index.ts
│   ├── components/
│   │   ├── footer/
│   │   │   └── Footer.tsx
│   │   ├── not-found/
│   │   │   └── PageNotFound.tsx
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SidebarBackdrop.tsx
│   │   │   ├── SidebarCloseButton.tsx
│   │   │   └── SidebarWrapper.tsx
│   │   ├── title/
│   │   │   └── Title.tsx
│   │   └── top-menu/
│   │       ├── TopMenu.tsx
│   │       ├── OpenMenuButton.tsx
│   │       └── ScrollShadow.tsx
│   └── features/
│       ├── cart/
│       │   ├── index.ts
│       │   └── CartItems.tsx
│       ├── checkout/
│       │   ├── index.ts
│       │   └── CheckoutItems.tsx
│       ├── orders/
│       │   ├── index.ts
│       │   └── components/
│       │       └── OrdersItems.tsx
│       ├── product/
│       │   ├── index.ts
│       │   ├── interfaces/
│       │   │   └── product.interface.ts
│       │   └── components/
│       │       ├── product-details/
│       │       │   └── ProductDetails.tsx
│       │       ├── quantity-selector/
│       │       │   └── QuantitySelector.tsx
│       │       ├── size-selector/
│       │       │   └── SizeSelector.tsx
│       │       └── slideshow/
│       │           ├── ProductSlideshow.tsx
│       │           ├── ProductMobileSlideshow.tsx
│       │           └── slideshow.css
│       └── products/
│           ├── index.ts
│           └── products-grid/
│               ├── ProductsGrid.tsx
│               ├── ProductGridItem.tsx
│               └── ProductGridImage.tsx
└── src/
    ├── app/
    │   ├── layout.tsx                 # Root layout (fonts, globals)
    │   ├── globals.css                # Tailwind v4 tokens + global styles
    │   ├── (shop)/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx               # Home
    │   │   ├── admin/page.tsx
    │   │   ├── cart/page.tsx
    │   │   ├── category/
    │   │   │   ├── [id]/page.tsx
    │   │   │   └── not-found.tsx
    │   │   ├── checkout/
    │   │   │   ├── page.tsx
    │   │   │   └── address/page.tsx
    │   │   ├── empty/page.tsx
    │   │   ├── orders/
    │   │   │   ├── page.tsx
    │   │   │   └── [id]/page.tsx
    │   │   ├── politicas/page.tsx
    │   │   ├── product/
    │   │   │   ├── [slug]/page.tsx
    │   │   │   └── not-found.tsx
    │   │   ├── products/page.tsx
    │   │   └── terminos/page.tsx
    │   └── auth/
    │       ├── layout.tsx
    │       ├── login/page.tsx
    │       └── new-account/page.tsx
    ├── config/
    │   └── fonts.ts                   # Inter + Montserrat Alternates (titleFont)
    └── seed/
        ├── seed.ts                    # Demo product catalog (initialData)
        └── seed-database.ts           # Seed runner: reset + insert via use case
```

> `node_modules/`, `.next/`, `src/generated/`, and local tooling directories
> (`.agents/`, `.claude/`, `.windsurf/`) are excluded from the tree.

## Roadmap / known gaps

- **Persistence is working**: `PrismaProductsHandler` implements `deleteAll`,
  `saveAllCategories`, `getCategoryByName`, `saveAllProducts` and
  `saveAllImageProducts` — the seed populates the catalog for real.
- The UI still renders **seed (static) data** — pages are not wired to read
  from the database through the use case yet.
- Cart is a Client island with local state (no global store yet).
- Auth pages are presentational stubs.

---

> Learning project — illustrations, terms and legal texts are for
> demonstration purposes.
