import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EIP-7702 Demo",
  description: "A demo for EIP-7702",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Providers>
          <Navbar />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                minWidth: "400px",
                maxWidth: "600px",
                wordWrap: "break-word",
              },
            }}
          />
          <main className="max-w-7xl mx-auto p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
