"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Phone, Shield, Clock } from "lucide-react"
import { ProviderProfileModal } from "@/components/provider-profile-modal"

interface Provider {
  id: number
  username: string
  fullname: string
  profession: string
  phone: string
  address: string
  rating: number
  reviewCount: number
  verified: boolean
  yearsExperience: number
  profileImage: string
}

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const [showProfileModal, setShowProfileModal] = useState(false)

  const modalProvider = {
    id : provider?.id,
    name: provider?.fullname,
    profession: provider?.profession,
    rating: provider?.rating,
    reviewCount: provider?.reviewCount,
    experience: `${provider?.yearsExperience}`,
    location: provider?.address?.split(",")[0] || provider?.address,
    phone: provider?.phone,
    email: `${provider?.username}@example.com`,
    bio: `Experienced ${provider?.profession} with ${provider?.yearsExperience}+ years in the field. Committed to providing high-quality services and customer satisfaction.`,
    serviceArea: provider?.address,
    availability: "Mon-Sat, 8:00 AM - 6:00 PM",
    is_verified: provider?.verified,
    profileImage: provider?.profileImage,
    completedJobs: Math.floor(Math.random() * 100) + 50,
    responseTime: "< 2 hours",
    services: [
      `${provider?.profession} Installation`,
      `${provider?.profession} Repair`,
      `${provider?.profession} Maintenance`,
      "Emergency Service",
    ],
    pricing: {
      hourly: `₹${Math.floor(Math.random() * 500) + 300}/hour`,
      fixed: `₹${Math.floor(Math.random() * 2000) + 1000} (basic service)`,
    },
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-slate-200/30 hover:border-primary/40 bg-card">
        <CardContent className="p-6">
          {/* Header with avatar and basic info */}
          <div className="flex items-start gap-4 mb-4 pb-4 border-b border-slate-200/20">
            <Avatar className="w-16 h-16 border-2 border-primary/20 ring-2 ring-primary/5">
              <AvatarImage src={provider?.profileImage || "/placeholder.svg"} alt={provider?.fullname} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {provider?.fullname?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{provider?.fullname}</h3>
                {provider?.verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-2 capitalize">Professional {provider?.profession}</p>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-sm">{provider?.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">({provider?.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Experience badge */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200/10">
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {provider?.yearsExperience} years experience
            </Badge>
          </div>

          {/* Contact info */}
          <div className="space-y-2 mb-6 pb-4 border-b border-slate-200/10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4 text-primary" />
              <span className="font-mono">{provider?.phone}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{provider?.address}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button className="flex-1" size="sm">
              Contact Now
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowProfileModal(true)}>
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProviderProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        provider={modalProvider}
      />
    </>
  )
}
