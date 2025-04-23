// "use client"

// import { useState, useEffect } from "react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { Loader2, Plus, Trash2, Save, Edit, X } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { fetchAboutContent, updateAboutContent } from "@/lib/api-mock"

// interface AboutSection {
//   id: string
//   title: string
//   content: string
//   order: number
// }

// interface TeamMember {
//   id: string
//   name: string
//   position: string
//   bio: string
//   imageUrl: string
//   order: number
// }

// interface AboutContent {
//   hero: {
//     title: string
//     subtitle: string
//     imageUrl: string
//   }
//   mission: {
//     title: string
//     content: string
//   }
//   vision: {
//     title: string
//     content: string
//   }
//   values: {
//     title: string
//     items: { id: string; title: string; description: string }[]
//   }
//   sections: AboutSection[]
//   team: TeamMember[]
// }

// export default function AboutContentManager() {
//   const { toast } = useToast();
//   const [activeTab, setActiveTab] = useState("hero");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [content, setContent] = useState<AboutContent | null>(null);
//   const [editingSection, setEditingSection] = useState<string | null>(null);
//   const [editingTeamMember, setEditingTeamMember] = useState<string | null>(null);
//   const [editingValue, setEditingValue] = useState<string | null>(null);
//   const [newSectionDialog, setNewSectionDialog] = useState(false);
//   const [newTeamMemberDialog, setNewTeamMemberDialog] = useState(false);
//   const [newValueDialog, setNewValueDialog] = useState(false);
//   const [newSection, setNewSection] = useState<Partial<AboutSection>>({
//     title: "",
//     content: "",
//   });
//   const [newTeamMember, setNewTeamMember] = useState<Partial<TeamMember>>({
//     name: "",
//     position: "",
//     bio: "",
//     imageUrl: "/placeholder.svg?height=200&width=200",
//   });
//   const [newValue, setNewValue] = useState({
//     title: "",
//     description: "",
//   });

//   useEffect(() => {
//     const loadContent = async () => {
//       try {
//         const data = await fetchAboutContent();
//         setContent(data);
//       } catch (error) {
//         toast({
//           title: "Error loading content",
//           description: "Failed to load About Us content. Please try again.",
//           variant: "destructive",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadContent();
//   }, [toast]);

//   const handleSave = async () => {
//     if (!content) return;

//     setIsSaving(true);
//     try {
//       await updateAboutContent(content);
//       toast({
//         title: "Content updated",
//         description: "About Us content has been successfully updated.",
//       });
//     } catch (error) {
//       toast({
//         title: "Error saving content",
//         description: "Failed to save About Us content. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const addNewSection = () => {
//     if (!content || !newSection.title || !newSection.content) return;

//     const newSectionWithId = {
//       ...newSection,
//       id: `section-${Date.now()}`,
//       order: content.sections.length + 1,
//     } as AboutSection;

//     setContent({
//       ...content,
//       sections: [...content.sections, newSectionWithId],
//     });

//     setNewSection({
//       title: "",
//       content: "",
//     });
//     setNewSectionDialog(false);

//     toast({
//       title: "Section added",
//       description: "New section has been added to About Us page.",
//     });
//   };

//   const addNewTeamMember = () => {
//     if (!content || !newTeamMember.name || !newTeamMember.position) return;

//     const newMemberWithId = {
//       ...newTeamMember,
//       id: `team-${Date.now()}`,
//       order: content.team.length + 1,
//     } as TeamMember;

//     setContent({
//       ...content,
//       team: [...content.team, newMemberWithId],
//     });

//     setNewTeamMember({
//       name: "",
//       position: "",
//       bio: "",
//       imageUrl: "/placeholder.svg?height=200&width=200",
//     });
//     setNewTeamMemberDialog(false);

//     toast({
//       title: "Team member added",
//       description: "New team member has been added to About Us page.",
//     });
//   };

//   const addNewValue = () => {
//     if (!content || !newValue.title || !newValue.description) return;

//     const newValueWithId = {
//       ...newValue,
//       id: `value-${Date.now()}`,
//     };

