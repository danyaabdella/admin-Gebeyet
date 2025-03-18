"use client"

import type React from "react"
import { useState } from "react"
import { Search, CheckCircle, XCircle, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminDetailsDialog } from "@/components/admins/admin-details-dialog"
import { CreateAdminDialog } from "@/components/admins/create-admin-dialog"
import { PaginationControls } from "@/components/auctions/pagination-controls"

export default function AdminsPageClient() {
  const [selectedTab, setSelectedTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Mock admins data
  const activeAdmins = Array.from({ length: 12 }, (_, i) => ({
    _id: `admin_${i + 1}`,
    fullname: `Admin ${i + 1}`,
    email: `admin${i + 1}@example.com`,
    phone: `+1555123${i.toString().padStart(3, "0")}`,
    role: "admin",
    isBanned: i % 5 === 0,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
    isDeleted: false,
    trashDate: null,
  }))

  const deletedAdmins = Array.from({ length: 5 }, (_, i) => ({
    _id: `trash_admin_${i + 1}`,
    fullname: `Deleted Admin ${i + 1}`,
    email: `deleted_admin${i + 1}@example.com`,
    phone: `+1555123${(i + 10).toString().padStart(3, "0")}`,
    role: "admin",
    isBanned: i % 2 === 0,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
    isDeleted: true,
    trashDate: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
  }))

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
  }

  const handleCreateAdmin = (data: any) => {
    console.log("Admin Created:", data);
    // Perform API call or logic to create an admin
  };

  const filteredAdmins = (selectedTab === "active" ? activeAdmins : deletedAdmins).filter((admin) => {
    if (
      searchQuery &&
      !admin.fullname.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    if (statusFilter === "banned" && !admin.isBanned) return false
    if (statusFilter === "active" && admin.isBanned) return false
    return true
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />
      <div className="flex-1 md:ml-[calc(var(--sidebar-width)-40px)] md:-mt-12 -mt-8">
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">Admin Management</h1>
            <div className="flex items-center gap-2 -mr-8 lg:mr-0">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4 " />
                Create Admin
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search admins..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" variant="secondary" size="sm">
                Search
              </Button>
            </form>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] lg:w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="sm:hidden">All</span>
                  <span className="hidden sm:inline">All Admins</span>
                </SelectItem>
                <SelectItem value="active">
                  <span className="sm:hidden">Active</span>
                  <span className="hidden sm:inline">Active Admins</span>
                </SelectItem>
                <SelectItem value="banned">
                  <span className="sm:hidden">Banned</span>
                  <span className="hidden sm:inline">Banned Admins</span>
                </SelectItem>
              </SelectContent>
            </Select>

            <TabsList>
              <TabsTrigger value="active">
                <span className="sm:hidden">Active</span>
                <span className="hidden sm:inline">Active Admins</span>
              </TabsTrigger>
              <TabsTrigger value="deleted">
                <span className="sm:hidden">Deleted</span>
                <span className="hidden sm:inline">Deleted Admins</span>
              </TabsTrigger>
            </TabsList>
          </div>
            <Card className="mt-4">
              <CardHeader className="p-4">
                <CardTitle>{selectedTab === "active" ? "Active Admins" : "Deleted Admins"}</CardTitle>
                <CardDescription>
                  {selectedTab === "active"
                    ? "Manage active administrators in the system"
                    : "View and restore deleted administrators"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead> {/* Date column always visible */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdmins.map((admin) => (
                      <TableRow
                        key={admin._id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedAdmin(admin)}
                      >
                        <TableCell className="font-medium">{admin.fullname}</TableCell>
                        <TableCell className="hidden md:table-cell">{admin.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{admin.phone}</TableCell>
                        <TableCell>
                          {admin.isBanned ? (
                            <Badge variant="destructive" className="flex w-fit items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              Banned
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="flex w-fit items-center gap-1 bg-green-50 text-green-700 border-green-200"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </TableCell> {/* Date column always visible */}
                      </TableRow>
                    ))}
                    {filteredAdmins.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No admins found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Tabs>

          {filteredAdmins.length > 0 && (
            <PaginationControls totalPages={Math.ceil(filteredAdmins.length / 15)} currentPage={1} />
          )}
        </main>
      </div>

      {selectedAdmin && (
        <AdminDetailsDialog admin={selectedAdmin} open={!!selectedAdmin} onOpenChange={() => setSelectedAdmin(null)} />
      )}

      <CreateAdminDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onSubmit={handleCreateAdmin} 
      />
    </div>
  )
}