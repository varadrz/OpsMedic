import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpsMedic | AI Failure Pattern Engine",
  description: "Predict CI/CD failure root causes using Machine Learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-slate-800 antialiased selection:bg-indigo-50 selection:text-indigo-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
