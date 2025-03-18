"use client";

import { ReportBarChart } from "./report-bar-chart";

// Sample data representing order distribution in the system
const data = [
  { type: "Auction Orders", count: 350, value: 35000 },
  { type: "Product Orders", count: 500, value: 50000 },
  { type: "Refunded Orders", count: 75, value: 7500 },
  { type: "Pending Refunds", count: 200, value: 20000 },
  { type: "Completed Orders", count: 150, value: 15000 },
  { type: "Cancelled Orders", count: 100, value: 10000 },
  { type: "Dispatched Orders", count: 100, value: 10000 },
];

export function OrderDistributionBarChart() {
  return (
     <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] sm:min-w-full">
              <ReportBarChart
                data={data}
                dataKeys={["count"]}
                xAxisKey="type"
                colors={["#4CAF50", "#FF9800", "#F44336", "#2196F3", "#FFC107", "#9C27B0"]}
                formatter={(value: number) => 
                  value > 1000 ? `$${value.toLocaleString()}` : `${value} Orders`
                }
              />
          </div>
        </div>
  );
}
