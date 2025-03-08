"use client"

import { CheckCircle, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sidebar } from "@/components/sidebar"
import { useState } from "react"
import { AuctionDetailsDialog } from "@/components/auctions/auction-details-dialog"
import { AuctionFilters } from "@/components/auctions/auction-filters"
import { PaginationControls } from "@/components/auctions/pagination-controls"

export default function AuctionsPageClient() {
  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />
      <div className="flex-1 md:ml-[var(--sidebar-width)]">
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Auction Management</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Total Auctions: 342</span>
            </div>
          </div>

          <AuctionFilters />

          <Card>
            <CardHeader className="p-4">
              <CardTitle>All Auctions</CardTitle>
              <CardDescription>Manage all auctions in the marketplace system</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <AuctionTable />
            </CardContent>
          </Card>

          <PaginationControls totalPages={23} currentPage={1} />
        </main>
      </div>
    </div>
  )
}

function AuctionTable() {
  const [selectedAuction, setSelectedAuction] = useState<any | null>(null)

  // Mock auctions data
  const auctions = Array.from({ length: 15 }).map((_, i) => ({
    id: `auction_${i + 1}`,
    productId: `product_${i + 1}`,
    productName: `Product ${i + 1}`,
    merchantName: `Merchant ${(i % 5) + 1}`,
    description: `This is a description for auction ${i + 1}. It includes details about the product condition and other relevant information.`,
    condition: i % 2 === 0 ? "new" : "used",
    startTime: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    endTime: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toISOString(),
    itemImg: [
      `/placeholder.svg?height=200&width=200&text=Image+${i + 1}`,
      `/placeholder.svg?height=200&width=200&text=Image+${i + 2}`,
    ],
    startingPrice: Number.parseFloat((Math.random() * 1000).toFixed(2)),
    reservedPrice: Number.parseFloat((Math.random() * 2000).toFixed(2)),
    bidIncrement: Number.parseFloat((Math.random() * 50).toFixed(2)),
    status:
      i % 5 === 0
        ? "requested"
        : i % 5 === 1
          ? "active"
          : i % 5 === 2
            ? "ended"
            : i % 5 === 3
              ? "cancelled"
              : "rejected",
    currentBid: Number.parseFloat((Math.random() * 1500).toFixed(2)),
    bidCount: Math.floor(Math.random() * 20),
  }))

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="hidden md:table-cell">Merchant</TableHead>
            <TableHead className="hidden md:table-cell">Starting Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Start/End Time</TableHead>
            <TableHead className="hidden md:table-cell">Current Bid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auctions.map((auction) => (
            <TableRow
              key={auction.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setSelectedAuction(auction)}
            >
              <TableCell className="font-medium">{auction.productName}</TableCell>
              <TableCell className="hidden md:table-cell">{auction.merchantName}</TableCell>
              <TableCell className="hidden md:table-cell">${auction.startingPrice.toFixed(2)}</TableCell>
              <TableCell>
                {auction.status === "requested" ? (
                  <span className="flex items-center text-yellow-500">
                    <Clock className="mr-1 h-4 w-4" /> Requested
                  </span>
                ) : auction.status === "active" ? (
                  <span className="flex items-center text-green-500">
                    <CheckCircle className="mr-1 h-4 w-4" /> Active
                  </span>
                ) : auction.status === "ended" ? (
                  <span className="flex items-center text-blue-500">
                    <CheckCircle className="mr-1 h-4 w-4" /> Ended
                  </span>
                ) : auction.status === "cancelled" ? (
                  <span className="flex items-center text-red-500">
                    <XCircle className="mr-1 h-4 w-4" /> Cancelled
                  </span>
                ) : (
                  <span className="flex items-center text-red-500">
                    <XCircle className="mr-1 h-4 w-4" /> Rejected
                  </span>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(auction.startTime).toLocaleDateString()} - {new Date(auction.endTime).toLocaleDateString()}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {auction.currentBid ? `$${auction.currentBid.toFixed(2)} (${auction.bidCount} bids)` : "No bids yet"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedAuction && (
        <AuctionDetailsDialog
          auction={selectedAuction}
          open={!!selectedAuction}
          onOpenChange={() => setSelectedAuction(null)}
        />
      )}
    </>
  )
}

