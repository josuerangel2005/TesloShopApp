# Teslo Shop

E-commerce demo built with the modern Next.js stack. It serves as a learning
project for App Router, React Server Components, strict TypeScript, Tailwind
CSS v4, and a hexagonal (Ports & Adapters) architecture.

## Stack

| Layer        | Tech                                              |
| ------------ | ------------------------------------------------- |
| Framework    | [Next.js 16.3](https://nextjs.org) (App Router, Turbopack) |
| UI           | React 19, React Server Components + Client Islands |
| Styling      | Tailwind CSS v4 (`@theme` design tokens)         |
| State        | Zustand 5 (isolated behind an adapter)           |
| Carousel     | Swiper 14                                        |
| Icons        | react-icons (`io5`)                              |
| Language     | TypeScript strict                                |

## Architecture

The project follows a **hexagonal (Ports & Adapters)** layout to keep UI and
state infrastructure decoupled.

```
src/        Next.js application — routes (App Router)
ui/         Internal UI library — components + feature modules (barrels)
modules/    Domain core — business state, ports, adapters, use cases
```

### `modules/` — the domain core

State lives in `modules/shared/ui-state` with clean dependency arrows:

```
domain/ports        → contracts (e.g. SidebarStatePort)
application/usecases→ orchestration (eg. HandleSidebarStateUseCase)
infrastructure      → adapters and wiring (Zustand store, factory)
```

Only the infrastructure layer knows about Zustand. The UI consumes the module
through its **public barrel** (`modules/shared/ui-state`), never touching the
store or the adapter directly.

### `ui/` — presentation only

Components are exported through **barrels** (`ui/index.ts` +
`ui/features/*/index.ts`) so consumers never use deep imports. The library
follows a **Server-first** approach:

- Pages and static containers are Server Components.
- Interactive pieces are small Client Component "islands"
  (e.g. `ProductSlideshow`, `QuantitySelector`, `SidebarWrapper`).

### Screens (App Router)

| Route                    | Description                          |
| ------------------------ | ------------------------------------ |
| `/`                      | Home — product grid                  |
| `/product/[slug]`        | Product detail (slideshow, size, qty) |
| `/cart`                  | Cart with live totals                |
| `/checkout/address`      | Address form                         |
| `/checkout`              | Order review (verify order)          |
| `/orders`                | Order list (demo data)               |
| `/orders/[id]`           | Order detail                         |
| `/auth/login`            | Sign in                              |
| `/auth/new-account`      | Sign up                              |
| `/terminos` + `/politicas` | Legal pages (Colombian context)    |
| `/empty`                 | Empty state demo                     |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev     # development server (Turbopack)
npm run build   # production build (type-check + static generation)
npm start       # run the production build
npm run lint    # ESLint (Next.js config)
```

## Design conventions

- **Design tokens** live in `src/app/globals.css` under Tailwind v4 `@theme`
  (`--color-primary`: `#274494` family).
- Global button classes `.btn-primary` / `.btn-secondary`.
- Lists/status use pill badges with the primary palette; inputs use a shared
  focus ring.
- Animations are CSS-only and respect `prefers-reduced-motion`.
- UI copy is Spanish; code and identifiers are English.

## Project structure highlights

```
src/app/                     App Router pages + layouts
src/config/fonts.ts         Inter + Montserrat Alternates (titleFont)
src/seed/seed.ts            Demo product catalog
ui/components/              TopMenu, Sidebar, Footer, Title, 404...
ui/features/                 cart, checkout, orders, product, products
ui/index.ts                  Public library barrel
modules/shared/ui-state/    Hexagonal sidebar state (Zustand)
```

## Roadmap / known gaps

- Currently uses **seed (demo) data**; no persistence, no API.
- Cart is a Client island with local state (no global store yet).
- Auth pages are presentational stubs.

---

> Learning project — illustrations, terms and legal texts are for
> demonstration purposes.