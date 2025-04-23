"use client"

import { useState } from "react"
import { CreditCard } from "lucide-react"

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
import { useToast } from "@/hooks/use-toast"

interface MerchantDetails {
  account_name: string
  account_number: string
  amount: number
  currency: string
  bank_code: string
}

interface PayMerchantDialogProps {
  orderId: string
  merchantDetails: MerchantDetails
}

export function PayMerchantDialog({ orderId, merchantDetails }: PayMerchantDialogProps) {
  console.log("Order ID: ", orderId);
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
    }).format(amount)
  }

  const handlePayMerchant = async () => {
    setIsSubmitting(true)
  
    try {
      const response = await fetch("/api/payMerchant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: orderId,
          account_name: merchantDetails.account_name,
          account_number: merchantDetails.account_number,
          amount: merchantDetails.amount,
          bank_code: 946,
        }),
      })

      console.log("Response: ", response);
      const data = await response.json();
      console.log("Data: ", data);
  
      if (!response.ok) {
        throw new Error(data.message || "Payment to merchant failed")
      }
  
      toast({
        title: "Payment to merchant processed",
        description: `${formatCurrency(merchantDetails.amount, merchantDetails.currency)} has been sent to ${merchantDetails.account_name}.`,
      })
  
      setOpen(false) // Close modal or popup
    } catch (error: any) {
      console.error("Payment to merchant error:", error)
  
      toast({
        title: "Payment failed",
        description: error.message || "There was an error processing the payment to merchant. Please try again.",
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
          <CreditCard className="h-4 w-4" />
          Pay Merchant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pay Merchant</DialogTitle>
          <DialogDescription>
            You are about to process a payment to the merchant. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="font-medium">Account Name:</span>
              <span>{merchantDetails.account_name}</span>

              <span className="font-medium">Account Number:</span>
              <span>{merchantDetails.account_number}</span>

              <span className="font-medium">Bank Code:</span>
              <span>{merchantDetails.bank_code}</span>

              <span className="font-medium">Amount:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(merchantDetails.amount, merchantDetails.currency)}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handlePayMerchant} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Confirm Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
