import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Auction Management - Marketplace Admin",
  description: "Manage auctions in the marketplace",
}

export default function OrdersLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      {/* You can wrap with sidebar/header if needed */}
      {children}
    </section>
  );
}
