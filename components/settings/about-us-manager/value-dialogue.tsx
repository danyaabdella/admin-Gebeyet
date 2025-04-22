import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ValueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingValue: any;
  setEditingValue: (value: any) => void;
  isNewValue: boolean;
  handleSaveValue: () => void;
}

export default function ValueDialog({
  open,
  onOpenChange,
  editingValue,
  setEditingValue,
  isNewValue,
  handleSaveValue,
}: ValueDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isNewValue ? "Add Company Value" : "Edit Company Value"}</DialogTitle>
          <DialogDescription>
            {isNewValue
              ? "Add a new core value to showcase on your About Us page."
              : "Update this company value."}
          </DialogDescription>
        </DialogHeader>
        {editingValue && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="value-title">Value Title</Label>
              <Input
                id="value-title"
                value={editingValue.title}
                onChange={(e) =>
                  setEditingValue({ ...editingValue, title: e.target.value })
                }
                placeholder="e.g., Integrity"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value-description">Description</Label>
              <Textarea
                id="value-description"
                value={editingValue.description}
                onChange={(e) =>
                  setEditingValue({ ...editingValue, description: e.target.value })
                }
                placeholder="Describe what this value means to your company..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value-icon">Icon Name</Label>
              <Input
                id="value-icon"
                value={editingValue.icon}
                onChange={(e) =>
                  setEditingValue({ ...editingValue, icon: e.target.value })
                }
                placeholder="e.g., Shield, Award, Users, etc."
              />
              <p className="text-xs text-muted-foreground">
                Enter the name of a Lucide icon (Shield, Award, Users, Heart, etc.)
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveValue}
            disabled={!editingValue?.title || !editingValue?.description}
          >
            {isNewValue ? "Add Value" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}