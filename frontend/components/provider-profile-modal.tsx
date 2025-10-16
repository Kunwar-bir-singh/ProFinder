"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Star, Clock, CheckCircle, Briefcase, Calendar, MessageCircle, Heart } from "lucide-react"

interface Provider {
  id: string
  name: string
  profession: string
  rating: number
  reviewCount: number
  experience: string
  location: string
  phone: string
  email: string
  bio: string
  serviceArea: string
  availability: string
  isVerified: boolean
  profileImage: string
  completedJobs: number
  responseTime: string
  services: string[]
  pricing: {
    hourly?: string
    fixed?: string
  }
}

interface ProviderProfileModalProps {
  isOpen: boolean
  onClose: () => void
  provider: Provider | null
}

export function ProviderProfileModal({ isOpen, onClose, provider }: ProviderProfileModalProps) {
  if (!provider) return null

  const handleContact = () => {
    // Handle contact logic
    console.log("Contacting provider:", provider.name)
  }

  const handleBookService = () => {
    // Handle booking logic
    console.log("Booking service with:", provider.name)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Provider Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Provider Header */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 mx-auto sm:mx-0">
                <AvatarImage src={provider.profileImage || "/placeholder.svg"} alt={provider.name} />
                <AvatarFallback className="text-xl">
                  {provider.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {provider.isVerified && (
                <div className="absolute -top-1 -right-1">
                  <CheckCircle className="h-6 w-6 text-green-600 bg-white rounded-full" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-slate-900">{provider.name}</h2>
                {provider.isVerified && (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 border-green-200 w-fit mx-auto sm:mx-0"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              <p className="text-lg text-primary font-medium capitalize mb-2">{provider.profession}</p>

              <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-600">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{provider.rating}</span>
                  <span>({provider.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.location}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{provider.experience} years experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{provider.completedJobs}</div>
                <div className="text-sm text-slate-600">Jobs Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{provider.responseTime}</div>
                <div className="text-sm text-slate-600">Response Time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{provider.rating}</div>
                <div className="text-sm text-slate-600">Rating</div>
              </CardContent>
            </Card>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About</h3>
            <p className="text-slate-700 leading-relaxed">{provider.bio}</p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
            <div className="flex flex-wrap gap-2">
              {provider.services.map((service, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700">{provider.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700">{provider.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700">{provider.serviceArea}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700">{provider.availability}</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Pricing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {provider.pricing.hourly && (
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-slate-600 mb-1">Hourly Rate</div>
                    <div className="text-xl font-bold text-primary">{provider.pricing.hourly}</div>
                  </CardContent>
                </Card>
              )}
              {provider.pricing.fixed && (
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-slate-600 mb-1">Fixed Rate</div>
                    <div className="text-xl font-bold text-primary">{provider.pricing.fixed}</div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleContact} className="flex-1 bg-transparent">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Provider
            </Button>
            <Button onClick={handleBookService} className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Book Service
            </Button>
            <Button variant="outline" size="icon" className="sm:w-auto bg-transparent">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