//     setContent({
//       ...content,
//       values: {
//         ...content.values,
//         items: [...content.values.items, newValueWithId],
//       },
//     });

//     setNewValue({
//       title: "",
//       description: "",
//     });
//     setNewValueDialog(false);

//     toast({
//       title: "Value added",
//       description: "New company value has been added to About Us page.",
//     });
//   };

//   const deleteSection = (id: string) => {
//     if (!content) return;

//     setContent({
//       ...content,
//       sections: content.sections.filter(section => section.id !== id),
//     });

//     toast({
//       title: "Section deleted",
//       description: "Section has been removed from About Us page.",
//     });
//   };

//   const deleteTeamMember = (id: string) => {
//     if (!content) return;

//     setContent({
//       ...content,
//       team: content.team.filter(member => member.id !== id),
//     });

//     toast({
//       title: "Team member deleted",
//       description: "Team member has been removed from About Us page.",
//     });
//   };

//   const deleteValue = (id: string) => {
//     if (!content) return;

//     setContent({
//       ...content,
//       values: {
//         ...content.values,
//         items: content.values.items.filter(value => value.id !== id),
//       },
//     });

//     toast({
//       title: "Value deleted",
//       description: "Company value has been removed from About Us page.",
//     });
//   };

//   const updateSection = (id: string, field: keyof AboutSection, value: string) => {
//     if (!content) return;

//     setContent({
//       ...content,
//       sections: content.sections.map(section => 
//         section.id === id ? { ...section, [field]: value } : section
//       ),
//     });
//   };

//   const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
//     if (!content) return;

//     setContent({
//       ...content,
//       team: content.team.map(member => 
//         member.id === id ? { ...member, [field]: value } : member
//       ),
//     });
//   };

//   const updateValue = (id: string, field: 'title' | 'description', value: string) => {
//     if (!content) return;

//     setContent({
//       ...content,
//       values: {
//         ...content.values,
//         items: content.values.items.map(item => 
//           item.id === id ? { ...item, [field]: value } : item
//         ),
//       },
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//         <span className="ml-2 text-lg">Loading About Us content...</span>
//       </div>
//     );
//   }

//   if (!content) {
//     return (
//       <div className="p-6 bg-destructive/10 rounded-lg">
//         <h3 className="text-lg font-medium text-destructive">Error loading content</h3>
//         <p className="mt-2">Unable to load About Us content. Please refresh the page or contact support.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">About Us Content Management</h2>
//           <p className="text-muted-foreground">Manage the content displayed on the About Us page</p>
//         </div>
//         <Button onClick={handleSave} disabled={isSaving}>
//           {isSaving ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Saving...
//             </>
//           ) : (
//             <>
//               <Save className="mr-2 h-4 w-4" />
//               Save Changes
//             </>
//           )}
//         </Button>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid grid-cols-5 w-full">
//           <TabsTrigger value="hero">Hero</TabsTrigger>
//           <TabsTrigger value="mission">Mission & Vision</TabsTrigger>
//           <TabsTrigger value="values">Values</TabsTrigger>
//           <TabsTrigger value="sections">Sections</TabsTrigger>
//           <TabsTrigger value="team">Team</TabsTrigger>
//         </TabsList>

