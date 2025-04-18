"use client"

import { useState, useEffect } from "react"
import { Search, Filter, X, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface AdsFilterProps {
  onFilterChange: (filters: any) => void
  isLoading: boolean
}

export function AdsFilter({ onFilterChange, isLoading }: AdsFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [approvalStatus, setApprovalStatus] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("")
  const [merchantName, setMerchantName] = useState("")
  const [isActive, setIsActive] = useState("")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(false)
  const [activeFilterCount, setActiveFilterCount] = useState(0)

  // Calculate active filter count
  useEffect(() => {
    let count = 0
    if (approvalStatus) count++
    if (paymentStatus) count++
    if (merchantName) count++
    if (isActive) count++
    if (dateFrom) count++
    if (dateTo) count++
    if (searchTerm) count++
    setActiveFilterCount(count)
  }, [approvalStatus, paymentStatus, merchantName, isActive, dateFrom, dateTo, searchTerm])

  // Apply filters immediately when any filter changes
  const applyFilters = () => {
    const filters: any = {
      approvalStatus: approvalStatus || undefined,
      paymentStatus: paymentStatus || undefined,
      merchantName: merchantName || undefined,
      searchTerm: searchTerm || undefined,
      isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
      dateRange: {
        from: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
        to: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      },
    }

    onFilterChange(filters)
  }

  // Apply filters immediately when any input changes
  useEffect(() => {
    applyFilters()
  }, [approvalStatus, paymentStatus, merchantName, isActive, dateFrom, dateTo, searchTerm])

  const clearFilters = () => {
    setSearchTerm("")
    setApprovalStatus("")
    setPaymentStatus("")
    setMerchantName("")
    setIsActive("")
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-4">
          {/* Search and Filter Toggle Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search ads..."
                className="pl-8 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-0"
                  onClick={() => setSearchTerm("")}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>

            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </CollapsibleTrigger>

                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    disabled={isLoading}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <CollapsibleContent className="mt-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Approval Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Approval Status</label>
                    <Select value={approvalStatus} onValueChange={setApprovalStatus} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Status</label>
                    <Select value={paymentStatus} onValueChange={setPaymentStatus} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Payment Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Payment Statuses</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Active Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Active Status</label>
                    <Select value={isActive} onValueChange={setIsActive} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Ads" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Ads</SelectItem>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Merchant */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Merchant</label>
                    <Input
                      placeholder="Filter by merchant name"
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2 col-span-1 sm:col-span-2">
                    <label className="text-sm font-medium">Created Date Range</label>
                    <div className="flex flex-wrap gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-start text-left font-normal w-full sm:w-[160px]"
                            disabled={isLoading}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {dateFrom ? format(dateFrom, "PPP") : "From date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-start text-left font-normal w-full sm:w-[160px]"
                            disabled={isLoading}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {dateTo ? format(dateTo, "PPP") : "To date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={dateTo}
                            onSelect={setDateTo}
                            initialFocus
                            disabled={(date) => (dateFrom ? date < dateFrom : false)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {activeFilterCount > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {approvalStatus && (
                      <Badge variant="secondary" className="gap-1">
                        Status: {approvalStatus}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setApprovalStatus("")}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove status filter</span>
                        </Button>
                      </Badge>
                    )}
                    {paymentStatus && (
                      <Badge variant="secondary" className="gap-1">
                        Payment: {paymentStatus}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPaymentStatus("")}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove payment status filter</span>
                        </Button>
                      </Badge>
                    )}
                    {isActive && (
                      <Badge variant="secondary" className="gap-1">
                        {isActive === "true" ? "Active" : "Inactive"}
                        <Button variant="ghost" size="sm" onClick={() => setIsActive("")} className="h-4 w-4 p-0 ml-1">
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove active filter</span>
                        </Button>
                      </Badge>
                    )}
                    {merchantName && (
                      <Badge variant="secondary" className="gap-1">
                        Merchant: {merchantName}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMerchantName("")}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove merchant filter</span>
                        </Button>
                      </Badge>
                    )}
                    {searchTerm && (
                      <Badge variant="secondary" className="gap-1">
                        Search: {searchTerm}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchTerm("")}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove search filter</span>
                        </Button>
                      </Badge>
                    )}
                    {dateFrom && (
                      <Badge variant="secondary" className="gap-1">
                        From: {format(dateFrom, "PP")}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDateFrom(undefined)}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove from date filter</span>
                        </Button>
                      </Badge>
                    )}
                    {dateTo && (
                      <Badge variant="secondary" className="gap-1">
                        To: {format(dateTo, "PP")}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDateTo(undefined)}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove to date filter</span>
                        </Button>
                      </Badge>
                    )}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
