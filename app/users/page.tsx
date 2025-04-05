/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { UserTable } from "@/components/users/user-table"
import { UserFilters } from "@/components/users/user-filters"
import { PaginationControls } from "@/components/users/pagination-controls"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/toaster"
import { banUser, deleteUser, permanentlyDeleteUser, restoreUser, unbanUser, verifyUser } from "@/utils/adminFunctions"

export default function UsersPage() {
  // State definitions
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [approvalStatusFilter, setApprovalStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  })
  const [confirmAction, setConfirmAction] = useState<{
    type: "verify" | "ban" | "unban" | "delete" | "restore" | "permanent-delete" | null
    userId: string | null
  }>({ type: null, userId: null })

  // Fetch users on component mount
  useEffect(() => {
    async function loadAllUsers() {
      setIsLoading(true)
      try {
        const response = await fetch('/api/manageUsers')
        const users = await response.json()
        setAllUsers(users)
      } catch (error) {
        console.error("Error loading users:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadAllUsers()
  }, [])

  // Filter users based on current state
  const getFilteredUsers = () => {
    let filtered = [...allUsers]

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(user =>
        (user.fullName?.toLowerCase().includes(lowerSearch) ||
         user.address?.state?.toLowerCase().includes(lowerSearch) ||
         user.address?.city?.toLowerCase().includes(lowerSearch))
      )
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Apply approval status filter for merchants
    if (approvalStatusFilter !== "all" && roleFilter === "merchant") {
      filtered = filtered.filter(user => user.role === "merchant" && user.approvalStatus === approvalStatusFilter)
    } else {
      // Apply status filter
      if (statusFilter === "verified") {
        filtered = filtered.filter(user => user.isEmailVerified && !user.isBanned && !user.isDeleted)
      } else if (statusFilter === "unverified") {
        filtered = filtered.filter(user => !user.isEmailVerified && !user.isBanned && !user.isDeleted)
      } else if (statusFilter === "banned") {
        filtered = filtered.filter(user => user.isBanned && !user.isDeleted)
      }
    }

    // Apply tab-specific filtering
    if (activeTab === "active") {
      filtered = filtered.filter(user => !user.isDeleted)
    } else if (activeTab === "trash") {
      filtered = filtered.filter(user => user.isDeleted)
    }

    return filtered
  }

  // Compute filtered and paginated users
  const filteredUsers = getFilteredUsers()
  const totalFiltered = filteredUsers.length
  const totalPages = Math.ceil(totalFiltered / pagination.limit)
  const paginatedUsers = filteredUsers.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  )

  // Update pagination when filters change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: totalFiltered,
      totalPages: totalPages,
      page: 1 // Reset to page 1 when filters change
    }))
  }, [searchTerm, roleFilter, statusFilter, approvalStatusFilter, activeTab, allUsers])

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  // Initiate a user action with confirmation
  const handleUserAction = (
    type: "verify" | "ban" | "unban" | "delete" | "restore" | "permanent-delete",
    userId: string
  ) => {
    setConfirmAction({ type, userId })
  }

  // Execute confirmed user action
  const handleConfirmAction = async () => {
    if (!confirmAction.userId || !confirmAction.type) return

    const { type, userId } = confirmAction
    try {
      let result
      switch (type) {
        case "verify":
          result = await verifyUser(userId)
          if (result.success) {
            setAllUsers(prev => prev.map(user =>
              user._id === userId ? { ...user, isEmailVerified: true } : user
            ))
          }
          break
        case "ban":
          result = await banUser(userId)
          if (result.success) {
            setAllUsers(prev => prev.map(user =>
              user._id === userId ? { ...user, isBanned: true } : user
            ))
          }
          break
        case "unban":
          result = await unbanUser(userId)
          if (result.success) {
            setAllUsers(prev => prev.map(user =>
              user._id === userId ? { ...user, isBanned: false } : user
            ))
          }
          break
        case "delete":
          result = await deleteUser(userId)
          if (result.success) {
            setAllUsers(prev => prev.map(user =>
              user._id === userId ? { ...user, isDeleted: true, trashDate: new Date() } : user
            ))
          }
          break
        case "restore":
          result = await restoreUser(userId)
          if (result.success) {
            setAllUsers(prev => prev.map(user =>
              user._id === userId ? { ...user, isDeleted: false, trashDate: null } : user
            ))
          }
          break
        case "permanent-delete":
          result = await permanentlyDeleteUser(userId)
          if (result.success) {
            setAllUsers(prev => prev.filter(user => user._id !== userId))
          }
          break
      }

      if (result?.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${type} user. Please try again.`,
      })
    } finally {
      setConfirmAction({ type: null, userId: null })
    }
  }

  // Define confirmation dialog content
  const getConfirmationContent = () => {
    switch (confirmAction.type) {
      case "verify":
        return { title: "Verify User", description: "Are you sure you want to verify this user?", variant: "default" }
      case "ban":
        return { title: "Ban User", description: "Are you sure you want to ban this user?", variant: "destructive" }
      case "unban":
        return { title: "Unban User", description: "Are you sure you want to unban this user?", variant: "default" }
      case "delete":
        return { title: "Delete User", description: "Are you sure you want to delete this user?", variant: "destructive" }
      case "restore":
        return { title: "Restore User", description: "Are you sure you want to restore this user?", variant: "default" }
      case "permanent-delete":
        return { title: "Permanently Delete User", description: "This action cannot be undone.", variant: "destructive" }
      default:
        return { title: "", description: "", variant: "default" }
    }
  }

  const confirmationContent = getConfirmationContent()

  // Render the UI
  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />
      <div className="flex-1 md:ml-[calc(var(--sidebar-width)-40px)] md:-mt-12 -mt-8">
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <span className="text-sm text-muted-foreground">
              Total Users: {filteredUsers.length}
            </span>
          </div>

          <Tabs value={activeTab} className="space-y-4" onValueChange={setActiveTab}>
            <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="trash">Trash</TabsTrigger>
            </TabsList>

            {/* All Users Tab */}
            <TabsContent value="all" className="space-y-4">
              <UserFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                approvalStatusFilter={approvalStatusFilter}
                setApprovalStatusFilter={setApprovalStatusFilter}
                showRoleFilter={true}
                showStatusFilter={true}
                showApprovalStatusFilter={roleFilter === "merchant"}
              />
              <Card className="overflow-hidden">
                <CardHeader className="p-4 bg-muted/50">
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>Manage all users in the marketplace system</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <UserTable
                    users={paginatedUsers}
                    isLoading={isLoading}
                    onViewUser={() => {}}
                    onAction={handleUserAction}
                  />
                </CardContent>
              </Card>
              <PaginationControls
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </TabsContent>

            {/* Active Users Tab */}
            <TabsContent value="active" className="space-y-4">
              <UserFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                approvalStatusFilter={approvalStatusFilter}
                setApprovalStatusFilter={setApprovalStatusFilter}
                showRoleFilter={true}
                showStatusFilter={true}
                showApprovalStatusFilter={roleFilter === "merchant"}
              />
              <Card className="overflow-hidden">
                <CardHeader className="p-4 bg-muted/50">
                  <CardTitle>Active Users</CardTitle>
                  <CardDescription>Manage active users</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <UserTable
                    users={paginatedUsers}
                    isLoading={isLoading}
                    onViewUser={() => {}}
                    onAction={handleUserAction}
                  />
                </CardContent>
              </Card>
              <PaginationControls
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </TabsContent>

            {/* Trash Tab */}
            <TabsContent value="trash" className="space-y-4">
              <UserFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                showRoleFilter={false}
                showStatusFilter={false}
                showApprovalStatusFilter={false}
              />
              <Card className="overflow-hidden">
                <CardHeader className="p-4 bg-muted/50">
                  <CardTitle>Deleted Users</CardTitle>
                  <CardDescription>Manage deleted users</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <UserTable
                    users={paginatedUsers}
                    isLoading={isLoading}
                    isTrash={true}
                    onViewUser={() => {}}
                    onAction={handleUserAction}
                  />
                </CardContent>
              </Card>
              <PaginationControls
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </TabsContent>
          </Tabs>

          {/* Confirmation Dialog */}
          <ConfirmationDialog
            open={confirmAction.type !== null}
            onOpenChange={(open) => !open && setConfirmAction({ type: null, userId: null })}
            title={confirmationContent.title}
            description={confirmationContent.description}
            onConfirm={handleConfirmAction}
            variant={confirmationContent.variant}
          />
        </main>
      </div>
      <Toaster />
    </div>
  )
}