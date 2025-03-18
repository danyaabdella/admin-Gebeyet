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

export function ProductFilters({ onApplyFilters, productCount }: ProductFiltersProps) {
  // State for filters
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
  ];
  
  const deliveryTypes = [
    { id: "all", name: "All Types" },
    { id: "flat", name: "Flat Rate" },
    { id: "perPiece", name: "Per Piece" },
    { id: "perKg", name: "Per Kilogram" },
    { id: "free", name: "Free Shipping" },
  ];
  

  // Debounced filter application
  const debouncedApplyFilters = useMemo(
    () => debounce(() => {
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
        location: locationCenter ? locationCenter : undefined,
        radius: locationCenter ? locationRadius : undefined
      }
      onApplyFilters(filters)
    }, 300),
    [priceRange, quantityRange, ratingRange, deliveryType, deliveryPriceRange, selectedCategory, locationRadius, locationCenter, onApplyFilters]
  )

  useEffect(() => {
    debouncedApplyFilters()
    return () => debouncedApplyFilters.cancel()
  }, [debouncedApplyFilters])

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

  const handleLocationChange = ({ radius, center }: { radius: number; center: any }) => {
    setLocationRadius(Math.round(radius / 1000))
    setLocationCenter(center)
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Filter Products</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Side - Filters */}
          <div className="space-y-4">
            {/* Price */}
            <div>
              <Label>Price Range</Label>
              <div className="flex gap-2">
                <Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" />
                <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <Label>Stock Quantity</Label>
              <div className="flex gap-2">
                <Input type="number" value={minQuantity} onChange={(e) => setMinQuantity(e.target.value)} placeholder="Min" />
                <Input type="number" value={maxQuantity} onChange={(e) => setMaxQuantity(e.target.value)} placeholder="Max" />
              </div>
            </div>

            {/* Rating */}
            <div>
              <Label>Average Rating</Label>
              <div className="flex gap-2">
                <Input type="number" value={minRating} onChange={(e) => setMinRating(e.target.value)} placeholder="Min" />
                <Input type="number" value={maxRating} onChange={(e) => setMaxRating(e.target.value)} placeholder="Max" />
              </div>
            </div>

            {/* Category */}
            <div className="gap-2 flex flex-row">
              {/* Category Dropdown */}
              <div className="flex-1">
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

              {/* Delivery Type Dropdown */}
              <div className="flex-1">
                <Label>Delivery Type</Label>
                <Select value={deliveryType} onValueChange={setDeliveryType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery type" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryTypes.map((delivery) => (
                      <SelectItem key={delivery.id} value={delivery.id}>
                        {delivery.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reset Button */}
            <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
          </div>

          {/* Right Side - Map */}
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

            <div className="border rounded-md p-2">
              <DistancePicker
                  onChange={handleLocationChange}
                  defaultRadius={locationRadius * 1000}
                />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
