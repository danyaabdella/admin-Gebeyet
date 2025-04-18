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

export async function fetchProducts(page: number, limit: number, filters: {
  isBanned: boolean | undefined; 
  isDeleted: boolean | undefined; 
  phrase: string | undefined; 
  categoryId: string | undefined; 
  minPrice: number | undefined; 
  maxPrice: number | undefined; 
  minQuantity: number | undefined; 
  maxQuantity: number | undefined; 
  minAvgReview: number | undefined; 
  maxAvgReview: number | undefined; 
  delivery: string | undefined; 
  minDeliveryPrice: number | undefined; 
  maxDeliveryPrice: number | undefined; 
  center: string | undefined; 
  radius: number | undefined;
}) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(filters.isDeleted !== undefined && { isDeleted: filters.isDeleted.toString() }),
    ...(filters.isBanned !== undefined && { isBanned: filters.isBanned.toString() }),
    ...(filters.phrase && { phrase: filters.phrase }),
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
    ...(filters.radius && { radius: filters.radius.toString() }),
  });

  const response = await fetch(`/api/products?${queryParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function banProduct(productId: string, banReason: object) {
  const response = await fetch(`/api/products`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _id: productId, isBanned: true, banReason }),
  });

  if (!response.ok) throw new Error("Failed to ban product");
  return response.json();
}

export async function unbanProduct(productId: string) {
  const response = await fetch(`/api/products`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _id: productId, isBanned: false }),
  });

  if (!response.ok) throw new Error("Failed to unban product");
  return response.json();
}

export async function deleteProduct(productId: string) {
  const response = await fetch(`/api/products?_id=${productId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to permanently delete product");
  return response.json();
}

export async function fetchDashboardStats() {
  try {
    // Fetch data from all APIs concurrently
    const [ordersRes, usersRes, productsRes, categoriesRes, adminsRes] = await Promise.all([
      fetch('/api/order'),
      fetch('/api/manageUsers'),
      fetch('/api/products'),
      fetch('/api/manageCategory'),
      fetch('/api/manageAdmins'),
    ]);

    // Check if responses are OK
    if (!ordersRes.ok || !usersRes.ok || !productsRes.ok || !categoriesRes.ok || !adminsRes.ok) {
      throw new Error('One or more API requests failed');
    }

    // Parse JSON responses
    const ordersData = await ordersRes.json();
    const usersData = await usersRes.json();
    const productsData = await productsRes.json();
    const categoriesData = await categoriesRes.json();
    const adminsData = await adminsRes.json();

    // Handle data with fallback to empty arrays
    const orders = Array.isArray(ordersData.orders) ? ordersData.orders : [];
    // Handle usersData as a flat array since /api/manageUsers returns users directly
    const users = Array.isArray(usersData) ? usersData : [];
    const products = Array.isArray(productsData.products) ? productsData.products : [];
    const categories = Array.isArray(categoriesData) ? categoriesData : [];
    const admins = Array.isArray(adminsData) ? adminsData : [];

    // Date utilities
    const now = new Date();
    const currentMonth = now.getMonth();
    const previousMonth = (currentMonth - 1 + 12) % 12;
    const currentYear = now.getFullYear();

    // Filter items by month for a given date field
    const filterByMonth = (items, field) => ({ current, previous }) => {
      const currentMonthItems = items.filter(item => {
        const date = new Date(item[field]);
        return isNaN(date.getTime())
          ? false
          : date.getMonth() === current && date.getFullYear() === currentYear;
      });

      const previousMonthItems = items.filter(item => {
        const date = new Date(item[field]);
        return isNaN(date.getTime())
          ? false
          : date.getMonth() === previous && date.getFullYear() === currentYear;
      });

      return { currentMonthItems, previousMonthItems };
    };

    // Calculate growth percentage and direction
    const calculateGrowth = (current, previous) => {
      const diff = current - previous;
      const percent = previous === 0 ? (current > 0 ? 100 : 0) : (diff / previous) * 100;
      return {
        isIncrease: diff >= 0,
        percentChange: Math.abs(+percent.toFixed(2)),
      };
    };

    // Transactions calculation
    let totalTransactionAmount = 0;

    orders.forEach((order) => {
      const { paymentStatus, totalPrice } = order;

      // Ensure totalPrice is a valid number
      const price = Number(totalPrice) || 0;

      if (paymentStatus === 'Paid') {
        totalTransactionAmount += price;
      } else if (paymentStatus === 'Refunded') {
        totalTransactionAmount += price * 2; // Double for refunded orders
      } else if (paymentStatus === 'Paid To Merchant') {
        const systemRevenue = price * 0.04; // 4% system revenue
        totalTransactionAmount += price - systemRevenue;
      }
    });

    const totalTransactions = +totalTransactionAmount.toFixed(2);

    const { currentMonthItems: currentTransactions, previousMonthItems: previousTransactions } =
      filterByMonth(orders, 'orderDate')({ current: currentMonth, previous: previousMonth });
    const transactionStats = calculateGrowth(currentTransactions.length, previousTransactions.length);

    // Revenue calculation
    const totalRevenueOrders = orders
      .filter(o => o.paymentStatus === 'Paid To Merchant')
      .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
    const revenue = +(totalRevenueOrders * 0.04).toFixed(2);

    const currentRevenue = currentTransactions
      .filter(o => o.paymentStatus === 'Paid To Merchant')
      .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0) * 0.04;

    const previousRevenue = previousTransactions
      .filter(o => o.paymentStatus === 'Paid To Merchant')
      .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0) * 0.04;

    const revenueStats = calculateGrowth(currentRevenue, previousRevenue);

    // Users calculation
    const filterByRole = (role: string) => {
      return users.filter((user) => user.role === role);
    };

    const customers = filterByRole('customer');
    const merchants = filterByRole('merchant');

    // Adjust pendingMerchantApprovals to handle API's approvalStatus behavior
    const pendingMerchantApprovals = merchants.filter(m => m.approvalStatus === 'pending').length;

    const { currentMonthItems: currentUsers, previousMonthItems: previousUsers } =
      filterByMonth(users, 'createdAt')({ current: currentMonth, previous: previousMonth });
    const { currentMonthItems: currentCustomers, previousMonthItems: previousCustomers } =
      filterByMonth(customers, 'createdAt')({ current: currentMonth, previous: previousMonth });
    const { currentMonthItems: currentMerchants, previousMonthItems: previousMerchants } =
      filterByMonth(merchants, 'createdAt')({ current: currentMonth, previous: previousMonth });

    // Products calculation
    const { currentMonthItems: currentProducts, previousMonthItems: previousProducts } =
      filterByMonth(products, 'createdAt')({ current: currentMonth, previous: previousMonth });

    // Categories calculation
    const { currentMonthItems: currentCategories, previousMonthItems: previousCategories } =
      filterByMonth(categories, 'createdAt')({ current: currentMonth, previous: previousMonth });

    // Return dashboard stats
    return {
      transactions: {
        total: totalTransactions,
        ...transactionStats,
      },
      revenue: {
        total: revenue,
        ...revenueStats,
      },
      merchants: {
        total: merchants.length,
        pendingApproval: pendingMerchantApprovals,
        ...calculateGrowth(currentMerchants.length, previousMerchants.length),
      },
      customers: {
        total: customers.length,
        ...calculateGrowth(currentCustomers.length, previousCustomers.length),
      },
      users: {
        total: users.length,
        ...calculateGrowth(currentUsers.length, previousUsers.length),
      },
      products: {
        total: products.length,
        ...calculateGrowth(currentProducts.length, previousProducts.length),
      },
      orders: {
        total: orders.length,
        pendingRefunds: orders.filter(o => o.paymentStatus === 'Pending Refund').length,
        ...calculateGrowth(currentTransactions.length, previousTransactions.length),
      },
      auctions: {
        total: 10,
        pendingApproval: 2,
        isIncrease: false,
        percentChange: -2, // Demo data, unchanged as requested
      },
      categories: {
        total: categories.length,
        ...calculateGrowth(currentCategories.length, previousCategories.length),
      },
      admins: {
        total: admins.length,
        isIncrease: false,
        percentChange: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", {
      message: error.message,
      stack: error.stack,
    });
    // Return default stats to prevent UI crashes
    return {
      transactions: { total: 0, isIncrease: false, percentChange: 0 },
      revenue: { total: 0, isIncrease: false, percentChange: 0 },
      merchants: { total: 0, pendingApproval: 0, isIncrease: false, percentChange: 0 },
      customers: { total: 0, isIncrease: false, percentChange: 0 },
      users: { total: 0, isIncrease: false, percentChange: 0 },
      products: { total: 0, isIncrease: false, percentChange: 0 },
      orders: { total: 0, pendingRefunds: 0, isIncrease: false, percentChange: 0 },
      auctions: { total: 10, pendingApproval: 2, isIncrease: false, percentChange: -2 },
      categories: { total: 0, isIncrease: false, percentChange: 0 },
      admins: { total: 0, isIncrease: false, percentChange: 0 },
    };
  }
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