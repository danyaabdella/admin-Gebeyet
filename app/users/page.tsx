/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { UserTable } from "@/components/users/user-table"
import { UserFilters } from "@/components/users/user-filters"
import { PaginationControls } from "@/components/users/pagination-controls"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/toaster"
import { banUser, deleteUser, permanentlyDeleteUser, restoreUser, unbanUser, verifyUser } from "@/utils/adminFunctions"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

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
  const [showBanDialog, setShowBanDialog] = useState<string | null>(null)
  const [showRestoreDialog, setShowRestoreDialog] = useState<string | null>(null)
  const [showPermanentDeleteDialog, setShowPermanentDeleteDialog] = useState<string | null>(null)
  const [selectedBanReason, setSelectedBanReason] = useState("")
  const [banDescription, setBanDescription] = useState("")

  // Predefined ban reasons
  const banReasons = [
    "Inappropriate behavior",
    "Spam",
    "Policy violation",
    "Other",
  ]

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
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(user =>
        (user.fullName?.toLowerCase().includes(lowerSearch) ||
         user.address?.state?.toLowerCase().includes(lowerSearch) ||
         user.address?.city?.toLowerCase().includes(lowerSearch))
      )
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter)
    }
    if (approvalStatusFilter !== "all" && roleFilter === "merchant") {
      filtered = filtered.filter(user => user.role === "merchant" && user.approvalStatus === approvalStatusFilter)
    } else {
      if (statusFilter === "verified") {
        filtered = filtered.filter(user => user.isEmailVerified && !user.isBanned && !user.isDeleted)
      } else if (statusFilter === "unverified") {
        filtered = filtered.filter(user => !user.isEmailVerified && !user.isBanned && !user.isDeleted)
      } else if (statusFilter === "banned") {
        filtered = filtered.filter(user => user.isBanned && !user.isDeleted)
      }
    }
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
      page: 1
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
    switch (type) {
      case "ban":
        setShowBanDialog(userId)
        setSelectedBanReason("")
        setBanDescription("")
        break
      case "restore":
        setShowRestoreDialog(userId)
        break
      case "permanent-delete":
        setShowPermanentDeleteDialog(userId)
        break
      default:
        // For other actions, you could use a generic dialog if needed
        handleConfirmAction(type, userId)
        break
    }
  }

  // Execute confirmed user action
  const handleConfirmAction = async (
    type: "verify" | "ban" | "unban" | "delete" | "restore" | "permanent-delete",
    userId: string,
    banData?: { reason: string; description: string }
  ) => {
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
          result = await banUser(userId, banData)
          if (result.success) {
            setAllUsers(prev => prev.map(user =>
              user._id === userId ? {
                ...user,
                isBanned: true,
                banReason: { reason: banData?.reason, description: banData?.description },
                bannedAt: new Date(),
                // bannedBy will be set by the server
              } : user
            ))
          }
          break
        case "unban":
          result = await unbanUser(userId)
          if (result.success) {
            setAllUsers(prev => prev.map(user =>
              user._id === userId ? { ...user, isBanned: false, banReason: null, bannedAt: null, bannedBy: null } : user
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
      } else {
        throw new Error(result?.message || `Failed to ${type} user`)
      }
    } catch (error) {
        if (error instanceof Error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || `Failed to ${type} user. Please try again.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to ${type} user. Please try again.`,
          });
        }
    }
  }

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

          {/* Ban Confirmation Dialog */}
          {showBanDialog && (
            <Dialog open={!!showBanDialog} onOpenChange={() => setShowBanDialog(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Ban</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to ban this user? Please provide a reason and additional details.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="banReason">Ban Reason</Label>
                    <Select value={selectedBanReason} onValueChange={setSelectedBanReason}>
                      <SelectTrigger id="banReason">
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {banReasons.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="banDescription">Additional Details</Label>
                    <Textarea
                      id="banDescription"
                      value={banDescription}
                      onChange={(e) => setBanDescription(e.target.value)}
                      placeholder="Enter additional details about the ban"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowBanDialog(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      if (!selectedBanReason) {
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Please select a ban reason.",
                        })
                        return
                      }
                      await handleConfirmAction("ban", showBanDialog, { reason: selectedBanReason, description: banDescription })
                      setShowBanDialog(null)
                    }}
                    disabled={!selectedBanReason || isLoading}
                  >
                    Confirm Ban
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Restore Confirmation Dialog */}
          {showRestoreDialog && (
            <Dialog open={!!showRestoreDialog} onOpenChange={() => setShowRestoreDialog(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Restore</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to restore this user?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowRestoreDialog(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      await handleConfirmAction("restore", showRestoreDialog)
                      setShowRestoreDialog(null)
                    }}
                    disabled={isLoading}
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Permanent Delete Confirmation Dialog */}
          {showPermanentDeleteDialog && (
            <Dialog open={!!showPermanentDeleteDialog} onOpenChange={() => setShowPermanentDeleteDialog(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Permanent Delete</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to permanently delete this user? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPermanentDeleteDialog(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await handleConfirmAction("permanent-delete", showPermanentDeleteDialog)
                      setShowPermanentDeleteDialog(null)
                    }}
                    disabled={isLoading}
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </main>
      </div>
      <Toaster />
    </div>
  )
}