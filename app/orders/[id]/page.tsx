"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Package, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { OrderStatusTimeline } from "@/components/orders/order-status-timeline"
import { RefundDialog } from "@/components/orders/refund-dialogue"
import { fetchOrderById } from "@/utils/api"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true)
      try {
        const data = await fetchOrderById(params.id)
        setOrder(data)
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrder()
  }, [params.id])

  const showRefundButton = order?.paymentStatus === "Pending Refund"

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Dispatched":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Received":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Paid To Merchant":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Pending Refund":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Refunded":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/orders">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[200px] md:col-span-2 lg:col-span-1" />
            <Skeleton className="h-[400px] md:col-span-2" />
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col -mt-10 sm:-mt-0">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold md:text-2xl">Order #{order.transactionRef}</h1>
            <p className="text-sm text-muted-foreground">Placed on {formatDate(order.orderDate)}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {showRefundButton && <RefundDialog orderId={order.id} />}
            <Button variant="outline">Update Status</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Order Status</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
                <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <OrderStatusTimeline status={order.status} />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Transaction Reference: {order.transactionRef}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Product</th>
                        <th className="p-3 text-center font-medium">Quantity</th>
                        <th className="p-3 text-center font-medium">Price</th>
                        <th className="p-3 text-center font-medium">Delivery</th>
                        <th className="p-3 text-right font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((product, index) => (
                        <tr key={product.productId} className={index !== order.products.length - 1 ? "border-b" : ""}>
                          <td className="p-3 text-left">{product.productName}</td>
                          <td className="p-3 text-center">{product.quantity}</td>
                          <td className="p-3 text-center">{formatCurrency(product.price)}</td>
                          <td className="p-3 text-center">
                            {product.delivery === "FREE" ? (
                              <span className="text-green-600">Free</span>
                            ) : (
                              <>
                                {product.delivery}: {formatCurrency(product.deliveryPrice)}
                              </>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {formatCurrency(
                              product.price * product.quantity +
                                (product.delivery === "PERPIECS"
                                  ? product.deliveryPrice * product.quantity
                                  : product.delivery === "FLAT"
                                    ? product.deliveryPrice
                                    : 0),
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t">
                        <td colSpan={4} className="p-3 text-right font-medium">
                          Total
                        </td>
                        <td className="p-3 text-right font-bold">{formatCurrency(order.totalPrice)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{order.customerDetail.customerName}</h3>
                  <p className="text-sm">{order.customerDetail.customerEmail}</p>
                  <p className="text-sm">{order.customerDetail.phoneNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Shipping Address
                  </h4>
                  <p className="text-sm">
                    {order.customerDetail.address.city}, {order.customerDetail.address.state}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Merchant Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{order.merchantDetail.merchantName}</h3>
                  <p className="text-sm">{order.merchantDetail.merchantEmail}</p>
                  <p className="text-sm">{order.merchantDetail.phoneNumber}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Payment Details</h4>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <span className="text-muted-foreground">Account Name:</span>
                    <span>{order.merchantDetail.account_name}</span>
                    <span className="text-muted-foreground">Account Number:</span>
                    <span>{order.merchantDetail.account_number}</span>
                    <span className="text-muted-foreground">Bank Code:</span>
                    <span>{order.merchantDetail.bank_code}</span>
                    {order.merchantDetail.merchantRefernce && (
                      <>
                        <span className="text-muted-foreground">Reference:</span>
                        <span>{order.merchantDetail.merchantRefernce}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
