import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VLR VORTEX - Tournament Pickems",
  description: "Make your picks for the VLR VORTEX tournament bracket!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-dark antialiased">
        {children}
      </body>
    </html>
  );
}
