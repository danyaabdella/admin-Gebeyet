import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Edit, Trash2 } from "lucide-react";

interface ValuesSectionProps {
  content: any;
  handleAddValue: () => void;
  handleEditValue: (value: any) => void;
  handleDeleteValue: (id: string) => void;
}

export default function ValuesSection({
  content,
  handleAddValue,
  handleEditValue,
  handleDeleteValue,
}: ValuesSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Company Values</CardTitle>
          <CardDescription>Edit your company's core values</CardDescription>
        </div>
        <Button size="sm" onClick={handleAddValue}>
          <Plus className="h-4 w-4 mr-1" /> Add Value
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.values.map((value: any, index: number) => (
            <Card key={value.id || `value-${index}`} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditValue(value)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteValue(value.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{value.description}</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Icon: {value.icon}
                </div>
              </CardContent>
            </Card>
          ))}
          {content.values.length === 0 && (
            <div className="col-span-2 text-center p-6 border border-dashed rounded-lg">
              <Award className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No values added yet. Click "Add Value" to create your first company value.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}