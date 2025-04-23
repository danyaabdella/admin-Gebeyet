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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Edit, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock API functions
const mockPrivacyData = {
  lastUpdated: "February 10, 2025",
  sections: [
    {
      id: "section-1",
      title: "Data Collection",
      content: "We collect personal information you provide when you use our services.",
      icon: "Lock",
    },
    {
      id: "section-2",
      title: "Data Usage",
      content: "Your data is used to improve our services and provide personalized experiences.",
      icon: "ShieldCheck",
    },
  ],
  faq: [
    {
      question: "What data do you collect?",
      answer: "We collect data such as your name, email, and usage patterns to enhance our services.",
    },
    {
      question: "How is my data protected?",
      answer: "We use encryption and secure protocols to protect your data from unauthorized access.",
    },
  ],
  fullPolicy: [
    {
      title: "Complete Privacy Policy",
      content: "This is the full text of our Privacy Policy, detailing all data practices.",
    },
  ],
}

const fetchPrivacyPolicy = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockPrivacyData
}

const updatePrivacyPolicy = async (data: any) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // In a real implementation, this would send data to a server
  console.log("Updated privacy data:", data)
  return true
}

export function PrivacyContentManager() {
  const [privacyData, setPrivacyData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("sections")
  const [editingSection, setEditingSection] = useState<any>(null)
  const [editingFaq, setEditingFaq] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [faqDialogOpen, setFaqDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadPrivacyData = async () => {
      try {
        const data = await fetchPrivacyPolicy()
        setPrivacyData(data)
      } catch (err) {
        console.error("Failed to fetch privacy data:", err)
        toast({
          title: "Error loading content",
          description: "Failed to load Privacy Policy content. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPrivacyData()
  }, [toast])

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      await updatePrivacyPolicy(privacyData)
      toast({
        title: "Changes saved",
        description: "Your Privacy Policy content has been updated successfully.",
      })
    } catch (err) {
      console.error("Failed to save privacy data:", err)
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
      const updatedSections = privacyData.sections.map((section: any) =>
        section.id === editingSection.id ? editingSection : section
      )

      setPrivacyData({
        ...privacyData,
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
      icon: "Shield",
    }

    setEditingSection(newSection)
    setEditDialogOpen(true)
  }

  const handleSaveNewSection = () => {
    if (editingSection) {
      setPrivacyData({
        ...privacyData,
        sections: [...privacyData.sections, editingSection],
      })

      setEditDialogOpen(false)

      toast({
        title: "Section added",
        description: `The "${editingSection.title}" section has been added.`,
      })
    }
  }

  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = privacyData.sections.filter((section: any) => section.id !== sectionId)

    setPrivacyData({
      ...privacyData,
      sections: updatedSections,
    })

    toast({
      title: "Section deleted",
      description: "The section has been removed from your Privacy Policy.",
    })
  }

  const handleEditFaq = (faq: any, index: number) => {
    setEditingFaq({ ...faq, index })
    setFaqDialogOpen(true)
  }

  const handleSaveFaq = () => {
    if (editingFaq) {
      const updatedFaqs = [...privacyData.faq]
      updatedFaqs[editingFaq.index] = {
        question: editingFaq.question,
        answer: editingFaq.answer,
      }

      setPrivacyData({
        ...privacyData,
        faq: updatedFaqs,
      })

      setFaqDialogOpen(false)

      toast({
        title: "FAQ updated",
        description: "The FAQ item has been updated successfully.",
      })
    }
  }

  const handleAddFaq = () => {
    const newFaq = {
      question: "New FAQ Question",
      answer: "Enter the answer to the FAQ here.",
      index: privacyData.faq.length,
    }

    setEditingFaq(newFaq)
    setFaqDialogOpen(true)
  }

  const handleSaveNewFaq = () => {
    if (editingFaq) {
      setPrivacyData({
        ...privacyData,
        faq: [...privacyData.faq, {
          question: editingFaq.question,
          answer: editingFaq.answer,
        }],
      })

      setFaqDialogOpen(false)

      toast({
        title: "FAQ added",
        description: "The new FAQ item has been added successfully.",
      })
    }
  }

  const handleDeleteFaq = (index: number) => {
    const updatedFaqs = privacyData.faq.filter((_: any, i: number) => i !== index)

    setPrivacyData({
      ...privacyData,
      faq: updatedFaqs,
    })

    toast({
      title: "FAQ deleted",
      description: "The FAQ item has been removed from your Privacy Policy.",
    })
  }

  const handleUpdateLastUpdated = () => {
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    const formattedDate = today.toLocaleDateString("en-US", options)

    setPrivacyData({
      ...privacyData,
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
            Last Updated: <span className="font-medium">{privacyData.lastUpdated}</span>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sections">Main Sections</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="fullpolicy">Full Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Manage Sections</h3>
            <Button onClick={handleAddSection} size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add Section
            </Button>
          </div>

          <div className="grid gap-4">
            {privacyData.sections.map((section: any) => (
              <Card key={section.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium flex items-center">
                        {section.title}
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">
                          Icon: {section.icon}
                        </span>
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{section.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditSection(section)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteSection(section.id)} className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
            <Button onClick={handleAddFaq} size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add FAQ
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {privacyData.faq.map((faq: any, index: number) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditFaq(faq, index)} className="gap-1">
                        <Edit className="h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteFaq(index)} className="gap-1">
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="fullpolicy" className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Full Privacy Policy</h3>
          <div className="space-y-6">
            {privacyData.fullPolicy.map((policy: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{policy.title}</h4>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{policy.content}</p>
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
            <DialogTitle>{editingSection && editingSection.id.startsWith("section-") ? "Add New Section" : "Edit Section"}</DialogTitle>
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

              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={editingSection.icon}
                  onValueChange={(value) => setEditingSection({ ...editingSection, icon: value })}
                >
                  <SelectTrigger id="icon">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lock">Lock</SelectItem>
                    <SelectItem value="ShieldCheck">Shield Check</SelectItem>
                    <SelectItem value="UserCheck">User Check</SelectItem>
                    <SelectItem value="Eye">Eye</SelectItem>
                    <SelectItem value="FileText">File Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={editingSection && editingSection.id.startsWith("section-") ? handleSaveNewSection : handleSaveSection}>
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingFaq && editingFaq.index >= privacyData.faq.length ? "Add New FAQ" : "Edit FAQ"}</DialogTitle>
            <DialogDescription>
              Make changes to the FAQ content below. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          {editingFaq && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  rows={6}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setFaqDialogOpen(false)}>Cancel</Button>
            <Button onClick={editingFaq && editingFaq.index >= privacyData.faq.length ? handleSaveNewFaq : handleSaveFaq}>
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}