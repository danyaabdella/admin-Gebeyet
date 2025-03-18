"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter, CheckCircle, XCircle, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { ProductDetailsDialog } from "@/components/products/product-details-dialog"
import { ProductFilters } from "@/components/products/product-filters"
import { PaginationControls } from "@/components/auctions/pagination-controls"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/toaster"
import { AddProductDialog } from "@/components/products/add-product-dialog"
import {
  fetchProducts,
  banProduct,
  unbanProduct,
  deleteProduct,
  restoreProduct,
  permanentDeleteProduct,
} from "@/lib/data-fetching"
import debounce from "lodash.debounce"

export default function ProductsPageClient() {
  const [selectedTab, setSelectedTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [filters, setFilters] = useState({
    isDeleted: false,
    phrase: "",
  })
  const { toast } = useToast()

  // Debounced search handler to prevent excessive API calls
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setFilters((prev) => ({ ...prev, phrase: query }))
      setCurrentPage(1)
    }, 300),
    []
  )

  // Fetch products when filters, pagination, tab, or search query changes
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingData(true)
      try {
        const response = await fetchProducts(currentPage, 15, {
          ...filters,
          isDeleted: selectedTab === "deleted",
          phrase: searchQuery,
        })
        setProducts(response.products)
        setTotalProducts(response.total)
        setTotalPages(response.pagination.totalPages)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load products. Please try again.",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    loadProducts()
  }, [currentPage, filters, selectedTab, searchQuery, toast])

  // Handle search input change with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    debouncedSearch(e.target.value)
  }

  // Handle tab change and trigger fetch
  const handleTabChange = (value: string) => {
    setSelectedTab(value)
    setCurrentPage(1)
    setFilters((prev) => ({ ...prev, isDeleted: value === "deleted" }))
  }

  // Handle filter application and trigger fetch
  const handleApplyFilters = (newFilters: any) => {
    setCurrentPage(1)
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  // Handle product actions (ban, unban, delete, etc.)
  const handleProductAction = async (type: string, productId: string) => {
    setIsLoading(true)
    try {
      let response
      switch (type) {
        case "ban":
          response = await banProduct(productId)
          break
        case "unban":
          response = await unbanProduct(productId)
          break
        case "delete":
          response = await deleteProduct(productId)
          break
        case "restore":
          response = await restoreProduct(productId)
          break
        case "permanent-delete":
          response = await permanentDeleteProduct(productId)
          break
        default:
          throw new Error("Invalid action type")
      }

      toast({
        title: "Success",
        description: response.message,
      })

      // Refresh product list after action
      const updatedResponse = await fetchProducts(currentPage, 15, {
        ...filters,
        isDeleted: selectedTab === "deleted",
        phrase: searchQuery,
      })
      setProducts(updatedResponse.products)
      setTotalProducts(updatedResponse.total)
      setTotalPages(updatedResponse.pagination.totalPages)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${type} product. Please try again.`,
      })
    } finally {
      setIsLoading(false)
      setSelectedProduct(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />
      <div className="flex-1 md:ml-[calc(var(--sidebar-width)-40px)] md:-mt-12 -mt-8">
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 md:gap-6">
            <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Product Management
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm md:text-base text-muted-foreground">
                <span className="hidden md:inline">Total </span>Products: 
                <span className="font-medium text-gray-800 dark:text-gray-200"> {totalProducts}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 px-3 py-1.5 text-sm md:text-base"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 md:h-5 md:w-5" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>
          <div className="flex gap-4 flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select defaultValue="active" value={selectedTab} onValueChange={handleTabChange}>
                <SelectTrigger className="w-[140px] md:w-[180px]">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active Products</SelectItem>
                  <SelectItem value="banned">Banned Products</SelectItem>
                  <SelectItem value="deleted">Deleted Products</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showFilters && (
            <ProductFilters 
              onApplyFilters={handleApplyFilters} 
              productCount={totalProducts} 
            />
          )}

          <Card className="-ml-5 md:ml-0 -mr-4 md:mr-0 overflow-x-hidden">
            <CardHeader className="p-4 text-sm md:text-base lg:text-lg">
             <CardTitle>
                {selectedTab === "active" 
                  ? "All Products" 
                  : selectedTab === "banned" 
                  ? "Banned Products" 
                  : "Deleted Products (Trash)"}
              </CardTitle>
              <CardDescription className="hidden md:block">
                {selectedTab === "active"
                  ? "Manage all active products in the marketplace system"
                  : selectedTab === "banned"
                  ? "View and manage banned products"
                  : "View and restore products moved to the trash"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="hidden md:table-cell">Merchant</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Stock</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingData ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Loading products...
                        </TableCell>
                      </TableRow>
                    ) : products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow
                          key={product._id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <TableCell className="font-medium">{product.productName}</TableCell>
                          <TableCell className="hidden md:table-cell">{product.category.categoryName}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell className="hidden md:table-cell">{product.merchantDetail.merchantName}</TableCell>
                          <TableCell>
                            {selectedTab === "deleted" ? (
                              <span className="flex items-center text-gray-500">
                                <Trash2 className="mr-1 h-4 w-4" /> Deleted
                              </span>
                            ) : product.isBanned ? (
                              <span className="flex items-center text-red-500">
                                <XCircle className="mr-1 h-4 w-4" /> Banned
                              </span>
                            ) : (
                              <span className="flex items-center text-green-500">
                                <CheckCircle className="mr-1 h-4 w-4" /> Active
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {product.quantity} ({product.soldQuantity} sold)
                          </TableCell>
                          <TableCell>
                            {product.avgRating > 0 ? (
                              <div className="flex items-center">
                                {product.avgRating}
                                <span className="text-yellow-500 ml-1">★</span>
                                <span className="text-xs text-muted-foreground ml-1">({product.review.length})</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No ratings</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <PaginationControls totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
          )}
        </main>
      </div>

      {selectedProduct && (
        <ProductDetailsDialog
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
          onAction={handleProductAction}
          isLoading={isLoading}
        />
      )}
      <Toaster />
    </div>
  )
}