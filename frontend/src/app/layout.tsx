import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "./ui/layout/header";
import Footer from "./ui/layout/footer";
import { ReduxProvider } from "./libs/stores/providers";
import Chatbot from "./ui/components/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nestfy | E-commerce de Luxo",
  description: "A melhor experiência em tecnologia e moda de luxo.",
};

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <AppRouterCacheProvider>
            <ReduxProvider>
                <Header />
                {children}
                <Chatbot />
                <Footer />
            </ReduxProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
