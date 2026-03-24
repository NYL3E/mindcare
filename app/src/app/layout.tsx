import type { Metadata } from "next";
import { Nunito, Fredoka } from "next/font/google";
import "./globals.css";
import { MindCareProvider } from "@/context/MindCareContext";
import ErrorBoundary from "@/components/ErrorBoundary";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const fredoka = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MindCare — Your Mental Health Companion",
  description:
    "Combat loneliness, track your mood, and connect with others through meaningful activities. Your AI friend is here for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${nunito.variable} ${fredoka.variable}`}>
      <body className="min-h-dvh bg-surface-soft text-text-primary font-sans antialiased">
        <ErrorBoundary>
          <MindCareProvider>{children}</MindCareProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
