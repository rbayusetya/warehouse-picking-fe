import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { DarkModeProvider } from "@/lib/dark-mode";

export const metadata: Metadata = {
  title: "Picking Control Gudang",
  description: "Aplikasi picking control gudang",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <DarkModeProvider>
          <AuthProvider>{children}</AuthProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
