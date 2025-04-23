"use client"

import { useState } from "react"
import type { Notification } from "@/utils/notification-data"
import { NotificationType } from "@/utils/notification-data"
import { NotificationItem } from "./notification-item"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CheckCircle, Search, Trash2, Bell } from "lucide-react"

interface NotificationListProps {
  initialNotifications: Notification[]
}

export function NotificationList({ initialNotifications }: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [filter, setFilter] = useState<NotificationType | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter = filter === "all" || notification.type === filter
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: !notification.read } : notification,
      ),
    )
  }

  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const handleDismissAll = () => {
    setNotifications([])
  }

  const handleDismissAllRead = () => {
    setNotifications(notifications.filter((notification) => !notification.read))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark all as read</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDismissAllRead}
            disabled={notifications.filter((n) => n.read).length === 0}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear read</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDismissAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear all</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notifications..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={filter} onValueChange={(value) => setFilter(value as NotificationType | "all")}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All notifications</SelectItem>
            <SelectItem value="alert">Alerts</SelectItem>
            <SelectItem value="update">Updates</SelectItem>
            <SelectItem value="message">Messages</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="action">Actions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDismiss={handleDismiss}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No notifications</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {notifications.length > 0
                ? "No notifications match your current filters."
                : "You're all caught up! Check back later for new notifications."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

