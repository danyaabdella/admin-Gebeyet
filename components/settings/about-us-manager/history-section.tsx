import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HistorySectionProps {
  content: any;
  setContent: (content: any) => void;
  handleAddTimelineEvent: () => void;
  handleEditTimelineEvent: (event: any) => void;
  handleDeleteTimelineEvent: (id: string) => void;
}

export default function HistorySection({
  content,
  setContent,
  handleAddTimelineEvent,
  handleEditTimelineEvent,
  handleDeleteTimelineEvent,
}: HistorySectionProps) {
  const { history } = content;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Company History</CardTitle>
          <CardDescription>Edit your company's timeline and history</CardDescription>
        </div>
        <Button size="sm" onClick={handleAddTimelineEvent}>
          <Plus className="h-4 w-4 mr-1" /> Add Timeline Event
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((event: any, index: number) => (
            <Card key={event.id} className="relative">
              <CardContent className="pt-6">
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleEditTimelineEvent(event)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleDeleteTimelineEvent(event.id)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="Year"
                    value={event.year}
                    onChange={(e) => {
                      const updatedHistory = [...content.history];
                      updatedHistory[index] = {
                        ...event,
                        year: e.target.value,
                      };
                      setContent({ ...content, history: updatedHistory });
                    }}
                  />
                  <Input
                    placeholder="Title"
                    value={event.title}
                    onChange={(e) => {
                      const updatedHistory = [...content.history];
                      updatedHistory[index] = {
                        ...event,
                        title: e.target.value,
                      };
                      setContent({ ...content, history: updatedHistory });
                    }}
                  />
                  <Textarea
                    placeholder="Description"
                    value={event.description}
                    onChange={(e) => {
                      const updatedHistory = [...content.history];
                      updatedHistory[index] = {
                        ...event,
                        description: e.target.value,
                      };
                      setContent({ ...content, history: updatedHistory });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          {content.history.length === 0 && (
            <div className="text-center p-6 border border-dashed rounded-lg">
              <History className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No timeline events added yet. Click "Add Timeline Event" to create your company history.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}