import type { Metadata } from "next"
import { Sidebar } from "@/components/sidebar"
import { TransactionManagementContent } from "@/components/transactions/transaction-management-content"

export const metadata: Metadata = {
  title: "Transaction Management - Marketplace Admin",
  description: "Manage transactions in the marketplace",
}

export default function TransactionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />
      <div className="flex-1 md:ml-[calc(var(--sidebar-width)-40px)] md:-mt-12 -mt-8">
        <TransactionManagementContent />
      </div>
    </div>
  )
}

