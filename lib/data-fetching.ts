// This file contains functions for fetching data from the API
// Currently using mock data, but can be replaced with actual API calls

// Mock user data

type Filters = {
  page?: number;
  limit?: number;
};

const mockUsers = Array.from({ length: 50 }, (_, i) => ({
  _id: `user_${i + 1}`,
  fullName: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? "merchant" : "customer",
  isBanned: i % 10 === 0,
  isEmailVerified: i % 5 !== 0,
  isMerchant: i % 3 === 0,
  isApproved: i % 3 === 0 && i % 2 === 0,
  approvedBy: i % 3 === 0 && i % 2 === 0 ? "Admin User" : null,
  phoneNumber: `+1234567${i.toString().padStart(4, "0")}`,
  stateName: "State " + ((i % 5) + 1),
  cityName: "City " + ((i % 10) + 1),
  tinNumber: i % 3 === 0 ? `TIN${i.toString().padStart(6, "0")}` : null,
  nationalId: i % 3 === 0 ? `ID${i.toString().padStart(8, "0")}` : null,
  account_name: i % 3 === 0 ? `Account ${i + 1}` : null,
  account_number: i % 3 === 0 ? `${Math.floor(Math.random() * 10000000000)}` : null,
  bank_code: i % 3 === 0 ? `BANK${(i % 5) + 1}` : null,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
  isDeleted: false,
  trashDate: null,
}))

// Mock deleted users
const mockTrashUsers = Array.from({ length: 20 }, (_, i) => ({
  _id: `trash_user_${i + 1}`,
  fullName: `Deleted User ${i + 1}`,
  email: `deleted${i + 1}@example.com`,
  role: i % 3 === 0 ? "merchant" : "customer",
  isBanned: i % 5 === 0,
  isEmailVerified: i % 2 === 0,
  isMerchant: i % 3 === 0,
  isApproved: i % 3 === 0 && i % 2 === 0,
  approvedBy: i % 3 === 0 && i % 2 === 0 ? "Admin User" : null,
  phoneNumber: `+1234567${i.toString().padStart(4, "0")}`,
  stateName: "State " + ((i % 5) + 1),
  cityName: "City " + ((i % 10) + 1),
  tinNumber: i % 3 === 0 ? `TIN${i.toString().padStart(6, "0")}` : null,
  nationalId: i % 3 === 0 ? `ID${i.toString().padStart(8, "0")}` : null,
  account_name: i % 3 === 0 ? `Account ${i + 1}` : null,
  account_number: i % 3 === 0 ? `${Math.floor(Math.random() * 10000000000)}` : null,
  bank_code: i % 3 === 0 ? `BANK${(i % 5) + 1}` : null,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
  isDeleted: true,
  trashDate: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
}))

// Mock auctions data
const mockAuctions = Array.from({ length: 50 }, (_, i) => ({
  _id: `auction_${i + 1}`,
  productId: `product_${i + 1}`,
  productName: `Product ${i + 1}`,
  merchantName: `Merchant ${(i % 5) + 1}`,
  merchantId: `merchant_${(i % 5) + 1}`,
  description: `This is a description for auction ${i + 1}. It includes details about the product condition and other relevant information.`,
  condition: i % 2 === 0 ? "new" : "used",
  startTime: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  endTime: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toISOString(),
  itemImg: [
    `/placeholder.svg?height=200&width=200&text=Image+${i + 1}`,
    `/placeholder.svg?height=200&width=200&text=Image+${i + 2}`,
  ],
  startingPrice: Number.parseFloat((Math.random() * 1000).toFixed(2)),
  reservedPrice: Number.parseFloat((Math.random() * 2000).toFixed(2)),
  bidIncrement: Number.parseFloat((Math.random() * 50).toFixed(2)),
  status:
    i % 5 === 0 ? "requested" : i % 5 === 1 ? "active" : i % 5 === 2 ? "ended" : i % 5 === 3 ? "cancelled" : "rejected",
  currentBid: Number.parseFloat((Math.random() * 1500).toFixed(2)),
  bidCount: Math.floor(Math.random() * 20),
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
}))

// Mock admin data
const mockAdmins = Array.from({ length: 12 }, (_, i) => ({
  _id: `admin_${i + 1}`,
  fullname: `Admin ${i + 1}`,
  email: `admin${i + 1}@example.com`,
  phone: `+1555123${i.toString().padStart(3, "0")}`,
  role: "admin",
  isBanned: i % 5 === 0,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
  isDeleted: false,
  trashDate: null,
}))

