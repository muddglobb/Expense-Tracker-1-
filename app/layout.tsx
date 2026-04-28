import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Personal expense tracker with PIN protection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full bg-slate-50 text-slate-950`}>
        <AuthGuard>
          <div className="flex flex-col md:flex-row min-h-screen">
            <Navigation />
            <main className="flex-1 pb-24 md:pb-0 md:pl-64">
              <div className="max-w-5xl mx-auto p-4 md:p-8">
                {children}
              </div>
            </main>
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}
