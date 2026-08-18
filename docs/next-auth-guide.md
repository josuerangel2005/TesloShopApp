# NextAuth Implementation Guide — Teslo-Shop

A working-reference blueprint for how **NextAuth v5 (Auth.js)** is implemented — and what still needs to be done — in this exact repo and its layered modular architecture.

> **Status of this document:** This is an **already-implemented blueprint**. Everything quoted below is the real, running code in `main`. Sections 1–7 describe the current state; Section 8 lists the concrete remaining gaps.

---

## 1. Overview & architecture decision

### What was chosen

| Decision | Value |
|---|---|
| Library | `next-auth` **v5.0.0-beta.32** (Auth.js) |
| Session strategy | **JWT** (`session: { strategy: "jwt" }`) — no database session table, no Adapter |
| Providers | **Credentials only** — no OAuth (Google/GitHub) wired yet |
| Route handling | **No `[...nextauth]` catch-all route** — sessions and actions use the `auth` instance exported from `auth.ts` directly (server-side pattern) |
| Edge protection | `src/proxy.ts` (Next 16 renamed **Middleware → Proxy**) with the `authorized` callback |
| Password hashing | `bcryptjs` v3 via a shared encrypt use case |
| Input validation | `zod` v4 (`NextAuthAuthorize` + shared user-registration validation) |

### How the modular layers map to NextAuth concepts

NextAuth is treated as an **infrastructure detail**. The domain never imports `next-auth`; the boundary is two driven ports:

- **`ForAuthSession`** wraps Auth.js session primitives: `login()` → `signIn("credentials", { redirect: false })`, `logout()` → `signOut({ redirect: false })`, `getSession()` → `auth()`, `isAuthenticated()`. Implemented by `NextAuthHandler` in infrastructure.
- **`ForAuth`** wraps persistence + password hashing: `verifyCredentials()` (bcrypt compare), `register()`, email-verification token flows, and seed helpers. Implemented by `PrismaUserHandler`.
- **`authorize()` lives in its own class** — `NextAuthAuthorize` — which validates credentials with zod and calls `ForAuth.verifyCredentials`, mapping domain exceptions back to `null` (which Auth.js turns into `CredentialsSignin`).
- **Manual DI via factories**: `auth.ts` builds its own `PrismaUserHandler → NextAuthAuthorize` graph for the provider; `handle-auth-use-case-factory.ts` builds `NextAuthHandler → HandleAuthUseCase` and `PrismaUserHandler → HandleAuthUseCase` for the rest of the app. No DI container.
- **Type augmentation** in `types/next-auth.d.ts` teaches TypeScript about the extra JWT/Session/User fields.

The remaining work is concentrated in the regression **guards**: admin-role enforcement, the proxy matcher coverage, and gating login on email verification. See Section 8.

---

## 2. Authentication flow (end-to-end walkthrough)

```
(1) Click "Ingresar"
      │
(2) LoginForm.tsx  [useActionState(authenticate, undefined)]
      │  form <form action={formAction}>
      │
(3) login-action.ts  ["use server"]  authenticate(prevState, formData)
      │  builds LoginCredential(email, password)
      │  getHandleAuthUseCase().login(credential)
      │
(4) HandleAuthUseCase.login → ForAuthSession.login
      │
(5) NextAuthHandler.login  →  signIn("credentials", { email, password, redirect:false })
      │
(6) Credentials provider → authorize(credentials)
      │  NextAuthAuthorize.execute(credentials)
      │  zod parse (email .email(), password min(6)); safeParse fails → null
      │
(7) ForAuth.verifyCredentials(email, password)
      │  PrismaUserHandler: findFirstOrThrow (P2025 → UserNotExistsException)
      │  bcrypt compare (mismatch → InvalidCredentialsException)
      │  returns domain User (id, name, email, role, image, emailVerified, …)
      │
(8) authorize returns plain object { id, name, email, image, role, emailVerified }
      │
(9) JWT created → jwt() callback copies fields into token
      │  token.id / name / email / image / role / emailVerified (ISO string)
      │
(10) session() callback rebuilds session.user from the token
      │  id, role ("USER" | "ADMIN"), emailVerified (Date back from ISO)
      │
(11) NextAuthHandler.login returns; signIn succeeded (no AuthError thrown)
      │
(12) login-action → redirect("/")
      │
(13) Subsequent requests hit src/proxy.ts (matcher-protected paths)
      │  authorized callback: /auth → !user ; everything else → !!user
      │  JWT verified → request allowed (or redirected by Auth.js to /auth/login)
      │
(14) Server components / server actions re-check server-side
      │  getSession() / getCurrentUser() (e.g. (shop) layout, profile page)
```

**Failure path:** bad email/password → `InvalidCredentialsException` → `authorize` returns `null` → Auth.js throws `CredentialsSignin` → `NextAuthHandler.login` catches `AuthError` and rethrows `InvalidCredentialsException` → `login-action` maps it to Spanish message `"Correo o contraseña incorrectos."`.

---

## 3. Dependencies

From `package.json` (real content):

```json
"next-auth": "^5.0.0-beta.32",
"bcryptjs": "^3.0.3",
"zod": "^4.4.3",
```

Also relevant: `next: 16.3.0`, `@prisma/client: ^7.9.1`, `@prisma/adapter-pg: ^7.9.1`, `react: 19.2.8`.

`devDependencies` include `prisma: ^7.9.1`, `@types/bcryptjs: ^2.4.6`.

Prisma 7 requires a driver adapter at runtime (`@prisma/adapter-pg` + a connection string passed from `process.env.DATABASE_URL`), and generates the client into `src/generated/prisma` (see the `generator client` block in `schema.prisma`).

### Environment variables (`.env`)

Entries required in `.env` (replace the placeholders — never commit real values):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/teslo-shop?schema=public"
AUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

- **`AUTH_SECRET`** — required to sign/verify JWTs with the `jwt` strategy. Never commit the real value; `.env` is git-ignored and `.env-template` holds the placeholders.
- **`NEXTAUTH_URL`** — used by `register-action` to build the email verification link.
- `DATABASE_URL` — consumed by `prisma.config.ts` and `modules/.../prisma.ts`.

---

## 4. File-by-file blueprint

Files are presented in **build order** (dependencies first, then Auth.js wiring, then UI). All content below is quoted from the real files.

### 4.1 `package.json`

