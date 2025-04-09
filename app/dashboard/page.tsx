import DashboardClient from './dashboard-client'
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Marketplace Dashboard",
  description: "Dashboard of the marketplace",
}
const DashboardPage = () => {
  return (
    <div>
      <DashboardClient/>
    </div>
  )
}

export default DashboardPage
