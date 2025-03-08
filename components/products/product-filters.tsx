"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"
import DistancePicker from "@/components/DistancePicker"

// Update the component props to include onApplyFilters
interface ProductFiltersProps {
  onApplyFilters: (filters: any) => void
}

export function ProductFilters({ onApplyFilters }: ProductFiltersProps) {
  // Price range filter
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("1000")

  // Quantity filters
  const [quantityRange, setQuantityRange] = useState([0, 100])
  const [minQuantity, setMinQuantity] = useState("0")
  const [maxQuantity, setMaxQuantity] = useState("100")

  const [soldQuantityRange, setSoldQuantityRange] = useState([0, 100])
  const [minSoldQuantity, setMinSoldQuantity] = useState("0")
  const [maxSoldQuantity, setMaxSoldQuantity] = useState("100")

  // Review rating filter
  const [ratingRange, setRatingRange] = useState([0, 5])
  const [minRating, setMinRating] = useState("0")
  const [maxRating, setMaxRating] = useState("5")

  // Delivery filters
  const [deliveryType, setDeliveryType] = useState("all")
  const [deliveryPriceRange, setDeliveryPriceRange] = useState([0, 50])
  const [minDeliveryPrice, setMinDeliveryPrice] = useState("0")
  const [maxDeliveryPrice, setMaxDeliveryPrice] = useState("50")

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Location filter
  const [useLocation, setUseLocation] = useState(false)
  const [locationRadius, setLocationRadius] = useState(10)
  const [locationCenter, setLocationCenter] = useState<{ lat: number; lng: number } | null>(null)

  // Categories data (mock)
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "category_1", name: "Electronics" },
    { id: "category_2", name: "Clothing" },
    { id: "category_3", name: "Home & Garden" },
    { id: "category_4", name: "Beauty" },
    { id: "category_5", name: "Toys" },
    { id: "category_6", name: "Sports" },
  ]

  const handleLocationChange = ({ radius, center }: { radius: number; center: any }) => {
    setLocationRadius(Math.round(radius / 1000)) // Convert meters to km
    setLocationCenter(center)
  }

  // Handle input changes and update sliders
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

  const handleMinSoldQuantityChange = (value: string) => {
    const numValue = Number(value)
    setMinSoldQuantity(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= soldQuantityRange[1]) {
      setSoldQuantityRange([numValue, soldQuantityRange[1]])
    }
  }

  const handleMaxSoldQuantityChange = (value: string) => {
    const numValue = Number(value)
    setMaxSoldQuantity(value)
    if (!isNaN(numValue) && numValue >= soldQuantityRange[0]) {
      setSoldQuantityRange([soldQuantityRange[0], numValue])
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

  // Handle slider changes and update inputs
  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values)
    setMinPrice(values[0].toString())
    setMaxPrice(values[1].toString())
  }

  const handleQuantityRangeChange = (values: number[]) => {
    setQuantityRange(values)
    setMinQuantity(values[0].toString())
    setMaxQuantity(values[1].toString())
  }

  const handleSoldQuantityRangeChange = (values: number[]) => {
    setSoldQuantityRange(values)
    setMinSoldQuantity(values[0].toString())
    setMaxSoldQuantity(values[1].toString())
  }

  const handleRatingRangeChange = (values: number[]) => {
    setRatingRange(values)
    setMinRating(values[0].toString())
    setMaxRating(values[1].toString())
  }

  const handleDeliveryPriceRangeChange = (values: number[]) => {
    setDeliveryPriceRange(values)
    setMinDeliveryPrice(values[0].toString())
    setMaxDeliveryPrice(values[1].toString())
  }

  const handleApplyFilters = () => {
    const filters: any = {
      categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
      minQuantity: quantityRange[0] > 0 ? quantityRange[0] : undefined,
      maxQuantity: quantityRange[1] < 100 ? quantityRange[1] : undefined,
      minSoldQuantity: soldQuantityRange[0] > 0 ? soldQuantityRange[0] : undefined,
      maxSoldQuantity: soldQuantityRange[1] < 100 ? soldQuantityRange[1] : undefined,
      minAvgReview: ratingRange[0] > 0 ? ratingRange[0] : undefined,
      maxAvgReview: ratingRange[1] < 5 ? ratingRange[1] : undefined,
      delivery: deliveryType !== "all" ? deliveryType : undefined,
      minDeliveryPrice: deliveryPriceRange[0] > 0 ? deliveryPriceRange[0] : undefined,
      maxDeliveryPrice: deliveryPriceRange[1] < 50 ? deliveryPriceRange[1] : undefined,
    }

    if (useLocation && locationCenter) {
      filters.location = locationCenter
      filters.radius = locationRadius
    }

    onApplyFilters(filters)
  }

  const handleResetFilters = () => {
    setPriceRange([0, 1000])
    setMinPrice("0")
    setMaxPrice("1000")

    setQuantityRange([0, 100])
    setMinQuantity("0")
    setMaxQuantity("100")

    setSoldQuantityRange([0, 100])
    setMinSoldQuantity("0")
    setMaxSoldQuantity("100")

    setRatingRange([0, 5])
    setMinRating("0")
    setMaxRating("5")

    setDeliveryType("all")
    setDeliveryPriceRange([0, 50])
    setMinDeliveryPrice("0")
    setMaxDeliveryPrice("50")

    setSelectedCategory("all")
    setUseLocation(false)
    setLocationRadius(10)
    setLocationCenter(null)

    // Apply the reset filters
    onApplyFilters({})
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Filters</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="pt-4 pb-2">
                  <Slider value={priceRange} max={1000} step={10} onValueChange={handlePriceRangeChange} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-1">$</span>
                    <Input
                      type="number"
                      value={minPrice}
                      onChange={(e) => handleMinPriceChange(e.target.value)}
                      min={0}
                      max={Number(maxPrice)}
                      className="w-20"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">to</span>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-1">$</span>
                    <Input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => handleMaxPriceChange(e.target.value)}
                      min={Number(minPrice)}
                      max={1000}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Type Filter */}
              <div className="space-y-2">
                <Label>Delivery Type</Label>
                <Select value={deliveryType} onValueChange={setDeliveryType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="FLAT">Flat Rate</SelectItem>
                    <SelectItem value="PERPIECE">Per Piece</SelectItem>
                    <SelectItem value="PERKG">Per Kilogram</SelectItem>
                    <SelectItem value="FREE">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Quantity Range Filter */}
              <div className="space-y-2">
                <Label>Quantity in Stock</Label>
                <div className="pt-4 pb-2">
                  <Slider value={quantityRange} max={100} step={1} onValueChange={handleQuantityRangeChange} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Input
                    type="number"
                    value={minQuantity}
                    onChange={(e) => handleMinQuantityChange(e.target.value)}
                    min={0}
                    max={Number(maxQuantity)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">to</span>
                  <Input
                    type="number"
                    value={maxQuantity}
                    onChange={(e) => handleMaxQuantityChange(e.target.value)}
                    min={Number(minQuantity)}
                    max={100}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">units</span>
                </div>
              </div>

              {/* Sold Quantity Range Filter */}
              <div className="space-y-2">
                <Label>Sold Quantity</Label>
                <div className="pt-4 pb-2">
                  <Slider value={soldQuantityRange} max={100} step={1} onValueChange={handleSoldQuantityRangeChange} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Input
                    type="number"
                    value={minSoldQuantity}
                    onChange={(e) => handleMinSoldQuantityChange(e.target.value)}
                    min={0}
                    max={Number(maxSoldQuantity)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">to</span>
                  <Input
                    type="number"
                    value={maxSoldQuantity}
                    onChange={(e) => handleMaxSoldQuantityChange(e.target.value)}
                    min={Number(minSoldQuantity)}
                    max={100}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">units</span>
                </div>
              </div>

              {/* Rating Range Filter */}
              <div className="space-y-2">
                <Label>Average Rating</Label>
                <div className="pt-4 pb-2">
                  <Slider value={ratingRange} max={5} step={0.5} onValueChange={handleRatingRangeChange} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={minRating}
                      onChange={(e) => handleMinRatingChange(e.target.value)}
                      min={0}
                      max={Number(maxRating)}
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
                      min={Number(minRating)}
                      max={5}
                      step={0.5}
                      className="w-16"
                    />
                    <Star className="h-3 w-3 ml-1 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Delivery Price Range Filter */}
              <div className="space-y-2">
                <Label>Delivery Price</Label>
                <div className="pt-4 pb-2">
                  <Slider value={deliveryPriceRange} max={50} step={1} onValueChange={handleDeliveryPriceRangeChange} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-1">$</span>
                    <Input
                      type="number"
                      value={minDeliveryPrice}
                      onChange={(e) => handleMinDeliveryPriceChange(e.target.value)}
                      min={0}
                      max={Number(maxDeliveryPrice)}
                      className="w-16"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">to</span>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-1">$</span>
                    <Input
                      type="number"
                      value={maxDeliveryPrice}
                      onChange={(e) => handleMaxDeliveryPriceChange(e.target.value)}
                      min={Number(minDeliveryPrice)}
                      max={50}
                      className="w-16"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="useLocation"
                checked={useLocation}
                onChange={(e) => setUseLocation(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="useLocation" className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-red-500" />
                Filter by location
              </Label>
            </div>

            {useLocation && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Distance (km)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={locationRadius}
                      onChange={(e) => setLocationRadius(Number(e.target.value))}
                      min={1}
                      max={1000}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">kilometers</span>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <DistancePicker
                    onChange={handleLocationChange}
                    defaultRadius={locationRadius * 1000} // Convert km to meters
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  )
}