//         {/* Hero Section */}
//         <TabsContent value="hero" className="space-y-4 pt-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Hero Section</CardTitle>
//               <CardDescription>Edit the main hero section of the About Us page</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="hero-title">Title</Label>
//                 <Input 
//                   id="hero-title" 
//                   value={content.hero.title} 
//                   onChange={(e) => setContent({
//                     ...content,
//                     hero: { ...content.hero, title: e.target.value }
//                   })}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="hero-subtitle">Subtitle</Label>
//                 <Textarea 
//                   id="hero-subtitle" 
//                   value={content.hero.subtitle} 
//                   onChange={(e) => setContent({
//                     ...content,
//                     hero: { ...content.hero, subtitle: e.target.value }
//                   })}
//                   rows={3}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="hero-image">Hero Image URL</Label>
//                 <Input 
//                   id="hero-image" 
//                   value={content.hero.imageUrl} 
//                   onChange={(e) => setContent({
//                     ...content,
//                     hero: { ...content.hero, imageUrl: e.target.value }
//                   })}
//                 />
//               </div>
//               {content.hero.imageUrl && (
//                 <div className="mt-4 border rounded-md p-2">
//                   <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
//                   <div className="relative h-40 bg-muted rounded-md overflow-hidden">
//                     <div 
//                       className="absolute inset-0 bg-cover bg-center"
//                       style={{ backgroundImage: `url(${content.hero.imageUrl})` }}
//                     />
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Mission & Vision Section */}
//         <TabsContent value="mission" className="space-y-4 pt-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Mission Statement</CardTitle>
//               <CardDescription>Edit your company's mission statement</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="mission-title">Title</Label>
//                 <Input 
//                   id="mission-title" 
//                   value={content.mission.title} 
//                   onChange={(e) => setContent({
//                     ...content,
//                     mission: { ...content.mission, title: e.target.value }
//                   })}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="mission-content">Content</Label>
//                 <Textarea 
//                   id="mission-content" 
//                   value={content.mission.content} 
//                   onChange={(e) => setContent({
//                     ...content,
//                     mission: { ...content.mission, content: e.target.value }
//                   })}
//                   rows={5}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Vision Statement</CardTitle>
//               <CardDescription>Edit your company's vision statement</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="vision-title">Title</Label>
//                 <Input 
//                   id="vision-title" 
//                   value={content.vision.title} 
//                   onChange={(e) => setContent({
//                     ...content,
//                     vision: { ...content.vision, title: e.target.value }
//                   })}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="vision-content">Content</Label>
//                 <Textarea 
//                   id="vision-content" 
//                   value={content.vision.content} 
//                   onChange={(e) => setContent({
//                     ...content,
//                     vision: { ...content.vision, content: e.target.value }
//                   })}
//                   rows={5}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Values Section */}
//         <TabsContent value="values" className="space-y-4 pt-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle>Company Values</CardTitle>
//                 <CardDescription>Edit your company's core values</CardDescription>
//               </div>
//               <Dialog open={newValueDialog} onOpenChange={setNewValueDialog}>
//                 <DialogTrigger asChild>
//                   <Button size="sm">
//                     <Plus className="h-4 w-4 mr-1" /> Add Value
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>Add New Company Value</DialogTitle>
//                     <DialogDescription>
//                       Add a new core value to showcase on your About Us page.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="space-y-4 py-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="new-value-title">Value Title</Label>
//                       <Input 
//                         id="new-value-title" 
//                         value={newValue.title} 
//                         onChange={(e) => setNewValue({...newValue, title: e.target.value})}
//                         placeholder="e.g., Integrity"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="new-value-description">Description</Label>
//                       <Textarea 
//                         id="new-value-description" 
//                         value={newValue.description} 
//                         onChange={(e) => setNewValue({...newValue, description: e.target.value})}
//                         placeholder="Describe what this value means to your company..."
//                         rows={3}
//                       />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button variant="outline" onClick={() => setNewValueDialog(false)}>Cancel</Button>
//                     <Button onClick={addNewValue} disabled={!newValue.title || !newValue.description}>
//                       Add Value
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="values-title">Section Title</Label>
//                 <Input 
//                   id="values-title" 
//                   value={content.values.title} 
//                   onChange={(e) => setContent({
//                     ...content,
//                     values: { ...content.values, title: e.target.value }
//                   })}
//                 />
//               </div>
              
//               <Separator className="my-4" />
              
