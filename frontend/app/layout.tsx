import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.scss";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ServiceHub — Book trusted local services",
    template: "%s | ServiceHub",
  },
  description: "ServiceHub connects customers with trusted service providers for cleaning, repairs, beauty and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
