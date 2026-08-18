"use client";

import type { ReactNode } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

interface Props {
  children: ReactNode;
}

export const PaypalProvider = ({ children }: Props) => (
  <PayPalScriptProvider
    options={{
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "",
      currency: "USD",
      intent: "capture",
    }}
  >
    {children}
  </PayPalScriptProvider>
);
