"use client"

import { useEffect, useState, createRef } from "react"
import { Mail, Phone, MapPin, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { LeadershipTeam } from "@/components/contact/leadership-team"
import { Partners } from "@/components/contact/partners"
import { Testimonials } from "@/components/contact/testimonial"
import { fetchLeadershipTeam, fetchPartners, fetchTestimonials } from "@/utils/api-mock"
import { Loader } from "@googlemaps/js-api-loader"
import { ContactForm } from "@/components/contact/contact-form"

interface ContactInfo {
  email: string
  phone: string
  address: string
  businessHours: string
}

export default function ContactPage() {
  const [leadershipData, setLeadershipData] = useState<any[]>([])
  const [partnersData, setPartnersData] = useState<any[]>([])
  const [testimonialsData, setTestimonialsData] = useState<any[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [isLoading, setIsLoading] = useState({
    leadership: true,
    partners: true,
    testimonials: true,
    contactInfo: true,
  })
  const [error, setError] = useState<string | null>(null)
  
  // Map specific states
  const mapsDivRef = createRef<HTMLDivElement>()
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)
  const location = [ 37.3878, 11.5876]
  const title = "Our Office"

  useEffect(() => {
    const loadData = async () => {
      try {
        const [leadership, partners, testimonials, contactResponse] = await Promise.all([
          fetchLeadershipTeam(),
          fetchPartners(),
          fetchTestimonials(),
          fetch("/api/about/contact-info").then(res => res.json()),
        ])

        if (!contactResponse.success) {
          throw new Error(contactResponse.error || "Failed to fetch contact info")
        }

        setLeadershipData(leadership)
        setPartnersData(partners)
        setTestimonialsData(testimonials)
        setContactInfo(contactResponse.data)
      } catch (err) {
        console.error("Failed to fetch contact page data:", err)
        setError("Failed to load some content. Please try again later.")
      } finally {
        setIsLoading({
          leadership: false,
          partners: false,
          testimonials: false,
          contactInfo: false,
        })
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (!mapsDivRef.current) return

    const loadMap = async () => {
      try {
        setIsMapLoading(true)
        setMapError(null)

        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_MAPS_KEY as string,
          version: "weekly",
        })

        await loader.load()

        const { Map } = await loader.importLibrary("maps")
        const { AdvancedMarkerElement } = await loader.importLibrary("marker")

        const map = new Map(mapsDivRef.current as HTMLDivElement, {
          mapId: "map",
          center: { lng: location[0], lat: location[1] },
          zoom: 6,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true,
          fullscreenControl: true,
        })

        new AdvancedMarkerElement({
          map,
          position: { lng: location[0], lat: location[1] },
          title: title,
        })

        setIsMapLoading(false)
      } catch (error) {
        console.error("Error loading map:", error)
        setMapError("Failed to load map. Please try again later.")
        setIsMapLoading(false)
      }
    }

    loadMap()
  }, [])

  return (
    <div className="container relative mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 max-w-7xl">
      <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-muted-foreground">
          We&apos;d love to hear from you. Get in touch with our team.
        </p>
      </div>

      {/* Hero section with contact options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-16">
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Get in Touch</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Have questions about our products or services? Need help with an order? Our team is here to assist you.
          </p>

          {isLoading.contactInfo ? (
            <div className="grid gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3 sm:mb-0">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="sm:ml-4">
                  <h3 className="text-base sm:text-lg font-medium">Email Us</h3>
                  <p className="text-muted-foreground text-sm">Our friendly team is here to help.</p>
                  <a
                    href={`mailto:${contactInfo?.email}`}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline mt-1 block"
                  >
                    {contactInfo?.email}
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-3 sm:mb-0">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="sm:ml-4">
                  <h3 className="text-base sm:text-lg font-medium">Call Us</h3>
                  <p className="text-muted-foreground text-sm">Mon-Fri from 8am to 5pm.</p>
                  <a
                    href={`tel:${contactInfo?.phone}`}
                    className="text-cyan-600 dark:text-cyan-400 hover:underline mt-1 block"
                  >
                    {contactInfo?.phone}
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3 sm:mb-0">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="sm:ml-4">
                  <h3 className="text-base sm:text-lg font-medium">Visit Us</h3>
                  <p className="text-muted-foreground text-sm">Come say hello at our office.</p>
                  <p className="text-muted-foreground text-sm mt-1 whitespace-pre-line">
                    {contactInfo?.address}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-3 sm:mb-0">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="sm:ml-4">
                  <h3 className="text-base sm:text-lg font-medium">Business Hours</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-line">
                    {contactInfo?.businessHours}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 p-4 sm:p-8 rounded-xl border border-emerald-100 dark:border-emerald-900">
          <ContactForm />
        </div>
      </div>

      {/* Leadership Team Section */}
      <div className="mb-12 sm:mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-12">Our Leadership Team</h2>
        {isLoading.leadership ? (
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        ) : (
          <LeadershipTeam leadershipData={leadershipData} />
        )}
      </div>

      {/* Partners & Testimonials Tabs */}
      <div className="mb-12 sm:mb-20">
        <Tabs defaultValue="partners" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
            <TabsTrigger value="partners">Our Partners</TabsTrigger>
            <TabsTrigger value="testimonials">Client Testimonials</TabsTrigger>
          </TabsList>
          <TabsContent value="partners">
            {isLoading.partners ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : (
              <Partners partnersData={partnersData} />
            )}
          </TabsContent>
          <TabsContent value="testimonials">
            {isLoading.testimonials ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : (
              <Testimonials testimonialsData={testimonialsData} />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Map Section */}
      <div className="mb-8 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">Find Us</h2>
        <div className="aspect-video w-full rounded-xl overflow-hidden border relative">
          {isMapLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm">Loading map...</p>
              </div>
            </div>
          )}

          {mapError && (
            <div className="h-full flex items-center justify-center bg-muted">
              <div className="text-center p-4">
                <MapPin className="h-8 w-8 mx-auto text-red-500" />
                <p className="font-medium mt-2">Map Error</p>
                <p className="text-sm text-muted-foreground mt-1">{mapError}</p>
              </div>
            </div>
          )}

          <div
            ref={mapsDivRef}
            className="w-full h-full transition-opacity duration-300"
            style={{ opacity: isMapLoading || mapError ? 0 : 1 }}
          ></div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-8 sm:mb-16 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-base sm:text-lg font-medium mb-2">What are your business hours?</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                {contactInfo?.businessHours || "Our office is open Monday through Friday from 9am to 5pm, Saturday from 10am to 2pm, and closed on Sundays."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-base sm:text-lg font-medium mb-2">How quickly do you respond to inquiries?</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                We aim to respond to all inquiries within 24 business hours. For urgent matters, please call our office
                directly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-base sm:text-lg font-medium mb-2">Do you offer virtual meetings?</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Yes, we offer virtual meetings via Zoom, Google Meet, or Microsoft Teams. Please indicate your
                preference when scheduling.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}