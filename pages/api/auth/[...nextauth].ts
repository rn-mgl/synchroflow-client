import NextAuth, { AuthOptions, User, type Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",

      credentials: {},

      async authorize(
        credentials: Record<string, string> | undefined,
        req,
      ): Promise<User | any> {
        if (credentials) {
          const user = { ...credentials, id: parseInt(credentials.id) };
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

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.user) {
        session.user = token.user as User;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
