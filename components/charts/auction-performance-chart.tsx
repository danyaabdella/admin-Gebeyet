"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Sample data - in a real application, this would come from props or an API
const data = [
  { month: "Jan", active: 40, completed: 24, cancelled: 10, rejected: 5 },
  { month: "Feb", active: 30, completed: 25, cancelled: 8, rejected: 4 },
  { month: "Mar", active: 20, completed: 26, cancelled: 5, rejected: 3 },
  { month: "Apr", active: 27, completed: 27, cancelled: 7, rejected: 6 },
  { month: "May", active: 18, completed: 28, cancelled: 6, rejected: 4 },
  { month: "Jun", active: 23, completed: 29, cancelled: 9, rejected: 7 },
  { month: "Jul", active: 34, completed: 30, cancelled: 11, rejected: 8 },
  { month: "Aug", active: 40, completed: 31, cancelled: 12, rejected: 9 },
  { month: "Sep", active: 32, completed: 32, cancelled: 8, rejected: 6 },
  { month: "Oct", active: 28, completed: 33, cancelled: 7, rejected: 5 },
  { month: "Nov", active: 33, completed: 34, cancelled: 9, rejected: 7 },
  { month: "Dec", active: 50, completed: 35, cancelled: 14, rejected: 10 },
];

export function AuctionPerformanceChart() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] sm:min-w-full">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="active"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              name="Active Auctions"
            />
            <Area
              type="monotone"
              dataKey="completed"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
              name="Completed Auctions"
            />
            <Area
              type="monotone"
              dataKey="cancelled"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
              name="Cancelled Auctions"
            />
            <Area
              type="monotone"
              dataKey="rejected"
              stackId="1"
              stroke="#ff0000"
              fill="#ff6666"
              name="Rejected Auctions"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
