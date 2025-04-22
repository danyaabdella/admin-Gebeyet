import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TextRollingText } from "react-rolling-text";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface HeroSectionProps {
  content: any;
  setContent: (content: any) => void;
}

export default function HeroSection({ content, setContent }: HeroSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
        <CardDescription>
          Edit the main hero section of the About Us page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hero-title">Title</Label>
          <Input
            id="hero-title"
            value={content.hero.title}
            onChange={(e) =>
              setContent({
                ...content,
                hero: { ...content.hero, title: e.target.value },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero-subtitle">Subtitle</Label>
          <Textarea
            id="hero-subtitle"
            value={content.hero.subtitle}
            onChange={(e) =>
              setContent({
                ...content,
                hero: { ...content.hero, subtitle: e.target.value },
              })
            }
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero-description">Description</Label>
          <Textarea
            id="hero-description"
            value={content.hero.description}
            onChange={(e) =>
              setContent({
                ...content,
                hero: { ...content.hero, description: e.target.value },
              })
            }
            rows={5}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero-image">Hero Image URL</Label>
          <Input
            id="hero-image"
            value={content.hero.image}
            onChange={(e) =>
              setContent({
                ...content,
                hero: { ...content.hero, image: e.target.value },
              })
            }
          />
        </div>
        {content.hero.image && (
          <div className="mt-4 border rounded-md p-2">
            <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
            <div className="relative h-40 bg-muted rounded-md overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${content.hero.image})` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}