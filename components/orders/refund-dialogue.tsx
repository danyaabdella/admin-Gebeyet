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
import { processRefund } from "@/utils/api"

interface RefundDialogProps {
  orderId: string
}

export function RefundDialog({ orderId }: RefundDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleRefund = async () => {
    setIsSubmitting(true)

    try {
      const result = await processRefund(orderId, reason)

      toast({
        title: "Refund processed successfully",
        description: `Order #${orderId} has been refunded.`,
      })

      setOpen(false)
      setReason("")
    } catch (error) {
      toast({
        title: "Refund failed",
        description: "There was an error processing the refund. Please try again.",
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
            You are about to process a refund for order #{orderId}. This action cannot be undone.
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
