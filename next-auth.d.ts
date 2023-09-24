import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string | null | undefined;
      id: number | null | undefined;
      name: string | null | undefined;
      token: string | null | undefined;
      uuid: string | null | undefined;
    } & DefaultSession["user"];
  }
}
