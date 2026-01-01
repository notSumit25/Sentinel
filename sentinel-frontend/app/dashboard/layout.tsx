import { Metadata } from "next";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Dashboard - Sentinel",
  description: "System metrics dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 h-16 max-w-full">
          <Link href="/" className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Sentinel
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>
              <a
                href="#"
                className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Settings
              </a>
            </nav>
            <div className="border-l border-slate-200 pl-4">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
