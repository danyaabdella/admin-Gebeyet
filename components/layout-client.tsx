"use client";

import { useSidebar } from "@/components/sidebar-provider";
import { Sidebar } from "@/components/sidebar";
import { Menu } from "lucide-react";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <div className="flex">
      <Sidebar />
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? "ml-[var(--sidebar-width)]" : "ml-0"
        }`}
      >
        <header className="flex items-center justify-between p-4 border-b">
          {!isOpen && (
            <button onClick={toggleSidebar} aria-label="Open sidebar">
              <Menu className="h-6 w-6" />
            </button>
          )}
          {/* Add other header content here, e.g., user profile */}
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

