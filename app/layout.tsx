import NavigationBar from "@/components/navigation-bar";
import NotAuthenticated from "@/components/not-authenticated";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coverage Todo",
  description: "A basic todo application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} antialiased`}>
          <NavigationBar />
          <SignedIn>
            <main>{children}</main>
          </SignedIn>
          <SignedOut>
            <NotAuthenticated />
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  );
}