//               <div className="space-y-4">
//                 {content.values.items.map((value) => (
//                   <Card key={value.id} className="relative">
//                     {editingValue === value.id ? (
//                       <CardContent className="pt-6 space-y-4">
//                         <div className="absolute top-2 right-2 flex space-x-2">
//                           <Button 
//                             variant="ghost" 
//                             size="icon" 
//                             onClick={() => setEditingValue(null)}
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor={`value-title-${value.id}`}>Value Title</Label>
//                           <Input 
//                             id={`value-title-${value.id}`} 
//                             value={value.title} 
//                             onChange={(e) => updateValue(value.id, 'title', e.target.value)}
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor={`value-desc-${value.id}`}>Description</Label>
//                           <Textarea 
//                             id={`value-desc-${value.id}`} 
//                             value={value.description} 
//                             onChange={(e) => updateValue(value.id, 'description', e.target.value)}
//                             rows={3}
//                           />
//                         </div>
//                         <Button 
//                           className="w-full" 
//                           onClick={() => setEditingValue(null)}
//                         >
//                           Save Changes
//                         </Button>
//                       </CardContent>
//                     ) : (
//                       <>
//                         <CardHeader className="pb-2">
//                           <div className="flex justify-between items-center">
//                             <CardTitle className="text-lg">{value.title}</CardTitle>
//                             <div className="flex space-x-1">
//                               <Button 
//                                 variant="ghost" 
//                                 size="icon" 
//                                 onClick={() => setEditingValue(value.id)}
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </Button>
//                               <Button 
//                                 variant="ghost" 
//                                 size="icon" 
//                                 onClick={() => deleteValue(value.id)}
//                               >
//                                 <Trash2 className="h-4 w-4 text-destructive" />
//                               </Button>
//                             </div>
//                           </div>
//                         </CardHeader>
//                         <CardContent>
//                           <p className="text-muted-foreground">{value.description}</p>
//                         </CardContent>
//                       </>
//                     )}
//                   </Card>
//                 ))}

