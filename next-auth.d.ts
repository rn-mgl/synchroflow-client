import { Session } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      id: number;
      name: string;
      token: string;
      uuid: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string;
    id: number;
    name: string;
    token: string;
    uuid: string;
  }
}
