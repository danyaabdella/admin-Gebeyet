"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { approveAuction, rejectAuction } from "@/lib/data-fetching"

interface AuctionDetailsDialogProps {
  auction: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuctionDetailsDialog({ auction, open, onOpenChange }: AuctionDetailsDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [rejectionCategory, setRejectionCategory] = useState("policy_violation")
  const [isRejecting, setIsRejecting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      const result = await approveAuction(auction._id)
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsApproving(false)
      onOpenChange(false)
    }
  }

  const handleReject = async () => {
    setIsRejecting(true)
    try {
      const result = await rejectAuction(auction._id, rejectionReason, rejectionCategory)
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsRejecting(false)
      onOpenChange(false)
    }
  }

  const nextImage = () => {
    if (auction.itemImg && auction.itemImg.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex === auction.itemImg.length - 1 ? 0 : prevIndex + 1))
    }
  }

  const prevImage = () => {
    if (auction.itemImg && auction.itemImg.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? auction.itemImg.length - 1 : prevIndex - 1))
    }
  }

  const statusColor =
    auction.status === "requested"
      ? "bg-yellow-100 text-yellow-800 border-yellow-300"
      : auction.status === "active"
        ? "bg-green-100 text-green-800 border-green-300"
        : auction.status === "ended"
          ? "bg-blue-100 text-blue-800 border-blue-300"
          : "bg-red-100 text-red-800 border-red-300"

  const statusIcon =
    auction.status === "requested" ? (
      <Clock className="h-4 w-4 mr-1" />
    ) : auction.status === "active" ? (
      <CheckCircle className="h-4 w-4 mr-1" />
    ) : auction.status === "ended" ? (
      <CheckCircle className="h-4 w-4 mr-1" />
    ) : (
      <XCircle className="h-4 w-4 mr-1" />
    )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Auction Details</span>
            <Badge className={`${statusColor} flex items-center px-2 py-1 text-xs`}>
              {statusIcon}
              {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription>View and manage auction information</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="bids">Bids</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Product</Label>
                <div className="text-sm mt-1">{auction.productName}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Merchant</Label>
                <div className="text-sm mt-1">{auction.merchantName}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Condition</Label>
                <div className="text-sm mt-1 capitalize">{auction.condition}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="text-sm mt-1 capitalize">{auction.status}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Start Time</Label>
                <div className="text-sm mt-1">{new Date(auction.startTime).toLocaleString()}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">End Time</Label>
                <div className="text-sm mt-1">{new Date(auction.endTime).toLocaleString()}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Starting Price</Label>
                <div className="text-sm mt-1">${auction.startingPrice.toFixed(2)}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Reserved Price</Label>
                <div className="text-sm mt-1">${auction.reservedPrice.toFixed(2)}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Bid Increment</Label>
                <div className="text-sm mt-1">${auction.bidIncrement.toFixed(2)}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Current Bid</Label>
                <div className="text-sm mt-1">
                  {auction.currentBid ? `$${auction.currentBid.toFixed(2)} (${auction.bidCount} bids)` : "No bids yet"}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Description</Label>
              <div className="text-sm mt-1 p-3 bg-muted rounded-md">{auction.description}</div>
            </div>

            {auction.status === "rejected" && (
              <div className="mt-4 border border-red-200 bg-red-50 p-3 rounded-md">
                <Label className="text-sm font-medium text-red-800">Rejection Reason</Label>
                <div className="text-sm mt-1 text-red-700">
                  <div className="font-medium">Category: Policy Violation</div>
                  <div className="mt-1">
                    {auction.rejectionReason ||
                      "This auction was rejected due to policy violations. The item does not meet our marketplace standards."}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="images">
            <div className="relative">
              {auction.itemImg && auction.itemImg.length > 0 ? (
                <div className="relative border rounded-md overflow-hidden">
                  <img
                    src={auction.itemImg[currentImageIndex] || "/placeholder.svg"}
                    alt={`Auction image ${currentImageIndex + 1}`}
                    className="w-full h-64 md:h-80 object-contain bg-gray-50"
                  />

                  {auction.itemImg.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous image</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next image</span>
                      </Button>

                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                        {currentImageIndex + 1} / {auction.itemImg.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                  <span className="text-muted-foreground">No images available</span>
                </div>
              )}

              {auction.itemImg && auction.itemImg.length > 1 && (
                <div className="flex mt-4 gap-2 overflow-x-auto pb-2">
                  {auction.itemImg.map((img: string, index: number) => (
                    <button
                      key={index}
                      className={`relative flex-shrink-0 w-16 h-16 border-2 rounded-md overflow-hidden ${
                        index === currentImageIndex ? "border-primary" : "border-transparent"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bids">
            {auction.status === "active" || auction.status === "ended" ? (
              auction.bidCount > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Bid History</h3>
                    <span className="text-sm text-muted-foreground">{auction.bidCount} bids total</span>
                  </div>
                  <div className="border rounded-md divide-y">
                    {Array.from({ length: Math.min(auction.bidCount, 5) }).map((_, i) => (
                      <div key={i} className="p-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium">Bidder {auction.bidCount - i}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(new Date(auction.endTime).getTime() - i * 3600000).toLocaleString()}
                          </div>
                        </div>
                        <div className="font-medium text-green-600">
                          ${(auction.currentBid - i * auction.bidIncrement).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No bids have been placed on this auction yet.
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {auction.status === "requested"
                  ? "Bids cannot be placed until the auction is approved."
                  : "This auction was rejected or cancelled and cannot receive bids."}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
          {auction.status === "requested" && (
            <>
              <Button onClick={handleApprove} disabled={isApproving} className="w-full sm:w-auto">
                <CheckCircle className="mr-2 h-4 w-4" />
                {isApproving ? "Approving..." : "Approve Auction"}
              </Button>

              <div className="w-full space-y-4">
                <div className="grid w-full gap-2">
                  <Label htmlFor="rejection-category">Rejection Category</Label>
                  <Select value={rejectionCategory} onValueChange={setRejectionCategory}>
                    <SelectTrigger id="rejection-category">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="policy_violation">Policy Violation</SelectItem>
                      <SelectItem value="inappropriate_content">Inappropriate Content</SelectItem>
                      <SelectItem value="pricing_issue">Pricing Issue</SelectItem>
                      <SelectItem value="product_quality">Product Quality</SelectItem>
                      <SelectItem value="incomplete_information">Incomplete Information</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full gap-2">
                  <Label htmlFor="rejection-reason">Rejection Reason</Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Provide detailed reason for rejection"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isRejecting || !rejectionReason.trim()}
                  className="w-full"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {isRejecting ? "Rejecting..." : "Reject Auction"}
                </Button>
              </div>
            </>
          )}

          {auction.status !== "requested" && (
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

