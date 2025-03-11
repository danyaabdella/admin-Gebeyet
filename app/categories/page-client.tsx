"use client"

import { useState } from "react"
import { CategoryManagementContent } from "@/components/categories/category-management-content"
import { CreateCategoryDialog } from "@/components/categories/create-category-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CategoryManagementPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCategoryAdded = (newCategory: any) => {
    // This will be handled by the CategoryManagementContent component
    setIsCreateDialogOpen(false)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4 px-8 pt-6 ">
        <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Category
        </Button>
      </div>
      <CategoryManagementContent />
      <CreateCategoryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCategoryAdded={handleCategoryAdded}
      />
    </>
  )
}

