"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MapPin, Phone, Mail, Clock, Building, Globe, Edit, Trash2, Plus, Save, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchLeadershipTeam, fetchPartners, fetchTestimonials, updateContactContent } from "@/utils/api-mock"

export function ContactContentManager() {
  const [contactInfo, setContactInfo] = useState<any>({
    address: "123 Business Avenue, Tech District, San Francisco, CA 94105",
    phone: "+1 (555) 123-4567",
    email: "contact@example.com",
    businessHours: [
      { days: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
      { days: "Saturday", hours: "10:00 AM - 4:00 PM" },
      { days: "Sunday", hours: "Closed" },
    ],
    mapLocation: {
      lat: 37.7749,
      lng: -122.4194,
    },
  })
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("info")

  // Dialog states
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)
  const [editingInfo, setEditingInfo] = useState<any>(null)

  const [teamMemberDialogOpen, setTeamMemberDialogOpen] = useState(false)
  const [editingTeamMember, setEditingTeamMember] = useState<any>(null)
  const [isNewTeamMember, setIsNewTeamMember] = useState(false)

  const [partnerDialogOpen, setPartnerDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<any>(null)
  const [isNewPartner, setIsNewPartner] = useState(false)

  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null)
  const [isNewTestimonial, setIsNewTestimonial] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamData, partnersData, testimonialsData] = await Promise.all([
          fetchLeadershipTeam(),
          fetchPartners(),
          fetchTestimonials(),
        ])

        setTeamMembers(teamData)
        setPartners(partnersData)
        setTestimonials(testimonialsData)
      } catch (err) {
        console.error("Failed to fetch contact page data:", err)
        toast({
          title: "Error loading content",
          description: "Failed to load Contact page content. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      await updateContactContent({
        contactInfo,
        teamMembers,
        partners,
        testimonials,
      })
      toast({
        title: "Changes saved",
        description: "Your Contact page content has been updated successfully.",
      })
    } catch (err) {
      console.error("Failed to save contact data:", err)
      toast({
        title: "Error saving changes",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Contact Info handlers
  const handleEditContactInfo = () => {
    setEditingInfo({ ...contactInfo })
    setInfoDialogOpen(true)
  }

  const handleSaveContactInfo = () => {
    setContactInfo(editingInfo)
    setInfoDialogOpen(false)
    toast({
      title: "Contact information updated",
      description: "Your contact information has been updated successfully.",
    })
  }

  // Team Member handlers
  const handleAddTeamMember = () => {
    setEditingTeamMember({
      id: `member-${Date.now()}`,
      name: "",
      role: "",
      image: "/placeholder.svg?height=300&width=300",
      bio: "",
      linkedin: "",
      twitter: "",
      email: "",
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
    if (isNewTeamMember) {
      setTeamMembers([...teamMembers, editingTeamMember])
    } else {
      setTeamMembers(teamMembers.map((member) => (member.id === editingTeamMember.id ? editingTeamMember : member)))
    }
    setTeamMemberDialogOpen(false)
    toast({
      title: isNewTeamMember ? "Team member added" : "Team member updated",
      description: isNewTeamMember
        ? `${editingTeamMember.name} has been added to the team.`
        : `${editingTeamMember.name}'s information has been updated.`,
    })
  }

  const handleDeleteTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
    toast({
      title: "Team member removed",
      description: "The team member has been removed from the leadership team.",
    })
  }

  // Partner handlers
  const handleAddPartner = () => {
    setEditingPartner({
      id: `partner-${Date.now()}`,
      name: "",
      logo: "/placeholder.svg?height=80&width=200",
      description: "",
      website: "",
      partnerSince: new Date().getFullYear().toString(),
      category: "",
    })
    setIsNewPartner(true)
    setPartnerDialogOpen(true)
  }

  const handleEditPartner = (partner: any) => {
    setEditingPartner({ ...partner })
    setIsNewPartner(false)
    setPartnerDialogOpen(true)
  }

  const handleSavePartner = () => {
    if (isNewPartner) {
      setPartners([...partners, editingPartner])
    } else {
      setPartners(partners.map((partner) => (partner.id === editingPartner.id ? editingPartner : partner)))
    }
    setPartnerDialogOpen(false)
    toast({
      title: isNewPartner ? "Partner added" : "Partner updated",
      description: isNewPartner
        ? `${editingPartner.name} has been added to the partners list.`
        : `${editingPartner.name}'s information has been updated.`,
    })
  }

  const handleDeletePartner = (id: string) => {
    setPartners(partners.filter((partner) => partner.id !== id))
    toast({
      title: "Partner removed",
      description: "The partner has been removed from the partners list.",
    })
  }

  // Testimonial handlers
  const handleAddTestimonial = () => {
    setEditingTestimonial({
      id: `testimonial-${Date.now()}`,
      quote: "",
      author: "",
      position: "",
      company: "",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      date: new Date().toISOString().split("T")[0],
    })
    setIsNewTestimonial(true)
    setTestimonialDialogOpen(true)
  }

  const handleEditTestimonial = (testimonial: any) => {
    setEditingTestimonial({ ...testimonial })
    setIsNewTestimonial(false)
    setTestimonialDialogOpen(true)
  }

  const handleSaveTestimonial = () => {
    if (isNewTestimonial) {
      setTestimonials([...testimonials, editingTestimonial])
    } else {
      setTestimonials(
        testimonials.map((testimonial) =>
          testimonial.id === editingTestimonial.id ? editingTestimonial : testimonial,
        ),
      )
    }
    setTestimonialDialogOpen(false)
    toast({
      title: isNewTestimonial ? "Testimonial added" : "Testimonial updated",
      description: isNewTestimonial
        ? `${editingTestimonial.author}'s testimonial has been added.`
        : `${editingTestimonial.author}'s testimonial has been updated.`,
    })
  }

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((testimonial) => testimonial.id !== id))
    toast({
      title: "Testimonial removed",
      description: "The testimonial has been removed from the testimonials list.",
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
      <div className="flex justify-end">
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Contact Info</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        {/* Contact Info Tab */}
        <TabsContent value="info" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <Button onClick={handleEditContactInfo} size="sm" className="gap-1">
              <Edit className="h-4 w-4" /> Edit Information
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Address</h4>
                    <p className="text-sm text-muted-foreground">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Business Hours</h4>
                    <div className="text-sm text-muted-foreground">
                      {contactInfo.businessHours.map((hours: any, index: number) => (
                        <p key={index}>
                          <span className="font-medium">{hours.days}:</span> {hours.hours}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Leadership Team</h3>
            <Button onClick={handleAddTeamMember} size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add Team Member
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${member.image})` }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="text-sm mt-2 line-clamp-2">{member.bio}</p>

                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" onClick={() => handleEditTeamMember(member)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteTeamMember(member.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {teamMembers.length === 0 && (
              <div className="col-span-2 p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-center">
                <Building className="h-10 w-10 text-muted-foreground mb-3" />
                <h4 className="font-medium">No team members added yet</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Add your leadership team to display on the Contact page
                </p>
                <Button onClick={handleAddTeamMember} size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add First Team Member
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Partners</h3>
            <Button onClick={handleAddPartner} size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add Partner
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partners.map((partner) => (
              <Card key={partner.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-3">
                    <div className="h-16 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      <div
                        className="w-full h-full bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${partner.logo})` }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{partner.name}</h4>
                      <p className="text-xs text-muted-foreground">Partner since {partner.partnerSince}</p>
                      <p className="text-sm mt-2">{partner.description}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          {partner.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" onClick={() => handleEditPartner(partner)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeletePartner(partner.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {partners.length === 0 && (
              <div className="col-span-2 p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-center">
                <Building className="h-10 w-10 text-muted-foreground mb-3" />
                <h4 className="font-medium">No partners added yet</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Add your partners to display on the Contact page
                </p>
                <Button onClick={handleAddPartner} size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add First Partner
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Testimonials</h3>
            <Button onClick={handleAddTestimonial} size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add Testimonial
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${testimonial.avatar})` }}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{testimonial.author}</h4>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.position}, {testimonial.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                        />
                      ))}
                    </div>

                    <p className="text-sm italic">&quot;{testimonial.quote}&quot;</p>

                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTestimonial(testimonial)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTestimonial(testimonial.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {testimonials.length === 0 && (
              <div className="col-span-2 p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-center">
                <Star className="h-10 w-10 text-muted-foreground mb-3" />
                <h4 className="font-medium">No testimonials added yet</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Add client testimonials to display on the Contact page
                </p>
                <Button onClick={handleAddTestimonial} size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add First Testimonial
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Contact Info Dialog */}
      <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Contact Information</DialogTitle>
            <DialogDescription>
              Update your business contact information displayed on the Contact page.
            </DialogDescription>
          </DialogHeader>

          {editingInfo && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  rows={2}
                  value={editingInfo.address}
                  onChange={(e) => setEditingInfo({ ...editingInfo, address: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editingInfo.phone}
                  onChange={(e) => setEditingInfo({ ...editingInfo, phone: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingInfo.email}
                  onChange={(e) => setEditingInfo({ ...editingInfo, email: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label>Business Hours</Label>
                {editingInfo.businessHours.map((hours: any, index: number) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Days"
                      value={hours.days}
                      onChange={(e) => {
                        const updatedHours = [...editingInfo.businessHours]
                        updatedHours[index].days = e.target.value
                        setEditingInfo({ ...editingInfo, businessHours: updatedHours })
                      }}
                    />
                    <Input
                      placeholder="Hours"
                      value={hours.hours}
                      onChange={(e) => {
                        const updatedHours = [...editingInfo.businessHours]
                        updatedHours[index].hours = e.target.value
                        setEditingInfo({ ...editingInfo, businessHours: updatedHours })
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setInfoDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveContactInfo}>
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Member Dialog */}
      <Dialog open={teamMemberDialogOpen} onOpenChange={setTeamMemberDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isNewTeamMember ? "Add Team Member" : "Edit Team Member"}</DialogTitle>
            <DialogDescription>
              {isNewTeamMember ? "Add a new member to your leadership team." : "Update team member information."}
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
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="member-role">Role/Position</Label>
                <Input
                  id="member-role"
                  value={editingTeamMember.role}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, role: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="member-bio">Bio</Label>
                <Textarea
                  id="member-bio"
                  rows={3}
                  value={editingTeamMember.bio}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, bio: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="member-image">Image URL</Label>
                <Input
                  id="member-image"
                  value={editingTeamMember.image}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, image: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="member-linkedin">LinkedIn URL (optional)</Label>
                <Input
                  id="member-linkedin"
                  value={editingTeamMember.linkedin || ""}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, linkedin: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="member-twitter">Twitter URL (optional)</Label>
                <Input
                  id="member-twitter"
                  value={editingTeamMember.twitter || ""}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, twitter: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="member-email">Email (optional)</Label>
                <Input
                  id="member-email"
                  type="email"
                  value={editingTeamMember.email || ""}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, email: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setTeamMemberDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTeamMember} disabled={!editingTeamMember?.name || !editingTeamMember?.role}>
              <Save className="h-4 w-4 mr-2" /> {isNewTeamMember ? "Add Member" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Partner Dialog */}
      <Dialog open={partnerDialogOpen} onOpenChange={setPartnerDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isNewPartner ? "Add Partner" : "Edit Partner"}</DialogTitle>
            <DialogDescription>
              {isNewPartner ? "Add a new partner to your partners list." : "Update partner information."}
            </DialogDescription>
          </DialogHeader>

          {editingPartner && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="partner-name">Partner Name</Label>
                <Input
                  id="partner-name"
                  value={editingPartner.name}
                  onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="partner-logo">Logo URL</Label>
                <Input
                  id="partner-logo"
                  value={editingPartner.logo}
                  onChange={(e) => setEditingPartner({ ...editingPartner, logo: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="partner-description">Description</Label>
                <Textarea
                  id="partner-description"
                  rows={3}
                  value={editingPartner.description}
                  onChange={(e) => setEditingPartner({ ...editingPartner, description: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="partner-website">Website URL</Label>
                <Input
                  id="partner-website"
                  value={editingPartner.website}
                  onChange={(e) => setEditingPartner({ ...editingPartner, website: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="partner-since">Partner Since (Year)</Label>
                <Input
                  id="partner-since"
                  value={editingPartner.partnerSince}
                  onChange={(e) => setEditingPartner({ ...editingPartner, partnerSince: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="partner-category">Category (optional)</Label>
                <Input
                  id="partner-category"
                  value={editingPartner.category || ""}
                  onChange={(e) => setEditingPartner({ ...editingPartner, category: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPartnerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePartner} disabled={!editingPartner?.name || !editingPartner?.website}>
              <Save className="h-4 w-4 mr-2" /> {isNewPartner ? "Add Partner" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Testimonial Dialog */}
      <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isNewTestimonial ? "Add Testimonial" : "Edit Testimonial"}</DialogTitle>
            <DialogDescription>
              {isNewTestimonial ? "Add a new client testimonial." : "Update testimonial information."}
            </DialogDescription>
          </DialogHeader>

          {editingTestimonial && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="testimonial-quote">Testimonial Quote</Label>
                <Textarea
                  id="testimonial-quote"
                  rows={4}
                  value={editingTestimonial.quote}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="testimonial-author">Author Name</Label>
                <Input
                  id="testimonial-author"
                  value={editingTestimonial.author}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="testimonial-position">Position</Label>
                <Input
                  id="testimonial-position"
                  value={editingTestimonial.position}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, position: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="testimonial-company">Company</Label>
                <Input
                  id="testimonial-company"
                  value={editingTestimonial.company}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="testimonial-avatar">Avatar URL</Label>
                <Input
                  id="testimonial-avatar"
                  value={editingTestimonial.avatar}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="testimonial-rating">Rating (1-5)</Label>
                <Input
                  id="testimonial-rating"
                  type="number"
                  min="1"
                  max="5"
                  value={editingTestimonial.rating}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, rating: Number.parseInt(e.target.value) || 5 })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setTestimonialDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveTestimonial}
              disabled={!editingTestimonial?.quote || !editingTestimonial?.author}
            >
              <Save className="h-4 w-4 mr-2" /> {isNewTestimonial ? "Add Testimonial" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
