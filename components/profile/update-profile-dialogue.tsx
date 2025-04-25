"use client"

import type React from "react"
import { useState } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { uploadImage } from "@/utils/upload"

interface UpdateProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: any
  onUpdate: (updatedProfile: any) => void
}

export function UpdateProfileDialog({ open, onOpenChange, profile, onUpdate }: UpdateProfileDialogProps) {
  const [formData, setFormData] = useState({
    fullname: profile?.fullname || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    image: profile?.image || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false) // Track image upload status
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIsUploading(true) // Disable Save button during upload

      try {
        const downloadUrl = await uploadImage(file)
        setFormData((prev) => ({ ...prev, image: downloadUrl }))

        toast({
          title: "Image Uploaded",
          description: "Your profile image has been uploaded successfully.",
        })
      } catch (error) {
        console.error("Image upload failed:", error)
        toast({
          title: "Image Upload Failed",
          description: "There was an error uploading the image. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false) // Re-enable Save button after upload completes
      }
    }
  }

  const updateAdminProfile = async (profileData: any) => {
    console.log("Updating admin profile:", profileData)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    return {
      ...profile,
      ...profileData,
      updatedAt: new Date().toISOString(),
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const updatedProfile = await updateAdminProfile(formData)

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })

      onUpdate(updatedProfile)
      onOpenChange(false) // Close dialog on successful update
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Profile Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24 border">
                <AvatarImage src={formData.image || "/placeholder.svg"} alt={formData.fullname} />
                <AvatarFallback className="text-2xl">
                  {formData.fullname
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="image-upload"
                className="cursor-pointer flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <Camera className="h-4 w-4" />
                Change Photo
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isUploading} // Disable file input during upload
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting ? "Saving..." : isUploading ? "Uploading..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}