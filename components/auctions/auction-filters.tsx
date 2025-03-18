"use client"

import type React from "react"

import { useState } from "react"
import { Search, Calendar, DollarSign, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

export function AuctionFilters() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 0])
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search && !activeFilters.includes(`search:${search}`)) {
      setActiveFilters([...activeFilters, `search:${search}`])
    }
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    if (value !== "all") {
      const statusFilter = `status:${value}`
      if (!activeFilters.includes(statusFilter)) {
        setActiveFilters([...activeFilters.filter((f) => !f.startsWith("status:")), statusFilter])
      }
    } else {
      setActiveFilters(activeFilters.filter((f) => !f.startsWith("status:")))
    }
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value)
  }

  const applyPriceFilter = () => {
    const priceFilter = `price:$${priceRange[0]}-$${priceRange[1]}`
    setActiveFilters([...activeFilters.filter((f) => !f.startsWith("price:")), priceFilter])
  }

  const applyDateFilter = () => {
    if (dateRange.from) {
      const dateFilter = dateRange.to
        ? `date:${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
        : `date:${format(dateRange.from, "MMM d, yyyy")}`

      setActiveFilters([...activeFilters.filter((f) => !f.startsWith("date:")), dateFilter])
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))

    if (filter.startsWith("search:")) {
      setSearch("")
    } else if (filter.startsWith("status:")) {
      setStatus("all")
    } else if (filter.startsWith("price:")) {
      setPriceRange([0, 2000])
    } else if (filter.startsWith("date:")) {
      setDateRange({})
    }
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setSearch("")
    setStatus("all")
    setPriceRange([0, 2000])
    setDateRange({})
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search auctions..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Auctions</SelectItem>
              <SelectItem value="requested">Requested</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <DollarSign className="mr-2 h-4 w-4" />
                Price Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Price Range</h4>
                  <p className="text-sm text-muted-foreground">Set the minimum and maximum price</p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="price-min">Min</Label>
                      <Input
                        id="price-min"
                        placeholder="Min price"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        type="number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price-max">Max</Label>
                      <Input
                        id="price-max"
                        placeholder="Max price"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        type="number"
                      />
                    </div>
                  </div>
                  <Button onClick={applyPriceFilter}>Apply Price Filter</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Calendar className="mr-2 h-4 w-4" />
                Date Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
              <div className="p-3 border-t border-border">
                <Button onClick={applyDateFilter} className="w-full">
                  Apply Date Filter
                </Button>
              </div>
            </PopoverContent>
          </Popover> */}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter(filter)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7">
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}

