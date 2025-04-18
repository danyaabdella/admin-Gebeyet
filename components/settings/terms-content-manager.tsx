"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, Edit, Save, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchTermsOfService, updateTermsOfService } from "@/utils/api-mock"

export function TermsContentManager() {
  const [termsData, setTermsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("sections")
  const [editingSection, setEditingSection] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadTermsData = async () => {
      try {
        const data = await fetchTermsOfService()
        setTermsData(data)
      } catch (err) {
        console.error("Failed to fetch terms data:", err)
        toast({
          title: "Error loading content",
          description: "Failed to load Terms of Service content. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTermsData()
  }, [toast])

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      await updateTermsOfService(termsData)
      toast({
        title: "Changes saved",
        description: "Your Terms of Service content has been updated successfully.",
      })
    } catch (err) {
      console.error("Failed to save terms data:", err)
      toast({
        title: "Error saving changes",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditSection = (section: any) => {
    setEditingSection({ ...section })
    setEditDialogOpen(true)
  }

  const handleSaveSection = () => {
    if (editingSection) {
      const updatedSections = termsData.sections.map((section: any) =>
        section.id === editingSection.id ? editingSection : section,
      )

      setTermsData({
        ...termsData,
        sections: updatedSections,
      })

      setEditDialogOpen(false)

      toast({
        title: "Section updated",
        description: `The "${editingSection.title}" section has been updated.`,
      })
    }
  }

  const handleAddSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      content: "Enter content for this section here.",
    }

    setEditingSection(newSection)
    setEditDialogOpen(true)
  }

  const handleSaveNewSection = () => {
    if (editingSection) {
      setTermsData({
        ...termsData,
        sections: [...termsData.sections, editingSection],
      })

      setEditDialogOpen(false)

      toast({
        title: "Section added",
        description: `The "${editingSection.title}" section has been added.`,
      })
    }
  }

  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = termsData.sections.filter((section: any) => section.id !== sectionId)

    setTermsData({
      ...termsData,
      sections: updatedSections,
    })

    toast({
      title: "Section deleted",
      description: "The section has been removed from your Terms of Service.",
    })
  }

  const handleUpdateLastUpdated = () => {
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    const formattedDate = today.toLocaleDateString("en-US", options)

    setTermsData({
      ...termsData,
      lastUpdated: formattedDate,
    })

    toast({
      title: "Date updated",
      description: `Last updated date changed to ${formattedDate}.`,
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-full bg-muted animate-pulse rounded-md"></div>
        <div className="h-32 w-full bg-muted animate-pulse rounded-md"></div>
        <div className="h-32 w-full bg-muted animate-pulse rounded-md"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Last Updated: <span className="font-medium">{termsData.lastUpdated}</span>
          </p>
          <Button variant="outline" size="sm" onClick={handleUpdateLastUpdated} className="mt-2">
            Update to Today&apos;s Date
          </Button>
        </div>
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sections">Main Sections</TabsTrigger>
          <TabsTrigger value="fullterms">Full Terms</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Manage Sections</h3>
            <Button onClick={handleAddSection} size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add Section
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {termsData.sections.map((section: any) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">{section.title}</AccordionTrigger>
                <AccordionContent className="px-4">
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">{section.content}</p>

                    {section.highlights && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Highlights:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {section.highlights.map((highlight: any, index: number) => (
                            <li key={index}>
                              <span className="font-medium">{highlight.title}:</span> {highlight.content}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {section.guidelines && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Guidelines:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {section.guidelines.map((guideline: any, index: number) => (
                            <li key={index}>
                              <span className="font-medium">{guideline.title}:</span> {guideline.content}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {section.details && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Details:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {section.details.map((detail: any, index: number) => (
                            <li key={index}>
                              <span className="font-medium">{detail.title}:</span> {detail.content}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {section.disclaimers && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Disclaimers:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {section.disclaimers.map((disclaimer: any, index: number) => (
                            <li key={index}>
                              <span className="font-medium">{disclaimer.title}:</span> {disclaimer.content}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditSection(section)} className="gap-1">
                        <Edit className="h-4 w-4" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSection(section.id)}
                        className="gap-1"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="fullterms" className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Full Terms of Service</h3>
          <div className="space-y-6">
            {termsData.fullTerms.map((term: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{term.title}</h4>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{term.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingSection && editingSection.id.startsWith("section-") ? "Add New Section" : "Edit Section"}
            </DialogTitle>
            <DialogDescription>
              Make changes to the section content below. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          {editingSection && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={editingSection.title}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Main Content</Label>
                <Textarea
                  id="content"
                  rows={4}
                  value={editingSection.content}
                  onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    For advanced editing of highlights, guidelines, details, or disclaimers, please use the full content
                    management system.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={
                editingSection && editingSection.id.startsWith("section-") ? handleSaveNewSection : handleSaveSection
              }
            >
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
