import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingStat: any;
  setEditingStat: (stat: any) => void;
  isNewStat: boolean;
  handleSaveStat: () => void;
}

export default function StatDialog({
  open,
  onOpenChange,
  editingStat,
  setEditingStat,
  isNewStat,
  handleSaveStat,
}: StatDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isNewStat ? "Add Company Stat" : "Edit Company Stat"}</DialogTitle>
          <DialogDescription>
            {isNewStat
              ? "Add a new statistic to showcase on your About Us page."
              : "Update this statistic."}
          </DialogDescription>
        </DialogHeader>
        {editingStat && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="stat-value">Value</Label>
              <Input
                id="stat-value"
                value={editingStat.value}
                onChange={(e) =>
                  setEditingStat({ ...editingStat, value: e.target.value })
                }
                placeholder="e.g., 500+"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stat-label">Label</Label>
              <Input
                id="stat-label"
                value={editingStat.label}
                onChange={(e) =>
                  setEditingStat({ ...editingStat, label: e.target.value })
                }
                placeholder="e.g., Clients Served"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveStat}
            disabled={!editingStat?.value || !editingStat?.label}
          >
            {isNewStat ? "Add Stat" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}