// Mock deleted admins
const mockTrashAdmins = Array.from({ length: 5 }, (_, i) => ({
  _id: `trash_admin_${i + 1}`,
  fullname: `Deleted Admin ${i + 1}`,
  email: `deleted_admin${i + 1}@example.com`,
  phone: `+1555123${(i + 10).toString().padStart(3, "0")}`,
  role: "admin",
  isBanned: i % 2 === 0,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
  isDeleted: true,
  trashDate: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
}))

// Mock products data
const mockProducts = Array.from({ length: 100 }, (_, i) => ({
  _id: `product_${i + 1}`,
  merchantDetail: {
    merchantId: `merchant_${(i % 5) + 1}`,
    merchantName: `Merchant ${(i % 5) + 1}`,
    merchantEmail: `merchant${(i % 5) + 1}@example.com`,
  },
  productName: `Product ${i + 1}`,
  category: {
    categoryId: `category_${(i % 6) + 1}`,
    categoryName: ["Electronics", "Clothing", "Home & Garden", "Beauty", "Toys", "Sports"][i % 6],
  },
  price: Number.parseFloat((Math.random() * 1000 + 10).toFixed(2)),
  quantity: Math.floor(Math.random() * 100) + 5,
  soldQuantity: Math.floor(Math.random() * 50),
  description: `This is a detailed description for Product ${i + 1}. It includes information about the product features, specifications, and usage.`,
  images: Array.from(
    { length: Math.floor(Math.random() * 4) + 1 },
    (_, j) => `/placeholder.svg?height=200&width=200&text=Product+${i + 1}+Image+${j + 1}`,
  ),
  variant: i % 3 === 0 ? ["Red", "Blue", "Green"] : i % 3 === 1 ? ["Black", "White"] : [],
  size: i % 4 === 0 ? ["S", "M", "L", "XL"] : i % 4 === 1 ? ["One Size"] : [],
  brand: i % 3 === 0 ? "Brand A" : i % 3 === 1 ? "Brand B" : "Hand Made",
  location: {
    type: "Point",
    coordinates: [-73.9857 + (Math.random() * 10 - 5), 40.7484 + (Math.random() * 10 - 5)],
  },
  review: Array.from({ length: Math.floor(Math.random() * 5) }, (_, j) => ({
    customerId: `customer_${j + 1}`,
    comment: `Great product! Review ${j + 1}`,
    rating: Math.floor(Math.random() * 5) + 1,
    createdDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  })),
  delivery: ["FLAT", "PERPIECE", "PERKG", "FREE"][Math.floor(Math.random() * 4)],
  deliveryPrice: ["FREE"].includes(["FLAT", "PERPIECE", "PERKG", "FREE"][Math.floor(Math.random() * 4)])
    ? 0
    : Number.parseFloat((Math.random() * 20).toFixed(2)),
  isBanned: i % 10 === 0,
  isDeleted: i >= 80, // Make some products deleted
  trashDate: i >= 80 ? new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString() : null,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
}))

// Calculate average rating for each product
mockProducts.forEach((product) => {
  if (product.review && product.review.length > 0) {
    const totalRating = product.review.reduce((sum, review) => sum + review.rating, 0)
    product.avgRating = Number((totalRating / product.review.length).toFixed(1))
  } else {
    product.avgRating = 0
  }
})

// Filter users based on search and filters
function filterUsers(users: any[], filters: any = {}) {
  return users.filter((user) => {
    // Search filter
    if (
      filters.search &&
      !user.fullName.toLowerCase().includes(filters.search.toLowerCase()) &&
      !user.email.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }

    // Role filter
    if (filters.role && filters.role !== "all" && user.role !== filters.role) {
      return false
    }

    // Status filters
    if (filters.isEmailVerified !== undefined && user.isEmailVerified !== filters.isEmailVerified) {
      return false
    }

    if (filters.isBanned !== undefined && user.isBanned !== filters.isBanned) {
      return false
    }

    return true
  })
}

// Filter auctions based on search and filters
function filterAuctions(auctions: any[], filters: any = {}) {
  return auctions.filter((auction) => {
    // Search filter
    if (
      filters.search &&
      !auction.productName.toLowerCase().includes(filters.search.toLowerCase()) &&
      !auction.merchantName.toLowerCase().includes(filters.search.toLowerCase()) &&
      !auction.description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }

    // Status filter
    if (filters.status && filters.status !== "all" && auction.status !== filters.status) {
      return false
    }

    // Price range filter
    if (filters.minPrice !== undefined && auction.startingPrice < filters.minPrice) {
      return false
    }

    if (filters.maxPrice !== undefined && auction.startingPrice > filters.maxPrice) {
      return false
    }

    // Date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate)
      const auctionStartTime = new Date(auction.startTime)
      if (auctionStartTime < startDate) {
        return false
      }
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate)
      const auctionEndTime = new Date(auction.endTime)
      if (auctionEndTime > endDate) {
        return false
      }
    }

    // Condition filter
    if (filters.condition && auction.condition !== filters.condition) {
      return false
    }

    return true
  })
}

