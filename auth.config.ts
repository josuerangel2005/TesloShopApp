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
