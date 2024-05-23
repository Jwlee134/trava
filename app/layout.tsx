import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import localFont from "next/font/local";
import Providers from "@/components/provider";

const nunito = Nunito({ subsets: ["latin"] });
const poetsenone = localFont({ src: "./poetsenone.ttf" });

const title = "Trava";
const description =
  "Share your pictures with explicit exif data and location for photographers all over the world.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL!),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  openGraph: {
    images: "/og-img.png",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="viewport-fit=cover" />
      </head>
      <body className="max-w-screen-lg mx-auto">
        <Providers>
          <header className="navbar bg-base-100 fixed top-0 px-4 z-50">
            <Link href="/" className={`${poetsenone.className} text-2xl`}>
              Trava
            </Link>
          </header>
          <main className={`${nunito.className} pt-16`}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
