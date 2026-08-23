# Teslo Shop

Proyecto de e-commerce de aprendizaje construido con el stack moderno de
Next.js. Sirve como ejemplo práctico de App Router, React Server Components,
TypeScript estricto, Tailwind CSS v4, Prisma ORM y una arquitectura hexagonal
(Ports & Adapters).

## Stack

| Capa        | Tecnología                                                  |
| ----------- | ----------------------------------------------------------- |
| Framework   | [Next.js 16.3](https://nextjs.org) (App Router, Turbopack)  |
| UI          | React 19, React Server Components + Client Islands          |
| Estilos     | Tailwind CSS v4 (design tokens con `@theme`)                |
| Estado      | Zustand 5 (aislado detrás de un adaptador)                  |
| Datos       | Prisma ORM 7 (`@prisma/adapter-pg` + `pg`), PostgreSQL      |
| Autenticación | NextAuth v5 (beta) + bcryptjs                             |
| Email       | Nodemailer (Gmail SMTP)                                     |
| Archivos    | Cloudinary SDK v2 (avatares, imágenes de producto, PDFs)    |
| Facturación | Spring Boot en Render (`BILLING_API_URL`) + PDFShift API v3 |
| Formularios | React Hook Form 7                                           |
| Validación  | Zod 4 (esquemas compartidos cliente + servidor)             |
| Carrusel    | Swiper 14                                                   |
| Iconos      | react-icons (`io5`)                                         |
| Lenguaje    | TypeScript estricto                                         |

## Arquitectura

El proyecto sigue un diseño **hexagonal (Ports & Adapters)** para mantener la
UI, el núcleo de dominio y la infraestructura desacoplados. Las dependencias
apuntan siempre hacia adentro: `infrastructure → application → domain`.

```
modules/    Núcleo de dominio — entidades, puertos, casos de uso, adaptadores
ui/         Librería interna de UI — componentes + módulos de feature (barrels)
src/        Aplicación Next.js — rutas (App Router)
```

### `modules/` — el núcleo de dominio

| Módulo                    | Propósito                                                        |
| ------------------------- | ---------------------------------------------------------------- |
| `modules/products`        | Dominio de productos: entidades, puerto, caso de uso, adaptador  |
| `modules/auth`            | Autenticación: credenciales, registro, verificación de email     |
| `modules/email`           | Envío de correos: puerto `ForEmailSender`, adaptador Gmail       |
| `modules/shared/ui-state` | Estado de UI compartido (sidebar + carrito + dirección + uploads)|
| `modules/shared/validation` | Esquemas Zod reutilizables (p. ej. `userAddressSchema`)        |
| `modules/orders`          | Órdenes: `Order`, `OrderItem`, `OrderAddress`, caso de uso y adaptador Prisma |

**`modules/products`** sigue el esquema hexagonal:

```
domain/
  model/        Entidades (Product, Category, ProductImage, Gender)
  error/        Excepciones de dominio (ProductAlreadyExists, CategoryNotExists...)
  ports/driven/ Puertos manejados — los contratos que la infraestructura debe cumplir
application/
  usecases/     Orquestación (HandleProductsUseCase, ValidateProductUseCase)
infrastructure/
  adapters/out/
    HandleProducts/   PrismaProductsHandler — CRUD completo + consultas
    Validate/         ZodValidateAdapter + ProductSchema (validación server-side)
  config/       Fábricas y cableado
```

Solo la **infraestructura** toca Prisma. El **dominio** declara el contrato
(`ForHandleProducts`), la **aplicación** lo orquesta
(`HandleProductsUseCase`, `ValidateProductUseCase`) y el **adaptador** lo implementa
(`PrismaProductsHandler`, `ZodValidateAdapter`). Cada capa mapea sus propios datos:

- Los mappers `utils/` del adaptador convierten **filas → dominio** (con
  `include` de relaciones).
- Los mappers de UI convierten **dominio → contratos de respuesta**
  (`productToResponse`).
- Los mappers de `src/seed/` convierten **datos de seed → comandos de guardado**.

El módulo incluye además el hexágono de **validación de productos**: el puerto
`ForValidateProduct` declara `validateAll(...)`, el caso de uso
`ValidateProductUseCase` lo orquesta y `ZodValidateAdapter` implementa la
validación campo por campo contra `ProductSchema` (Zod), devolviendo un
`ValidationResult` con `fieldErrors` tipados. La server action de
guardado/actualización traduce esas claves a las rutas reales del formulario
(p. ej. `imagesQuantity → images`, `category → category.name`) y las pinta con
`setError`. El formulario complementa con validación React Hook Form en el
cliente (UX) — el servidor siempre revalida (autoridad).

**`modules/auth`** cubre el flujo completo de autenticación:

- **Dominio**: `User` (con `emailVerified` y token de verificación), `Role`,
  `LoginCredential`, `UserSaveCommand`, excepciones de dominio
  (`InvalidCredentialsException`, `UserAlreadyExistsException`,
  `VerificationTokenInvalidException`, `VerificationTokenExpiredException`...).
- **Puertos**: `ForAuth` (credenciales, registro, token de verificación,
  verificación de email) y `ForAuthSession` (sesión con NextAuth).
- **Aplicación**: `HandleAuthUseCase` — `login`, `register`,
  `saveEmailVerification` y `verifyEmail` (con validación encadenada:
  token inválido → ya verificado → expirado → recién marca `emailVerified`).
- **Infraestructura**: `PrismaUserHandler` (persistencia en PostgreSQL) y
  `NextAuthHandler` (integración con NextAuth v5).

**`modules/email`** es el hexágono de envío de correos, desacoplado del de
auth:

```
domain/
  model/        EmailMessage (to, subject, html)
  ports/driven/ ForEmailSender (send)
application/
  usecases/     EmailSenderHandlerUseCase
infrastructure/
  adapters/out/ GmailEmailSenderAppAdapter (Nodemailer + SMTP de Gmail)
  templates/    verificationEmail() — template HTML con estilo inline
  config/       Fábrica (getEmailSenderHandlerUseCase)
```

El módulo de email **solo envía**; el ciclo de vida del token
(generar/persistir/validar) pertenece al hexágono de auth. La orquestación
entre ambos ocurre en el server action de registro.

**`modules/shared/ui-state`** usa el mismo patrón para estado del navegador.
Aloja el enum compartido `Size` y stores de feature, cada uno aislado
detrás de un puerto manejado:

- **Sidebar** — puerto `ForSidebarState`, `HandleSidebarStateUseCase`,
  `SidebarState/zustand-sidebar-adapter.ts` (colapsado + abierto).
- **Carrito** — puerto `ForCartStore`, `HandleProductsInCartUseCase`,
  `CartState/zustand-cart-adapter.ts` (persistido con el middleware `persist`
  de Zustand bajo la clave `shopping-cart`). El adaptador rehidrata los DTOs
  persistidos de vuelta a instancias de dominio `CartProduct` mediante una
  función `merge`.
- **Dirección** — puerto `ForAddressState`, `HandleAddressStateUseCase`,
  `AddressState/zustand-address-adapter.ts` (prefill y guardado en el
  checkout; se persiste en BD por usuario vía `UserAddress`).

El módulo también expone el hexágono de **subida de archivos**:

- **Imágenes** — `CloudinaryImageUploadAdapter` (`folder: teslo/avatars`).
- **Documentos PDF** — `CloudinaryDocumentUploadAdapter`
  (`resource_type: "raw"`, `folder: teslo/documents`, guard de MIME
  `application/pdf`), con `ForDocumentUpload` + `HandleUploadDocumentUseCase`.
- **Conversión HTML → PDF** — `ForPdfConversion` +
  `PdfShiftDocumentConverterAdapter` (API v3, `sandbox: true` en desarrollo
  para no gastar créditos).

La UI consume estos estados a través de las fábricas del módulo, nunca el
store de Zustand directamente.

### Capa de datos (Prisma 7)

La configuración de conexión sigue las convenciones de Prisma 7:

```
prisma.config.ts                                            ← tooling (raíz)
modules/shared/ui-state/infrastructure/adapters/out/
  persistence/prisma/schema.prisma                           ← schema
  persistence/prisma/migrations/                             ← migraciones
  persistence/prisma/prisma.ts                               ← conexión
```

- La **URL de Migrate** vive en `prisma.config.ts`, `datasource.url`.
- La **conexión en runtime** se pasa al constructor de `PrismaClient` como
  adaptador (`PrismaPg`) — nunca en el schema.
- Cliente generado en `src/generated/prisma` (gitignored).

Migraciones aplicadas:

| Migración                              | Contenido                                    |
| -------------------------------------- | -------------------------------------------- |
| `20260809163453_teslo`                 | Esquema inicial (catálogo)                   |
| `20260813180224_add_user`              | Modelo `User` + `Role`                       |
| `20260813182459_add_email_verification_token` | Token y expiración de verificación    |
| `20260813224006_add_email_verified`    | Campo `emailVerified`                        |
| `20260815005140_add_countries`         | Catálogo de países (`countryId` ISO)         |
| `20260815043109_user_address`          | Modelo `UserAddress` (dirección por usuario) |
| `20260815043525_fix_user_address_typo` | Corrección de typo en `UserAddress`          |
| `20260815054242_align_user_address_country_iso` | Alinea `countryId` con ISO             |
| `20260815215752_order_address_items`   | Modelos `Order`, `OrderItem`, `OrderAddress` |

### `ui/` — solo presentación

Los componentes se exportan mediante **barrels** (`ui/index.ts` +
`ui/features/*/index.ts`) para que los consumidores nunca usen imports
profundos. La librería sigue un enfoque **Server-first**:

- Las páginas y contenedores estáticos son Server Components.
- Las piezas interactivas son pequeños "islas" de Client Components
  (p. ej. `ProductSlideshow`, `QuantitySelector`, `SidebarWrapper`,
  `TopMenuCartCount`, `CartItems`, `LoginForm`, `RegisterForm`,
  `VerifyEmailForm`).

Cada feature expone sus **server actions** en `ui/features/*/actions/` y sus
componentes en `ui/features/*/components/`.

### Flujo de datos: páginas → actions → use case → adapter

Las páginas nunca tocan el adaptador directamente. Llaman **server actions**
(`"use server"`) que obtienen el caso de uso desde la fábrica del módulo:

```
src/app/(shop)/page.tsx
  └─ getPaginatedProductsWithImages({ page, take })   [server action]
       └─ HandleProductsUseCase.getAllProductsWithImages(page, take)
            └─ PrismaProductsHandler (1 query con include)
```

El mismo patrón alimenta el stock de la página de producto:
`StockLabel` → `getStockByProductSlug` → caso de uso → handler.

El carrito sigue el mismo encapsulamiento en el cliente: la página de producto
agrega items a través de `HandleProductsInCartUseCase` → puerto
`ForCartStore` → `ZustandCartAdapter` (persistido en `localStorage`).
`CartItems`, `TopMenuCartCount` y `CheckoutItems` leen el store como única
fuente de verdad vía `useSyncExternalStore`:

```
ProductDetails (agregar al carrito) / CartItems / TopMenuCartCount / CheckoutItems
  └─ HandleProductsInCartUseCase (caso de uso de cliente)
       └─ ForCartStore (puerto manejado)
            └─ ZustandCartAdapter (persist → localStorage "shopping-cart")
```

El checkout también lee la dirección de entrega desde el store de dirección
(`HandleAddressStateUseCase` → `ZustandAddressAdapter`); si viene vacío y hay
sesión, `AddressForm` la precarga desde la BD vía `getAddressByUserIdAction`
y valida en cliente con `userAddressSchema` (fail-closed: corta el envío si
hay campos inválidos).

### Flujo de autenticación

**Registro** (`ui/features/register/actions/register-action.ts`):

1. Imagen de perfil opcional → `ImageUpload` → Cloudinary → URL.
2. `register(UserSaveCommand)` — crea el usuario con contraseña hasheada.
3. Genera token (`randomBytes(32).toString("hex")`) con expiración de 24 h y
   lo persiste (`saveEmailVerification`).
4. Envía el correo de verificación (`verificationEmail(email, link)` vía el
   hexágono de email).
5. Redirige a `/auth/check-email`.

**Verificación** (`/auth/verify-email`):

- La página lee el token de `searchParams` y renderiza `VerifyEmailForm`.
- La server action `verify-email-action` valida el token: inválido → error,
  ya verificado → idempotente, expirado → error; si todo está bien marca
  `emailVerified` y limpia el token (un solo uso).

**Login** (`ui/features/login/actions/login-action.ts`): valida credenciales
con `HandleAuthUseCase.login` y redirige a `/` en caso de éxito; los errores
tipados se muestran en el formulario. El callback `authorize()` de NextAuth
delega en `NextAuthAuthorize`, que verifica las credenciales contra la base de
datos vía `ForAuth.verifyCredentials` (`auth.ts` → `NextAuthAuthorize` →
`PrismaUserHandler`).

### Pantallas (App Router)

| Ruta                         | Descripción                                  |
| ---------------------------- | -------------------------------------------- |
| `/`                          | Home — grilla de productos (desde Postgres)  |
| `/product/[slug]`            | Detalle de producto (slideshow, talla, stock)|
| `/products`                  | Listado de productos                         |
| `/category/[id]`             | Listado por categoría/género (paginado)      |
| `/cart`                      | Carrito con totales en vivo (persistido)     |
| `/checkout/address`          | Formulario de dirección (validado + prefill) |
| `/checkout`                  | Revisión de la orden (carrito + dirección reales) |
| `/profile`                   | Perfil de usuario                            |
| `/orders`                    | Listado de órdenes (demo)                    |
| `/orders/[id]`               | Detalle de orden                             |
| `/auth/login`                | Iniciar sesión                               |
| `/auth/new-account`          | Crear cuenta (avatar + verificación)         |
| `/auth/verify-email`         | Verificación de correo por token             |
| `/terminos` + `/politicas`   | Páginas legales (contexto colombiano)        |
| `/empty`                     | Demo de estado vacío                         |
| `/admin`                     | Dashboard de administración                  |
| `/admin/users`               | Gestión de usuarios (cambio de rol USER/ADMIN) |
| `/admin/products`            | Tabla de productos (stock, precio, acciones) |
| `/admin/product/new`         | Crear producto                               |
| `/admin/product/[slug]`      | Editar producto                              |

> Las páginas de la tienda están conectadas a la base de datos mediante
> **server actions** (`ui/features/product/actions`) que llaman al caso de
> uso. Home (`getPaginatedProductsWithImages`) y categorías
> (`getProductsByGender`) usan `include` de Prisma para traer cada producto
> con su categoría e imágenes en una sola consulta, y renderizan con
> `revalidate = 60` (ISR) — o `generateMetadata` por producto en
> `/product/[slug]`.

## Empezar

### 1. Clonar el repositorio

```bash
git clone <repo-url> teslo-shop
cd teslo-shop
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar el entorno

```bash
cp .env-template .env
```

Editar `.env` (los valores de la base deben coincidir con
`docker-compose.yml` si usás el contenedor local de PostgreSQL):

```bash
# Base de datos
DB_USER=postgres
DB_NAME=teslo-shop
DB_PASSWORD=123456
DATABASE_URL="postgresql://postgres:123456@localhost:5432/teslo-shop?schema=public"

# NextAuth (generalo con: openssl rand -base64 32)
AUTH_SECRET=

# Cloudinary (upload de imágenes de perfil y documentos PDF)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# PDFShift (HTML → PDF; crea la key en https://app.pdfshift.io → API Keys)
PDFSHIFT_API_KEY=sk_xxxxxxxxx

# Servicio de facturación (Spring Boot en Render — genera el PDF de factura)
BILLING_API_URL=https://spring-generate-bill.onrender.com

# Gmail (App Password con 2FA habilitada)
GMAIL_USER=tu-correo@gmail.com
GMAIL_APP_PASSWORD=tu-app-password
```

### 4. Levantar PostgreSQL (Docker)

```bash
docker compose up -d
```

### 5. Ejecutar Prisma

```bash
# Aplicar migraciones pendientes (crea el schema y las tablas)
npx prisma migrate dev

# Generar el cliente de Prisma en src/generated/prisma
npx prisma generate
```

### 6. Sembrar la base de datos (opcional pero recomendado)

Puebla el catálogo — 4 categorías, 52 productos y 104 imágenes:

```bash
npm run seed
```

> ⚠️ `npm run seed` **resetea** la base primero (`deleteAll`) y luego inserta
> el catálogo. Está pensado para ejecutarse cada vez que quieras datos demo
> frescos.
>
> Las imágenes del catálogo se persisten con **ruta completa**
> (`/products/<archivo>`); los productos creados desde el panel admin guardan
> la URL completa de Cloudinary. Así la UI consume `url` plano, sin
> transformaciones en los componentes.

### 7. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev          # servidor de desarrollo (Turbopack)
npm run build        # build de producción (type-check + generación estática)
npm start            # ejecutar el build de producción
npm run lint         # ESLint (config de Next.js)
npm run seed         # reset + insertar catálogo demo (runner tsx)
```

## Comandos de Prisma

El schema vive dentro del módulo, así que Prisma lee las rutas desde
`prisma.config.ts` (raíz).

```bash
# Validar el schema (sin necesidad de base de datos)
npx prisma validate

# Reformatar el archivo del schema
npx prisma format

# Generar el cliente de Prisma en src/generated/prisma
npx prisma generate

# Crear una migración nueva a partir de cambios en el schema
npx prisma migrate dev --name <nombre-migracion>

# Aplicar migraciones pendientes / sincronizar la DB de desarrollo
npx prisma migrate dev

# Mostrar estado de migraciones (aplicadas vs pendientes)
npx prisma migrate status

# Explorador interactivo de la base de datos
npx prisma studio

# Resetear la base de desarrollo (dropea, reaplica migraciones, corre seed)
npx prisma migrate reset
```

> **Nota Prisma 7**: `npx prisma generate` regenera el cliente en
> `src/generated/prisma` (gitignored). La conexión en runtime usa el adaptador
> `PrismaPg` dentro de `prisma.ts` — la URL nunca vive en el schema.

## Convenciones de diseño

- **Design tokens** en `src/app/globals.css` con `@theme` de Tailwind v4
  (familia `--color-primary`: `#274494`).
- Clases globales de botones `.btn-primary` / `.btn-secondary`.
- Listas/estados usan badges tipo pill con la paleta primaria; los inputs
  comparten un anillo de foco.
- Los errores de formulario se muestran con ícono de alerta y el campo con
  borde/estado rojo; las secciones sin input (tallas, imágenes) usan banners
  destacados que se limpian al corregir.
- `next/image` consume rutas locales (`/products/...`) y remotas de Cloudinary
  (`res.cloudinary.com`, declarado en `images.remotePatterns`). Las imágenes
  nuevas en previews usan `blob:` con `unoptimized`.
- Las animaciones son solo CSS y respetan `prefers-reduced-motion`.
- El copy de UI está en español; el código y los identificadores en inglés.
- Los correos transaccionales usan CSS inline (los clientes de correo ignoran
  Tailwind) con la paleta de la marca.

## Estructura del proyecto

```
teslo-shop/
├── prisma.config.ts
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── next.config.ts
├── auth.ts                          # Configuración de NextAuth (sesión)
├── auth.config.ts                   # Configuración de NextAuth (pages + providers)
├── src/proxy.ts                     # Middleware de NextAuth (matcher: /auth, /profile,
│                                    #   /checkout, /admin) — /admin exige rol ADMIN
│                                    #   vía el callback `authorized` de auth.config.ts;
│                                    #   /auth/verify-email se permite con sesión activa
├── .env / .env-template
├── .gitignore
├── modules/
│   ├── auth/
│   │   ├── domain/
│   │   │   ├── model/
│   │   │   │   ├── auth-session.ts
│   │   │   │   ├── commands/user-save-command.ts
│   │   │   │   ├── login-credentials.ts
│   │   │   │   ├── role.ts
│   │   │   │   └── user.ts          # emailVerified + token de verificación
│   │   │   ├── error/               # Excepciones de dominio
│   │   │   └── ports/driven/
│   │   │       ├── for-auth.ts
│   │   │       └── for-auth-session.ts
│   │   ├── application/usecases/handle-auth-use-case.ts
│   │   └── infrastructure/
│   │       ├── adapters/out/auth/
│   │       │   ├── next-auth-handler.ts
│   │       │   ├── prisma-users-handler.ts
│   │       │   └── mappers/toUserDomainMapper.ts
│   │       └── config/factory/handle-auth-use-case-factory.ts
│   ├── email/
│   │   ├── domain/
│   │   │   ├── model/email-message.ts
│   │   │   └── ports/driven/for-email-sender.ts
│   │   ├── application/usecases/email-sender-handler-use-case.ts
│   │   └── infrastructure/
│   │       ├── adapters/out/send/GmailEmailSederAdapter.ts
│   │       ├── config/factory/email-sender-handler-use-case-factory.ts
│   │       └── templates/verification-email.ts
│   ├── products/
│   │   ├── domain/
│   │   │   ├── model/               # category, gender, product, productImage, commands
│   │   │   ├── error/               # Excepciones de dominio
│   │   │   └── ports/driven/for-handle-products.ts
│   │   ├── application/usecases/handle-products-use-case.ts
│   │   │                          # + validate-product-use-case.ts
│   │   └── infrastructure/
│   │       ├── adapters/out/
│   │       │   ├── HandleProducts/   # prisma-products-handler + utils (mappers)
│   │       │   └── Validate/         # zod-validate-adapter + product-schema
│   │       └── config/factory/
│   ├── shared/
│   │   ├── ui-state/
│   │   │   ├── domain/
│   │   │   │   ├── model/           # cart-product, address, document-upload, size
│   │   │   │   └── ports/           # for-cart-store, for-sidebar-state, for-address-state,
│   │   │   │                        #   for-document-upload, for-pdf-conversion
│   │   │   ├── application/usecases/
│   │   │   ├── infrastructure/
│   │   │   │   ├── adapters/out/
│   │   │   │   │   ├── CartState/   # cart-store + zustand-cart-adapter
│   │   │   │   │   ├── SidebarState/
│   │   │   │   │   ├── AddressState/# address-store + zustand-address-adapter
│   │   │   │   │   ├── CloudinaryUpload/  # imágenes de perfil + documentos PDF
│   │   │   │   │   ├── PdfConversion/     # pdfshift-document-converter-adapter
│   │   │   │   │   └── Encrypt/     # bcrypt-validator-adapter
│   │   │   │   └── persistence/prisma/   # schema + migraciones
│   │   │   └── config/factory/
│   │   └── validation/              # esquemas Zod compartidos (registro, dirección)
│   └── orders/                      # Order/OrderItem/OrderAddress + caso de uso
│                                    #   + adaptador Prisma + factura por email
├── ui/
│   ├── index.ts
│   ├── components/                  # sidebar, top-menu, title, footer...
│   └── features/
│       ├── admin/                   # Panel de administración
│       │   ├── users/               # UsersTable + RoleSelector + actions
│       │   ├── products/            # ProductsTable + AddProductButton
│       │   └── product/             # ProductForm (RHF) + actions + interfaces
│       ├── address/                 # AddressForm + actions (save/get/delete/countries)
│       ├── cart/                    # CartItems + currency-format
│       ├── checkout/                # CheckoutItems (carrito + dirección reales)
│       ├── login/                   # actions/ + components/Login-form
│       ├── orders/                  # OrdersItems
│       ├── product/                 # actions/ + components/ + mappers/
│       ├── products/                # ProductsGrid
│       ├── profile/                 # página de perfil
│       ├── register/                # actions/ + components/Register-form
│       └── verify-email/            # actions/ + components/Verify-email-form
└── src/
    ├── app/
    │   ├── layout.tsx               # Layout raíz (fonts, globals, metadata)
    │   ├── globals.css              # Tokens Tailwind v4 + estilos globales
    │   ├── (shop)/                  # Tienda (home, productos, carrito, checkout, profile...)
    │   └── auth/                    # login, new-account, verify-email
    ├── config/fonts.ts              # Inter + Montserrat Alternates (titleFont)
    └── seed/                        # Catálogo demo (reset + insert)
```

> `node_modules/`, `.next/`, `src/generated/` y los directorios locales de
> tooling (`.agents/`, `.claude/`, `.windsurf/`) quedan excluidos del árbol.

## Roadmap / brechas conocidas

- **Catálogo desde Postgres**: home, categoría (por género) y detalle de
  producto consultan a través del caso de uso; `PrismaProductsHandler` cubre
  paginación, conteos, búsquedas por slug y stock. El seed puebla el catálogo.
- **Panel de administración**: dashboard, gestión de usuarios (cambio de rol
  USER/ADMIN con `RoleSelector`) y CRUD completo de productos — crear, editar
  y eliminar con subida de imágenes a Cloudinary. Formulario con validación
  dual: React Hook Form en cliente + hexágono Zod (`ZodValidateAdapter`) en
  servidor, con mapeo de `fieldErrors` a los campos del form.
- **Imágenes consistentes**: la BD guarda siempre rutas completas (seed
  persiste `/products/<archivo>`; uploads guardan la URL de Cloudinary). La
  UI consume `url` plano vía `next/image`.
- **Carrito persistido en el cliente**: Zustand `persist` bajo
  `shopping-cart`, leído por `CartItems`/`TopMenuCartCount`/`CheckoutItems`
  como única fuente de verdad vía `useSyncExternalStore`.
- **Dirección de entrega**: formulario con validación Zod fail-closed
  (client + server), prefill desde zustand/BD y persistencia por usuario
  (`UserAddress`). El checkout muestrea la dirección desde el store.
- **Registro y verificación de email**: flujo completo implementado
  (registro → token → correo → verificación). `authorize()` de NextAuth
  valida credenciales contra la BD (`NextAuthAuthorize`). El proxy protege
  `/admin` por rol y permite `/auth/verify-email` con sesión activa.
- **Facturas por email**: `send-invoice-email-action` orquesta orden →
  servicio Spring (`BILLING_API_URL`) genera el PDF → URL del documento →
  correo con el enlace (`invoice-email`). PDFShift queda como alternativa
  de conversión HTML → PDF.
- **Búsqueda y filtro**: barra de búsqueda animada en `TopMenu` con
  expansión inline, param `?search=` (no `?q=`). Resultados filtrados
  server-side con `title.contains` (Prisma). Página `/products?q=...`
  filtra server-side. Página de catálogo (`/`) filtra por `?search=`.
- **Validación dual**: React Hook Form (cliente, UX) + hexágono Zod
  (`ZodValidateAdapter`) en servidor. Esquemas Zod compartidos cliente/servidor.
  Esquemas relajados: título permite dígitos, descripción permite puntuación.
- **NotFound inteligente**: `ProductsNotFound` parametrizado — 404 clásico o
  "Sin resultados" según query `?search=`. Componente `NotFoundContent`
  detecta `?search=` vía `useSearchParams()` y adapta badge, código, título,
  descripción y botón CTA. `not-found.tsx` usa `Suspense` + cliente para
  leer `useSearchParams()` y delegar a `ProductsNotFound` con props correctas.
- **TopMenu rediseñado**: dos filas (logo/acciones arriba, categorías abajo).
  Categorías con scroll horizontal nativo en móvil (`overflow-x-auto`),
  inline en desktop. Logo + acciones arriba, categorías debajo.
- **Imágenes consistentes**: la BD guarda siempre rutas completas (seed
  persiste `/products/<archivo>`; uploads guardan la URL de Cloudinary). La
  UI consume `url` plano vía `next/image`.
- **Validación de formularios**: `saveProductAction` y `updateProductAction`
  normalizan `tags` (string→array), `price` e `inStock` (string→number) antes
  de validar y persistir. `slugScheme` permite guiones bajos; `titleScheme`
  permite dígitos; `descriptionScheme` permite puntuación común.
- **Server actions**: `saveProductAction`, `updateProductAction`,
  `deleteProductById`, `getAllCategoriesAction`, `sendInvoiceEmailAction`.
  Facturación via Spring Boot (`BILLING_API_URL`) + PDFShift fallback.
- **Órdenes**: `Order`, `OrderItem`, `OrderAddress` + caso de uso + adaptador
  Prisma + factura por email con Spring + PDFShift.
- **Admin panel**: dashboard, usuarios (`RoleSelector`), productos CRUD
  con `ProductForm` (RHF + Zod), subida imágenes Cloudinary.
- Sin tests automatizados todavía (sin runner ni suite configurada).

---

> Proyecto de aprendizaje — las ilustraciones, términos y textos legales son
> con fines de demostración.
