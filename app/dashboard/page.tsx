"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  Layers,
  Gavel,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShieldCheck,
  Bell,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RevenueChart } from "@/components/charts/revenue-chart"
import { UserGrowthChart } from "@/components/charts/user-growth-chart"
import { UserDistributionChart } from "@/components/charts/user-distribution-chart"
import { RevenueDistributionChart } from "@/components/charts/revenue-distribution-chart"
import { CategoryRevenueChart } from "@/components/charts/category-revenue-chart"
import { ProductSalesChart } from "@/components/charts/product-sales-chart"
import { AuctionPerformanceChart } from "@/components/charts/auction-performance-chart"
import { ExportReportButton } from "@/components/export-report-button"
import { fetchDashboardStats, fetchTopProducts } from "@/lib/data-fetching"
import { Toaster } from "@/components/toaster"
import { TransactionTypesChart } from "@/components/transactions/transaction-types-chart"

import { RevenueBarChart } from "@/components/charts/revenur-bar-chart"
import { UserGrowthBarChart } from "@/components/charts/user-grouth-bar-chart"
import { CategoryRevenueBarChart } from "@/components/charts/category-revenue-bar-chart"
import { OrderDistributionBarChart } from "@/components/charts/order-bar-chart"
import { MonthlyReportsBarChart } from "@/components/charts/monthly-report-bar-chart"
import { TransactionTypeDistributionChart } from "@/components/charts/transaction-type-chart"
import { OrderDistributionPieChart } from "@/components/charts/order-distribution-chart"

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [analyticsYear, setAnalyticsYear] = useState("2023")
  const [analyticsMonth, setAnalyticsMonth] = useState("all")
  const [reportYear, setReportYear] = useState("2023")
  const [reportMonth, setReportMonth] = useState("all")
  const [reportPeriod, setReportPeriod] = useState("year")

  useEffect(() => {
    async function loadData() {
      const dashboardStats = await fetchDashboardStats()
      const products = await fetchTopProducts()
      setStats(dashboardStats)
      setTopProducts(products)
    }
    loadData()
  }, [])

  // In your dashboard component
  const transactions = [
    { id: 1, type: "deposit", date: "2024-03-01" },
    { id: 2, type: "withdrawal", date: "2024-03-05" },
    { id: 3, type: "deposit", date: "2024-03-10" },
    { id: 4, type: "payment", date: "2024-03-15" },
    { id: 5, type: "deposit", date: "2024-03-20" },
  ]

  const dateRange = { from: new Date("2024-03-01"), to: new Date("2024-03-31") }
  const isLoading = false

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

  if (!stats) {
    return (
      <div className="flex min-h-screen flex-col">
        <Sidebar />
        <div className="flex-1 md:ml-[var(--sidebar-width)] lg:-mt-12 -mt-8">
          <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>
            <div className="flex items-center justify-center h-[80vh]">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Loading dashboard data...</h2>
                <p className="text-muted-foreground">Please wait while we fetch the latest statistics</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Function to render the stats cards grid
  const renderStatsCards = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Transactions */}
      <Link href="/transactions" className="block">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.transactions.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={`flex items-center ${stats.transactions.isIncrease ? "text-green-500" : "text-red-500"}`}
              >
                {stats.transactions.isIncrease ? "+" : "-"}
                {stats.transactions.percentChange}%{" "}
                {stats.transactions.isIncrease ? (
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="ml-1 h-3 w-3" />
                )}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* System Revenue */}
      <Link href="/transactions?revenue" className="block">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center ${stats.revenue.isIncrease ? "text-green-500" : "text-red-500"}`}>
                {stats.revenue.isIncrease ? "+" : "-"}
                {stats.revenue.percentChange}%{" "}
                {stats.revenue.isIncrease ? (
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="ml-1 h-3 w-3" />
                )}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Total Merchants */}
      <Link href="/users?merchants" className="block relative">
        {stats.merchants.pendingApproval > 0 && (
          <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white z-10">
            {stats.merchants.pendingApproval}
          </span>
        )}
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Merchants
              {stats.merchants.pendingApproval > 0 && (
                <span className="ml-2 text-red-500">
                  <Bell className="inline h-3 w-3" />
                </span>
              )}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.merchants.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center ${stats.merchants.isIncrease ? "text-green-500" : "text-red-500"}`}>
                {stats.merchants.isIncrease ? "+" : "-"}
                {stats.merchants.percentChange}%{" "}
                {stats.merchants.isIncrease ? (
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="ml-1 h-3 w-3" />
                )}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Total Customers */}
      <Link href="/users?customers" className="block">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.customers.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center ${stats.customers.isIncrease ? "text-green-500" : "text-red-500"}`}>
                {stats.customers.isIncrease ? "+" : "-"}
                {stats.customers.percentChange}%{" "}
                {stats.customers.isIncrease ? (
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="ml-1 h-3 w-3" />
                )}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Total System Users */}
      <Link href="/users" className="block">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total System Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center ${stats.users.isIncrease ? "text-green-500" : "text-red-500"}`}>
                {stats.users.isIncrease ? "+" : "-"}
                {stats.users.percentChange}%{" "}
                {stats.users.isIncrease ? (
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="ml-1 h-3 w-3" />
                )}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Total Products */}
      <Link href="/products" className="block">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center ${stats.products.isIncrease ? "text-green-500" : "text-red-500"}`}>
                {stats.products.isIncrease ? "+" : "-"}
                {stats.products.percentChange}%{" "}
                {stats.products.isIncrease ? (
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="ml-1 h-3 w-3" />
                )}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Total Orders */}
      <Link href="/orders" className="block relative">
        {stats.orders.pendingRefunds > 0 && (
          <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white z-10">
            {stats.orders.pendingRefunds}
          </span>
        )}
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
              {stats.orders.pendingRefunds > 0 && (
                <span className="ml-2 text-red-500">
                  <Bell className="inline h-3 w-3" />
                </span>
              )}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.orders.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center ${stats.orders.isIncrease ? "text-green-500" : "text-red-500"}`}>
                {stats.orders.isIncrease ? "+" : "-"}
                {stats.orders.percentChange}%{" "}
                {stats.orders.isIncrease ? (
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="ml-1 h-3 w-3" />
                )}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Total Auctions */}
      <Link href="/auctions" className="block relative">
        {stats.auctions.pendingApproval > 0 && (
          <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white z-10">
            {stats.auctions.pendingApproval}
          </span>
        )}
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Auctions
              {stats.auctions.pendingApproval > 0 && (
                <span className="ml-2 text-red-500">
                  <Bell className="inline h-3 w-3" />
                </span>
              )}
            </CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.auctions.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center ${stats.auctions.isIncrease ? "text-green-500" : "text-red-500"}`}>
                {stats.auctions.isIncrease ? "+" : "-"}
                {Math.abs(stats.auctions.percentChange)}%{" "}
                {stats.auctions.isIncrease ? (
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="ml-1 h-3 w-3" />
                )}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Total Categories */}
      <Link href="/categories" className="block">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center ${stats.categories.isIncrease ? "text-green-500" : "text-red-500"}`}>
                {stats.categories.isIncrease ? "+" : "-"}
                {stats.categories.percentChange}{" "}
                {stats.categories.isIncrease ? (
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="ml-1 h-3 w-3" />
                )}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Total Admins */}
      <Link href="/admins" className="block">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center ${stats.admins.isIncrease ? "text-green-500" : "text-red-500"}`}>
                {stats.admins.isIncrease ? "+" : "-"}
                {stats.admins.percentChange}{" "}
                {stats.admins.isIncrease ? (
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="ml-1 h-3 w-3" />
                )}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  )

  // Function to render recent sales
  const renderRecentSales = () => (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>You made 265 sales this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-end">
          {[...Array(10)].map((_, i) => (
            <div className="flex items-center space-x-4 justify-between" key={i}>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Customer {i + 1}</p>
                <p className="text-sm text-muted-foreground">customer{i + 1}@example.com</p>
              </div>
              <div className="ml-auto font-medium">+${(Math.random() * 1000).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />
      <div className="flex-1 md:ml-[calc(var(--sidebar-width)-40px)] md:-mt-12 -mt-8">
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="overview" className="flex-1 sm:flex-none">
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex-1 sm:flex-none">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex-1 sm:flex-none">
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {renderStatsCards()}

              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <Card className="">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue and order trends</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <RevenueChart />
                  </CardContent>
                </Card>

                <Card className="">
                  <CardHeader>
                    <CardTitle>User Distribution</CardTitle>
                    <CardDescription>Breakdown by user type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserDistributionChart />
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Distribution</CardTitle>
                    <CardDescription>Breakdown by revenue source</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RevenueDistributionChart />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Distribution</CardTitle>
                    <CardDescription>Breakdown by transaction types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TransactionTypeDistributionChart />
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Category</CardTitle>
                    <CardDescription>Top performing categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CategoryRevenueChart />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Distribution</CardTitle>
                    <CardDescription>Order classification</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OrderDistributionPieChart />
                  </CardContent>
                </Card>
              </div>

              {renderRecentSales()}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                  <Select value={analyticsYear} onValueChange={setAnalyticsYear}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={analyticsMonth} onValueChange={setAnalyticsMonth}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      <SelectItem value="1">January</SelectItem>
                      <SelectItem value="2">February</SelectItem>
                      <SelectItem value="3">March</SelectItem>
                      <SelectItem value="4">April</SelectItem>
                      <SelectItem value="5">May</SelectItem>
                      <SelectItem value="6">June</SelectItem>
                      <SelectItem value="7">July</SelectItem>
                      <SelectItem value="8">August</SelectItem>
                      <SelectItem value="9">September</SelectItem>
                      <SelectItem value="10">October</SelectItem>
                      <SelectItem value="11">November</SelectItem>
                      <SelectItem value="12">December</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="last30days">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last7days">Last 7 days</SelectItem>
                      <SelectItem value="last30days">Last 30 days</SelectItem>
                      <SelectItem value="last90days">Last 90 days</SelectItem>
                      <SelectItem value="lastyear">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>New user registrations over time</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <UserGrowthChart />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sales Performance</CardTitle>
                    <CardDescription>Revenue and order trends</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[300px] w-full">
                      <RevenueChart />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* New Product Sales Graph */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Sales</CardTitle>
                  <CardDescription>Monthly product sales data compared to targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductSalesChart />
                </CardContent>
              </Card>

              {/* New Auction Performance Graph */}
              <Card>
                <CardHeader>
                  <CardTitle>Auction Performance</CardTitle>
                  <CardDescription>Monthly auction activity breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <AuctionPerformanceChart />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="grid gap-2 grid-cols-2 lg:grid-cols-4">
                  <Select value={reportYear} onValueChange={setReportYear}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={reportMonth} onValueChange={setReportMonth}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      <SelectItem value="1">January</SelectItem>
                      <SelectItem value="2">February</SelectItem>
                      <SelectItem value="3">March</SelectItem>
                      <SelectItem value="4">April</SelectItem>
                      <SelectItem value="5">May</SelectItem>
                      <SelectItem value="6">June</SelectItem>
                      <SelectItem value="7">July</SelectItem>
                      <SelectItem value="8">August</SelectItem>
                      <SelectItem value="9">September</SelectItem>
                      <SelectItem value="10">October</SelectItem>
                      <SelectItem value="11">November</SelectItem>
                      <SelectItem value="12">December</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={reportPeriod} onValueChange={setReportPeriod}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last7days">Last 7 days</SelectItem>
                      <SelectItem value="last30days">Last 30 days</SelectItem>
                      <SelectItem value="last90days">Last 90 days</SelectItem>
                      <SelectItem value="year">Full Year</SelectItem>
                    </SelectContent>
                  </Select>

                  <ExportReportButton period={reportPeriod} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 ">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Financial Reports</CardTitle>
                  <CardDescription>Revenue, profit, and expenses breakdown by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyReportsBarChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Report</CardTitle>
                  <CardDescription>Monthly revenue trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <RevenueBarChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Growth Report</CardTitle>
                  <CardDescription>Monthly user growth by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserGrowthBarChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Sales Report</CardTitle>
                  <CardDescription>Monthly product sales data compared to targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductSalesChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Auction Performance Report</CardTitle>
                  <CardDescription>Monthly auction activity breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <AuctionPerformanceChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>Top performing categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryRevenueBarChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Distribution</CardTitle>
                  <CardDescription>Breakdown of Order Distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderDistributionBarChart />
                </CardContent>
              </Card>
              </div>

              {/* Top Products Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                  <CardDescription>Products with highest revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, i) => (
                      <div className="flex items-center" key={i}>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <div className="ml-auto font-medium">${product.revenue.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Toaster />
    </div>
  )
}