**Purpose:** Project manifest with the auth-related deps.

Content quoted in Section 3. No change needed for NextAuth beyond having `next-auth@^5.0.0-beta.32`.

### 4.2 `modules/shared/ui-state/infrastructure/adapters/out/Persistence/prisma/schema.prisma` — `User` model

**Purpose:** The DB shape NextAuth's credential flow reads from.

```prisma
enum Role {
  USER
  ADMIN
}

model User {
  id                       String       @id @default(uuid())
  name                     String
  email                    String       @unique
  password                 String
  role                     Role         @default(USER)
  image                    String       @default("")
  emailVerified            DateTime?
  emailVerificationToken   String?      @unique
  emailVerificationExpires DateTime?
  userAddress              UserAddress?
  orders                   Order[]
}
```

> **Notes**
> - `password` lives only in the DB row; the domain `User` model intentionally has **no password field** — the plaintext/bcrypt hash never crosses the domain boundary.
> - Email verification is a custom column trio (`emailVerified`, `emailVerificationToken`, `emailVerificationExpires`), **not** Auth.js's built-in Email provider — we rolled our own verify-email flow.
> - Prisma 7 uses `provider = "prisma-client"` with `output = "../../../../../../../../src/generated/prisma"`; the client is imported as `@/generated/prisma/client`.

### 4.3 `modules/shared/ui-state/infrastructure/config/factory/encrypt-password-use-case-factory.ts`

**Purpose:** Shared DI for bcrypt (used by both the auth module and the seed).

```ts
import { EncryptPasswordUseCase } from "../../../application/usecases/encrypt-password-use-case";
import { BcryptValidatorAdapter } from "../../adapters/out/Encrypt/bcrypt-validator-adapter";

const bcryptValidatorAdapter = new BcryptValidatorAdapter();

export const getEncryptPasswordUseCase = () =>
  new EncryptPasswordUseCase(bcryptValidatorAdapter);
```

> **Note:** The adapter is a **module-level singleton**; the use case is rebuilt per call. Both the Prisma user handler and the seed depend on the same hashing stack — hashing consistency matters, otherwise seed users hashed with a different algorithm would never authenticate.

### 4.4 Domain model — `modules/auth/domain/model/`

**Purpose:** Pure TS value/entity objects; no `next-auth` or Prisma imports.

#### `role.ts`

```ts
export enum Role {
  user = "USER",
  admin = "ADMIN",
}
```

#### `user.ts`

```ts
import { Role } from "./role";

export class User {
  private readonly id: string;
  private name: string;
  private email: string;
  private role: Role;
  private image: string;
  private readonly emailVerified: Date | null;
  private readonly emailVerificationToken: string | null;
  private readonly emailVerificationExpires: Date | null;

  constructor(
    id: string,
    name: string,
    email: string,
    role: Role,
    image: string,
    emailVerified: Date | null,
    emailVerificationToken: string | null,
    emailVerificationExpires: Date | null,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.image = image;
    this.emailVerified = emailVerified;
    this.emailVerificationToken = emailVerificationToken;
    this.emailVerificationExpires = emailVerificationExpires;
  }

  public getId(): string {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
  public getEmail(): string {
    return this.email;
  }
  public getRole(): Role {
    return this.role;
  }
  public getImage(): string {
    return this.image;
  }
  public getEmailVerified(): Date | null {
    return this.emailVerified;
  }
  public getEmailVerificationToken(): string | null {
    return this.emailVerificationToken;
  }
  public getEmailVerificationExpires(): Date | null {
    return this.emailVerificationExpires;
  }
}
```

> **Note:** Full getter pattern, readonly identity fields. No `password` — by design.

#### `auth-session.ts`

```ts
import { Role } from "./role";

export class AuthSession {
  private readonly id: string;
  private readonly email: string;
  private readonly name: string;
  private readonly image: string;
  private readonly role: Role;
  private readonly emailVerified: Date | null;
  private readonly expiresAt: Date;

  constructor(
    id: string,
    email: string,
    name: string,
    image: string,
    role: Role,
    emailVerified: Date | null,
    expiresAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.image = image;
    this.role = role;
    this.emailVerified = emailVerified;
    this.expiresAt = expiresAt;
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getName(): string {
    return this.name;
  }

  public getImage(): string {
    return this.image;
  }

  public getRole(): Role {
    return this.role;
  }

  public getEmailVerified(): Date | null {
    return this.emailVerified;
  }

  public getExpiresAt(): Date {
    return this.expiresAt;
  }

  public isExpired(): boolean {
    return this.expiresAt.getTime() < Date.now();
  }
}
```

#### `login-credentials.ts`

```ts
export class LoginCredential {
  private readonly email: string;
  private readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }
}
```

#### `commands/user-save-command.ts`

```ts
import { Role } from "../role";

export class UserSaveCommand {
  private name: string;
  private email: string;
  private password: string;
  private role: Role;
  private image: string;

  constructor(
    name: string,
    email: string,
    password: string,
    role: Role,
    image: string,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.image = image;
  }

  public getName(): string {
    return this.name;
  }
  public getEmail(): string {
    return this.email;
  }
  public getPassword(): string {
    return this.password;
  }
  public getRole(): Role {
    return this.role;
  }
  public getImage(): string {
    return this.image;
  }
}
```

> **Note:** `register-action` constructs this with `Role.user` and `imageUrl ?? ""` — new accounts are always plain `USER` role.

> **TODO:** `for-auth.ts` also references `commands/user-seed-save-command.ts` (`UserSeedSaveCommand`) for the seed flow — it exists under `modules/auth/domain/model/commands/`; quoted here only by mention since it is not part of the runtime auth path.

### 4.5 Domain errors — `modules/auth/domain/error/*.ts`

**Purpose:** Semantic exceptions that let the UI map failures to Spanish messages without leaking Prisma/NextAuth errors. All extend `Error` (real content, condensed):

| File | Message |
|---|---|
| `empty-credentials-exception.ts` | `EmptyCredentialExcepion` → "The credentials are empty" |
| `invalid-credentials-exception.ts` | `InvalidCredentialsException` → "Email or password are incorrect" |
| `auth-exception.ts` | `AuthException(message)` → `"Unknown auth error: ${message}"` |
| `user-not-exists-exception.ts` | `UserNotExistsException(email)` → `"The user with the email ${email} not exists"` |
| `user-already-exists-exception.ts` | `UserAlreadyExistsException(email)` → `"User with email: ${email} already exists"` |
| `user-persistence-exception.ts` | `UserPersistenceException(message)` → plain passthrough |
| `verification-token-invalid-exception.ts` | `VerificationTokenInvalidException` → "The verification token is invalid or has already been used" |
| `verification-token-expired-exception.ts` | `VerificationTokenExpiredException` → "The verification token has expired" |

