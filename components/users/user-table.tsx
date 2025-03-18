"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Trash2, MoreHorizontal, AlertTriangle, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserDetailsDialog } from "@/components/users/user-details-dialog"

interface UserTableProps {
  users: any[]
  isLoading: boolean
  isTrash?: boolean
  onViewUser: (user: any) => void
  onAction: (type: "verify" | "ban" | "unban" | "delete" | "restore" | "permanent-delete", userId: string) => void
}

export function UserTable({ users, isLoading, isTrash = false, onViewUser, onAction }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const handleRowClick = (user: any) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
    onViewUser(user)
  }

  return (
    <>
      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              {!isTrash && <TableHead className="hidden md:table-cell">Role</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">{isTrash ? "Deleted On" : "Joined"}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={isTrash ? 5 : 6} className="text-center py-8 text-muted-foreground">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isTrash ? 5 : 6} className="text-center py-8 text-muted-foreground">
                  {isTrash ? "No deleted users found" : "No users found matching your filters"}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user._id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(user)}
                >
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                  {!isTrash && <TableCell className="hidden md:table-cell capitalize">{user.role}</TableCell>}
                  <TableCell>
                    {user.isBanned ? (
                      <span className="flex items-center text-red-500">
                        <AlertTriangle className="mr-1 h-4 w-4" /> Banned
                      </span>
                    ) : !user.isEmailVerified ? (
                      <span className="flex items-center text-yellow-500">
                        <XCircle className="mr-1 h-4 w-4" /> Unverified
                      </span>
                    ) : (
                      <span className="flex items-center text-green-500">
                        <CheckCircle className="mr-1 h-4 w-4" /> Verified
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {isTrash
                      ? new Date(user.trashDate).toLocaleDateString()
                      : new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewUser(user)
                        }}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{isTrash ? "Deleted User Actions" : "User Actions"}</DialogTitle>
                            <DialogDescription>Choose an action for {user.fullName}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <Button className="w-full" variant="outline" onClick={() => handleViewUser(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>

                            {!isTrash ? (
                              <>
                                {!user.isEmailVerified && (
                                  <Button
                                    className="w-full"
                                    variant="default"
                                    onClick={() => onAction("verify", user._id)}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Verify User
                                  </Button>
                                )}
                                {user.isBanned ? (
                                  <Button
                                    className="w-full"
                                    variant="default"
                                    onClick={() => onAction("unban", user._id)}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Unban User
                                  </Button>
                                ) : (
                                  <Button
                                    className="w-full"
                                    variant="destructive"
                                    onClick={() => onAction("ban", user._id)}
                                  >
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Ban User
                                  </Button>
                                )}
                                <Button
                                  className="w-full"
                                  variant="destructive"
                                  onClick={() => onAction("delete", user._id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  className="w-full"
                                  variant="default"
                                  onClick={() => onAction("restore", user._id)}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Restore User
                                </Button>
                                <Button
                                  className="w-full"
                                  variant="destructive"
                                  onClick={() => onAction("permanent-delete", user._id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Permanently
                                </Button>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <UserDetailsDialog
          user={selectedUser}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          onAction={onAction}
        />
      )}
    </>
  )
}

