"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Tag,
  Gavel,
  CreditCard,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed top-0 left-0 z-30 h-screen w-[var(--sidebar-width)] border-r bg-background mt-16 hidden md:block">
      <div className="flex flex-col gap-2 p-4">
        <nav className="grid gap-1">
          <Link href="/dashboard" passHref>
            <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} className="justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Link href="/users" passHref>
            <Button variant={pathname === "/users" ? "secondary" : "ghost"} className="justify-start">
              <Users className="mr-2 h-4 w-4" />
              User Management
            </Button>
          </Link>

          <Link href="/admins" passHref>
            <Button variant={pathname === "/admins" ? "secondary" : "ghost"} className="justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Admin Management
            </Button>
          </Link>

          <Link href="/auctions" passHref>
            <Button variant={pathname === "/auctions" ? "secondary" : "ghost"} className="justify-start">
              <Gavel className="mr-2 h-4 w-4" />
              Auction Management
            </Button>
          </Link>

          <Link href="/products" passHref>
            <Button variant={pathname === "/products" ? "secondary" : "ghost"} className="justify-start">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Product Management
            </Button>
          </Link>

          <Link href="/categories" passHref>
            <Button variant={pathname === "/categories" ? "secondary" : "ghost"} className="justify-start">
              <Tag className="mr-2 h-4 w-4" />
              Category Management
            </Button>
          </Link>

          <Link href="/transactions" passHref>
            <Button variant={pathname === "/transactions" ? "secondary" : "ghost"} className="justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Transactions
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  )
}