// Filter admins based on search and filters
function filterAdmins(admins: any[], filters: any = {}) {
  return admins.filter((admin) => {
    // Search filter
    if (
      filters.search &&
      !admin.fullname.toLowerCase().includes(filters.search.toLowerCase()) &&
      !admin.email.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }

    // Status filter
    if (filters.status && filters.status !== "all" && admin.isBanned !== (filters.status === "banned")) {
      return false
    }

    // Deleted filter
    if (filters.isDeleted !== undefined && admin.isDeleted !== filters.isDeleted) {
      return false
    }

    return true
  })
}

// Filter products based on search and filters
function filterProducts(products: any[], filters: any = {}) {
  return products.filter((product) => {
    // Text search filter
    if (
      filters.phrase &&
      !product.productName.toLowerCase().includes(filters.phrase.toLowerCase()) &&
      !product.description.toLowerCase().includes(filters.phrase.toLowerCase())
    ) {
      return false
    }

    // Category filter
    if (filters.categoryId && filters.categoryId !== "all" && product.category.categoryId !== filters.categoryId) {
      return false
    }

    // Price range filter
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false
    }
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false
    }

    // Quantity range filter
    if (filters.minQuantity !== undefined && product.quantity < filters.minQuantity) {
      return false
    }
    if (filters.maxQuantity !== undefined && product.quantity > filters.maxQuantity) {
      return false
    }

    // Sold quantity range filter
    if (filters.minSoldQuantity !== undefined && product.soldQuantity < filters.minSoldQuantity) {
      return false
    }
    if (filters.maxSoldQuantity !== undefined && product.soldQuantity > filters.maxSoldQuantity) {
      return false
    }

    // Average review rating filter
    if (filters.minAvgReview !== undefined && product.avgRating < filters.minAvgReview) {
      return false
    }
    if (filters.maxAvgReview !== undefined && product.avgRating > filters.maxAvgReview) {
      return false
    }

    // Delivery type filter
    if (filters.delivery && filters.delivery !== "all" && product.delivery !== filters.delivery) {
      return false
    }

    // Delivery price range filter
    if (filters.minDeliveryPrice !== undefined && product.deliveryPrice < filters.minDeliveryPrice) {
      return false
    }
    if (filters.maxDeliveryPrice !== undefined && product.deliveryPrice > filters.maxDeliveryPrice) {
      return false
    }

    // Location filter
    if (filters.location && filters.radius) {
      // In a real app, you would calculate the distance between the product location and the filter location
      // and check if it's within the radius
      // This is a simplified version
      const productLat = product.location.coordinates[1]
      const productLng = product.location.coordinates[0]
      const filterLat = filters.location.lat
      const filterLng = filters.location.lng

      // Simple distance calculation (not accurate for long distances)
      const distance = Math.sqrt(Math.pow(productLat - filterLat, 2) + Math.pow(productLng - filterLng, 2)) * 111 // Rough conversion to kilometers

      if (distance > filters.radius) {
        return false
      }
    }

    // Status filters
    if (filters.isBanned !== undefined && product.isBanned !== filters.isBanned) {
      return false
    }

    if (filters.isDeleted !== undefined && product.isDeleted !== filters.isDeleted) {
      return false
    }

    return true
  })
}

// Paginate results
function paginateResults(items: any[], page: number, limit: number) {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return {
    items: items.slice(startIndex, endIndex),
    pagination: {
      total: items.length,
      page,
      limit,
      totalPages: Math.ceil(items.length / limit),
    },
  }
}

// Fetch users with pagination and filters
export async function fetchUsers(page = 1, limit = 15, filters = {}) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const filteredUsers = filterUsers(mockUsers, filters)
  const { items, pagination } = paginateResults(filteredUsers, page, limit)

  return {
    users: items,
    pagination,
  }
}

// Fetch deleted users with pagination
export async function fetchDeletedUsers(page = 1, limit = 15) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const { items, pagination } = paginateResults(mockTrashUsers, page, limit)

  return {
    users: items,
    pagination,
  }
}

