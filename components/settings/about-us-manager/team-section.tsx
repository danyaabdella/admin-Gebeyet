import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, Edit, Trash2 } from "lucide-react";

interface TeamSectionProps {
  content: any;
  setContent: (content: any) => void;
  handleAddTeamMember: () => void;
  handleEditTeamMember: (member: any) => void;
  handleDeleteTeamMember: (id: string) => void;
}

export default function TeamSection({
  content,
  setContent,
  handleAddTeamMember,
  handleEditTeamMember,
  handleDeleteTeamMember,
}: TeamSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team members displayed on the About Us page
          </CardDescription>
        </div>
        <div>
          <div className="space-y-2 mb-4">
            <Label htmlFor="team-title">Section Title</Label>
            <Input
              id="team-title"
              value={content.team.name}
              onChange={(e) =>
                setContent({
                  ...content,
                  team: { ...content.team, name: e.target.value },
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTeamMember(member)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTeamMember(member.id)}
                    >
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
                No team members added yet. Click "Add Team Member" to showcase your team.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}