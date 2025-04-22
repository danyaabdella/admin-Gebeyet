import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTeamMember: any;
  setEditingTeamMember: (member: any) => void;
  isNewTeamMember: boolean;
  handleSaveTeamMember: () => void;
}

export default function TeamMemberDialog({
  open,
  onOpenChange,
  editingTeamMember,
  setEditingTeamMember,
  isNewTeamMember,
  handleSaveTeamMember,
}: TeamMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onChange={(e) =>
                  setEditingTeamMember({ ...editingTeamMember, name: e.target.value })
                }
                placeholder="e.g., John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="member-role">Role/Position</Label>
              <Input
                id="member-role"
                value={editingTeamMember.role}
                onChange={(e) =>
                  setEditingTeamMember({ ...editingTeamMember, role: e.target.value })
                }
                placeholder="e.g., Chief Executive Officer"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="member-bio">Bio</Label>
              <Textarea
                id="member-bio"
                value={editingTeamMember.bio}
                onChange={(e) =>
                  setEditingTeamMember({ ...editingTeamMember, bio: e.target.value })
                }
                placeholder="Brief biography of the team member..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="member-image">Image URL</Label>
              <Input
                id="member-image"
                value={editingTeamMember.image}
                onChange={(e) =>
                  setEditingTeamMember({ ...editingTeamMember, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveTeamMember}
            disabled={!editingTeamMember?.name || !editingTeamMember?.role}
          >
            {isNewTeamMember ? "Add Team Member" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}