const isTrashView = false // Declare isTrashView variable

// Fetch admins with pagination and filters
export async function fetchAdmins(filters = {}) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const filteredAdmins = filterAdmins(isTrashView ? mockTrashAdmins : mockAdmins, filters)
  const { items, pagination } = paginateResults(filteredAdmins, filters?.page || 1, filters?.limit || 15)

  return {
    admins: items,
    total: filteredAdmins.length,
    pagination,
  }
}

// Fetch auctions with pagination and filters
export async function fetchAuctions(page = 1, limit = 15, filters = {}) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const filteredAuctions = filterAuctions(mockAuctions, filters)
  const { items, pagination } = paginateResults(filteredAuctions, page, limit)

  return {
    auctions: items,
    pagination,
    total: filteredAuctions.length,
  }
}

// Auction actions
export async function approveAuction(auctionId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    success: true,
    message: "Auction approved successfully",
  }
}

export async function rejectAuction(auctionId: string, reason: string, category: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    success: true,
    message: "Auction rejected successfully",
  }
}

// User actions
export async function verifyUser(userId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    message: "User verified successfully",
  }
}

export async function banUser(userId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    message: "User banned successfully",
  }
}

export async function unbanUser(userId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    message: "User unbanned successfully",
  }
}

export async function deleteUser(userId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    message: "User deleted successfully",
  }
}

export async function restoreUser(userId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    message: "User restored successfully",
  }
}

export async function permanentlyDeleteUser(userId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    message: "User permanently deleted",
  }
}

// Product actions
// @/lib/data-fetching.ts

// @/lib/data-fetching.ts
export async function fetchProducts(page: number, limit: number, filters: { isDeleted: any; phrase: any; categoryId: any; minPrice: any; maxPrice: any; minQuantity: any; maxQuantity: any; minAvgReview: any; maxAvgReview: any; delivery: any; minDeliveryPrice: any; maxDeliveryPrice: any; center: any; radius: any; }) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    isDeleted: filters.isDeleted.toString(),
    phrase: filters.phrase || "",
    ...(filters.categoryId && { categoryId: filters.categoryId }),
    ...(filters.minPrice && { minPrice: filters.minPrice.toString() }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice.toString() }),
    ...(filters.minQuantity && { minQuantity: filters.minQuantity.toString() }),
    ...(filters.maxQuantity && { maxQuantity: filters.maxQuantity.toString() }),
    ...(filters.minAvgReview && { minAvgReview: filters.minAvgReview.toString() }),
    ...(filters.maxAvgReview && { maxAvgReview: filters.maxAvgReview.toString() }),
    ...(filters.delivery && { delivery: filters.delivery }),
    ...(filters.minDeliveryPrice && { minDeliveryPrice: filters.minDeliveryPrice.toString() }),
    ...(filters.maxDeliveryPrice && { maxDeliveryPrice: filters.maxDeliveryPrice.toString() }),
    ...(filters.center && { center: filters.center }),
    radius: filters.radius.toString(), // Always included
  });

  const response = await fetch(`/api/products?${queryParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

// Other functions (banProduct, unbanProduct, etc.) remain unchanged

export async function banProduct(productId: string) {
  const response = await fetch(`/api/products`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _id: productId, isBanned: true }),
  });

  if (!response.ok) throw new Error("Failed to ban product");
  return response.json();
}

export async function unbanProduct(productId: string) {
  const response = await fetch(`/api/products`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _id: productId, isBanned: false }),
  });

  if (!response.ok) throw new Error("Failed to unban product");
  return response.json();
}

export async function deleteProduct(productId: string) {
  const response = await fetch(`/api/products`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _id: productId, isDeleted: true }),
  });

  if (!response.ok) throw new Error("Failed to delete product");
  return response.json();
}

export async function restoreProduct(productId: string) {
  const response = await fetch(`/api/products`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _id: productId, isDeleted: false }),
  });

  if (!response.ok) throw new Error("Failed to restore product");
  return response.json();
}

export async function permanentDeleteProduct(productId: string) {
  const response = await fetch(`/api/products?_id=${productId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to permanently delete product");
  return response.json();
}

// Admin actions
export async function createAdmin(adminData: any) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { success: true, message: "Admin created successfully" }
}

export async function banAdmin(adminId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { success: true, message: "Admin banned successfully" }
}

export async function unbanAdmin(adminId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { success: true, message: "Admin unbanned successfully" }
}

export async function deleteAdmin(adminId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { success: true, message: "Admin deleted successfully" }
}

