import { getMockNotifications } from "@/utils/notification-data"
import { NotificationList } from "@/components/notification/notification-list"

export default function NotificationsPage() {
  const notifications = getMockNotifications()

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <NotificationList initialNotifications={notifications} />
    </div>
  )
}

