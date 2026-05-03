import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FashionHub - Premium Fashion Ecommerce",
    template: "%s | FashionHub"
  },
  description: "Premium fashion ecommerce platform with prepaid secure checkout.",
  openGraph: {
    title: "FashionHub",
    description: "Premium fashion ecommerce platform.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
