"use client"

import { useState } from "react"
import { RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface RefundDialogProps {
  orderId: string
  amount: number
  transactionRef: string
}

export function RefundDialog({ orderId, amount, transactionRef }: RefundDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleRefund = async () => {
    setIsSubmitting(true)
  
    try {
      const response = await fetch("/api/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref: transactionRef,
          reason: reason,
          amount: amount
        }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error || "Refund failed")
      }
  
      toast({
        title: "Refund processed",
        description: data.message || `Order #${transactionRef} has been refunded.`,
      })
  
      setOpen(false)
      setReason("")
    } catch (error: any) {
      console.error("Refund error:", error)
  
      toast({
        title: "Refund failed",
        description: error.message || "Something went wrong during refund.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Process Refund
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>
            You are about to process a refund for order #{transactionRef}. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Refund Reason
            </label>
            <Textarea
              id="reason"
              placeholder="Enter the reason for the refund..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleRefund} disabled={!reason.trim() || isSubmitting}>
            {isSubmitting ? "Processing..." : "Confirm Refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
