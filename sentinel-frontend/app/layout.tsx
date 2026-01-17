import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Sidebar} from "@/src/components/Sidebar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sentinel - System Monitoring Dashboard",
  description: "Real-time system metrics monitoring with Sentinel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
          {/* App shell: sidebar + main content */}
          <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 shrink-0 border-r border-border bg-surface">
              <Sidebar />
            </aside>
            {/* Main content */}
            <main className="flex-1">
              {/* Page container */}
              <div className="mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
                {children}
              </div>
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
