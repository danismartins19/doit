import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  title: "doit",
  description: "Tarefas por projeto e por dia - compartilháveis, com histórico e prazos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${hanken.variable} font-sans antialiased`} spellCheck={false}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
