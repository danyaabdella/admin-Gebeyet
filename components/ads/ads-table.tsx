"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Eye, Loader2, DollarSign, Clock, Ban } from "lucide-react"
import { format } from "date-fns"
import { AdDetailDialog } from "./ad-detail.dialogue"
import { ApproveAdDialog } from "./approve-ad-dialogue"
import { RejectAdDialog } from "./reject-ad-dialogue"
import { Sidebar } from "../sidebar"

interface AdsTableProps {
  ads: any[]
  isLoading: boolean
  onRefresh: () => void
}

export function AdsTable({ ads, isLoading, onRefresh }: AdsTableProps) {
  const router = useRouter()
  const [selectedAd, setSelectedAd] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)

  const handleViewDetails = (ad: any) => {
    setSelectedAd(ad)
    setIsDetailOpen(true)
  }

  const handleApproveClick = (ad: any) => {
    setSelectedAd(ad)
    setIsApproveOpen(true)
  }

  const handleRejectClick = (ad: any) => {
    setSelectedAd(ad)
    setIsRejectOpen(true)
  }

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Approved
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        )
      case "PENDING":
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        )
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" /> Paid
          </Badge>
        )
      case "FAILED":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Ban className="h-3 w-3" /> Failed
          </Badge>
        )
      case "PENDING":
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Pending
          </Badge>
        )
    }
  }

  const getActiveStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="success" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" /> Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" /> Inactive
      </Badge>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Product</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading ads...
                  </div>
                </TableCell>
              </TableRow>
            ) : ads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No ads found.
                </TableCell>
              </TableRow>
            ) : (
              ads.map((ad) => (
                <TableRow 
                  key={ad._id} 
                  onClick={() => handleViewDetails(ad)} 
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="w-[50px] h-[50px] relative">
                      <Image
                        src={ad.product.image || "/placeholder.svg?height=50&width=50"}
                        alt={ad.product.productName}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{ad.product.productName}</TableCell>
                  <TableCell>{ad.merchantDetail.merchantName}</TableCell>
                  <TableCell>${ad.price.toFixed(2)}</TableCell>
                  <TableCell>{getApprovalStatusBadge(ad.approvalStatus)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(ad.paymentStatus)}</TableCell>
                  <TableCell>{getActiveStatusBadge(ad.isActive)}</TableCell>
                  <TableCell>{format(new Date(ad.createdAt), "MMM d, yyyy")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      {selectedAd && (
        <AdDetailDialog
          ad={selectedAd}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onApprove={() => {
            setIsDetailOpen(false)
            setIsApproveOpen(true)
          }}
          onReject={() => {
            setIsDetailOpen(false)
            setIsRejectOpen(true)
          }}
        />
      )}

      {/* Approve Dialog */}
      {selectedAd && (
        <ApproveAdDialog
          ad={selectedAd}
          isOpen={isApproveOpen}
          onClose={() => setIsApproveOpen(false)}
          onSuccess={() => {
            setIsApproveOpen(false)
            onRefresh()
          }}
        />
      )}

      {/* Reject Dialog */}
      {selectedAd && (
        <RejectAdDialog
          ad={selectedAd}
          isOpen={isRejectOpen}
          onClose={() => setIsRejectOpen(false)}
          onSuccess={() => {
            setIsRejectOpen(false)
            onRefresh()
          }}
        />
      )}
    </>
  )
}