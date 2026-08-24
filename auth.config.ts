import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/auth/login", newUser: "/auth/new-account" },
  providers: [],
  session: { strategy: "jwt" },
  callbacks: {
    authorized: async ({ auth, request }) => {
      const user = auth?.user;
      const path = request.nextUrl.pathname;

      // Ruta pública: siempre accesible, tenga sesión o no
      if (path.includes("/verify-email")) return true;

      if (path.startsWith("/admin")) return user?.role === "ADMIN";

      if (
        path.endsWith("/cart") ||
        path.includes("/checkout") ||
        path.includes("/empty")
      )
        return user?.role !== "ADMIN";

      if (path.startsWith("/auth")) return !user;

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
