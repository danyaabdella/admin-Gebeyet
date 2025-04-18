"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, RefreshCw } from 'lucide-react'
import { AdsTable } from "@/components/ads/ads-table"
import { AdsFilter } from "@/components/ads/ads-filter"
import { fetchAds } from "@/utils/ads-api"
import { Sidebar } from "@/components/sidebar"

export default function AdsManagementPage() {
  // State for all data and UI
  const [allAds, setAllAds] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    approvalStatus: "",
    paymentStatus: "",
    merchantName: "",
    searchTerm: "",
    dateRange: {
      from: "",
      to: "",
    },
    isActive: "",
  })
  const [activeTab, setActiveTab] = useState("all")

  // Fetch all ads once on component mount
  useEffect(() => {
    const loadAllAds = async () => {
      setIsLoading(true)
      try {
        const adsData = await fetchAds({})
        setAllAds(adsData)
      } catch (error) {
        console.error("Failed to fetch ads:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAllAds()
  }, [])

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const adsData = await fetchAds({})
      setAllAds(adsData)
    } catch (error) {
      console.error("Failed to fetch ads:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter ads client-side based on current filters and active tab
  const filteredAds = useMemo(() => {
    return allAds.filter(ad => {
      // Filter by tab (approval status)
      if (activeTab === "pending" && ad.approvalStatus !== "PENDING") return false
      if (activeTab === "approved" && ad.approvalStatus !== "APPROVED") return false
      if (activeTab === "rejected" && ad.approvalStatus !== "REJECTED") return false

      // Filter by approval status (if selected in filter)
      if (filters.approvalStatus && filters.approvalStatus !== "ALL" && ad.approvalStatus !== filters.approvalStatus) {
        return false
      }

      // Filter by payment status
      if (filters.paymentStatus && filters.paymentStatus !== "ALL" && ad.paymentStatus !== filters.paymentStatus) {
        return false
      }

      // Filter by merchant name
      if (filters.merchantName && !ad.merchantDetail.merchantName.toLowerCase().includes(filters.merchantName.toLowerCase())) {
        return false
      }

      // Filter by active status
      if (filters.isActive === "true" && !ad.isActive) return false
      if (filters.isActive === "false" && ad.isActive) return false

      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const matchesProduct = ad.product.productName.toLowerCase().includes(searchLower)
        const matchesMerchant = ad.merchantDetail.merchantName.toLowerCase().includes(searchLower)
        if (!matchesProduct && !matchesMerchant) return false
      }

      // Filter by date range
      if (filters.dateRange.from) {
        const fromDate = new Date(filters.dateRange.from)
        const adDate = new Date(ad.createdAt)
        if (adDate < fromDate) return false
      }

      if (filters.dateRange.to) {
        const toDate = new Date(filters.dateRange.to)
        toDate.setHours(23, 59, 59, 999) // End of day
        const adDate = new Date(ad.createdAt)
        if (adDate > toDate) return false
      }

      return true
    })
  }, [allAds, filters, activeTab])

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters })
  }

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
     <Sidebar/>
     <div className="flex-1 md:ml-[calc(var(--sidebar-width)-40px)] md:-mt-12 -mt-8">
     <main className="flex flex-1 flex-col gap-4 p-2 sm:p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Ads Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex items-center justify-between overflow-auto">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All Ads</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending</TabsTrigger>
              <TabsTrigger value="approved" className="text-xs sm:text-sm">Approved</TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs sm:text-sm">Rejected</TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-4">
            <AdsFilter onFilterChange={handleFilterChange} isLoading={isLoading} />
          </div>

          <div className="mt-4">
            <TabsContent value="all">
              <AdsTable ads={filteredAds} isLoading={isLoading} onRefresh={handleRefresh} />
            </TabsContent>
            <TabsContent value="pending">
              <AdsTable ads={filteredAds} isLoading={isLoading} onRefresh={handleRefresh} />
            </TabsContent>
            <TabsContent value="approved">
              <AdsTable ads={filteredAds} isLoading={isLoading} onRefresh={handleRefresh} />
            </TabsContent>
            <TabsContent value="rejected">
              <AdsTable ads={filteredAds} isLoading={isLoading} onRefresh={handleRefresh} />
            </TabsContent>
          </div>
        </Tabs>
      </main>
     </div>
    </div>
  )
}
