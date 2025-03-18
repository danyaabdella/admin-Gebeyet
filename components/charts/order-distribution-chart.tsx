"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function OrderDistributionPieChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart instance before creating a new one
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      // Order Distribution Data
      const data = [
        { type: "Auction - Refunded", value: 80, color: "rgba(255, 99, 132, 0.7)" },
        { type: "Auction - Pending Refunds", value: 50, color: "rgba(255, 159, 64, 0.7)" },
        { type: "Auction - Completed", value: 300, color: "rgba(75, 192, 192, 0.7)" },
        { type: "Auction - Cancelled", value: 40, color: "rgba(153, 102, 255, 0.7)" },
        { type: "Auction - Dispatched", value: 150, color: "rgba(255, 206, 86, 0.7)" },
        
        { type: "Product - Refunded", value: 120, color: "rgba(255, 99, 132, 0.5)" },
        { type: "Product - Pending Refunds", value: 70, color: "rgba(255, 159, 64, 0.5)" },
        { type: "Product - Completed", value: 400, color: "rgba(75, 192, 192, 0.5)" },
        { type: "Product - Cancelled", value: 60, color: "rgba(153, 102, 255, 0.5)" },
        { type: "Product - Dispatched", value: 200, color: "rgba(255, 206, 86, 0.5)" },
      ]

      chartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: data.map((item) => item.type),
          datasets: [
            {
              data: data.map((item) => item.value),
              backgroundColor: data.map((item) => item.color),
              borderColor: data.map((item) => item.color.replace("0.7", "1")),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || ""
                  const value = context.raw as number
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0) as number
                  const percentage = Math.round((value / total) * 100)
                  return `${label}: ${value} Orders (${percentage}%)`
                },
              },
            },
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}
