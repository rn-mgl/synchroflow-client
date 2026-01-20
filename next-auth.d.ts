import { Session } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    email: string;
    id: number;
    name: string;
    token: string;
    uuid: string;
  }
  interface Session {
    user: User;
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
