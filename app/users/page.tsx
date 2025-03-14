"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { UserTable } from "@/components/users/user-table"
import { UserFilters } from "@/components/users/user-filters"
import { PaginationControls } from "@/components/users/pagination-controls"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import {
  fetchUsers,
  fetchDeletedUsers,
  verifyUser,
  banUser,
  unbanUser,
  deleteUser,
  restoreUser,
  permanentlyDeleteUser,
} from "@/lib/data-fetching"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/toaster"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [trashUsers, setTrashUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  })
  const [trashPagination, setTrashPagination] = useState({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  })
  const [confirmAction, setConfirmAction] = useState<{
    type: "verify" | "ban" | "unban" | "delete" | "restore" | "permanent-delete" | null
    userId: string | null
  }>({ type: null, userId: null })

  // Load users data
  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true)
      try {
        const filters: any = {}
        if (searchTerm) filters.search = searchTerm
        if (roleFilter !== "all") filters.role = roleFilter
        if (statusFilter === "verified") filters.isEmailVerified = true
        if (statusFilter === "unverified") filters.isEmailVerified = false
        if (statusFilter === "banned") filters.isBanned = true

        const result = await fetchUsers(pagination.page, pagination.limit, filters)
        setUsers(result.users)
        setPagination(result.pagination)

        // Also fetch trash users for the trash tab
        const trashResult = await fetchDeletedUsers(trashPagination.page, trashPagination.limit)
        setTrashUsers(trashResult.users)
        setTrashPagination(trashResult.pagination)
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

    loadUsers()
  }, [
    pagination.page,
    trashPagination.page,
    searchTerm,
    roleFilter,
    statusFilter,
    pagination.limit,
    trashPagination.limit,
  ])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("url: ", urlParams.toString());
  
    const tabParam = urlParams.has("customers")
      ? "customers"
      : urlParams.has("merchants")
      ? "merchants"
      : "all";
  
    setActiveTab(tabParam);
    console.log("Active tab :", tabParam);
  }, []);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (activeTab === "trash") {
      setTrashPagination((prev) => ({ ...prev, page: newPage }))
    } else {
      setPagination((prev) => ({ ...prev, page: newPage }))
    }
  }

  // Handle user actions
  const handleUserAction = (
    type: "verify" | "ban" | "unban" | "delete" | "restore" | "permanent-delete",
    userId: string,
  ) => {
    setConfirmAction({ type, userId })
  }

  const handleConfirmAction = async () => {
    if (!confirmAction.userId || !confirmAction.type) return

    const { type, userId } = confirmAction
    try {
      let result

      switch (type) {
        case "verify":
          result = await verifyUser(userId)
          if (result.success) {
            setUsers(users.map((user) => (user._id === userId ? { ...user, isEmailVerified: true } : user)))
          }
          break
        case "ban":
          result = await banUser(userId)
          if (result.success) {
            setUsers(users.map((user) => (user._id === userId ? { ...user, isBanned: true } : user)))
          }
          break
        case "unban":
          result = await unbanUser(userId)
          if (result.success) {
            setUsers(users.map((user) => (user._id === userId ? { ...user, isBanned: false } : user)))
          }
          break
        case "delete":
          result = await deleteUser(userId)
          if (result.success) {
            setUsers(users.filter((user) => user._id !== userId))
            // Refresh trash users
            const trashResult = await fetchDeletedUsers(trashPagination.page, trashPagination.limit)
            setTrashUsers(trashResult.users)
            setTrashPagination(trashResult.pagination)
          }
          break
        case "restore":
          result = await restoreUser(userId)
          if (result.success) {
            setTrashUsers(trashUsers.filter((user) => user._id !== userId))
            // Refresh active users
            const usersResult = await fetchUsers(pagination.page, pagination.limit)
            setUsers(usersResult.users)
            setPagination(usersResult.pagination)
          }
          break
        case "permanent-delete":
          result = await permanentlyDeleteUser(userId)
          if (result.success) {
            setTrashUsers(trashUsers.filter((user) => user._id !== userId))
            setTrashPagination((prev) => ({
              ...prev,
              total: prev.total - 1,
              totalPages: Math.ceil((prev.total - 1) / prev.limit),
            }))
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
        description: `Failed to ${confirmAction.type} user. Please try again.`,
      })
    } finally {
      setConfirmAction({ type: null, userId: null })
    }
  }

  // Get confirmation dialog content based on action type
  const getConfirmationContent = () => {
    switch (confirmAction.type) {
      case "verify":
        return {
          title: "Verify User",
          description: "Are you sure you want to verify this user?",
          variant: "default" as const,
        }
      case "ban":
        return {
          title: "Ban User",
          description: "Are you sure you want to ban this user? They will not be able to access the platform.",
          variant: "destructive" as const,
        }
      case "unban":
        return {
          title: "Unban User",
          description: "Are you sure you want to unban this user? They will regain access to the platform.",
          variant: "default" as const,
        }
      case "delete":
        return {
          title: "Delete User",
          description: "Are you sure you want to delete this user? They will be moved to trash.",
          variant: "destructive" as const,
        }
      case "restore":
        return {
          title: "Restore User",
          description: "Are you sure you want to restore this user? They will regain access to the platform.",
          variant: "default" as const,
        }
      case "permanent-delete":
        return {
          title: "Permanently Delete User",
          description: "Are you sure you want to permanently delete this user? This action cannot be undone.",
          variant: "destructive" as const,
        }
      default:
        return {
          title: "",
          description: "",
          variant: "default" as const,
        }
    }
  }

  const confirmationContent = getConfirmationContent()

  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />
      <div className="flex-1 md:ml-[var(--sidebar-width)] -mt-12">
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Total Users: {activeTab === "trash" ? trashPagination.total : pagination.total}
              </span>
            </div>
          </div>

          <Tabs value={activeTab} className="space-y-4" onValueChange={setActiveTab}>
            <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
              <TabsTrigger value="all" className="flex-1 sm:flex-none">
                All Users
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex-1 sm:flex-none">
                Customers
              </TabsTrigger>
              <TabsTrigger value="merchants" className="flex-1 sm:flex-none">
                Merchants
              </TabsTrigger>
              <TabsTrigger value="trash" className="flex-1 sm:flex-none">
                Trash
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <UserFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />

              <Card className="overflow-hidden">
                <CardHeader className="p-4 bg-muted/50">
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>Manage all users in the marketplace system</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <UserTable users={users} isLoading={isLoading} onViewUser={() => {}} onAction={handleUserAction} />
                </CardContent>
              </Card>

              <PaginationControls
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="p-4 bg-muted/50">
                  <CardTitle>Customer Users</CardTitle>
                  <CardDescription>Manage customer accounts in the marketplace</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <UserTable
                    users={users.filter((user) => user.role === "customer")}
                    isLoading={isLoading}
                    onViewUser={() => {}}
                    onAction={handleUserAction}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="merchants" className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="p-4 bg-muted/50">
                  <CardTitle>Merchant Users</CardTitle>
                  <CardDescription>Manage merchant accounts in the marketplace</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <UserTable
                    users={users.filter((user) => user.role === "merchant")}
                    isLoading={isLoading}
                    onViewUser={() => {}}
                    onAction={handleUserAction}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trash" className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="p-4 bg-muted/50">
                  <CardTitle>Deleted Users</CardTitle>
                  <CardDescription>Manage deleted users in the marketplace system</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <UserTable
                    users={trashUsers}
                    isLoading={isLoading}
                    isTrash={true}
                    onViewUser={() => {}}
                    onAction={handleUserAction}
                  />
                </CardContent>
              </Card>

              <PaginationControls
                currentPage={trashPagination.page}
                totalPages={trashPagination.totalPages}
                onPageChange={handlePageChange}
              />
            </TabsContent>
          </Tabs>

          {/* Confirmation Dialog */}
          <ConfirmationDialog
            open={confirmAction.type !== null}
            onOpenChange={(open) => {
              if (!open) setConfirmAction({ type: null, userId: null })
            }}
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

