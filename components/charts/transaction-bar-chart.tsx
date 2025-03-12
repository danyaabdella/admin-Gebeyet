"use client"

import { ReportBarChart } from "./report-bar-chart"

// Sample data - in a real application, this would come from props or an API
const data = [
  { type: "Purchase", count: 450, value: 45000 },
  { type: "Refund", count: 50, value: 5000 },
  { type: "Deposit", count: 200, value: 20000 },
  { type: "Withdrawal", count: 150, value: 15000 },
  { type: "Fee", count: 300, value: 3000 },
]

export function TransactionTypesBarChart() {
    return (
      <ReportBarChart
        data={data}
        dataKeys={["count", "value"]}
        xAxisKey="type"
        colors={["#8884d8", "#82ca9d"]}
        formatter={(value: number) => `$${value.toLocaleString()}`}
      />
    )
  }
