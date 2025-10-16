"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, MapPin, Phone, Mail, User, Briefcase, Save, Upload, Shield, CheckCircle } from "lucide-react"
import { VerificationModal } from "@/components/verification-modal"

export default function EditProfilePage() {
  const [userType, setUserType] = useState<"user" | "provider">("provider")
  const [isVerified, setIsVerified] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)

  const [profileData, setProfileData] = useState({
    username: "Kunwarbir Singh",
    fullname: "Kunwarbir Singh",
    email: "kunwarbir@example.com",
    phone: "9914126177",
    profession: "plumber",
    city: "ludhiana",
    address: "123 Main Street, Ludhiana, Punjab",
    bio: "Experienced plumber with 8+ years in residential and commercial plumbing services.",
    experience: "8",
    serviceArea: "Ludhiana and surrounding areas",
  })

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log("Saving profile:", profileData)
    // Handle save logic here
  }

  const handleVerificationSuccess = () => {
    setIsVerified(true)
    setShowVerificationModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Profile</h1>
            <p className="text-slate-600">Update your profile information and preferences</p>
          </div>

          {/* User Type Toggle */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="user-type" className="text-base font-medium">
                    Account Type:
                  </Label>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-sm ${userType === "user" ? "font-semibold text-primary" : "text-slate-500"}`}
                    >
                      User
                    </span>
                    <Switch
                      id="user-type"
                      checked={userType === "provider"}
                      onCheckedChange={(checked) => setUserType(checked ? "provider" : "user")}
                    />
                    <span
                      className={`text-sm ${userType === "provider" ? "font-semibold text-primary" : "text-slate-500"}`}
                    >
                      Provider
                    </span>
                  </div>
                </div>
                <Badge variant={userType === "provider" ? "default" : "secondary"} className="capitalize">
                  {userType}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status Card */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Shield className="h-5 w-5 text-slate-600" />
                  <div>
                    <Label className="text-base font-medium">Account Verification</Label>
                    <p className="text-sm text-slate-600 mt-1">
                      {isVerified ? "Your account is verified" : "Verify your account to build trust with users"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {isVerified ? (
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setShowVerificationModal(true)}>
                      <Shield className="h-4 w-4 mr-2" />
                      Verify Account
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-32 w-32 mx-auto">
                      <AvatarImage src="/professional-plumber-headshot.jpg" alt="Profile" />
                      <AvatarFallback className="text-2xl">
                        {profileData.fullname
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full h-10 w-10 p-0"
                      variant="secondary"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    {/* Verification Badge on Avatar */}
                    {isVerified && (
                      <div className="absolute -top-1 -right-1">
                        <CheckCircle className="h-6 w-6 text-green-600 bg-white rounded-full" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{profileData.fullname}</h3>
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{profileData.phone}</span>
                    </div>
                    {userType === "provider" && (
                      <>
                        <div className="flex items-center justify-center gap-2 text-slate-600">
                          <Briefcase className="h-4 w-4" />
                          <span className="text-sm capitalize">{profileData.profession}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-slate-600">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{profileData.city}</span>
                        </div>
                        <Badge variant="outline" className="mt-2">
                          {profileData.experience}+ Years Experience
                        </Badge>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Form Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        placeholder="Enter username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Full Name</Label>
                      <Input
                        id="fullname"
                        value={profileData.fullname}
                        onChange={(e) => handleInputChange("fullname", e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter email address"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="Enter phone number"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Provider-specific fields */}
                  {userType === "provider" && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="profession">Profession</Label>
                          <Select
                            value={profileData.profession}
                            onValueChange={(value) => handleInputChange("profession", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select profession" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="plumber">Plumber</SelectItem>
                              <SelectItem value="electrician">Electrician</SelectItem>
                              <SelectItem value="carpenter">Carpenter</SelectItem>
                              <SelectItem value="painter">Painter</SelectItem>
                              <SelectItem value="mechanic">Mechanic</SelectItem>
                              <SelectItem value="cleaner">Cleaner</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Input
                            id="experience"
                            value={profileData.experience}
                            onChange={(e) => handleInputChange("experience", e.target.value)}
                            placeholder="Enter years of experience"
                            type="number"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="service-area">Service Area</Label>
                        <Input
                          id="service-area"
                          value={profileData.serviceArea}
                          onChange={(e) => handleInputChange("serviceArea", e.target.value)}
                          placeholder="Enter service area"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Professional Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          placeholder="Tell us about your professional experience and services"
                          rows={4}
                        />
                      </div>
                    </>
                  )}

                  {/* Location Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="city"
                          value={profileData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="Enter city"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter full address"
                      rows={3}
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} className="px-8">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerificationSuccess={handleVerificationSuccess}
        userEmail={profileData.email}
      />
    </div>
  )
}
