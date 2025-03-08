"use client"

import { useState, useEffect } from "react"
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
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [transactions, setTransactions] = useState<any[]>([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const { toast } = useToast()

  // Mock transactions data
  const mockTransactions = [
    {
      _id: "txn_1",
      transactionId: "TXN-2023-10-01-001",
      type: "purchase",
      amount: 129.99,
      fee: 3.99,
      status: "completed",
      date: "2023-10-01T10:15:00.000Z",
      customer: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
      product: {
        name: "Premium Headphones",
        id: "prod_001",
      },
      paymentMethod: "credit_card",
    },
    {
      _id: "txn_2",
      transactionId: "TXN-2023-10-02-002",
      type: "purchase",
      amount: 49.99,
      fee: 1.5,
      status: "completed",
      date: "2023-10-02T14:30:00.000Z",
      customer: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
      },
      product: {
        name: "Wireless Mouse",
        id: "prod_002",
      },
      paymentMethod: "paypal",
    },
    {
      _id: "txn_3",
      transactionId: "TXN-2023-10-03-003",
      type: "refund",
      amount: 49.99,
      fee: 0,
      status: "completed",
      date: "2023-10-03T09:45:00.000Z",
      customer: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
      },
      product: {
        name: "Wireless Mouse",
        id: "prod_002",
      },
      paymentMethod: "paypal",
    },
    {
      _id: "txn_4",
      transactionId: "TXN-2023-10-04-004",
      type: "withdrawal",
      amount: 500.0,
      fee: 5.0,
      status: "completed",
      date: "2023-10-04T16:20:00.000Z",
      customer: {
        name: "Seller Account",
        email: "seller@example.com",
      },
      product: null,
      paymentMethod: "bank_transfer",
    },
    {
      _id: "txn_5",
      transactionId: "TXN-2023-10-05-005",
      type: "purchase",
      amount: 199.99,
      fee: 5.99,
      status: "pending",
      date: "2023-10-05T11:10:00.000Z",
      customer: {
        name: "Robert Johnson",
        email: "robert.j@example.com",
      },
      product: {
        name: "Smart Watch",
        id: "prod_003",
      },
      paymentMethod: "credit_card",
    },
    {
      _id: "txn_6",
      transactionId: "TXN-2023-10-06-006",
      type: "deposit",
      amount: 1000.0,
      fee: 0,
      status: "completed",
      date: "2023-10-06T13:25:00.000Z",
      customer: {
        name: "Seller Account",
        email: "seller@example.com",
      },
      product: null,
      paymentMethod: "bank_transfer",
    },
    {
      _id: "txn_7",
      transactionId: "TXN-2023-10-07-007",
      type: "fee",
      amount: 25.0,
      fee: 0,
      status: "completed",
      date: "2023-10-07T09:00:00.000Z",
      customer: {
        name: "Marketplace",
        email: "admin@marketplace.com",
      },
      product: null,
      paymentMethod: "system",
    },
    {
      _id: "txn_8",
      transactionId: "TXN-2023-10-08-008",
      type: "purchase",
      amount: 79.99,
      fee: 2.49,
      status: "failed",
      date: "2023-10-08T15:40:00.000Z",
      customer: {
        name: "Michael Brown",
        email: "michael.b@example.com",
      },
      product: {
        name: "Bluetooth Speaker",
        id: "prod_004",
      },
      paymentMethod: "credit_card",
    },
    {
      _id: "txn_9",
      transactionId: "TXN-2023-10-09-009",
      type: "purchase",
      amount: 149.99,
      fee: 4.5,
      status: "completed",
      date: "2023-10-09T12:15:00.000Z",
      customer: {
        name: "Emily Davis",
        email: "emily.d@example.com",
      },
      product: {
        name: "External Hard Drive",
        id: "prod_005",
      },
      paymentMethod: "paypal",
    },
    {
      _id: "txn_10",
      transactionId: "TXN-2023-10-10-010",
      type: "refund",
      amount: 79.99,
      fee: 0,
      status: "processing",
      date: "2023-10-10T10:30:00.000Z",
      customer: {
        name: "Michael Brown",
        email: "michael.b@example.com",
      },
      product: {
        name: "Bluetooth Speaker",
        id: "prod_004",
      },
      paymentMethod: "credit_card",
    },
    {
      _id: "txn_11",
      transactionId: "TXN-2023-10-11-011",
      type: "purchase",
      amount: 299.99,
      fee: 8.99,
      status: "completed",
      date: "2023-10-11T14:20:00.000Z",
      customer: {
        name: "Sarah Wilson",
        email: "sarah.w@example.com",
      },
      product: {
        name: "Tablet",
        id: "prod_006",
      },
      paymentMethod: "credit_card",
    },
    {
      _id: "txn_12",
      transactionId: "TXN-2023-10-12-012",
      type: "withdrawal",
      amount: 750.0,
      fee: 7.5,
      status: "pending",
      date: "2023-10-12T16:45:00.000Z",
      customer: {
        name: "Seller Account",
        email: "seller@example.com",
      },
      product: null,
      paymentMethod: "bank_transfer",
    },
    {
      _id: "txn_13",
      transactionId: "TXN-2023-10-13-013",
      type: "purchase",
      amount: 59.99,
      fee: 1.8,
      status: "completed",
      date: "2023-10-13T11:05:00.000Z",
      customer: {
        name: "David Miller",
        email: "david.m@example.com",
      },
      product: {
        name: "Gaming Mouse",
        id: "prod_007",
      },
      paymentMethod: "paypal",
    },
    {
      _id: "txn_14",
      transactionId: "TXN-2023-10-14-014",
      type: "fee",
      amount: 15.0,
      fee: 0,
      status: "completed",
      date: "2023-10-14T09:30:00.000Z",
      customer: {
        name: "Marketplace",
        email: "admin@marketplace.com",
      },
      product: null,
      paymentMethod: "system",
    },
    {
      _id: "txn_15",
      transactionId: "TXN-2023-10-15-015",
      type: "purchase",
      amount: 89.99,
      fee: 2.7,
      status: "completed",
      date: "2023-10-15T13:40:00.000Z",
      customer: {
        name: "Jennifer Lee",
        email: "jennifer.l@example.com",
      },
      product: {
        name: "Wireless Keyboard",
        id: "prod_008",
      },
      paymentMethod: "credit_card",
    },
    {
      _id: "txn_16",
      transactionId: "TXN-2023-10-16-016",
      type: "deposit",
      amount: 500.0,
      fee: 0,
      status: "completed",
      date: "2023-10-16T15:15:00.000Z",
      customer: {
        name: "Seller Account",
        email: "seller@example.com",
      },
      product: null,
      paymentMethod: "bank_transfer",
    },
    {
      _id: "txn_17",
      transactionId: "TXN-2023-10-17-017",
      type: "purchase",
      amount: 399.99,
      fee: 11.99,
      status: "failed",
      date: "2023-10-17T10:50:00.000Z",
      customer: {
        name: "Thomas Anderson",
        email: "thomas.a@example.com",
      },
      product: {
        name: "Smartphone",
        id: "prod_009",
      },
      paymentMethod: "credit_card",
    },
    {
      _id: "txn_18",
      transactionId: "TXN-2023-10-18-018",
      type: "refund",
      amount: 149.99,
      fee: 0,
      status: "completed",
      date: "2023-10-18T12:25:00.000Z",
      customer: {
        name: "Emily Davis",
        email: "emily.d@example.com",
      },
      product: {
        name: "External Hard Drive",
        id: "prod_005",
      },
      paymentMethod: "paypal",
    },
    {
      _id: "txn_19",
      transactionId: "TXN-2023-10-19-019",
      type: "purchase",
      amount: 249.99,
      fee: 7.49,
      status: "completed",
      date: "2023-10-19T14:10:00.000Z",
      customer: {
        name: "Daniel White",
        email: "daniel.w@example.com",
      },
      product: {
        name: "Noise-Cancelling Headphones",
        id: "prod_010",
      },
      paymentMethod: "credit_card",
    },
    {
      _id: "txn_20",
      transactionId: "TXN-2023-10-20-020",
      type: "withdrawal",
      amount: 1200.0,
      fee: 12.0,
      status: "completed",
      date: "2023-10-20T16:30:00.000Z",
      customer: {
        name: "Seller Account",
        email: "seller@example.com",
      },
      product: null,
      paymentMethod: "bank_transfer",
    },
  ]

  // Filter transactions based on search, type, status, and date range
  const filterTransactions = () => {
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
  }

  // Load transactions with pagination
  useEffect(() => {
    setIsLoadingData(true)

    // Simulate API call with delay
    const fetchData = async () => {
      // In a real app, this would be an API call with the filters
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Filter transactions
      const filteredTransactions = filterTransactions()

      // Calculate pagination
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
  }, [currentPage, selectedType, selectedStatus, dateRange, searchQuery])

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
    setDateRange(range)
    setCurrentPage(1)

    // Show a loading toast
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
        <h1 className="text-3xl font-bold tracking-tight">Transaction Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <TransactionOverview transactions={mockTransactions} dateRange={dateRange} isLoading={isLoadingData} />

      <TransactionCharts transactions={mockTransactions} dateRange={dateRange} isLoading={isLoadingData} />

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
        <CardHeader className="p-4">
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Manage and view all transactions in the marketplace</CardDescription>
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

