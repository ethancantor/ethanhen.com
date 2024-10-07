import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import localFont from '@next/font/local'

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
    <html lang="en">
      <body className={`antialiased ${FUTURA.variable} bg-neutral-900`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
