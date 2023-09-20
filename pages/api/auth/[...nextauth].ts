import NextAuth, { AuthOptions, Awaitable } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const url = `http://192.168.1.121:9000`;

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",

      credentials: {
        candidateEmail: { label: "Email", type: "email" },
        candidatePassword: { label: "Password", type: "password" },
      },

      async authorize(credentials, req): Promise<any> {
        const { data } = await axios.post(`${url}/auth/login`, {
          loginCredentials: credentials,
        });

        if (data) {
          const user = { name: data.primary };
          return user;
        } else {
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
