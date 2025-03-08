"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategoryTable } from "@/components/categories/category-table"
import { CreateCategoryDialog } from "@/components/categories/create-category-dialog"
import { CategoryPagination } from "@/components/categories/category-pagination"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/toaster"

// Mock data for category creators
const categoryCreators = [
  { id: "all", name: "All Creators" },
  { id: "admin@example.com", name: "Admin User" },
  { id: "moderator@example.com", name: "Moderator User" },
  { id: "editor@example.com", name: "Editor User" },
]

// Mock session data - in a real app, this would come from your auth provider
const mockSession = {
  user: {
    email: "admin@example.com",
    role: "superAdmin", // or "admin" for testing permission differences
  },
}

export function CategoryManagementContent() {
  const [selectedTab, setSelectedTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState<any[]>([])
  const [totalCategories, setTotalCategories] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [selectedCreator, setSelectedCreator] = useState("all")
  const { toast } = useToast()

  // Mock categories data
  const mockCategories = [
    {
      _id: "category_1",
      name: "Electronics",
      description: "Electronic devices and gadgets",
      createdBy: "admin@example.com",
      isDeleted: false,
      trashDate: null,
      createdAt: "2023-10-26T12:00:00.000Z",
    },
    {
      _id: "category_2",
      name: "Clothing",
      description: "Apparel and fashion items",
      createdBy: "moderator@example.com",
      isDeleted: false,
      trashDate: null,
      createdAt: "2023-10-25T12:00:00.000Z",
    },
    {
      _id: "category_3",
      name: "Home & Garden",
      description: "Home decor and gardening supplies",
      createdBy: "admin@example.com",
      isDeleted: false,
      trashDate: null,
      createdAt: "2023-10-24T12:00:00.000Z",
    },
    {
      _id: "category_4",
      name: "Beauty",
      description: "Beauty and personal care products",
      createdBy: "editor@example.com",
      isDeleted: false,
      trashDate: null,
      createdAt: "2023-10-23T12:00:00.000Z",
    },
    {
      _id: "category_5",
      name: "Toys",
      description: "Toys and games for all ages",
      createdBy: "moderator@example.com",
      isDeleted: false,
      trashDate: null,
      createdAt: "2023-10-22T12:00:00.000Z",
    },
    {
      _id: "category_6",
      name: "Sports",
      description: "Sports equipment and accessories",
      createdBy: "admin@example.com",
      isDeleted: false,
      trashDate: null,
      createdAt: "2023-10-21T12:00:00.000Z",
    },
    {
      _id: "category_7",
      name: "Books",
      description: "Books, magazines, and publications",
      createdBy: "editor@example.com",
      isDeleted: false,
      trashDate: null,
      createdAt: "2023-10-20T12:00:00.000Z",
    },
    {
      _id: "category_8",
      name: "Automotive",
      description: "Car parts and accessories",
      createdBy: "admin@example.com",
      isDeleted: false,
      trashDate: null,
      createdAt: "2023-10-19T12:00:00.000Z",
    },
    {
      _id: "category_9",
      name: "Jewelry",
      description: "Jewelry and watches",
      createdBy: "moderator@example.com",
      isDeleted: false,
      trashDate: null,
      createdAt: "2023-10-18T12:00:00.000Z",
    },
    {
      _id: "category_10",
      name: "Health",
      description: "Health and wellness products",
      createdBy: "admin@example.com",
      isDeleted: false,
      trashDate: null,
      createdAt: "2023-10-17T12:00:00.000Z",
    },
    {
      _id: "category_11",
      name: "Pet Supplies",
      description: "Products for pets",
      createdBy: "editor@example.com",
      isDeleted: false,
      trashDate: null,
      createdAt: "2023-10-16T12:00:00.000Z",
    },
    {
      _id: "category_12",
      name: "Office Supplies",
      description: "Office and stationery items",
      createdBy: "admin@example.com",
      isDeleted: false,
      trashDate: null,
      createdAt: "2023-10-15T12:00:00.000Z",
    },
    {
      _id: "category_13",
      name: "Furniture",
      description: "Home and office furniture",
      createdBy: "moderator@example.com",
      isDeleted: true,
      trashDate: "2023-11-01T12:00:00.000Z",
      createdAt: "2023-10-14T12:00:00.000Z",
    },
    {
      _id: "category_14",
      name: "Outdoors",
      description: "Outdoor equipment and gear",
      createdBy: "admin@example.com",
      isDeleted: true,
      trashDate: "2023-11-02T12:00:00.000Z",
      createdAt: "2023-10-13T12:00:00.000Z",
    },
    {
      _id: "category_15",
      name: "Art & Crafts",
      description: "Art supplies and craft materials",
      createdBy: "editor@example.com",
      isDeleted: true,
      trashDate: "2023-11-03T12:00:00.000Z",
      createdAt: "2023-10-12T12:00:00.000Z",
    },
  ]

  // Filter categories based on search, tab, and creator
  const filterCategories = () => {
    return mockCategories.filter((category) => {
      // Filter by active/deleted status
      if (selectedTab === "active" && category.isDeleted) return false
      if (selectedTab === "deleted" && !category.isDeleted) return false

      // Filter by search query
      if (
        searchQuery &&
        !category.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !category.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Filter by creator
      if (selectedCreator !== "all" && category.createdBy !== selectedCreator) {
        return false
      }

      return true
    })
  }

  // Load categories with pagination
  useEffect(() => {
    setIsLoadingData(true)

    // Filter categories
    const filteredCategories = filterCategories()

    // Calculate pagination
    const itemsPerPage = 10
    const totalItems = filteredCategories.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

    setCategories(paginatedCategories)
    setTotalCategories(totalItems)
    setTotalPages(totalPages)
    setIsLoadingData(false)
  }, [currentPage, selectedTab, searchQuery, selectedCreator])

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleTabChange = (value: string) => {
    setSelectedTab(value)
    setCurrentPage(1)
  }

  const handleCreatorChange = (value: string) => {
    setSelectedCreator(value)
    setCurrentPage(1)
  }

  const handleCategoryAction = async (type: string, categoryId: string, data?: any) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      let message = ""
      switch (type) {
        case "delete":
          message = "Category moved to trash"
          break
        case "restore":
          message = "Category restored successfully"
          break
        case "permanent-delete":
          message = "Category permanently deleted"
          break
        case "edit":
          message = "Category updated successfully"
          break
      }

      toast({
        title: "Success",
        description: message,
      })

      // In a real app, you would refresh the category list here
      // For now, we'll simulate it by updating our mock data
      const updatedCategories = [...mockCategories]
      const categoryIndex = updatedCategories.findIndex((cat) => cat._id === categoryId)

      if (categoryIndex !== -1) {
        if (type === "delete") {
          updatedCategories[categoryIndex].isDeleted = true
          updatedCategories[categoryIndex].trashDate = new Date().toISOString()
        } else if (type === "restore") {
          updatedCategories[categoryIndex].isDeleted = false
          updatedCategories[categoryIndex].trashDate = null
        } else if (type === "edit" && data) {
          updatedCategories[categoryIndex] = {
            ...updatedCategories[categoryIndex],
            ...data,
          }
        }
        // For permanent-delete, we would remove it from the array in a real app
      }

      // Refresh the filtered list
      const filteredCategories = filterCategories()
      const itemsPerPage = 10
      const totalItems = filteredCategories.length
      const totalPages = Math.ceil(totalItems / itemsPerPage)
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

      setCategories(paginatedCategories)
      setTotalCategories(totalItems)
      setTotalPages(totalPages)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${type} category. Please try again.`,
      })
    } finally {
      setIsLoading(false)
      setSelectedCategory(null)
    }
  }

  const handleCategoryAdded = async (newCategory: any) => {
    // In a real app, you would add the category to the database
    // For now, we'll simulate it by updating our mock data
    const categoryWithId = {
      ...newCategory,
      _id: `category_${mockCategories.length + 1}`,
      createdBy: mockSession.user.email,
      isDeleted: false,
      trashDate: null,
      createdAt: new Date().toISOString(),
    }

    mockCategories.unshift(categoryWithId)

    // Refresh the filtered list
    const filteredCategories = filterCategories()
    const itemsPerPage = 10
    const totalItems = filteredCategories.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

    setCategories(paginatedCategories)
    setTotalCategories(totalItems)
    setTotalPages(totalPages)

    toast({
      title: "Success",
      description: "Category created successfully",
    })
  }

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Total Categories: {totalCategories}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search categories..."
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

        <div className="flex items-center gap-2">
          <Select value={selectedCreator} onValueChange={handleCreatorChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Creator" />
            </SelectTrigger>
            <SelectContent>
              {categoryCreators.map((creator) => (
                <SelectItem key={creator.id} value={creator.id}>
                  {creator.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Categories</SelectItem>
              <SelectItem value="deleted">Deleted Categories</SelectItem>
            </SelectContent>
          </Select>

          <CreateCategoryDialog onCategoryAdded={handleCategoryAdded} />
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>{selectedTab === "active" ? "All Categories" : "Deleted Categories"}</CardTitle>
          <CardDescription>
            {selectedTab === "active"
              ? "Manage all categories in the marketplace system"
              : "View and restore deleted categories"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <CategoryTable
            categories={categories}
            isLoading={isLoadingData}
            userSession={mockSession}
            onCategoryAction={handleCategoryAction}
            selectedTab={selectedTab}
          />
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <CategoryPagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
      )}

      <Toaster />
    </main>
  )
}

