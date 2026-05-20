import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/auth-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "VeriSure",
    template: "%s | VeriSure",
  },

  description:
    "Enterprise-grade background verification platform for secure candidate verification, compliance, and reporting.",

  keywords: [
    "verification",
    "background verification",
    "candidate verification",
    "hr platform",
    "enterprise dashboard",
  ],

  metadataBase: new URL(
    "https://verisure.vercel.app"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="bg-premium min-h-screen text-slate-900 antialiased">
        <AuthProvider>
          {children}

          <Toaster
            richColors
            closeButton
            position="top-right"
            expand
            duration={3500}
          />
        </AuthProvider>
      </body>
    </html>
  );
}