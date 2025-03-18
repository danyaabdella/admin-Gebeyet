"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionTable } from "@/components/transactions/transaction-table"
import { TransactionPagination } from "@/components/transactions/transaction-pagination"
import { TransactionOverview } from "@/components/transactions/transaction-overview"
import { TransactionCharts } from "@/components/transactions/transaction-charts"
import { DateRangePicker } from "@/components/date-range-picker"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/toaster"
import { DateRange } from "react-day-picker"
import { mockTransactions } from "@/lib/mock-transaction"

// Mock transaction types
const transactionTypes = [
  { id: "all", name: "All Types" },
  { id: "purchase", name: "Purchase" },
  { id: "refund", name: "Refund" },
  { id: "withdrawal", name: "Withdrawal" },
  { id: "deposit", name: "Deposit" },
  { id: "fee", name: "Platform Fee" },
]

// Mock transaction statuses
const transactionStatuses = [
  { id: "all", name: "All Statuses" },
  { id: "completed", name: "Completed" },
  { id: "pending", name: "Pending" },
  { id: "failed", name: "Failed" },
  { id: "processing", name: "Processing" },
]

export function TransactionManagementContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(), // Default to today's date
    to: new Date(),   // Default to today's date
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [transactions, setTransactions] = useState<any[]>([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const { toast } = useToast()

  // Compute filtered transactions using useMemo
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((transaction) => {
      // Filter by type
      if (selectedType !== "all" && transaction.type !== selectedType) return false

      // Filter by status
      if (selectedStatus !== "all" && transaction.status !== selectedStatus) return false

      // Filter by date range
      if (dateRange.from && new Date(transaction.date) < dateRange.from) return false
      if (dateRange.to) {
        const endDate = new Date(dateRange.to)
        endDate.setHours(23, 59, 59, 999)
        if (new Date(transaction.date) > endDate) return false
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          transaction.transactionId.toLowerCase().includes(query) ||
          transaction.customer.name.toLowerCase().includes(query) ||
          transaction.customer.email.toLowerCase().includes(query) ||
          (transaction.product && transaction.product.name.toLowerCase().includes(query))
        )
      }

      return true
    })
  }, [selectedType, selectedStatus, dateRange, searchQuery])

  // Handle pagination and loading state
  useEffect(() => {
    setIsLoadingData(true)
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const itemsPerPage = 10
      const totalItems = filteredTransactions.length
      const totalPages = Math.ceil(totalItems / itemsPerPage)
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

      setTransactions(paginatedTransactions)
      setTotalTransactions(totalItems)
      setTotalPages(totalPages)
      setIsLoadingData(false)
    }
    fetchData()
  }, [filteredTransactions, currentPage])

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    setCurrentPage(1)
  }

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range as DateRange)
    setCurrentPage(1)
    if (range.from || range.to) {
      toast({
        title: "Filtering Transactions",
        description: `Showing transactions ${range.from ? `from ${range.from.toLocaleDateString()}` : ""} ${range.to ? `to ${range.to.toLocaleDateString()}` : ""}`,
      })
    }
  }

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your transaction data is being exported. It will be available for download shortly.",
    })
  }

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">Transaction Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

        <TransactionOverview transactions={filteredTransactions} dateRange={dateRange} isLoading={isLoadingData} />
        <TransactionCharts transactions={filteredTransactions} dateRange={dateRange} isLoading={isLoadingData} />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button variant="secondary" size="sm" onClick={handleSearch}>
            Search
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker value={dateRange} onValueChange={handleDateRangeChange} />

          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {transactionTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {transactionStatuses.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="p-2 md:p-4">
          <CardTitle className="text-xl md:text-2xl">All Transactions</CardTitle>
          <CardDescription className="hidden md:block">Manage and view all transactions in the marketplace</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <TransactionTable transactions={transactions} isLoading={isLoadingData} />
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <TransactionPagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
      )}

      <Toaster />
    </main>
  )
}