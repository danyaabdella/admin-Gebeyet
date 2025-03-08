import type { Metadata } from "next"
import { Sidebar } from "@/components/sidebar"
import { CategoryManagementContent } from "@/components/categories/category-management-content"

export const metadata: Metadata = {
  title: "Category Management - Marketplace Admin",
  description: "Manage categories in the marketplace",
}

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />
      <div className="flex-1 md:ml-[var(--sidebar-width)]">
        <CategoryManagementContent />
      </div>
    </div>
  )
}

