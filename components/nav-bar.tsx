"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Settings, LogOut, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationPopover } from "./notification-popover";
import { ThemeToggle } from "./ui/theme-toogle";
import { useSidebar } from "./sidebar-provider";
import { Badge } from "./ui/badge";

export function NavBar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isOpen, toggleSidebar } = useSidebar();

  // Navigation links
  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Transactions", href: "/transactions" },
  ];

  // Redirect to /signin if there's no session
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Handle scroll and resize events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Cleanup on unmount
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMobileMenuOpen]);

  if (status === "loading") return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full h-16 border-b bg-background/95 backdrop-blur transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="flex h-full items-center justify-between px-4">
          {/* Left Side: Toggle Button (Mobile) and Logo */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-lg font-bold text-primary-foreground">M</span>
              </div>
              <span className="hidden font-semibold sm:inline-block">Marketplace Admin</span>
            </Link>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side: Notifications, Theme Toggle, User Avatar */}
          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationPopover />
            <ThemeToggle />

            {/* User Profile */}
            {session?.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                      <AvatarImage
                        src={session.user.image || "/placeholder.svg"}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image || "/placeholder.svg"}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => {
                      signOut();
                      router.push("/signin");
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Backdrop for Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Navigation Menu (Side Drawer) */}
      <div
        className={`fixed top-16 left-0 bottom-0 z-50 w-64 bg-background shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close mobile menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="py-2">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="flex w-full px-4 py-2 text-sm font-medium hover:bg-muted"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}