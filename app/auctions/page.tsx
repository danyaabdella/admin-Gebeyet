import type { Metadata } from "next"
import AuctionsPageClient from "./page-client"

export const metadata: Metadata = {
  title: "Auction Management - Marketplace Admin",
  description: "Manage auctions in the marketplace",
}

export default function AuctionsPage() {
  return <AuctionsPageClient />
}

