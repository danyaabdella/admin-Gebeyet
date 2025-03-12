"use client"

import { ReportBarChart } from "./report-bar-chart"

// Sample data - in a real application, this would come from props or an API
const data = [
  { month: "Jan", revenue: 4000, orders: 240 },
  { month: "Feb", revenue: 3000, orders: 198 },
  { month: "Mar", revenue: 2000, orders: 120 },
  { month: "Apr", revenue: 2780, orders: 167 },
  { month: "May", revenue: 1890, orders: 98 },
  { month: "Jun", revenue: 2390, orders: 145 },
  { month: "Jul", revenue: 3490, orders: 210 },
  { month: "Aug", revenue: 4000, orders: 240 },
  { month: "Sep", revenue: 3200, orders: 190 },
  { month: "Oct", revenue: 2800, orders: 170 },
  { month: "Nov", revenue: 3300, orders: 200 },
  { month: "Dec", revenue: 5000, orders: 300 },
]

export function RevenueBarChart() {
  return (
    <ReportBarChart
      data={data}
      dataKeys={["revenue"]}
      xAxisKey="month"
      colors={["#8884d8"]}
      formatter={(value) => `$${value}`}
    />
  )
}

