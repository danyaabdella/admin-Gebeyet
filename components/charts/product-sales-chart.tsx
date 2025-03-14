"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data - in a real application, this would come from props or an API
const data = [
  { month: "Jan", sales: 4000, auctions: 2400 },
  { month: "Feb", sales: 3000, auctions: 2500 },
  { month: "Mar", sales: 2000, auctions: 2600 },
  { month: "Apr", sales: 2780, auctions: 2700 },
  { month: "May", sales: 1890, auctions: 2800 },
  { month: "Jun", sales: 2390, auctions: 2900 },
  { month: "Jul", sales: 3490, auctions: 3000 },
  { month: "Aug", sales: 4000, auctions: 3100 },
  { month: "Sep", sales: 3200, auctions: 3200 },
  { month: "Oct", sales: 2800, auctions: 3300 },
  { month: "Nov", sales: 3300, auctions: 3400 },
  { month: "Dec", sales: 5000, auctions: 3500 },
]

export function ProductSalesChart() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] sm:min-w-full">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" name="Sales" />
            <Bar dataKey="auctions" fill="#82ca9d" name="Auctions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
