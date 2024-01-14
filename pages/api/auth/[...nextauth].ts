import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const local = "http://192.168.1.121:9000";
const prod = "https://synchroflow-server.onrender.com";

const url = local;

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
          const user = data;
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
    maxAge: 7 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
