"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Award, Building, ChevronRight, Globe, Lightbulb, MapPin, Shield, Target, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { fetchAboutUsContent } from "@/utils/api-mock"

export default function AboutUsPage() {
  const [aboutData, setAboutData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const data = await fetchAboutUsContent()
        setAboutData(data)
      } catch (err) {
        console.error("Failed to fetch about us data:", err)
        setError("Failed to load About Us content. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadAboutData()
  }, [])

  // Function to render the appropriate icon
  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case "Lightbulb":
        return <Lightbulb className={className} />
      case "Shield":
        return <Shield className={className} />
      case "Award":
        return <Award className={className} />
      case "Users":
        return <Users className={className} />
      default:
        return <Lightbulb className={className} />
    }
  }

  if (error) {
    return (
      <div className="container relative mx-auto px-4 py-12 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container relative mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 max-w-7xl">
      {/* Hero Section */}
      <div className="relative mb-16">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {aboutData.hero.title}
              </h1>
              <p className="mt-4 text-xl font-medium text-purple-600 dark:text-purple-400">
                {aboutData.hero.subtitle}
              </p>
              <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
                {aboutData.hero.description}
              </p>
            </div>

            <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden">
              <Image
                src={aboutData.hero.image || "/placeholder.svg"}
                alt="About our company"
                fill
                className="object-cover"
                priority
              />
            </div>
          </>
        )}
      </div>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {isLoading ? (
          <>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </>
        ) : (
          <>
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={aboutData.mission.image || "/placeholder.svg"}
                  alt="Our mission"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Target className="h-6 w-6 text-purple-600 mr-2" />
                  <h2 className="text-2xl font-bold">{aboutData.mission.title}</h2>
                </div>
                <p className="text-muted-foreground">{aboutData.mission.content}</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={aboutData.vision.image || "/placeholder.svg"}
                  alt="Our vision"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Globe className="h-6 w-6 text-indigo-600 mr-2" />
                  <h2 className="text-2xl font-bold">{aboutData.vision.title}</h2>
                </div>
                <p className="text-muted-foreground">{aboutData.vision.content}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Our Core Values</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutData.values.map((value: any) => (
              <Card key={value.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                    {renderIcon(value.icon, "h-6 w-6 text-purple-600 dark:text-purple-400")}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl p-8 mb-16">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {aboutData.stats.map((stat: any) => (
              <div key={stat.id} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">{stat.value}</p>
                <p className="text-sm sm:text-base text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Timeline Section */}
      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          {isLoading ? <Skeleton className="h-8 w-64 mx-auto" /> : aboutData.history.title}
        </h2>

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-purple-200 dark:bg-purple-900/50"></div>

            <div className="space-y-12">
              {aboutData.history.timeline.map((event: any, index: number) => (
                <div
                  key={event.year}
                  className={`relative flex flex-col md:flex-row ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="md:w-1/2 mb-4 md:mb-0">
                    <div
                      className={`relative ${
                        index % 2 === 0 ? "md:pl-8" : "md:pr-8"
                      } p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm`}
                    >
                      <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">{event.year}</h3>
                      <h4 className="text-lg font-semibold mb-2">{event.title}</h4>
                      <p className="text-muted-foreground">{event.description}</p>
                    </div>
                  </div>

                  <div className="md:w-1/2 flex justify-center items-center">
                    <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-purple-600 border-4 border-white dark:border-gray-900 z-10"></div>
                    <div className="hidden md:block w-24 h-24 rounded-full overflow-hidden mx-auto">
                      <Image src={event.image || "/placeholder.svg"} alt={event.title} width={96} height={96} className="object-cover" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-64 mx-auto mb-4" />
              <Skeleton className="h-4 w-96 mx-auto" />
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold">{aboutData.team.title}</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{aboutData.team.description}</p>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {aboutData.team.members.map((member: any) => (
              <Card key={member.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} className="object-cover" />
                    <AvatarFallback className="text-4xl rounded-none h-full">
                      {member.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400">{member.role}</p>
                  <p className="text-xs text-muted-foreground mt-2">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Locations Section */}
      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Our Global Presence</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aboutData.locations.map((location: any) => (
              <Card key={location.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image src={location.image || "/placeholder.svg"} alt={location.city} fill className="object-cover" />
                  {location.isHeadquarters && (
                    <Badge className="absolute top-2 right-2 bg-purple-600">Headquarters</Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-lg">
                        {location.city}, {location.country}
                      </h3>
                      <p className="text-muted-foreground text-sm">{location.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Awards Section */}
      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Awards & Recognition</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aboutData.awards.map((award: any) => (
              <Card key={award.id} className="overflow-hidden">
                <CardContent className="p-6 flex items-start">
                  <div className="mr-4 flex-shrink-0">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Award className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold">{award.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {award.organization}, {award.year}
                    </p>
                    <p className="text-sm mt-2">{award.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{aboutData.cta.title}</h2>
          <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">{aboutData.cta.description}</p>
          <Link href={aboutData.cta.buttonLink}>
            <Button size="lg" variant="secondary" className="group">
              {aboutData.cta.buttonText}
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
