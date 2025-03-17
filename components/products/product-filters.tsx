"use client"

import { useState, useEffect, useMemo } from "react"
import debounce from "lodash.debounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star, X, DollarSign, Box, Truck, Tag, Banknote } from "lucide-react"
import DistancePicker from "@/components/DistancePicker"

interface ProductFiltersProps {
  onApplyFilters: (filters: any) => void
  productCount: number
}

interface ActiveFilter {
  label: string
  remove: () => void
}

export function ProductFilters({ onApplyFilters, productCount }: ProductFiltersProps) {
  // State for all filters
  const [priceRange, setPriceRange] = useState([0, 0])
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("0")

  const [quantityRange, setQuantityRange] = useState([0, 0])
  const [minQuantity, setMinQuantity] = useState("0")
  const [maxQuantity, setMaxQuantity] = useState("0")

  const [ratingRange, setRatingRange] = useState([0, 5])
  const [minRating, setMinRating] = useState("0")
  const [maxRating, setMaxRating] = useState("5")

  const [deliveryType, setDeliveryType] = useState("all")
  const [deliveryPriceRange, setDeliveryPriceRange] = useState([0, 0])
  const [minDeliveryPrice, setMinDeliveryPrice] = useState("0")
  const [maxDeliveryPrice, setMaxDeliveryPrice] = useState("0")

  const [selectedCategory, setSelectedCategory] = useState("all")

  const [locationRadius, setLocationRadius] = useState(50)
  const [locationCenter, setLocationCenter] = useState<{ lat: number; lng: number } | null>(null)

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "category_1", name: "Electronics" },
    { id: "category_2", name: "Clothing" },
    { id: "category_3", name: "Home & Garden" },
    { id: "category_4", name: "Beauty" },
    { id: "category_5", name: "Toys" },
    { id: "category_6", name: "Sports" },
  ]

  // Input change handlers
  const handleMinPriceChange = (value: string) => {
    const numValue = Number(value)
    setMinPrice(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= priceRange[1]) {
      setPriceRange([numValue, priceRange[1]])
    }
  }

  const handleMaxPriceChange = (value: string) => {
    const numValue = Number(value)
    setMaxPrice(value)
    if (!isNaN(numValue) && numValue >= priceRange[0]) {
      setPriceRange([priceRange[0], numValue])
    }
  }

  const handleMinQuantityChange = (value: string) => {
    const numValue = Number(value)
    setMinQuantity(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= quantityRange[1]) {
      setQuantityRange([numValue, quantityRange[1]])
    }
  }

  const handleMaxQuantityChange = (value: string) => {
    const numValue = Number(value)
    setMaxQuantity(value)
    if (!isNaN(numValue) && numValue >= quantityRange[0]) {
      setQuantityRange([quantityRange[0], numValue])
    }
  }

  const handleMinRatingChange = (value: string) => {
    const numValue = Number(value)
    setMinRating(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= ratingRange[1]) {
      setRatingRange([numValue, ratingRange[1]])
    }
  }

  const handleMaxRatingChange = (value: string) => {
    const numValue = Number(value)
    setMaxRating(value)
    if (!isNaN(numValue) && numValue >= ratingRange[0] && numValue <= 5) {
      setRatingRange([ratingRange[0], numValue])
    }
  }

  const handleMinDeliveryPriceChange = (value: string) => {
    const numValue = Number(value)
    setMinDeliveryPrice(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= deliveryPriceRange[1]) {
      setDeliveryPriceRange([numValue, deliveryPriceRange[1]])
    }
  }

  const handleMaxDeliveryPriceChange = (value: string) => {
    const numValue = Number(value)
    setMaxDeliveryPrice(value)
    if (!isNaN(numValue) && numValue >= deliveryPriceRange[0]) {
      setDeliveryPriceRange([deliveryPriceRange[0], numValue])
    }
  }

  const handleLocationChange = ({ radius, center }: { radius: number; center: any }) => {
    setLocationRadius(Math.round(radius / 1000))
    setLocationCenter(center)
  }

  // Apply filters logic
  const applyFilters = () => {
    const filters: any = {
      categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] > 0 ? priceRange[1] : undefined,
      minQuantity: quantityRange[0] > 0 ? quantityRange[0] : undefined,
      maxQuantity: quantityRange[1] > 0 ? quantityRange[1] : undefined,
      minAvgReview: ratingRange[0] > 0 ? ratingRange[0] : undefined,
      maxAvgReview: ratingRange[1] < 5 ? ratingRange[1] : undefined,
      delivery: deliveryType !== "all" ? deliveryType : undefined,
      minDeliveryPrice: deliveryPriceRange[0] > 0 ? deliveryPriceRange[0] : undefined,
      maxDeliveryPrice: deliveryPriceRange[1] > 0 ? deliveryPriceRange[1] : undefined,
    }

    if (locationCenter) {
      filters.location = locationCenter
      filters.radius = locationRadius
    }

    onApplyFilters(filters)
  }

  // Debounced filter application
  const debouncedApplyFilters = useMemo(
    () => debounce(applyFilters, 300),
    [onApplyFilters]
  )

  // Apply filters in real-time when state changes
  useEffect(() => {
    debouncedApplyFilters()
    return () => debouncedApplyFilters.cancel()
  }, [
    priceRange,
    quantityRange,
    ratingRange,
    deliveryType,
    deliveryPriceRange,
    selectedCategory,
    locationRadius,
    locationCenter,
    debouncedApplyFilters,
  ])

  // Reset filters
  const handleResetFilters = () => {
    setPriceRange([0, 0])
    setMinPrice("0")
    setMaxPrice("0")
    setQuantityRange([0, 0])
    setMinQuantity("0")
    setMaxQuantity("0")
    setRatingRange([0, 5])
    setMinRating("0")
    setMaxRating("5")
    setDeliveryType("all")
    setDeliveryPriceRange([0, 0])
    setMinDeliveryPrice("0")
    setMaxDeliveryPrice("0")
    setSelectedCategory("all")
    setLocationRadius(50)
    setLocationCenter(null)
  }

  return (
    <Card className="mb-0">
      <CardContent className="p-2">
        {/* Product Count and Active Filters */}
        <div className="mb-2">
          <h2 className="text-lg font-semibold">Filter Products</h2>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
        {/* Left Column: Other Filters */}
          <div className="grid grid-cols-2 gap-4 h-auto">
            {/* Price Range */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
               <Banknote className="h-4 w-4" />;
                Price Range
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={minPrice}
                  onChange={(e) => handleMinPriceChange(e.target.value)}
                  min={0}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => handleMaxPriceChange(e.target.value)}
                  min={Number(minPrice) || 0}
                  className="w-20"
                />
              </div>
            </div>

            {/* Stock Quantity */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Box className="h-4 w-4" />
                 Stock Quantity
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={minQuantity}
                  onChange={(e) => handleMinQuantityChange(e.target.value)}
                  min={0}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <Input
                  type="number"
                  value={maxQuantity}
                  onChange={(e) => handleMaxQuantityChange(e.target.value)}
                  min={Number(minQuantity) || 0}
                  className="w-20"
                />
              </div>
            </div>

            {/* Average Rating */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                Average Rating
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Input
                    type="number"
                    value={minRating}
                    onChange={(e) => handleMinRatingChange(e.target.value)}
                    min={0}
                    max={5}
                    step={0.5}
                    className="w-16"
                  />
                  <Star className="h-3 w-3 ml-1 text-yellow-500" />
                </div>
                <span className="text-sm text-muted-foreground">to</span>
                <div className="flex items-center">
                  <Input
                    type="number"
                    value={maxRating}
                    onChange={(e) => handleMaxRatingChange(e.target.value)}
                    min={Number(minRating) || 0}
                    max={5}
                    step={0.5}
                    className="w-16"
                  />
                  <Star className="h-3 w-3 ml-1 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Delivery Type */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Truck className="h-4 w-4" />
                Delivery Type
              </Label>
              <Select value={deliveryType} onValueChange={setDeliveryType}>
                <SelectTrigger className="w-[150px] lg:w-[180px]"> {/* Set fixed width */}
                  <SelectValue placeholder="Select delivery type" />
                </SelectTrigger>
                <SelectContent className="w-[150px] lg:w-[180px]"> {/* Ensure dropdown matches */}
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="FLAT">Flat Rate</SelectItem>
                  <SelectItem value="PERPIECE">Per Piece</SelectItem>
                  <SelectItem value="PERKG">Per Kilogram</SelectItem>
                  <SelectItem value="FREE">Free Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Delivery Price */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
              <Banknote className="h-4 w-4" />;
               Delivery Price
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={minDeliveryPrice}
                  onChange={(e) => handleMinDeliveryPriceChange(e.target.value)}
                  min={0}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <Input
                  type="number"
                  value={maxDeliveryPrice}
                  onChange={(e) => handleMaxDeliveryPriceChange(e.target.value)}
                  min={Number(minDeliveryPrice) || 0}
                  className="w-20"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Category
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px] lg:w-[180px]"> {/* Adjust width if needed */}
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="w-[150px]"> {/* Match width */}
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
          {/* Right Column: Location Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 justify-between">
              <Label htmlFor="useLocation" className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-red-500" />
                Location
              </Label>
              <div className="flex items-center gap-2">
                <Label className="hidden md:block">Distance (km)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={locationRadius}
                    onChange={(e) => setLocationRadius(Number(e.target.value))}
                    min={1}
                    max={1000}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">KM</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="border rounded-md p-4 h-[250px]">
                <DistancePicker
                  onChange={handleLocationChange}
                  defaultRadius={locationRadius * 1000}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}