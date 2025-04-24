import { Suspense } from "react"
import AboutSettingsPage from "@/components/setting/about/about-settings-page";
import { SettingsPageSkeleton } from "@/components/setting/settings-page-skeleton";
import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Marketplace Setting - Marketplace Setting",
  description: "Setting of the marketplace",
}

export default function Page() {
  return (
    <Suspense fallback={<SettingsPageSkeleton />}>
      <Sidebar/>
      <div className="flex-1 md:ml-[calc(var(--sidebar-width)-40px)] md:-mt-12 -mt-8">
        <AboutSettingsPage />
      </div>
    </Suspense>
  )
}
