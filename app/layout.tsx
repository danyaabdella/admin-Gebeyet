import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/sidebar-provider"
import { NavBar } from '../components/nav-bar';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Marketplace Admin Dashboard",
  description: "Admin dashboard for marketplace management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar/>
        <SidebarProvider>{children}</SidebarProvider>
      </body>
    </html>
  )
}



import './globals.css'