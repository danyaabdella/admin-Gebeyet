"use client"

import { ReportBarChart } from "./report-bar-chart"

// Sample data - in a real application, this would come from props or an API
const data = [
  { month: "Jan", revenue: 4000, profit: 1600, expenses: 2400 },
  { month: "Feb", revenue: 3000, profit: 1200, expenses: 1800 },
  { month: "Mar", revenue: 2000, profit: 800, expenses: 1200 },
  { month: "Apr", revenue: 2780, profit: 1112, expenses: 1668 },
  { month: "May", revenue: 1890, profit: 756, expenses: 1134 },
  { month: "Jun", revenue: 2390, profit: 956, expenses: 1434 },
  { month: "Jul", revenue: 3490, profit: 1396, expenses: 2094 },
  { month: "Aug", revenue: 4000, profit: 1600, expenses: 2400 },
  { month: "Sep", revenue: 3200, profit: 1280, expenses: 1920 },
  { month: "Oct", revenue: 2800, profit: 1120, expenses: 1680 },
  { month: "Nov", revenue: 3300, profit: 1320, expenses: 1980 },
  { month: "Dec", revenue: 5000, profit: 2000, expenses: 3000 },
]

export function MonthlyReportsBarChart() {
  return (
    <ReportBarChart
      data={data}
      dataKeys={["revenue", "profit", "expenses"]}
      xAxisKey="month"
      colors={["#8884d8", "#82ca9d", "#ffc658"]}
      formatter={(value) => `$${value}`}
    />
  )
}

