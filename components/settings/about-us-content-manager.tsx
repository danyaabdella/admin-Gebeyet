"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Trash2, Save, Edit, Award, Users, History, BarChart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { fetchAboutUsContent, updateAboutContent } from "@/utils/api-mock"

export function AboutUsContentManager() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("hero")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [content, setContent] = useState<any>(null)

  // Dialog states
  const [valueDialogOpen, setValueDialogOpen] = useState(false)
  const [editingValue, setEditingValue] = useState<any>(null)
  const [isNewValue, setIsNewValue] = useState(false)

  const [teamMemberDialogOpen, setTeamMemberDialogOpen] = useState(false)
  const [editingTeamMember, setEditingTeamMember] = useState<any>(null)
  const [isNewTeamMember, setIsNewTeamMember] = useState(false)

  const [statDialogOpen, setStatDialogOpen] = useState(false)
  const [editingStat, setEditingStat] = useState<any>(null)
  const [isNewStat, setIsNewStat] = useState(false)

  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false)
  const [editingTimelineEvent, setEditingTimelineEvent] = useState<any>(null)
  const [isNewTimelineEvent, setIsNewTimelineEvent] = useState(false)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await fetchAboutUsContent()
        setContent(data)
      } catch (error) {
        console.error("Failed to fetch about us content:", error)
        toast({
          title: "Error loading content",
          description: "Failed to load About Us content. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [toast])

  const handleSaveChanges = async () => {
    if (!content) return

    setIsSaving(true)
    try {
      await updateAboutContent(content)
      toast({
        title: "Content updated",
        description: "About Us content has been successfully updated.",
      })
    } catch (error) {
      console.error("Failed to save about us content:", error)
      toast({
        title: "Error saving content",
        description: "Failed to save About Us content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Values handlers
  const handleAddValue = () => {
    setEditingValue({
      id: `value-${Date.now()}`,
      title: "",
      description: "",
      icon: "Award",
    })
    setIsNewValue(true)
    setValueDialogOpen(true)
  }

  const handleEditValue = (value: any) => {
    setEditingValue({ ...value })
    setIsNewValue(false)
    setValueDialogOpen(true)
  }

  const handleSaveValue = () => {
    if (!editingValue?.title || !editingValue?.description) return

    if (isNewValue) {
      setContent({
        ...content,
        values: [...content.values, editingValue],
      })
    } else {
      setContent({
        ...content,
        values: content.values.map((value: any) => (value.id === editingValue.id ? editingValue : value)),
      })
    }

    setValueDialogOpen(false)
    toast({
      title: isNewValue ? "Value added" : "Value updated",
      description: isNewValue
        ? `${editingValue.title} has been added to your company values.`
        : `${editingValue.title} has been updated.`,
    })
  }

  const handleDeleteValue = (id: string) => {
    setContent({
      ...content,
      values: content.values.filter((value: any) => value.id !== id),
    })

    toast({
      title: "Value deleted",
      description: "The value has been removed from your company values.",
    })
  }

  // Team member handlers
  const handleAddTeamMember = () => {
    setEditingTeamMember({
      id: `member-${Date.now()}`,
      name: "",
      role: "",
      bio: "",
      image: "/placeholder.svg?height=300&width=300",
    })
    setIsNewTeamMember(true)
    setTeamMemberDialogOpen(true)
  }

  const handleEditTeamMember = (member: any) => {
    setEditingTeamMember({ ...member })
    setIsNewTeamMember(false)
    setTeamMemberDialogOpen(true)
  }

  const handleSaveTeamMember = () => {
    if (!editingTeamMember?.name || !editingTeamMember?.role) return

    if (isNewTeamMember) {
      setContent({
        ...content,
        team: {
          ...content.team,
          members: [...content.team.members, editingTeamMember],
        },
      })
    } else {
      setContent({
        ...content,
        team: {
          ...content.team,
          members: content.team.members.map((member: any) =>
            member.id === editingTeamMember.id ? editingTeamMember : member,
          ),
        },
      })
    }

    setTeamMemberDialogOpen(false)
    toast({
      title: isNewTeamMember ? "Team member added" : "Team member updated",
      description: isNewTeamMember
        ? `${editingTeamMember.name} has been added to your team.`
        : `${editingTeamMember.name}'s information has been updated.`,
    })
  }

  const handleDeleteTeamMember = (id: string) => {
    setContent({
      ...content,
      team: {
        ...content.team,
        members: content.team.members.filter((member: any) => member.id !== id),
      },
    })

    toast({
      title: "Team member deleted",
      description: "The team member has been removed from your team.",
    })
  }

  // Stats handlers
  const handleAddStat = () => {
    setEditingStat({
      id: `stat-${Date.now()}`,
      value: "",
      label: "",
    })
    setIsNewStat(true)
    setStatDialogOpen(true)
  }

  const handleEditStat = (stat: any) => {
    setEditingStat({ ...stat })
    setIsNewStat(false)
    setStatDialogOpen(true)
  }

  const handleSaveStat = () => {
    if (!editingStat?.value || !editingStat?.label) return

    if (isNewStat) {
      setContent({
        ...content,
        stats: [...content.stats, editingStat],
      })
    } else {
      setContent({
        ...content,
        stats: content.stats.map((stat: any) => (stat.id === editingStat.id ? editingStat : stat)),
      })
    }

    setStatDialogOpen(false)
    toast({
      title: isNewStat ? "Stat added" : "Stat updated",
      description: isNewStat
        ? `${editingStat.label} has been added to your stats.`
        : `${editingStat.label} has been updated.`,
    })
  }

  const handleDeleteStat = (id: string) => {
    setContent({
      ...content,
      stats: content.stats.filter((stat: any) => stat.id !== id),
    })

    toast({
      title: "Stat deleted",
      description: "The stat has been removed from your stats.",
    })
  }

  // Timeline handlers
  const handleAddTimelineEvent = () => {
    setEditingTimelineEvent({
      year: "",
      title: "",
      description: "",
      image: "/placeholder.svg?height=100&width=100",
    })
    setIsNewTimelineEvent(true)
    setTimelineDialogOpen(true)
  }

  const handleEditTimelineEvent = (event: any, index: number) => {
    setEditingTimelineEvent({ ...event, index })
    setIsNewTimelineEvent(false)
    setTimelineDialogOpen(true)
  }

  const handleSaveTimelineEvent = () => {
    if (!editingTimelineEvent?.year || !editingTimelineEvent?.title) return

    if (isNewTimelineEvent) {
      setContent({
        ...content,
        history: {
          ...content.history,
          timeline: [
            ...content.history.timeline,
            {
              year: editingTimelineEvent.year,
              title: editingTimelineEvent.title,
              description: editingTimelineEvent.description,
              image: editingTimelineEvent.image,
            },
          ],
        },
      })
    } else {
      const updatedTimeline = [...content.history.timeline]
      updatedTimeline[editingTimelineEvent.index] = {
        year: editingTimelineEvent.year,
        title: editingTimelineEvent.title,
        description: editingTimelineEvent.description,
        image: editingTimelineEvent.image,
      }

      setContent({
        ...content,
        history: {
          ...content.history,
          timeline: updatedTimeline,
        },
      })
    }

    setTimelineDialogOpen(false)
    toast({
      title: isNewTimelineEvent ? "Timeline event added" : "Timeline event updated",
      description: isNewTimelineEvent
        ? `${editingTimelineEvent.title} has been added to your timeline.`
        : `${editingTimelineEvent.title} has been updated.`,
    })
  }

  const handleDeleteTimelineEvent = (index: number) => {
    const updatedTimeline = [...content.history.timeline]
    updatedTimeline.splice(index, 1)

    setContent({
      ...content,
      history: {
        ...content.history,
        timeline: updatedTimeline,
      },
    })

    toast({
      title: "Timeline event deleted",
      description: "The event has been removed from your timeline.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading About Us content...</span>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg">
        <h3 className="text-lg font-medium text-destructive">Error loading content</h3>
        <p className="mt-2">Unable to load About Us content. Please refresh the page or contact support.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">About Us Content Management</h2>
          <p className="text-muted-foreground">Manage the content displayed on the About Us page</p>
        </div>
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="mission">Mission & Vision</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
          <TabsTrigger value="history">History & Stats</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Edit the main hero section of the About Us page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Title</Label>
                <Input
                  id="hero-title"
                  value={content.hero.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, title: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Textarea
                  id="hero-subtitle"
                  value={content.hero.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, subtitle: e.target.value },
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-description">Description</Label>
                <Textarea
                  id="hero-description"
                  value={content.hero.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, description: e.target.value },
                    })
                  }
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-image">Hero Image URL</Label>
                <Input
                  id="hero-image"
                  value={content.hero.image}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, image: e.target.value },
                    })
                  }
                />
              </div>
              {content.hero.image && (
                <div className="mt-4 border rounded-md p-2">
                  <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
                  <div className="relative h-40 bg-muted rounded-md overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${content.hero.image})` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mission & Vision Section */}
        <TabsContent value="mission" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mission Statement</CardTitle>
              <CardDescription>Edit your company&apos;s mission statement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mission-title">Title</Label>
                <Input
                  id="mission-title"
                  value={content.mission.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      mission: { ...content.mission, title: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mission-content">Content</Label>
                <Textarea
                  id="mission-content"
                  value={content.mission.content}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      mission: { ...content.mission, content: e.target.value },
                    })
                  }
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mission-image">Image URL</Label>
                <Input
                  id="mission-image"
                  value={content.mission.image}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      mission: { ...content.mission, image: e.target.value },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vision Statement</CardTitle>
              <CardDescription>Edit your company&apos;s vision statement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vision-title">Title</Label>
                <Input
                  id="vision-title"
                  value={content.vision.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      vision: { ...content.vision, title: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision-content">Content</Label>
                <Textarea
                  id="vision-content"
                  value={content.vision.content}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      vision: { ...content.vision, content: e.target.value },
                    })
                  }
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision-image">Image URL</Label>
                <Input
                  id="vision-image"
                  value={content.vision.image}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      vision: { ...content.vision, image: e.target.value },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Values Section */}
        <TabsContent value="values" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Company Values</CardTitle>
                <CardDescription>Edit your company&apos;s core values</CardDescription>
              </div>
              <Button size="sm" onClick={handleAddValue}>
                <Plus className="h-4 w-4 mr-1" /> Add Value
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.values.map((value: any) => (
                  <Card key={value.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{value.title}</CardTitle>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditValue(value)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteValue(value.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{value.description}</p>
                      <div className="mt-2 text-xs text-muted-foreground">Icon: {value.icon}</div>
                    </CardContent>
                  </Card>
                ))}

                {content.values.length === 0 && (
                  <div className="col-span-2 text-center p-6 border border-dashed rounded-lg">
                    <Award className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No values added yet. Click &quot;Add Value&quot; to create your first company value.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History & Stats Section */}
        <TabsContent value="history" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Company History</CardTitle>
                <CardDescription>Edit your company&apos;s timeline and history</CardDescription>
              </div>
              <div>
                <Input
                  className="mb-2"
                  placeholder="Timeline Title"
                  value={content.history.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      history: { ...content.history, title: e.target.value },
                    })
                  }
                />
                <Button size="sm" onClick={handleAddTimelineEvent}>
                  <Plus className="h-4 w-4 mr-1" /> Add Timeline Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.history.timeline.map((event: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-md">{event.year}</div>
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditTimelineEvent(event, index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteTimelineEvent(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {content.history.timeline.length === 0 && (
                  <div className="text-center p-6 border border-dashed rounded-lg">
                    <History className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No timeline events added yet. Click &quot;Add Timeline Event&quot; to create your company history.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Company Stats</CardTitle>
                <CardDescription>Showcase key metrics and achievements</CardDescription>
              </div>
              <Button size="sm" onClick={handleAddStat}>
                <Plus className="h-4 w-4 mr-1" /> Add Stat
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {content.stats.map((stat: any) => (
                  <Card key={stat.id} className="relative">
                    <CardContent className="pt-6 text-center">
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditStat(stat)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleDeleteStat(stat.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}

                {content.stats.length === 0 && (
                  <div className="col-span-4 text-center p-6 border border-dashed rounded-lg">
                    <BarChart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No stats added yet. Click &quot;Add Stat&quot; to showcase your company achievements.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Section */}
        <TabsContent value="team" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your team members displayed on the About Us page</CardDescription>
              </div>
              <div>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="team-title">Section Title</Label>
                  <Input
                    id="team-title"
                    value={content.team.title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        team: { ...content.team, title: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="team-description">Section Description</Label>
                  <Textarea
                    id="team-description"
                    value={content.team.description}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        team: { ...content.team, description: e.target.value },
                      })
                    }
                    rows={2}
                  />
                </div>
                <Button size="sm" onClick={handleAddTeamMember}>
                  <Plus className="h-4 w-4 mr-1" /> Add Team Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {content.team.members.map((member: any) => (
                  <Card key={member.id}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-muted mb-3">
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${member.image})` }}
                          />
                        </div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <p className="text-xs mt-2 line-clamp-3">{member.bio}</p>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" onClick={() => handleEditTeamMember(member)}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteTeamMember(member.id)}>
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {content.team.members.length === 0 && (
                  <div className="col-span-3 text-center p-6 border border-dashed rounded-lg">
                    <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No team members added yet. Click &quot;Add Team Member&quot; to showcase your team.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Value Dialog */}
      <Dialog open={valueDialogOpen} onOpenChange={setValueDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isNewValue ? "Add Company Value" : "Edit Company Value"}</DialogTitle>
            <DialogDescription>
              {isNewValue ? "Add a new core value to showcase on your About Us page." : "Update this company value."}
            </DialogDescription>
          </DialogHeader>

          {editingValue && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="value-title">Value Title</Label>
                <Input
                  id="value-title"
                  value={editingValue.title}
                  onChange={(e) => setEditingValue({ ...editingValue, title: e.target.value })}
                  placeholder="e.g., Integrity"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value-description">Description</Label>
                <Textarea
                  id="value-description"
                  value={editingValue.description}
                  onChange={(e) => setEditingValue({ ...editingValue, description: e.target.value })}
                  placeholder="Describe what this value means to your company..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value-icon">Icon Name</Label>
                <Input
                  id="value-icon"
                  value={editingValue.icon}
                  onChange={(e) => setEditingValue({ ...editingValue, icon: e.target.value })}
                  placeholder="e.g., Shield, Award, Users, etc."
                />
                <p className="text-xs text-muted-foreground">
                  Enter the name of a Lucide icon (Shield, Award, Users, Heart, etc.)
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setValueDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveValue} disabled={!editingValue?.title || !editingValue?.description}>
              {isNewValue ? "Add Value" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Member Dialog */}
      <Dialog open={teamMemberDialogOpen} onOpenChange={setTeamMemberDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isNewTeamMember ? "Add Team Member" : "Edit Team Member"}</DialogTitle>
            <DialogDescription>
              {isNewTeamMember
                ? "Add a new team member to showcase on your About Us page."
                : "Update this team member's information."}
            </DialogDescription>
          </DialogHeader>

          {editingTeamMember && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="member-name">Name</Label>
                <Input
                  id="member-name"
                  value={editingTeamMember.name}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, name: e.target.value })}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="member-role">Role/Position</Label>
                <Input
                  id="member-role"
                  value={editingTeamMember.role}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, role: e.target.value })}
                  placeholder="e.g., Chief Executive Officer"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="member-bio">Bio</Label>
                <Textarea
                  id="member-bio"
                  value={editingTeamMember.bio}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, bio: e.target.value })}
                  placeholder="Brief biography of the team member..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="member-image">Image URL</Label>
                <Input
                  id="member-image"
                  value={editingTeamMember.image}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setTeamMemberDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTeamMember} disabled={!editingTeamMember?.name || !editingTeamMember?.role}>
              {isNewTeamMember ? "Add Team Member" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stat Dialog */}
      <Dialog open={statDialogOpen} onOpenChange={setStatDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isNewStat ? "Add Company Stat" : "Edit Company Stat"}</DialogTitle>
            <DialogDescription>
              {isNewStat ? "Add a new statistic to showcase on your About Us page." : "Update this statistic."}
            </DialogDescription>
          </DialogHeader>

          {editingStat && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="stat-value">Value</Label>
                <Input
                  id="stat-value"
                  value={editingStat.value}
                  onChange={(e) => setEditingStat({ ...editingStat, value: e.target.value })}
                  placeholder="e.g., 500+"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stat-label">Label</Label>
                <Input
                  id="stat-label"
                  value={editingStat.label}
                  onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                  placeholder="e.g., Clients Served"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setStatDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStat} disabled={!editingStat?.value || !editingStat?.label}>
              {isNewStat ? "Add Stat" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Timeline Event Dialog */}
      <Dialog open={timelineDialogOpen} onOpenChange={setTimelineDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isNewTimelineEvent ? "Add Timeline Event" : "Edit Timeline Event"}</DialogTitle>
            <DialogDescription>
              {isNewTimelineEvent ? "Add a new event to your company timeline." : "Update this timeline event."}
            </DialogDescription>
          </DialogHeader>

          {editingTimelineEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="event-year">Year</Label>
                <Input
                  id="event-year"
                  value={editingTimelineEvent.year}
                  onChange={(e) => setEditingTimelineEvent({ ...editingTimelineEvent, year: e.target.value })}
                  placeholder="e.g., 2010"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-title">Title</Label>
                <Input
                  id="event-title"
                  value={editingTimelineEvent.title}
                  onChange={(e) => setEditingTimelineEvent({ ...editingTimelineEvent, title: e.target.value })}
                  placeholder="e.g., Company Founded"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  value={editingTimelineEvent.description}
                  onChange={(e) => setEditingTimelineEvent({ ...editingTimelineEvent, description: e.target.value })}
                  placeholder="Brief description of this event..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-image">Image URL (optional)</Label>
                <Input
                  id="event-image"
                  value={editingTimelineEvent.image}
                  onChange={(e) => setEditingTimelineEvent({ ...editingTimelineEvent, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setTimelineDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveTimelineEvent}
              disabled={!editingTimelineEvent?.year || !editingTimelineEvent?.title}
            >
              {isNewTimelineEvent ? "Add Event" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
