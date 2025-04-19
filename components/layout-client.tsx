"use client";

import type React from "react";

import { useSidebar } from "@/components/sidebar-provider";
import { Sidebar } from "@/components/sidebar";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "./footer";
import { Toaster } from "@/components/toaster";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div
        className={`flex min-h-[calc(100vh-4rem)] flex-col transition-all duration-300 ${
          isOpen ? "md:ml-0" : "ml-0"
        }`}
        style={{ marginTop: "4rem" }}
      >
        <main className="flex-1 p-4 md:p-6">{children}</main>
        <Footer />
      </div>

      <Toaster />
    </div>
  );
}
