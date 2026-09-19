import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pinakas-tou-100.aglow-bison-8640.chatgpt.site"),
  title: "Πίνακες αριθμών 1–1000",
  description: "Διαδραστικοί πίνακες μαθηματικών με τους αριθμούς από το 1 μέχρι το 1000.",
  openGraph: {
    title: "Πίνακες αριθμών 1–1000",
    description: "Διαδραστικοί πίνακες μαθηματικών με έξυπνη μετάβαση ψηφίων.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Πίνακες αριθμών 1–1000",
    description: "Διαδραστικοί πίνακες μαθηματικών με έξυπνη μετάβαση ψηφίων.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <body>{children}</body>
    </html>
  );
}
