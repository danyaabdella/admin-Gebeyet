"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, CreditCard, RefreshCcw, AlertCircle } from "lucide-react"

interface TransactionOverviewProps {
  transactions: any[]
  dateRange: { from?: Date; to?: Date }
  isLoading?: boolean
}

export function TransactionOverview({
  transactions = [],
  dateRange = {},
  isLoading = false,
}: TransactionOverviewProps) {
  // Filter transactions by date range
  const filteredTransactions = transactions.filter((transaction) => {
    if (!transaction || !transaction.date) return false

    if (dateRange.from && new Date(transaction.date) < dateRange.from) return false
    if (dateRange.to) {
      const endDate = new Date(dateRange.to)
      endDate.setHours(23, 59, 59, 999)
      if (new Date(transaction.date) > endDate) return false
    }
    return true
  })

  // Calculate total revenue (purchases minus refunds)
  const totalRevenue = filteredTransactions.reduce((total, transaction) => {
    if (!transaction) return total

    if (transaction.type === "purchase" && transaction.status === "completed") {
      return total + (transaction.amount || 0)
    } else if (transaction.type === "refund" && transaction.status === "completed") {
      return total - (transaction.amount || 0)
    }
    return total
  }, 0)

  // Calculate total fees
  const totalFees = filteredTransactions.reduce((total, transaction) => {
    if (!transaction) return total

    if (transaction.status === "completed") {
      return total + (transaction.fee || 0)
    }
    return total
  }, 0)

  // Count completed transactions
  const completedTransactions = filteredTransactions.filter(
    (transaction) => transaction && transaction.status === "completed",
  ).length

  // Count pending transactions
  const pendingTransactions = filteredTransactions.filter(
    (transaction) => transaction && (transaction.status === "pending" || transaction.status === "processing"),
  ).length

  // Count failed transactions
  const failedTransactions = filteredTransactions.filter(
    (transaction) => transaction && transaction.status === "failed",
  ).length

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const renderValue = (value: any, prefix = "", suffix = "") => {
    if (isLoading) {
      return <div className="h-7 w-24 animate-pulse rounded bg-muted"></div>
    }
    return `${prefix}${value}${suffix}`
  }

  // Calculate percentages safely
  const calculatePercentage = (count: number) => {
    if (filteredTransactions.length === 0) return 0
    return Math.round((count / filteredTransactions.length) * 100)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{renderValue(formatCurrency(totalRevenue))}</div>
          <p className="text-xs text-muted-foreground">+{renderValue(formatCurrency(totalFees), "+")} in fees</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Transactions</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{renderValue(completedTransactions)}</div>
          <p className="text-xs text-muted-foreground">
            {renderValue(calculatePercentage(completedTransactions), "", "%")} of total transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
          <RefreshCcw className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{renderValue(pendingTransactions)}</div>
          <p className="text-xs text-muted-foreground">
            {renderValue(calculatePercentage(pendingTransactions), "", "%")} of total transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed Transactions</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{renderValue(failedTransactions)}</div>
          <p className="text-xs text-muted-foreground">
            {renderValue(calculatePercentage(failedTransactions), "", "%")} of total transactions
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

