// Mock data for demonstration
const mockOrders = [
    {
      id: "ord_1",
      transactionRef: "TRX123456",
      customerName: "John Doe",
      merchantName: "Tech Store",
      totalPrice: 299.99,
      status: "Pending",
      paymentStatus: "Paid",
      orderDate: "2023-04-01T12:00:00Z",
    },
    {
      id: "ord_2",
      transactionRef: "TRX789012",
      customerName: "Jane Smith",
      merchantName: "Fashion Outlet",
      totalPrice: 149.5,
      status: "Dispatched",
      paymentStatus: "Paid To Merchant",
      orderDate: "2023-04-02T14:30:00Z",
    },
    {
      id: "ord_3",
      transactionRef: "TRX345678",
      customerName: "Robert Johnson",
      merchantName: "Home Goods",
      totalPrice: 599.99,
      status: "Received",
      paymentStatus: "Paid To Merchant",
      orderDate: "2023-04-03T09:15:00Z",
    },
    {
      id: "ord_4",
      transactionRef: "TRX901234",
      customerName: "Emily Davis",
      merchantName: "Electronics Hub",
      totalPrice: 1299.99,
      status: "Pending",
      paymentStatus: "Pending",
      orderDate: "2023-04-04T16:45:00Z",
    },
    {
      id: "ord_5",
      transactionRef: "TRX567890",
      customerName: "Michael Wilson",
      merchantName: "Sports Gear",
      totalPrice: 199.95,
      status: "Pending",
      paymentStatus: "Refunded",
      orderDate: "2023-04-05T11:20:00Z",
    },
    {
      id: "ord_6",
      transactionRef: "TRX567891",
      customerName: "Michael Wilson",
      merchantName: "Sports Gear",
      totalPrice: 199.95,
      status: "Dispatched",
      paymentStatus: "Pending Refund",
      orderDate: "2023-04-05T11:20:00Z",
    },
    {
      id: "ord_7",
      transactionRef: "TRX567892",
      customerName: "Michael Wilson",
      merchantName: "Sports Gear",
      totalPrice: 199.95,
      status: "Dispatched",
      paymentStatus: "Refunded",
      orderDate: "2023-04-05T11:20:00Z",
    },
    {
      id: "ord_8",
      transactionRef: "TRX567893",
      customerName: "Michael Wilson",
      merchantName: "Sports Gear",
      totalPrice: 199.95,
      status: "Pending",
      paymentStatus: "Pending",
      orderDate: "2023-04-05T11:20:00Z",
    },
    {
      id: "ord_9",
      transactionRef: "TRX567894",
      customerName: "Michael Wilson",
      merchantName: "Sports Gear",
      totalPrice: 199.95,
      status: "Dispatched",
      paymentStatus: "Refunded",
      orderDate: "2023-04-05T11:20:00Z",
    },
  ]
  
  // Mock order detail
  const mockOrderDetail = {
    id: "ord_3",
    transactionRef: "TRX345678",
    customerDetail: {
      customerId: "user_123",
      customerName: "Robert Johnson",
      phoneNumber: "+1 (555) 123-4567",
      customerEmail: "robert@example.com",
      address: {
        state: "California",
        city: "San Francisco",
      },
    },
    merchantDetail: {
      merchantId: "merchant_456",
      merchantName: "Home Goods",
      merchantEmail: "contact@homegoods.com",
      phoneNumber: "+1 (555) 987-6543",
      account_name: "Home Goods Inc.",
      account_number: "9876543210",
      merchantRefernce: "HG-REF-789",
      bank_code: "BANK123",
    },
    products: [
      {
        productId: "prod_1",
        productName: "Modern Coffee Table",
        quantity: 1,
        price: 299.99,
        delivery: "FLAT",
        deliveryPrice: 25.0,
      },
      {
        productId: "prod_2",
        productName: "Decorative Throw Pillows (Set of 4)",
        quantity: 2,
        price: 89.99,
        delivery: "PERPIECS",
        deliveryPrice: 5.0,
      },
      {
        productId: "prod_3",
        productName: "Wall Art Canvas Print",
        quantity: 3,
        price: 49.99,
        delivery: "FREE",
        deliveryPrice: 0.0,
      },
    ],
    totalPrice: 599.99,
    status: "Dispatched",
    paymentStatus: "Pending Refund",
    location: {
      type: "Point",
      coordinates: [37.7749, -122.4194],
    },
    orderDate: "2023-04-03T09:15:00Z",
  }
  
  // Filter interface
  export interface OrderFilters {
    searchTerm?: string
    status?: string
    paymentStatus?: string
    merchantName?: string
    minPrice?: number
    maxPrice?: number
    page?: number
    limit?: number
  }
  
  // API functions
  export async function fetchOrders(filters: OrderFilters = {}) {
    // In a real implementation, this would be an API call with filters
    console.log("Fetching orders with filters:", filters)
  
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    // Filter the mock data based on the provided filters
    let filteredOrders = [...mockOrders]
  
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.transactionRef.toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower) ||
          order.merchantName.toLowerCase().includes(searchLower),
      )
    }
  
    if (filters.status && filters.status !== "all-statuses") {
      filteredOrders = filteredOrders.filter((order) => order.status === filters.status)
    }
  
    if (filters.paymentStatus && filters.paymentStatus !== "all-payment-statuses") {
      filteredOrders = filteredOrders.filter((order) => order.paymentStatus === filters.paymentStatus)
    }
  
    if (filters.merchantName && filters.merchantName !== "all-merchants") {
      filteredOrders = filteredOrders.filter((order) => order.merchantName === filters.merchantName)
    }
  
    if (filters.minPrice !== undefined) {
      filteredOrders = filteredOrders.filter((order) => order.totalPrice >= filters.minPrice)
    }
  
    if (filters.maxPrice !== undefined) {
      filteredOrders = filteredOrders.filter((order) => order.totalPrice <= filters.maxPrice)
    }
  
    return {
      orders: filteredOrders,
      total: filteredOrders.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
      totalPages: Math.ceil(filteredOrders.length / (filters.limit || 10)),
    }
  }

  export async function fetchOrderById(id: string) {
    // In a real implementation, this would be an API call to get a specific order
    console.log("Fetching order with ID:", id)
  
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    // For demo purposes, always return the mock order detail
    return { ...mockOrderDetail, id }
  }
  
  export async function processRefund(orderId: string, reason: string) {
    // In a real implementation, this would be an API call to process a refund
    console.log("Processing refund for order:", orderId, "with reason:", reason)
  
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
  
    // Return success for demo
    return { success: true, message: "Refund processed successfully" }
  }
  
  export async function updateOrderStatus(orderId: string, status: string) {
    // In a real implementation, this would be an API call to update order status
    console.log("Updating order status:", orderId, "to", status)
  
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))
  
    // Return success for demo
    return { success: true, message: `Order status updated to ${status}` }
  }
  