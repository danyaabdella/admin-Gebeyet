"use client";

import { ReportBarChart } from "./report-bar-chart";

// Updated sample data with transactions > revenue & expenses, and added refund category
const data = [
  { month: "Jan", transactions: 5000, revenue: 4000, expenses: 2400, refunds: 500 },
  { month: "Feb", transactions: 4200, revenue: 3000, expenses: 1800, refunds: 400 },
  { month: "Mar", transactions: 3500, revenue: 2000, expenses: 1200, refunds: 300 },
  { month: "Apr", transactions: 3900, revenue: 2780, expenses: 1668, refunds: 350 },
  { month: "May", transactions: 3300, revenue: 1890, expenses: 1134, refunds: 280 },
  { month: "Jun", transactions: 3700, revenue: 2390, expenses: 1434, refunds: 320 },
  { month: "Jul", transactions: 4800, revenue: 3490, expenses: 2094, refunds: 450 },
  { month: "Aug", transactions: 5100, revenue: 4000, expenses: 2400, refunds: 480 },
  { month: "Sep", transactions: 4300, revenue: 3200, expenses: 1920, refunds: 400 },
  { month: "Oct", transactions: 4100, revenue: 2800, expenses: 1680, refunds: 350 },
  { month: "Nov", transactions: 4600, revenue: 3300, expenses: 1980, refunds: 420 },
  { month: "Dec", transactions: 5500, revenue: 5000, expenses: 3000, refunds: 500 },
];

export function MonthlyReportsBarChart() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] sm:min-w-full">
        <ReportBarChart
          data={data}
          dataKeys={["transactions", "expenses", "revenue", "refunds"]}
          xAxisKey="month"
          colors={["#8884d8", "#ffc658", "#82ca9d", "#ff6961"]}
          formatter={(value) =>
            typeof value === "number"
              ? value >= 1000
                ? `$${value}` // Format revenue, expenses, and refunds as currency
                : `${value} Tx` // Format transactions with "Tx"
              : `${value}`
          }
        />
      </div>
    </div>
  );
}