export async function restoreAdmin(adminId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { success: true, message: "Admin restored successfully" }
}

export async function permanentDeleteAdmin(adminId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { success: true, message: "Admin permanently deleted" }
}

// Mock dashboard stats
export async function fetchDashboardStats() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    transactions: {
      total: 1234,
      isIncrease: true,
      percentChange: 12.5,
    },
    revenue: {
      total: 25000,
      isIncrease: false,
      percentChange: -5,
    },
    merchants: {
      total: 573,
      isIncrease: true,
      percentChange: 8,
      pendingApproval: 2,
    },
    customers: {
      total: 2834,
      isIncrease: true,
      percentChange: 15,
    },
    users: {
      total: 3407,
      isIncrease: true,
      percentChange: 10,
    },
    products: {
      total: 12234,
      isIncrease: true,
      percentChange: 20,
    },
    orders: {
      total: 1500,
      isIncrease: true,
      percentChange: 10,
      pendingRefunds: 5,
    },
    auctions: {
      total: 342,
      isIncrease: false,
      percentChange: -2,
    },
    categories: {
      total: 48,
      isIncrease: false,
      percentChange: 0,
    },
    admins: {
      total: 12,
      isIncrease: false,
      percentChange: 0,
    },
  }
}

// Mock top products
export async function fetchTopProducts() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { name: "Product A", category: "Electronics", revenue: 5000 },
    { name: "Product B", category: "Clothing", revenue: 4500 },
    { name: "Product C", category: "Home & Garden", revenue: 4000 },
    { name: "Product D", category: "Beauty", revenue: 3500 },
    { name: "Product E", category: "Toys", revenue: 3000 },
  ]
}

// Mock transaction distribution data
export async function fetchTransactionDistributionData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { label: "Credit Card", value: 15000, color: "rgba(59, 130, 246, 0.7)" },
    { label: "Debit Card", value: 10000, color: "rgba(16, 185, 129, 0.7)" },
    { label: "PayPal", value: 5000, color: "rgba(249, 115, 22, 0.7)" },
  ]
}

// Mock revenue distribution data
export async function fetchRevenueDistributionData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { label: "Sales", value: 20000, color: "rgba(59, 130, 246, 0.7)" },
    { label: "Auctions", value: 5000, color: "rgba(16, 185, 129, 0.7)" },
  ]
}

// Mock category revenue data
export async function fetchCategoryRevenueData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { label: "Electronics", value: 8000, color: "rgba(59, 130, 246, 0.7)" },
    { label: "Clothing", value: 6000, color: "rgba(16, 185, 129, 0.7)" },
    { label: "Home & Garden", value: 4000, color: "rgba(249, 115, 22, 0.7)" },
    { label: "Beauty", value: 3000, color: "rgba(255, 159, 64, 0.7)" },
    { label: "Toys", value: 2000, color: "rgba(153, 102, 255, 0.7)" },
  ]
}

// Mock report generation
export async function generateReport(period: string, format: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock download URL - replace with actual URL in a real app
  const downloadUrl = `/reports/${period}-${format}.${format}`

  return {
    success: true,
    downloadUrl,
  }
}

// Update the verifyOtp function to be more lenient for testing
export async function verifyOtp(email: string, otp: string, purpose: "login" | "reset-password") {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock OTP verification - in a real app, this would validate the OTP
  // For testing purposes, accept any 6-digit code
  if (otp && otp.length === 6 && /^\d{6}$/.test(otp)) {
    return {
      success: true,
      message: purpose === "login" ? "Login successful" : "OTP verified successfully",
      token: "mock_jwt_token_" + Math.random().toString(36).substring(2),
    }
  }

  return {
    success: false,
    message: "Invalid OTP code",
  }
}

// Update the requestPasswordReset function to be more realistic
export async function requestPasswordReset(email: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock password reset request - accept any valid email format
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: true,
      message: "OTP sent to your email",
      resetToken: "mock_reset_token_" + Math.random().toString(36).substring(2),
    }
  }

  return {
    success: false,
    message: "Email not found or invalid format",
  }
}

export async function resendOtp(email: string, purpose: "login" | "reset-password") {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock resend OTP
  if (email) {
    return {
      success: true,
      message: "OTP resent successfully",
    }
  }

  return {
    success: false,
    message: "Failed to resend OTP",
  }
}

export async function resetPassword(email: string, newPassword: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock password reset
  if (email && newPassword) {
    return {
      success: true,
      message: "Password reset successfully",
    }
  }

  return {
    success: false,
    message: "Failed to reset password",
  }
}

