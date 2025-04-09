'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Tag,
  Gavel,
  CreditCard,
  Shield,
  Home,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 z-30 h-screen w-[var(--sidebar-width)] border-r bg-background mt-16 hidden md:block -ml-4">
      <div className="flex flex-col gap-2 p-4">
        <nav className="grid gap-1">
          {[
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/users", label: "User", icon: Users },
            { href: "/admins", label: "Admin", icon: Shield },
            { href: "/auctions", label: "Auction", icon: Gavel },
            { href: "/orders", label: "Order", icon: Package },  // Using Package icon
            { href: "/products", label: "Product", icon: ShoppingBag },
            { href: "/categories", label: "Category", icon: Tag },
            { href: "/transactions", label: "Transactions", icon: CreditCard },
          ].map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} passHref>
              <Button
                variant={pathname === href ? "secondary" : "ghost"}
                className="justify-start w-full flex-grow text-left"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span className="whitespace-nowrap">{label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Back Home Button */}
        <div className="mt-64">
          <Link href="/" passHref>
            <Button variant="ghost" className="justify-start w-full flex-grow text-left">
              <Home className="mr-2 h-4 w-4" />
              <span className="whitespace-nowrap">Back Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
