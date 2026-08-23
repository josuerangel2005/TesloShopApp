import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/config/fonts";
import { ToastProvider } from "../../ui";
import { PaypalProvider } from "../../ui/components/paypal";

export const metadata: Metadata = {
  title: {
    template: "%s - Teslo | Shop",
    default: "Home - Teslo | Shop",
  },
  description: "Una tienda virtual de productos",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={"h-full antialiased"}>
      <body
        className={`min-h-full flex flex-col overflow-x-hidden ${inter.className} p-2`}
      >
        <PaypalProvider>
          <ToastProvider />
          {children}
        </PaypalProvider>
      </body>
    </html>
  );
}
