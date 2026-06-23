import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { StoreProvider } from "@/lib/store";
/* @ts-ignore */
import "./globals.css";
import AuthProvider from "@/provider/auth.provider";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { SessionProvider } from "@/provider/session.provider";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  title: "doit",
  description:
    "Tarefas por projeto e por dia - compartilháveis, com histórico e prazos.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${hanken.variable} font-sans antialiased`}
        spellCheck={false}
      >
        <AuthProvider>
          {/* @ts-ignore */}
          <SessionProvider session={session}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              <StoreProvider>{children}</StoreProvider>
            </ThemeProvider>
          </SessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