//                 {content.values.items.length === 0 && (
//                   <div className="text-center p-6 border border-dashed rounded-lg">
//                     <p className="text-muted-foreground">No values added yet. Click "Add Value" to create your first company value.</p>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Additional Sections */}
//         <TabsContent value="sections" className="space-y-4 pt-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle>Additional Sections</CardTitle>
//                 <CardDescription>Manage additional content sections for the About Us page</CardDescription>
//               </div>
//               <Dialog open={newSectionDialog} onOpenChange={setNewSectionDialog}>
//                 <DialogTrigger asChild>
//                   <Button size="sm">
//                     <Plus className="h-4 w-4 mr-1" /> Add Section
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>Add New Section</DialogTitle>
//                     <DialogDescription>
//                       Create a new content section for your About Us page.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="space-y-4 py-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="new-section-title">Section Title</Label>
//                       <Input 
//                         id="new-section-title" 
//                         value={newSection.title} 
//                         onChange={(e) => setNewSection({...newSection, title: e.target.value})}
//                         placeholder="e.g., Our History"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="new-section-content">Content</Label>
//                       <Textarea 
//                         id="new-section-content" 
//                         value={newSection.content} 
//                         onChange={(e) => setNewSection({...newSection, content: e.target.value})}
//                         placeholder="Enter the content for this section..."
//                         rows={5}
//                       />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button variant="outline" onClick={() => setNewSectionDialog(false)}>Cancel</Button>
//                     <Button onClick={addNewSection} disabled={!newSection.title || !newSection.content}>
//                       Add Section
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {content.sections.map((section) => (
//                   <Card key={section.id} className="relative">
//                     {editingSection === section.id ? (
//                       <CardContent className="pt-6 space-y-4">
//                         <div className="absolute top-2 right-2 flex space-x-2">
//                           <Button 
//                             variant="ghost" 
//                             size="icon" 
//                             onClick={() => setEditingSection(null)}
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor={`section-title-${section.id}`}>Section Title</Label>
//                           <Input 
//                             id={`section-title-${section.id}`} 
//                             value={section.title} 
//                             onChange={(e) => updateSection(section.id, 'title', e.target.value)}
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor={`section-content-${section.id}`}>Content</Label>
//                           <Textarea 
//                             id={`section-content-${section.id}`} 
//                             value={section.content} 
//                             onChange={(e) => updateSection(section.id, 'content', e.target.value)}
//                             rows={5}
//                           />
//                         </div>
//                         <Button 
//                           className="w-full" 
//                           onClick={() => setEditingSection(null)}
//                         >
//                           Save Changes
//                         </Button>
//                       </CardContent>
//                     ) : (
//                       <>
//                         <CardHeader className="pb-2">
//                           <div className="flex justify-between items-center">
//                             <CardTitle>{section.title}</CardTitle>
//                             <div className="flex space-x-1">
//                               <Button 
//                                 variant="ghost" 
//                                 size="icon" 
//                                 onClick={() => setEditingSection(section.id)}
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </Button>
//                               <Button 
//                                 variant="ghost" 
//                                 size="icon" 
//                                 onClick={() => deleteSection(section.id)}
//                               >
//                                 <Trash2 className="h-4 w-4 text-destructive" />
//                               </Button>
//                             </div>
//                           </div>
//                         </CardHeader>
//                         <CardContent>
//                           <p className="text-muted-foreground line-clamp-2">{section.content}</p>
//                         </CardContent>
//                       </>
//                     )}
//                   </Card>
//                 ))}

//                 {content.sections.length === 0 && (
//                   <div className="text-center p-6 border border-dashed rounded-lg">
//                     <p className="text-muted-foreground">No additional sections added yet. Click "Add Section" to create your first section.</p>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Team Section */}
//         <TabsContent value="team" className="space-y-4 pt-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle>Team Members</CardTitle>
//                 <CardDescription>Manage your team members displayed on the About Us page</CardDescription>
//               </div>
//               <Dialog open={newTeamMemberDialog} onOpenChange={setNewTeamMemberDialog}>
//                 <DialogTrigger asChild>
//                   <Button size="sm">
//                     <Plus className="h-4 w-4 mr-1" /> Add Team Member
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>Add New Team Member</DialogTitle>
//                     <DialogDescription>
//                       Add a new team member to showcase on your About Us page.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="space-y-4 py-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="new-member-name">Name</Label>
//                       <Input 
//                         id="new-member-name" 
//                         value={newTeamMember.name} 
//                         onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
//                         placeholder="e.g., John Doe"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="new-member-position">Position</Label>
//                       <Input 
//                         id="new-member-position" 
//                         value={newTeamMember.position} 
//                         onChange={(e) => setNewTeamMember({...newTeamMember, position: e.target.value})}
//                         placeholder="e.g., Chief Executive Officer"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="new-member-bio">Bio</Label>
//                       <Textarea 
//                         id="new-member-bio" 
//                         value={newTeamMember.bio} 
//                         onChange={(e) => setNewTeamMember({...newTeamMember, bio: e.target.value})}
//                         placeholder="Brief biography of the team member..."
//                         rows={3}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="new-member-image">Image URL</Label>
//                       <Input 
//                         id="new-member-image" 
//                         value={newTeamMember.imageUrl} 
//                         onChange={(e) => setNewTeamMember({...newTeamMember, imageUrl: e.target.value})}
//                         placeholder="https://example.com/image.jpg"
//                       />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button variant="outline" onClick={() => setNewTeamMemberDialog(false)}>Cancel</Button>
//                     <Button onClick={addNewTeamMember} disabled={!newTeamMember.name || !newTeamMember.position}>
//                       Add Team Member
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {content.team.map((member) => (
//                   <Card key={member.id} className="relative">
//                     {editingTeamMember === member.id ? (
//                       <CardContent className="pt-6 space-y-4">
//                         <div className="absolute top-2 right-2 flex space-x-2">
//                           <Button 
//                             variant="ghost" 
//                             size="icon" 
//                             onClick={() => setEditingTeamMember(null)}
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor={`member-name-${member.id}`}>Name</Label>
//                           <Input 
//                             id={`member-name-${member.id}`} 
//                             value={member.name} 
//                             onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor={`member-position-${member.id}`}>Position</Label>
//                           <Input 
//                             id={`member-position-${member.id}`} 
//                             value={member.position} 
//                             onChange={(e) => updateTeamMember(member.id, 'position', e.target.value)}
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor={`member-bio-${member.id}`}>Bio</Label>
//                           <Textarea 
//                             id={`member-bio-${member.id}`} 
//                             value={member.bio} 
//                             onChange={(e) => updateTeamMember(member.id, 'bio', e.target.value)}
//                             rows={3}
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor={`member-image-${member.id}`}>Image URL</Label>
//                           <Input 
//                             id={`
