import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Πίνακας του 100",
  description: "Διαδραστικός πίνακας μαθηματικών με τους αριθμούς από το 1 μέχρι το 100.",
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
