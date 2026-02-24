import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Raleway, Open_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://hatmoc.vn"
  ),
  title: {
    default: "Hạt Mộc | Sữa Hạt Tươi 100% Tự Nhiên",
    template: "%s | Hạt Mộc",
  },
  description:
    "Sữa hạt tươi nguyên chất, không chất bảo quản. Sản phẩm hữu cơ, giàu dinh dưỡng, tốt cho sức khoẻ. Giao hàng tận nơi tại Hồ Chí Minh.",
  keywords: [
    "sữa hạt",
    "sữa hạt tươi",
    "hạt mộc",
    "sữa hữu cơ",
    "sữa hạt điều",
    "sữa hạnh nhân",
    "healthy drink",
    "Hồ Chí Minh",
  ],
  authors: [{ name: "Hạt Mộc" }],
  creator: "Hạt Mộc",
  publisher: "Hạt Mộc",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Hạt Mộc",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@hatmoc",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <GoogleAnalytics />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable} ${openSans.variable} ${playfairDisplay.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
