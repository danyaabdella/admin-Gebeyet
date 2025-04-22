import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TimelineEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTimelineEvent: any;
  setEditingTimelineEvent: (event: any) => void;
  isNewTimelineEvent: boolean;
  handleSaveTimelineEvent: () => void;
}

export default function TimelineEventDialog({
  open,
  onOpenChange,
  editingTimelineEvent,
  setEditingTimelineEvent,
  isNewTimelineEvent,
  handleSaveTimelineEvent,
}: TimelineEventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isNewTimelineEvent ? "Add Timeline Event" : "Edit Timeline Event"}</DialogTitle>
          <DialogDescription>
            {isNewTimelineEvent
              ? "Add a new event to your company timeline."
              : "Update this timeline event."}
          </DialogDescription>
        </DialogHeader>
        {editingTimelineEvent && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event-year">Year</Label>
              <Input
                id="event-year"
                value={editingTimelineEvent.year}
                onChange={(e) =>
                  setEditingTimelineEvent({ ...editingTimelineEvent, year: e.target.value })
                }
                placeholder="e.g., 2010"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                value={editingTimelineEvent.title}
                onChange={(e) =>
                  setEditingTimelineEvent({ ...editingTimelineEvent, title: e.target.value })
                }
                placeholder="e.g., Company Founded"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={editingTimelineEvent.description}
                onChange={(e) =>
                  setEditingTimelineEvent({
                    ...editingTimelineEvent,
                    description: e.target.value,
                  })
                }
                placeholder="Brief description of this event..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-image">Image URL (optional)</Label>
              <Input
                id="event-image"
                value={editingTimelineEvent.image}
                onChange={(e) =>
                  setEditingTimelineEvent({ ...editingTimelineEvent, image: e.target.value })
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
            onClick={handleSaveTimelineEvent}
            disabled={!editingTimelineEvent?.year || !editingTimelineEvent?.title}
          >
            {isNewTimelineEvent ? "Add Event" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}