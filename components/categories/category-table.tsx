"use client"

import { useState } from "react"
import { Trash2, MoreHorizontal, RotateCcw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CategoryDetailsDialog } from "@/components/categories/category-details-dialog"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

interface CategoryTableProps {
  categories: any[]
  isLoading: boolean
  userSession: any
  onCategoryAction: (type: string, categoryId: string) => void
  selectedTab: string
}

export function CategoryTable({
  categories,
  isLoading,
  userSession,
  onCategoryAction,
  selectedTab,
}: CategoryTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const canPerformAction = (category: any) => {
    // Super admins can perform any action
    if (userSession.user.role === "superAdmin") return true

    // Regular admins can only perform actions on categories they created
    return category.createdBy === userSession.user.email
  }

  const handleDelete = (category: any) => {
    setSelectedCategory(category)
    setShowDeleteConfirm(true)
  }

  const handleRestore = (category: any) => {
    setSelectedCategory(category)
    setShowRestoreConfirm(true)
  }

  const handlePermanentDelete = (category: any) => {
    setSelectedCategory(category)
    setShowPermanentDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (selectedCategory) {
      onCategoryAction("delete", selectedCategory._id)
      setShowDeleteConfirm(false)
    }
  }

  const confirmRestore = () => {
    if (selectedCategory) {
      onCategoryAction("restore", selectedCategory._id)
      setShowRestoreConfirm(false)
    }
  }

  const confirmPermanentDelete = () => {
    if (selectedCategory) {
      onCategoryAction("permanent-delete", selectedCategory._id)
      setShowPermanentDeleteConfirm(false)
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Loading categories...
              </TableCell>
            </TableRow>
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow
                key={category._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedCategory(category)}
              >
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.createdBy}</TableCell>
                <TableCell>{formatDate(category.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    {selectedTab === "active" && canPerformAction(category) && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(category)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {selectedTab === "deleted" && canPerformAction(category) && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => handleRestore(category)}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handlePermanentDelete(category)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedCategory && (
        <CategoryDetailsDialog
          category={selectedCategory}
          open={!!selectedCategory && !showDeleteConfirm && !showRestoreConfirm && !showPermanentDeleteConfirm}
          onOpenChange={() => setSelectedCategory(null)}
          onAction={onCategoryAction}
          userSession={userSession}
        />
      )}

      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Category"
        description="Are you sure you want to delete this category? It will be moved to trash."
        onConfirm={confirmDelete}
      />

      <ConfirmationDialog
        open={showRestoreConfirm}
        onOpenChange={setShowRestoreConfirm}
        title="Restore Category"
        description="Are you sure you want to restore this category?"
        onConfirm={confirmRestore}
      />

      <ConfirmationDialog
        open={showPermanentDeleteConfirm}
        onOpenChange={setShowPermanentDeleteConfirm}
        title="Permanently Delete Category"
        description="Are you sure you want to permanently delete this category? This action cannot be undone."
        onConfirm={confirmPermanentDelete}
      />
    </>
  )
}