> Typo note (do not "fix"): the empty-credentials class is spelled `EmptyCredentialExcepion` (missing "s") and it is used consistently under that name in `login-action.ts`.

### 4.6 Driven ports — `modules/auth/domain/ports/driven/`

**Purpose:** The abstractions the application layer depends on.

#### `for-auth.ts`

```ts
import { UserSaveCommand } from "../../model/commands/user-save-command";
import { UserSeedSaveCommand } from "../../model/commands/user-seed-save-command";
import { User } from "../../model/user";

export interface ForAuth {
  verifyCredentials(email: string, password: string): Promise<User>;
  register(saveCommand: UserSaveCommand): Promise<User>;
  findUserByEmail(email: string): Promise<User>;
  findUserByVerificationToken: (token: string) => Promise<User>;
  saveEmailVerificationToken: (
    email: string,
    token: string,
    expiresAt: Date,
  ) => Promise<void>;
  verifyEmail: (token: string) => Promise<User>;

  //for seed
  saveAllUsersSeed: (users: UserSeedSaveCommand[]) => Promise<void>;
  deleteAllUsers: () => Promise<void>;
  deleteAllUserAddresses: () => Promise<void>;
}
```

#### `for-auth-session.ts`

```ts
import { AuthSession } from "../../model/auth-session";
import { LoginCredential } from "../../model/login-credentials";

export interface ForAuthSession {
  login(credentials: LoginCredential): Promise<void>;
  logout(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  isAuthenticated(): Promise<boolean>;
}
```

### 4.7 Application use case — `modules/auth/application/usecases/handle-auth-use-case.ts`

**Purpose:** The single orchestration façade used by all UI actions/pages. Decorates the two driven ports.

```ts
import { AuthSession } from "../../domain/model/auth-session";
import { UserSaveCommand } from "../../domain/model/commands/user-save-command";
import { LoginCredential } from "../../domain/model/login-credentials";
import { User } from "../../domain/model/user";
import { ForAuth } from "../../domain/ports/driven/for-auth";
import { ForAuthSession } from "../../domain/ports/driven/for-auth-session";
import { VerificationTokenExpiredException } from "../../domain/error/verification-token-expired-exception";
import { VerificationTokenInvalidException } from "../../domain/error/verification-token-invalid-exception";
import { UserNotExistsException } from "../../domain/error/user-not-exists-exception";
import { UserSeedSaveCommand } from "../../domain/model/commands/user-seed-save-command";

export class HandleAuthUseCase {
  private readonly forAuthSession: ForAuthSession;
  private readonly forAuth: ForAuth;

  constructor(forAuthSession: ForAuthSession, forAuth: ForAuth) {
    this.forAuthSession = forAuthSession;
    this.forAuth = forAuth;
  }

  public login(credentials: LoginCredential): Promise<void> {
    return this.forAuthSession.login(credentials);
  }

  public logout(): Promise<void> {
    return this.forAuthSession.logout();
  }

  public getSession(): Promise<AuthSession | null> {
    return this.forAuthSession.getSession();
  }

  public async getCurrentUser(): Promise<User | null> {
    const session = await this.forAuthSession.getSession();
    const email = session?.getEmail();
    if (!email) return null;

    try {
      return await this.forAuth.findUserByEmail(email);
    } catch (error) {
      if (error instanceof UserNotExistsException) return null;
      throw error;
    }
  }

  public isAuthenticated(): Promise<boolean> {
    return this.forAuthSession.isAuthenticated();
  }

  public verifyCredentials(email: string, password: string): Promise<User> {
    return this.forAuth.verifyCredentials(email, password);
  }

  public register(saveCommand: UserSaveCommand): Promise<User> {
    return this.forAuth.register(saveCommand);
  }

  public findUserByEmail(email: string): Promise<User> {
    return this.forAuth.findUserByEmail(email);
  }

  public saveEmailVerification(
    email: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    return this.forAuth.saveEmailVerificationToken(email, token, expiresAt);
  }

  public async verifyEmail(token: string): Promise<User> {
    const user = await this.forAuth.findUserByVerificationToken(token);

    if (user.getEmailVerified()) return user;

    const expiresAt = user.getEmailVerificationExpires();
    if (expiresAt && expiresAt < new Date())
      throw new VerificationTokenExpiredException();

    return this.forAuth.verifyEmail(token);
  }

  //seed
  public saveAllUsersSeed(users: UserSeedSaveCommand[]): Promise<void> {
    return this.forAuth.saveAllUsersSeed(users);
  }

  public deleteAllUsers(): Promise<void> {
    return this.forAuth.deleteAllUsers();
  }

  public deleteAllUserAddresses(): Promise<void> {
    return this.forAuth.deleteAllUserAddresses();
  }
}
```

> **Notes**
> - `getCurrentUser()` re-fetches the live DB row by session email — the JWT is only the "token of truth" for the routes; the fresh `User` is used for role checks on pages like `/profile` and `/orders`.
> - `verifyCredentials` here is **not** used by the provider authorize (that goes through `NextAuthAuthorize → ForAuth.verifyCredentials` directly); this method exists for completeness/seed purposes.
> - `login()` returns `Promise<void>` — the actual redirect happens in the server action.

### 4.8 Infrastructure adapters — `modules/auth/infrastructure/adapters/out/auth/`

**Purpose:** Where NextAuth and Prisma actually live. This is the only place `next-auth`/`@/generated/prisma/client` are imported for the auth domain (besides the root `auth.ts` wiring).

#### `mappers/toUserDomainMapper.ts`

```ts
import { Prisma } from "@/generated/prisma/client";
import { User } from "../../../../../domain/model/user";
import { Role } from "../../../../../domain/model/role";

export const toUserDomainMapper = (row: Prisma.UserGetPayload<{}>): User =>
  new User(
    row.id,
    row.name,
    row.email,
    row.role as Role,
    row.image,
    row.emailVerified,
    row.emailVerificationToken,
    row.emailVerificationExpires,
  );
```

