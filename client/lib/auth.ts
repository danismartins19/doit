import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import { User } from "next-auth";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:3333";
const backendUrl = apiUrl.replace(/\/+$/, "").replace(/\/v1$/, "");

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.events",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? process.env.NEXTAUTH_URL,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        if (!account.id_token) {
          throw new Error("GOOGLE_ID_TOKEN_MISSING");
        }

        try {
          const response = await axios.post(`${backendUrl}/auth/google/token`, {
            idToken: account.id_token,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
          });

          token.accessToken = response.data.accessToken ?? response.data.token;
        } catch (error: any) {
          console.error("NEXTAUTH_GOOGLE_TOKEN_EXCHANGE_FAILED", {
            status: error?.response?.status,
            data: error?.response?.data,
            message: error?.message,
          });
          throw error;
        }
      }

      if (user) {
        token.accessToken = token.accessToken ?? user.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.accessToken = token.accessToken;

      return session;
    },
  },
  debug: false,
  // process.env.NODE_ENV !== "production",
};
