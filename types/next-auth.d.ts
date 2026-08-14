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
