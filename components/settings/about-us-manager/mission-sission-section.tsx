import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MissionVisionSectionProps {
  content: any;
  setContent: (content: any) => void;
}

export default function MissionVisionSection({ content, setContent }: MissionVisionSectionProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Mission Statement</CardTitle>
          <CardDescription>Edit your company's mission statement</CardDescription>
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
          <CardDescription>Edit your company's vision statement</CardDescription>
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
    </>
  );
}