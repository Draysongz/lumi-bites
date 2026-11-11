import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumi's Bites - The Story Behind Lagos' Favorite Daily Online Kitchen",
  description:
    "Hearty, authentic Nigerian comfort food cooked fresh every single day. Pre-order meals and book catering with Lumi's Bites — fast and yummy, good for your tummy.",
  manifest: "/manifest.webmanifest",
  applicationName: "Lumi's Bites",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lumi's Bites",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E61E14",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-light-surface text-light-on-surface font-body selection:bg-brand-red selection:text-white">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
