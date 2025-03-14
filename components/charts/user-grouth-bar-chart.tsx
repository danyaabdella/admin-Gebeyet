"use client"

import { ReportBarChart } from "./report-bar-chart"

// Sample data - in a real application, this would come from props or an API
const data = [
  { month: "Jan", customers: 120, merchants: 20, admins: 5 },
  { month: "Feb", customers: 140, merchants: 22, admins: 5 },
  { month: "Mar", customers: 170, merchants: 25, admins: 6 },
  { month: "Apr", customers: 200, merchants: 28, admins: 6 },
  { month: "May", customers: 220, merchants: 30, admins: 7 },
  { month: "Jun", customers: 250, merchants: 32, admins: 7 },
  { month: "Jul", customers: 280, merchants: 35, admins: 8 },
  { month: "Aug", customers: 310, merchants: 38, admins: 8 },
  { month: "Sep", customers: 340, merchants: 40, admins: 9 },
  { month: "Oct", customers: 370, merchants: 42, admins: 9 },
  { month: "Nov", customers: 400, merchants: 45, admins: 10 },
  { month: "Dec", customers: 430, merchants: 48, admins: 10 },
]

export function UserGrowthBarChart() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] sm:min-w-full">
        <ReportBarChart
          data={data}
          dataKeys={["customers", "merchants", "admins"]}
          xAxisKey="month"
          colors={["#8884d8", "#82ca9d", "#ffc658"]}
          stacked={true}
        />
      </div>
    </div>
  )
}

