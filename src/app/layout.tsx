import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/store-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = { title: { default: "سوق السودان | تسوق بثقة", template: "%s | سوق السودان" }, description: "وجهتك السودانية للتسوق الإلكتروني. اختيارات مميزة، أسعار واضحة، وتوصيل لباب بيتك." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body><StoreProvider><Header />{children}<Footer /></StoreProvider></body></html>;
}
