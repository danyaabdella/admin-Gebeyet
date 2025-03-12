"use client"

import { ReportBarChart } from "./report-bar-chart"

// Sample data - in a real application, this would come from props or an API
const data = [
  { category: "Electronics", revenue: 12000 },
  { category: "Clothing", revenue: 9000 },
  { category: "Home & Garden", revenue: 7500 },
  { category: "Sports", revenue: 6000 },
  { category: "Beauty", revenue: 4500 },
  { category: "Toys", revenue: 3000 },
  { category: "Books", revenue: 2000 },
  { category: "Automotive", revenue: 1500 },
]

export function CategoryRevenueBarChart() {
  return (
    <ReportBarChart
      data={data}
      dataKeys={["revenue"]}
      xAxisKey="category"
      colors={["#8884d8"]}
      formatter={(value) => `$${value}`}
    />
  )
}

