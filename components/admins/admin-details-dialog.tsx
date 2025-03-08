"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Trash2, RefreshCw, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { banAdmin, unbanAdmin, deleteAdmin, restoreAdmin, permanentDeleteAdmin } from "@/lib/data-fetching"

interface AdminDetailsDialogProps {
  admin: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminDetailsDialog({ admin, open, onOpenChange }: AdminDetailsDialogProps) {
  const [isBanning, setIsBanning] = useState(false)
  const [isUnbanning, setIsUnbanning] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isPermanentlyDeleting, setIsPermanentlyDeleting] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleBanAdmin = async () => {
    setIsBanning(true)
    try {
      await banAdmin(admin._id)
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsBanning(false)
      onOpenChange(false)
    }
  }

  const handleUnbanAdmin = async () => {
    setIsUnbanning(true)
    try {
      await unbanAdmin(admin._id)
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsUnbanning(false)
      onOpenChange(false)
    }
  }

  const handleDeleteAdmin = async () => {
    setIsDeleting(true)
    try {
      await deleteAdmin(admin._id)
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsDeleting(false)
      onOpenChange(false)
    }
  }

  const handleRestoreAdmin = async () => {
    setIsRestoring(true)
    try {
      await restoreAdmin(admin._id)
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsRestoring(false)
      onOpenChange(false)
    }
  }

  const handlePermanentDelete = async () => {
    setIsPermanentlyDeleting(true)
    try {
      await permanentDeleteAdmin(admin._id)
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsPermanentlyDeleting(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Admin Details</span>
            {admin.isBanned ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Banned
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3" />
                Active
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>View and manage administrator information</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <div className="text-sm mt-1">{admin.fullname}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <div className="text-sm mt-1">{admin.email}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Phone</Label>
              <div className="text-sm mt-1">{admin.phone}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Created</Label>
              <div className="text-sm mt-1">{new Date(admin.createdAt).toLocaleString()}</div>
            </div>
            {admin.isDeleted && (
              <div>
                <Label className="text-sm font-medium">Deleted</Label>
                <div className="text-sm mt-1">{new Date(admin.trashDate).toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {!admin.isDeleted ? (
            <>
              {!admin.isBanned ? (
                <Button
                  variant="destructive"
                  onClick={handleBanAdmin}
                  disabled={isBanning}
                  className="w-full sm:w-auto"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {isBanning ? "Banning..." : "Ban Admin"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleUnbanAdmin}
                  disabled={isUnbanning}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isUnbanning ? "Unbanning..." : "Unban Admin"}
                </Button>
              )}

              {!showConfirmDelete ? (
                <Button variant="destructive" onClick={() => setShowConfirmDelete(true)} className="w-full sm:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Admin
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={handleDeleteAdmin}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="default"
                onClick={handleRestoreAdmin}
                disabled={isRestoring}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {isRestoring ? "Restoring..." : "Restore Admin"}
              </Button>

              {!showConfirmDelete ? (
                <Button variant="destructive" onClick={() => setShowConfirmDelete(true)} className="w-full sm:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Permanently Delete
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={handlePermanentDelete}
                  disabled={isPermanentlyDeleting}
                  className="w-full sm:w-auto"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  {isPermanentlyDeleting ? "Deleting..." : "Confirm Permanent Delete"}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

