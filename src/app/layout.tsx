import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local"
import NextAuthSessionProvider from "@/components/SessionProvider/SessionProvider";

export const metadata: Metadata = {
  title: "ethanhen.com",
};


const FUTURA = localFont({ 
  src: [
    { path: '../lib/fonts/Futura LT/FuturaLT-Heavy.ttf', weight: '400' },
    { path: '../lib/fonts/Futura LT/FuturaLT-ExtraBold.ttf', weight: '700', }
  ],
  variable: '--font-futura'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${FUTURA.variable} bg-neutral-900`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
            <NextAuthSessionProvider >
              {children}
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
