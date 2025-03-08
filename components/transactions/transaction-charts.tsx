"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface TransactionChartsProps {
  transactions: any[]
  dateRange: { from?: Date; to?: Date }
  isLoading?: boolean
}

export function TransactionCharts({ transactions = [], dateRange = {}, isLoading = false }: TransactionChartsProps) {
  const [chartView, setChartView] = useState("daily")

  // Filter transactions by date range
  const filteredTransactions = transactions.filter((transaction) => {
    if (!transaction) return false
    if (dateRange.from && new Date(transaction.date) < dateRange.from) return false
    if (dateRange.to) {
      const endDate = new Date(dateRange.to)
      endDate.setHours(23, 59, 59, 999)
      if (new Date(transaction.date) > endDate) return false
    }
    return true
  })

  // Prepare data for daily/weekly/monthly charts
  const prepareTimeSeriesData = (groupBy: "daily" | "weekly" | "monthly") => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      return []
    }

    const groupedData: Record<string, { date: string; revenue: number; transactions: number }> = {}

    filteredTransactions.forEach((transaction) => {
      if (!transaction || !transaction.date) return

      const date = new Date(transaction.date)
      let key = ""

      if (groupBy === "daily") {
        key = date.toISOString().split("T")[0] // YYYY-MM-DD
      } else if (groupBy === "weekly") {
        // Get the week number
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
        key = `${date.getFullYear()}-W${weekNumber}`
      } else if (groupBy === "monthly") {
        key = `${date.getFullYear()}-${date.getMonth() + 1}` // YYYY-MM
      }

      if (!groupedData[key]) {
        groupedData[key] = {
          date: key,
          revenue: 0,
          transactions: 0,
        }
      }

      if (transaction.type === "purchase" && transaction.status === "completed") {
        groupedData[key].revenue += transaction.amount
        groupedData[key].transactions += 1
      } else if (transaction.type === "refund" && transaction.status === "completed") {
        groupedData[key].revenue -= transaction.amount
      }
    })

    // Convert to array and sort by date
    return Object.keys(groupedData).length > 0
      ? Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date))
      : []
  }

  // Prepare data for transaction types pie chart
  const prepareTransactionTypeData = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      return []
    }

    const typeCounts: Record<string, number> = {}

    filteredTransactions.forEach((transaction) => {
      if (!transaction || !transaction.type) return

      if (!typeCounts[transaction.type]) {
        typeCounts[transaction.type] = 0
      }
      typeCounts[transaction.type] += 1
    })

    return Object.keys(typeCounts).length > 0
      ? Object.entries(typeCounts).map(([type, count]) => ({
          name: type.charAt(0).toUpperCase() + type.slice(1),
          value: count,
        }))
      : []
  }

  // Prepare data for payment methods pie chart
  const preparePaymentMethodData = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      return []
    }

    const methodCounts: Record<string, number> = {}

    filteredTransactions.forEach((transaction) => {
      if (!transaction || !transaction.paymentMethod) return

      if (!methodCounts[transaction.paymentMethod]) {
        methodCounts[transaction.paymentMethod] = 0
      }
      methodCounts[transaction.paymentMethod] += 1
    })

    return Object.keys(methodCounts).length > 0
      ? Object.entries(methodCounts).map(([method, count]) => {
          let name = method
          switch (method) {
            case "credit_card":
              name = "Credit Card"
              break
            case "paypal":
              name = "PayPal"
              break
            case "bank_transfer":
              name = "Bank Transfer"
              break
            case "system":
              name = "System"
              break
          }

          return {
            name,
            value: count,
          }
        })
      : []
  }

  // Format date labels for charts
  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return ""

    if (chartView === "daily") {
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } else if (chartView === "weekly") {
      const [year, week] = dateStr.split("-W")
      return `Week ${week}`
    } else if (chartView === "monthly") {
      const [year, month] = dateStr.split("-")
      return new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    }
    return dateStr
  }

  // Colors for pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  // Get data based on selected view
  const timeSeriesData = prepareTimeSeriesData(chartView as "daily" | "weekly" | "monthly")
  const transactionTypeData = prepareTransactionTypeData()
  const paymentMethodData = preparePaymentMethodData()

  const LoadingOverlay = () =>
    isLoading ? (
      <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    ) : null

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2 relative">
        <LoadingOverlay />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Revenue Overview</CardTitle>
            <Tabs value={chartView} onValueChange={setChartView}>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>Revenue and transaction count over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
              transactions: {
                label: "Transactions",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDateLabel} tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  name="Revenue"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="transactions"
                  stroke="var(--color-transactions)"
                  name="Transactions"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="relative">
        <LoadingOverlay />
        <CardHeader>
          <CardTitle>Transaction Types</CardTitle>
          <CardDescription>Distribution of transaction types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {transactionTypeData.length > 0 && (
                  <Pie
                    data={transactionTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name || ""}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {transactionTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                )}
                <Tooltip formatter={(value) => [`${value} transactions`, "Count"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="relative">
        <LoadingOverlay />
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Distribution of payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {paymentMethodData.length > 0 && (
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name || ""}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                )}
                <Tooltip formatter={(value) => [`${value} transactions`, "Count"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

