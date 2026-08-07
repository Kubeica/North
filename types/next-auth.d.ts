import type { DefaultSession } from "next-auth";

import type { Role } from "@/lib/permissions";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      name: string;
      email: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    name: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    name?: string | null;
    email?: string | null;
    /** Last time role/active were refreshed from the database. */
    activeCheckedAt?: number;
    /** Set when the user is inactive or missing — session becomes invalid. */
    error?: "InactiveUser";
  }
}
