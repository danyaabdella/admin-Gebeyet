"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Settings, MessageSquare, Info } from "lucide-react"
import { TermsContentManager } from "@/components/settings/terms-content-manager"
import { PrivacyContentManager } from "@/components/settings/privacy-content-manager"
import { ContactContentManager } from "@/components/settings/contact-content-manager"
import { AboutUsContentManager } from "@/components/settings/about-us-content-manager"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("terms")

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
            <p className="text-muted-foreground">
              Manage content for your website&apos;s pages including Terms, Privacy, Contact, and About Us.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Terms of Service</span>
              <span className="sm:hidden">Terms</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy Policy</span>
              <span className="sm:hidden">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Contact Page</span>
              <span className="sm:hidden">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">About Us</span>
              <span className="sm:hidden">About</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Terms of Service Content Management</CardTitle>
                <CardDescription>
                  Add, edit, or remove content sections from your Terms of Service page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TermsContentManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Policy Content Management</CardTitle>
                <CardDescription>Add, edit, or remove content sections from your Privacy Policy page.</CardDescription>
              </CardHeader>
              <CardContent>
                <PrivacyContentManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Page Content Management</CardTitle>
                <CardDescription>
                  Manage contact information, team members, and other content on your Contact page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactContentManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About Us Content Management</CardTitle>
                <CardDescription>
                  Update company information, team members, and other content on your About Us page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AboutUsContentManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview Pages</CardTitle>
              <CardDescription>View your pages to see how they look with the current content.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/terms"
                  target="_blank"
                  className="flex items-center justify-center p-4 border rounded-md hover:bg-muted transition-colors"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Terms Page
                </Link>
                <Link
                  href="/privacy"
                  target="_blank"
                  className="flex items-center justify-center p-4 border rounded-md hover:bg-muted transition-colors"
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Privacy Page
                </Link>
                <Link
                  href="/contact"
                  target="_blank"
                  className="flex items-center justify-center p-4 border rounded-md hover:bg-muted transition-colors"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Contact Page
                </Link>
                <Link
                  href="/about"
                  target="_blank"
                  className="flex items-center justify-center p-4 border rounded-md hover:bg-muted transition-colors"
                >
                  <Info className="mr-2 h-5 w-5" />
                  About Us Page
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Management Tips</CardTitle>
              <CardDescription>Best practices for managing your website content.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    1
                  </span>
                  <span>
                    <strong>Regular Updates:</strong> Keep your content fresh and up-to-date, especially legal pages
                    like Terms and Privacy Policy.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    2
                  </span>
                  <span>
                    <strong>Clear Language:</strong> Use simple, straightforward language that your audience can easily
                    understand.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    3
                  </span>
                  <span>
                    <strong>Mobile-Friendly:</strong> Ensure your content looks good on all devices, especially mobile.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    4
                  </span>
                  <span>
                    <strong>Consistent Branding:</strong> Maintain consistent tone, style, and visual elements across
                    all pages.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