> **Note:** Uses `@/generated/prisma/client` (Prisma 7 generated client) and a strict `as Role` cast for the DB enum.

#### `prisma-users-handler.ts` (trimmed to the auth-relevant parts)

**Purpose:** Implements `ForAuth` over Prisma + bcrypt; maps `P2025` (not found) / `P2002` (unique conflict) to domain exceptions.

```ts
import { prisma } from "../../../../../shared/ui-state/infrastructure/adapters/out/Persistence/prisma/prisma";
import { EncryptPasswordUseCase } from "../../../../../shared/ui-state/application/usecases/encrypt-password-use-case";
import { UserSaveCommand } from "../../../../domain/model/commands/user-save-command";
import { User } from "../../../../domain/model/user";
import { ForAuth } from "../../../../domain/ports/driven/for-auth";
import { InvalidCredentialsException } from "../../../../domain/error/invalid-credentials-exception";
import { Role } from "../../../../domain/model/role";
import { Prisma } from "@/generated/prisma/client";
import { UserNotExistsException } from "../../../../domain/error/user-not-exists-exception";
import { UserPersistenceException } from "../../../../domain/error/user-persistence-exception";
import { toUserDomainMapper } from "./mappers/toUserDomainMapper";
import { UserAlreadyExistsException } from "../../../../domain/error/user-already-exists-exception";
import { VerificationTokenInvalidException } from "../../../../domain/error/verification-token-invalid-exception";
import { UserSeedSaveCommand } from "../../../../domain/model/commands/user-seed-save-command";

export class PrismaUserHandler implements ForAuth {
  private readonly prismaClient: typeof prisma;
  private readonly encryptPasswordUseCase: EncryptPasswordUseCase;

  constructor(
    prismaClient: typeof prisma,
    encryptPasswordUseCase: EncryptPasswordUseCase,
  ) {
    this.prismaClient = prismaClient;
    this.encryptPasswordUseCase = encryptPasswordUseCase;
  }

  async verifyCredentials(email: string, password: string): Promise<User> {
    try {
      const data = await this.prismaClient.user.findFirstOrThrow({
        where: {
          email,
        },
      });

      if (!(await this.encryptPasswordUseCase.compare(password, data.password)))
        throw new InvalidCredentialsException();

      return new User(
        data.id,
        data.name,
        data.email,
        data.role as Role,
        data.image,
        data.emailVerified,
        data.emailVerificationToken,
        data.emailVerificationExpires,
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new UserNotExistsException(email);
      if (error instanceof InvalidCredentialsException) throw error;
      throw new UserPersistenceException(
        `Failed verify credentials: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async register(saveCommand: UserSaveCommand): Promise<User> {
    try {
      const data = await this.prismaClient.user.create({
        data: {
          name: saveCommand.getName(),
          email: saveCommand.getEmail(),
          password: await this.encryptPasswordUseCase.encrypt(
            saveCommand.getPassword(),
          ),
          role: saveCommand.getRole(),
          image: saveCommand.getImage(),
        },
      });

      return toUserDomainMapper(data);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        throw new UserAlreadyExistsException(saveCommand.getEmail());
      throw new UserPersistenceException(
        `Failed to save user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  // … findUserByEmail, findUserByVerificationToken, saveEmailVerificationToken,
  // verifyEmail, seed helpers — all follow the same try/catch + P2025/P2002 mapping pattern.
}
```

> **Notes**
> - **P2025 → `UserNotExistsException`** for reads; **P2002 → `UserAlreadyExistsException`** for register/seed. Any other error becomes `UserPersistenceException`.
> - `verifyCredentials` does **NOT currently check `emailVerified`** — Section 8.4 shows the gap and the fix.
> - The password hash is compared via the shared `EncryptPasswordUseCase.compare`, keeping bcrypt ADR details out of the auth module.

#### `next-auth-authorize.ts`

**Purpose:** The `authorize()` callable for the Credentials provider. zod-validates, calls `ForAuth.verifyCredentials`, and translates domain exceptions to `null` (Auth.js failure signal).

```ts
import { z } from "zod";
import { ForAuth } from "../../../../domain/ports/driven/for-auth";
import { InvalidCredentialsException } from "../../../../domain/error/invalid-credentials-exception";
import { UserNotExistsException } from "../../../../domain/error/user-not-exists-exception";

export class NextAuthAuthorize {
  private readonly forAuth: ForAuth;

  constructor(forAuth: ForAuth) {
    this.forAuth = forAuth;
  }

  public async execute(credentials: unknown) {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });
    const parsed = schema.safeParse(credentials);
    if (!parsed.success) return null;

    const { email, password } = parsed.data;

    try {
      const user = await this.forAuth.verifyCredentials(email, password);
      return {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        image: user.getImage(),
        role: user.getRole(),
        emailVerified: user.getEmailVerified(),
      };
    } catch (error) {
      if (error instanceof InvalidCredentialsException) return null;
      if (error instanceof UserNotExistsException) return null;
      throw error;
    }
  }
}
```

> **Notes**
> - Returning `null` makes Auth.js throw `CredentialsSignin` — which `NextAuthHandler.login` converts into `InvalidCredentialsException`.
> - `password: z.string().min(6)` means login with a < 6 char password is rejected **before** touching the DB.
> - `role` from the domain enum (`Role.user`/`Role.admin` = `"USER"`/`"ADMIN"`) flows straight into the `User` object handed to the `jwt` callback.

#### `next-auth-handler.ts`

**Purpose:** Implements `ForAuthSession` by wrapping the auth instance's `signIn` / `signOut` / `auth()`; maps `AuthError` to domain exceptions.

```ts
import { AuthError } from "next-auth";
import { auth } from "../../../../../../auth";
import { LoginCredential } from "../../../../domain/model/login-credentials";
import { ForAuthSession } from "../../../../domain/ports/driven/for-auth-session";
import { InvalidCredentialsException } from "../../../../domain/error/invalid-credentials-exception";
import { AuthSession } from "../../../../domain/model/auth-session";
import { Role } from "../../../../domain/model/role";
import { AuthException } from "../../../../domain/error/auth-exception";

export class NextAuthHandler implements ForAuthSession {
  private readonly authentication: typeof auth;

  constructor(authentication: typeof auth) {
    this.authentication = authentication;
  }

  async login(credentials: LoginCredential): Promise<void> {
    try {
      await this.authentication.signIn("credentials", {
        email: credentials.getEmail(),
        password: credentials.getPassword(),
        redirect: false,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.type === "CredentialsSignin")
          throw new InvalidCredentialsException();
        else throw new AuthException("Unknown authentication error");
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authentication.signOut({ redirect: false });
    } catch (error) {
      if (error instanceof AuthError)
        throw new AuthException("Unknown logout error");
      throw error;
    }
  }

  async getSession(): Promise<AuthSession | null> {
    const session = await this.authentication.auth();

    if (!session?.user) return null;

    return new AuthSession(
      session.user.id ?? "",
      session.user.email ?? "",
      session.user.name ?? "",
      session.user.image ?? "",
      session.user.role as Role,
      session.user.emailVerified ?? null,
      new Date(session.expires),
    );
  }

  async isAuthenticated(): Promise<boolean> {
    return (await this.getSession()) !== null;
  }
}
```

> **Notes**
> - `redirect: false` is the key: signIn returns instead of throwing on failure and instead of redirecting on success — the server action controls navigation via `redirect("/")`.
> - `error.type === "CredentialsSignin"` is the string sentinel the official `next-auth` Credentials provider uses; the working repo relies on it.
> - `getSession()` pins `session.expires` to `AuthSession.expiresAt` (token expiry), which powers `isExpired()`.

### 4.9 Factory — `modules/auth/infrastructure/config/factory/handle-auth-use-case-factory.ts`

**Purpose:** Manual DI root for the application-layer façade.

```ts
import { auth } from "../../../../../auth";
import { prisma } from "../../../../shared/ui-state/infrastructure/adapters/out/Persistence/prisma/prisma";
import { getEncryptPasswordUseCase } from "../../../../shared/ui-state/infrastructure/config/factory/encrypt-password-use-case-factory";
import { HandleAuthUseCase } from "../../../application/usecases/handle-auth-use-case";
import { NextAuthHandler } from "../../adapters/out/auth/next-auth-handler";
import { PrismaUserHandler } from "../../adapters/out/auth/prisma-users-handler";

const nextAuthHandler = new NextAuthHandler(auth);
const prismaUsersHandler = new PrismaUserHandler(
  prisma,
  getEncryptPasswordUseCase(),
);

export const getHandleAuthUseCase = () =>
  new HandleAuthUseCase(nextAuthHandler, prismaUsersHandler);
```

> **Notes**
> - `nextAuthHandler` and `prismaUsersHandler` are **module-level singletons**; `HandleAuthUseCase` itself is cheap and rebuilt per call. This mirrors the singleton pattern in `auth.ts` and the encrypt factory — one shared `prisma` connection across the DI graphs.
> - Same static factory pattern used everywhere in the codebase (`getShowMessageUseCase`, `getEmailSenderHandlerUseCase`, …).

### 4.10 Module barrel — `modules/auth/index.ts`

**Purpose:** Public surface for the module (actions and pages import from here).

```ts
export * from "./application/usecases/handle-auth-use-case";
export * from "./domain/ports/driven/for-auth";
export * from "./domain/ports/driven/for-auth-session";
export * from "./infrastructure/config/factory/handle-auth-use-case-factory";
```

### 4.11 `auth.config.ts` — shared base config

**Purpose:** The pure, edge-safe `NextAuthConfig` used both by `auth.ts` and `src/proxy.ts` (callbacks + pages + strategy). No Node-only deps here — that is what keeps the Proxy bundle edge-safe.

```ts
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/auth/login", newUser: "/auth/new-account" },
  providers: [],
  session: { strategy: "jwt" },
  callbacks: {
    authorized: async ({ auth, request }) => {
      const user = auth?.user;
      const path = request.nextUrl.pathname;

      //rutas que necesita role = ADMIN

      //rutas a las que no se puede acceder si ya se está logueado
      if (path.startsWith("/auth")) return !user;

      //El resto solo exige sesión iniciada
      return !!user;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
        token.emailVerified = user.emailVerified?.toISOString() ?? null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";
        session.user.image = token.image ?? "";
        session.user.role = token.role ?? "USER";
        session.user.emailVerified = token.emailVerified
          ? new Date(token.emailVerified)
          : null;
      }
      return session;
    },
  },
};
```

> **Notes**
> - The `authorized` callback only handles two cases today: block already-authenticated users from `/auth/*` and require a session everywhere else the proxy matches. The "rutas que necesita role = ADMIN" block is an **empty TODO** — see Section 8.1.
> - **JWT serialization gotcha:** `emailVerified` is stored on the token as an **ISO string** (`toISOString()`) because the JWT payload is JSON; the `session` callback converts it back to a `Date`. This is the mutation pattern: `jwt` enriches `token`, `session` enriches `session.user` from that token.
> - `pages.signIn`/`newUser` point Auth.js redirects at the custom pages.

### 4.12 `auth.ts` — root NextAuth instance

**Purpose:** The runtime instance with the real Credentials provider. Server components/actions import `auth` from here (via the handler factory).

```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { NextAuthAuthorize } from "./modules/auth/infrastructure/adapters/out/auth/next-auth-authorize";
import { PrismaUserHandler } from "./modules/auth/infrastructure/adapters/out/auth/prisma-users-handler";
import { prisma } from "./modules/shared/ui-state/infrastructure/adapters/out/Persistence/prisma/prisma";
import { getEncryptPasswordUseCase } from "./modules/shared/ui-state/infrastructure/config/factory/encrypt-password-use-case-factory";

const prismaUserHandler = new PrismaUserHandler(
  prisma,
  getEncryptPasswordUseCase(),
);
const nextAuthAuthorize = new NextAuthAuthorize(prismaUserHandler);

export const auth = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        return nextAuthAuthorize.execute(credentials);
      },
    }),
  ],
});
```

> **Notes**
> - This builds a **second DI graph** (`PrismaUserHandler → NextAuthAuthorize`) separate from the one in the use-case factory. Both share the same `prisma` singleton and `getEncryptPasswordUseCase()`.
> - A subtlety of Auth.js v5 beta on Next 16: the **provider must live in `auth.ts` (Node runtime)**, while `auth.config.ts` stays provider-free so it can be reused by the edge Proxy.

### 4.13 `src/proxy.ts` — NextAuth as edge middleware (Next 16 rename)

**Purpose:** Runs the `authorized` callback on matched routes before the request completes; grants/denies by re-using `authConfig`.

```ts
import NextAuth from "next-auth";
import { authConfig } from "../auth.config";

const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  matcher: ["/auth/:path*", "/profile", "/checkout/:path*"],
};
```

> **Notes / Next 16 rename rule**
> From `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`:
> > "Starting with Next.js 16, Middleware is now called Proxy to better reflect its purpose. The functionality remains the same."
>
> The file must be named `proxy.ts` (or `proxy.js`) at project root / inside `src` — same level as `app`. There is a `config.matcher` export. So what used to be `src/middleware.ts` with `middleware = auth` is now `src/proxy.ts` with `export const proxy = auth`.
> - `auth.config.ts` (no Node-only imports) is reused here — the `jwt`/`session` callbacks only run in the Node instance; the Proxy only needs `authorized` to work on the edge.
> - **Important gap:** the current matcher covers only `/auth/*`, `/profile`, `/checkout/*`. `/admin`, `/orders`, `/cart` are NOT matched — Section 8.2.

### 4.14 `types/next-auth.d.ts` — type augmentation

**Purpose:** Teach TypeScript about the custom fields. (Detailed in Section 5.)

```ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
      emailVerified?: Date | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "USER" | "ADMIN";
    emailVerified?: Date | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    image?: string | null;
    role?: "USER" | "ADMIN";
    emailVerified?: string | null;
  }
}
```

This file must be included by `tsconfig.json` (`types`/`include`). It keeps `session.user.role as Role`-style casts and `token.role`/`session.user.emailVerified` mutations type-safe across `auth.ts`, `auth.config.ts`, and `next-auth-handler.ts`.

---

## 5. Type augmentation

Why it is required: with the JWT strategy, everything custom you want in `session.user` must be **(a)** copied into the token in `jwt()`, **(b)** copied into `session.user` in `session()`, and **(c)** typed in `types/next-auth.d.ts` — otherwise TS flags the mutations.

- `Session.user` adds `id: string`, `role: "USER" | "ADMIN"`, `emailVerified?: Date | null`, intersected with `DefaultSession["user"]` (so `name`/`email`/`image` remain optional).
- `User` (the object returned by `authorize`) gains optional `role` and `emailVerified` so `auth.ts` can set them before the JWT is created.
- `JWT` (`@auth/core/jwt`) declares the token-payload shape — note `emailVerified?: string | null` (string, not Date) matching the `toISOString()` serialization in the `jwt` callback.

The whole chain is exercised end-to-end in `NextAuthHandler.getSession()`:
```ts
session.user.role as Role,
session.user.emailVerified ?? null,
```

---

## 6. UI layer

All auth actions are `"use server"` and return plain serializable state objects except `logout` (which just redirects). The forms are `"use client"` and use `useActionState`. The UI keeps the existing Spanish-message convention — that is an intentional project decision for end-user copy and stays as-is.

### 6.1 `ui/features/login/actions/login-action.ts`

```ts
"use server";
import { InvalidCredentialsException } from "../../../../modules/auth/domain/error/invalid-credentials-exception";
import { AuthException } from "../../../../modules/auth/domain/error/auth-exception";
import { LoginCredential } from "../../../../modules/auth/domain/model/login-credentials";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { redirect } from "next/navigation";
import { getValidateUserRegistrationUseCase } from "../../../../modules/shared/validation";
import { EmptyCredentialExcepion } from "../../../../modules/auth/domain/error/empty-credentials-exception";

export interface LoginState {
  message?: string;
  fieldsErrors: {
    email?: string;
    password?: string;
  };
}

export async function authenticate(
  prevState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const handleAuthUseCase = getHandleAuthUseCase();
  const email: string = formData.get("email")?.toString().trim() ?? "";
  const password: string = formData.get("password")?.toString().trim() ?? "";

  try {
    if (!email || !password) throw new EmptyCredentialExcepion();

    await handleAuthUseCase.login(new LoginCredential(email, password));
  } catch (error) {
    if (error instanceof InvalidCredentialsException) {
      return {
        fieldsErrors: {},
        message: "Correo o contraseña incorrectos.",
      };
    }
    if (error instanceof EmptyCredentialExcepion) {
      return {
        fieldsErrors: {},
        message: "Debe completar los campos",
      };
    }
    if (error instanceof AuthException) {
      return {
        fieldsErrors: {},
        message: "Error al iniciar sesión. Intente nuevamente.",
      };
    }
    console.error("Login error:", error);
    return {
      fieldsErrors: {},
      message: "Ocurrió un error inesperado. Intente nuevamente.",
    };
  }

  redirect("/");
}
```

> **Note on `redirect:false` server actions:** because the action returns state on error and `redirect()`s on success, you never re-render with a success payload — the router navigation is handled by Next.js. This is exactly the pattern Auth.js docs recommend pairing with Credentials + `redirect: false`.

### 6.2 `ui/features/login/components/Login-form/LoginForm.tsx` (key excerpts)

```tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useActionState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { authenticate } from "../../actions/login-action";
import { getShowMessageUseCase } from "../../../../../modules/shared/ui-state";

interface Props {
  fieldClass: string;
  registered?: boolean;
}

export const LoginForm = ({ fieldClass, registered }: Props) => {
  const [state, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  const showedRegisteredToast = useRef(false);

  useEffect(() => {
    if (registered && !showedRegisteredToast.current) {
      showedRegisteredToast.current = true;
      getShowMessageUseCase().show(
        "Tu cuenta fue creada. Revisá tu correo para activarla.",
        "success",
      );
    }
  }, [registered]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* … email input (name="email"), password input (name="password") … */}
      {state?.message && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <IoAlertCircleOutline size={18} className="mt-0.5 shrink-0" />
          <p className="font-medium">{state.message}</p>
        </div>
      )}

      <button
        type="submit"
        className="btn-primary mt-2 w-full justify-center text-center disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPending}
      >
        Ingresar
      </button>
      …
    </form>
  );
};
```

> **Note:** `useActionState(authenticate, undefined)` threads `prevState`/`formData` into the server action and gives `isPending` for the disabled submit button. `registered` prop (set from `?registered=1` in the login page) fires a one-time success toast instead of an error banner.

### 6.3 `ui/features/login/actions/logout-action.ts`

```ts
"use server";

import { redirect } from "next/navigation";
import { getHandleAuthUseCase } from "../../../../modules/auth";

export const logout = async () => {
  const handleAuthUseCase = getHandleAuthUseCase();

  await handleAuthUseCase.logout();
  redirect("/");
};
```

### 6.4 `ui/features/register/actions/register-action.ts` (key excerpts)

```ts
"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { UserAlreadyExistsException } from "../../../../modules/auth/domain/error/user-already-exists-exception";
import { UserSaveCommand } from "../../../../modules/auth/domain/model/commands/user-save-command";
import { Role } from "../../../../modules/auth/domain/model/role";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import {
  getEmailSenderHandlerUseCase,
  verificationEmail,
} from "../../../../modules/email";
// …

export async function register(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name: string = formData.get("name")?.toString().trim() ?? "";
  const email: string = formData.get("email")?.toString().trim() ?? "";
  const password: string = formData.get("password")?.toString().trim() ?? "";
  const imageFile = formData.get("image") as File | null;

  const validation = getValidateUserRegistrationUseCase().validate(
    name,
    email,
    password,
  );
  if (!validation.success) {
    return { fieldErrors: validation.fieldErrors };
  }

  try {
    // 1. Imagen opcional
    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      const image = new ImageUpload(
        Buffer.from(await imageFile.arrayBuffer()),
        imageFile.type,
        imageFile.name,
      );
      imageUrl = await getHandleUploadImageUseCase().upload(image);
    }

    // 2. Registrar el usuario
    await getHandleAuthUseCase().register(
      new UserSaveCommand(name, email, password, Role.user, imageUrl ?? ""),
    );

    // 3. Generar token de verificación
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await getHandleAuthUseCase().saveEmailVerification(email, token, expiresAt);

    // 4. Enviar el correo de verificación
    const link = `${process.env.NEXTAUTH_URL ?? ""}/auth/verify-email?token=${token}`;
    await getEmailSenderHandlerUseCase().send(verificationEmail(email, link));
  } catch (error) {
    if (error instanceof UserAlreadyExistsException)
      return { serverError: "Ya existe una cuenta con ese correo." };

    console.error("Register error:", error);
    return { serverError: "Ocurrió un error al registrar la cuenta." };
  }
  redirect("/auth/login?registered=1");
}
```

> **Note:** registration is public, creates the `USER` role row, generates a 32-byte hex token valid 24h, emails a link built from `NEXTAUTH_URL`, then redirects to login with `?registered=1` (consumed by `LoginForm` toast).

### 6.5 `ui/features/verify-email/actions/verify-email-action.ts`

```ts
"use server";

import { VerificationTokenExpiredException } from "../../../../modules/auth/domain/error/verification-token-expired-exception";
import { VerificationTokenInvalidException } from "../../../../modules/auth/domain/error/verification-token-invalid-exception";
import { getHandleAuthUseCase } from "../../../../modules/auth";

export async function verifyEmail(
  prevState: string | undefined,
  formData: FormData,
): Promise<string> {
  const token = formData.get("token")?.toString().trim() ?? "";

  try {
    if (!token) return "No se encontró el enlace de verificación";
    await getHandleAuthUseCase().verifyEmail(token);
  } catch (error) {
    if (error instanceof VerificationTokenInvalidException)
      return "El enlace es inválido o ya fue utilizado.";
    if (error instanceof VerificationTokenExpiredException)
      return "El enlace expiró. Solicitá un nuevo correo de verificación.";

    console.error("Verify email error:", error);
    return "Ocurrió un error al verificar tu correo. Intentalo de nuevo.";
  }

  return "Tu correo fue verificado correctamente.";
}
```

### 6.6 Auth layouts

#### `src/app/auth/(auth)/layout.tsx`

```tsx
import type { ReactNode } from "react";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { redirect } from "next/navigation";

export default async function AuthProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const handleAuthUseCase = getHandleAuthUseCase();

  if (await handleAuthUseCase.getSession()) redirect("/");

  return <>{children}</>;
}
```

> **Note:** defense in depth — even though the proxy already blocks authenticated users from `/auth/*`, this layout re-checks `getSession()` server-side so pages load **only** for anonymous visitors.

#### `src/app/(shop)/layout.tsx` (session-related parts)

```tsx
export default async function ShopLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getHandleAuthUseCase().getSession();
  const isAuthenticated = !!session;

  const userRol =
    (await getHandleAuthUseCase().getCurrentUser())?.getRole() ?? "USER";

  const pendingOrdersCount = await getPendingOrdersCountAction();

  return (
    <main className="flex min-h-screen flex-col">
      <SidebarWrapper isAuthenticated={isAuthenticated} rol={userRol} />
      <TopMenu pendingOrdersCount={pendingOrdersCount} />
      …
    </main>
  );
}
```

> **Note:** the shop shell is a Server Component that reads the session on every render to drive the sidebar/menu (`isAuthenticated`, `rol`) — the server-side pattern chosen over client `useSession`.

---

## 7. Protection matrix today

| Route | Protection mechanism | Status |
|---|---|---|
| `/auth/login`, `/auth/new-account`, `/auth/verify-email` | Proxy matcher ▶ `authorized` callback (`/auth` prefix → `!user`) + `auth/(auth)` layout `getSession()` redirect | ✅ Working |
| `/profile` | Proxy matcher + `profile/page.tsx` page-level `getCurrentUser()` redirect | ✅ Working (double-guarded) |
| `/checkout/:path*` | Proxy matcher only (no inline check in `checkout/address/page.tsx`) | ✅ Auth via proxy; no inline guard |
| `/orders` | **No proxy matcher.** Page calls `getCurrentUser()` and branches admin vs user orders | ⚠️ Gap — add to matcher (§8.2) |
| `/cart` | **No proxy matcher**, no page guard (client cart state) | ⚠️ Gap — add to matcher (§8.2) |
| `/admin` | **No proxy matcher.** `admin/page.tsx` is an unprotected placeholder (`<h1>Admin Page</h1>`) | ❌ Gap — session check + role guard (§8.1, §8.3) |
| Admin-only routes (role `ADMIN`) | Authorized-callback role check | ❌ TODO in `auth.config.ts` (§8.1) |
| Email verification | ☑ flow exists (register → token → verify) but **login does not enforce it** | ❌ Gap (§8.4) |

**Summary:** authentication (who can log in) is fully wired; **authorization** (who may access `/admin`, role-gated routes) is the open front.

---

## 8. Remaining gaps (next steps)

### 8.1 `authorized` callback: admin-route role check — `auth.config.ts`

The placeholder comment `//rutas que necesita role = ADMIN` is where the role guard belongs. Add it **before** the `/auth` branch:

```ts
authorized: async ({ auth, request }) => {
  const user = auth?.user;
  const path = request.nextUrl.pathname;

  //rutas que necesita role = ADMIN
  if (path.startsWith("/admin") && user?.role !== "ADMIN") return false;

  //rutas a las que no se puede acceder si ya se está logueado
  if (path.startsWith("/auth")) return !user;

  //El resto solo exige sesión iniciada
  return !!user;
},
```

Returning `false` lets Auth.js redirect unauthenticated users to `pages.signIn` and non-admin users to the home page. `user?.role` is available because the `jwt`/`session` callbacks already put the `role` on the session.

### 8.2 Proxy matcher coverage — `src/proxy.ts`

```ts
export const config = {
  matcher: [
    "/auth/:path*",
    "/profile",
    "/checkout/:path*",
    "/admin",
    "/orders",
    "/cart",
  ],
};
```

Without `/admin:path*` (or `/admin`), the role guard in §8.1 never runs for admin pages; `/orders` and `/cart` should also demand a session now that the profile/checkout patterns exist.

### 8.3 `/admin` placeholder page — `src/app/(shop)/admin/page.tsx`

Add a server-side session + role check (mirror the profile-page pattern):

```tsx
import type { Metadata } from "next";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { Role } from "../../../../modules/auth/domain/model/role";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Administración",
  description: "Panel de administración de la tienda.",
};

export default async function () {
  const user = await getHandleAuthUseCase().getCurrentUser();

  if (!user || user.getRole() !== Role.admin) redirect("/");

  return (
    <div>
      <h1>Admin Page</h1>
    </div>
  );
}
```

Use `Role.admin` (enum) so the compare is type-safe; `redirect("/")` matches the codebase's existing anonymous-redirect convention (`profile/page.tsx:15`).

### 8.4 Email verification does NOT gate login — `prisma-users-handler.ts`

Today `verifyCredentials` ignores `emailVerified`. An unverified user can sign in. Fix by adding a domain exception and enforcing it inside `verifyCredentials`, right after the bcrypt compare passes and **before** returning the `User`:

```ts
async verifyCredentials(email: string, password: string): Promise<User> {
  try {
    const data = await this.prismaClient.user.findFirstOrThrow({
      where: { email },
    });

    if (!(await this.encryptPasswordUseCase.compare(password, data.password)))
      throw new InvalidCredentialsException();

    if (!data.emailVerified) throw new EmailNotVerifiedException();

    return new User(
      data.id,
      data.name,
      data.email,
      data.role as Role,
      data.image,
      data.emailVerified,
      data.emailVerificationToken,
      data.emailVerificationExpires,
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    )
      throw new UserNotExistsException(email);
    if (error instanceof InvalidCredentialsException) throw error;
    throw new UserPersistenceException(/* … */);
  }
}
```

**File to add:** `modules/auth/domain/error/email-not-verified-exception.ts`:

```ts
export class EmailNotVerifiedException extends Error {
  constructor() {
    super("The email has not been verified yet");
  }
}
```

**Map it in `next-auth-authorize.ts`** so login surfaces the standard "incorrect credentials" message (or add a specific branch):

```ts
if (error instanceof EmailNotVerifiedException) return null;
```

And optionally surface a distinct Spanish message in `login-action.ts`:

```ts
if (error instanceof EmailNotVerifiedException) {
  return {
    fieldsErrors: {},
    message: "Verificá tu correo antes de iniciar sesión.",
  };
}
```

> Note: the email verification flow itself is complete and working (register → token → email → `verifyEmail` clears `emailVerified`). Only the **login-side enforcement** is missing.

### 8.5 (Optional) Client-side `useSession` / `SessionProvider`

The repo deliberately uses the **server-side pattern**: every consumption point (`(shop)` layout menu, `profile`, `orders`, auth layouts) reads `getSession()`/`getCurrentUser()` in Server Components or server actions. `useSession` is **not** used, so no `<SessionProvider>` exists and no root-layout wrapper is needed.

Introduce it only when you need **reactive** auth state in a client component (e.g. showing the logged-in user in a client-managed cart drawer, or optimistic UI that changes when the session expires). That requires one root-level `<SessionProvider>` (e.g. in `src/app/layout.tsx`), a top-level `auth()` pass-through to hydrate it, and accepting the extra client `fetch('/api/auth/session')` round-trips. For a JWT-strategy app that already redirects from the edge and re-checks on every server render, the current server-first approach is simpler and keeps the auth surface Node/runtime where the bcrypt + Prisma stack lives.

---

## 9. Quick reference — commands

```bash
# Install (already done in this repo):
npm i next-auth@^5.0.0-beta.32 bcryptjs zod

# Env vars (.env):
#   AUTH_SECRET=<long random string>   # generate: openssl rand -base64 32
#   NEXTAUTH_URL=http://localhost:3000
#   DATABASE_URL=postgresql://…

# If a future User field is added to schema.prisma (e.g. `phone String?`):
npx prisma migrate dev --name add-phone-to-user
npx prisma generate    # regenerates src/generated/prisma used by @/generated/prisma/client

# Type-check the whole repo (auth wiring + type augmentation):
npx tsc --noEmit

# Lint:
npm run lint
```

> Notes: Prisma 7 with the `pglite`-style driver setup requires the adapter (`@prisma/adapter-pg`) to be passed in `prisma.config.ts`/client construction — run `npx prisma generate` after any schema change so the `@/generated/prisma/client` output stays in sync with the `User` model used by `PrismaUserHandler`.

---

### Revision notes

- Auth wiring: `auth.config.ts` (edge-safe base) + `auth.ts` (provider) + `src/proxy.ts` (edge matcher) + `types/next-auth.d.ts`.
- Modular mapping: `ForAuthSession` ↔ NextAuth session primitives; `ForAuth` ↔ Prisma + bcrypt; `authorize()` isolated in `NextAuthAuthorize`; manual DI in `auth.ts` and `handle-auth-use-case-factory.ts`.
- No `[...nextauth]` route required because server actions + `signIn`/`signOut`/`auth()` come from the same `auth` instance.