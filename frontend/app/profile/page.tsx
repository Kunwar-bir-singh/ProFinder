"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetUserDetailsQuery,
  useUpdateProfileMutation,
} from "@/lib/api/services/user/user.service";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import {
  Camera,
  MapPin,
  Phone,
  Mail,
  User,
  Briefcase,
  Save,
  Upload,
  Shield,
  CheckCircle,
} from "lucide-react";
import { VerificationModal } from "@/components/verification-modal";
import { type User as UserType } from "@/lib/utils/types/types";

export default function EditProfilePage() {
  const { toast } = useToast();
  const { data: userData, isLoading } = useGetUserDetailsQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [userType, setUserType] = useState<"user" | "provider">("user");
  const [originalUserType, setOriginalUserType] = useState<"user" | "provider">("user");
  const [originalProfession, setOriginalProfession] = useState<string>("");
  const [is_verified, setIs_verified] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const [profileData, setProfileData] = useState<UserType>();

  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      setProfileData({
        username: user.username || "",
        fullname: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
        profession: user.profession || "",
        city: user.city || "",
        address: user.address || "",
        bio: user.bio || "",
        experience: user.experience || 0,
        serviceArea: user.serviceArea || "",
        type: user.type as "user" | "provider",
        is_verified: user.is_verified || false,
      });
      setUserType(user.type as "user" | "provider");
      setOriginalUserType(user.type as "user" | "provider");
      setOriginalProfession(user.profession || "");
      setIs_verified(user.is_verified || false);
    }
  }, [userData]);

  const handleInputChange = (field: keyof UserType, value: string) => {
    setProfileData(
      (prev) =>
        ({
          ...prev,
          [field]: value,
        } as UserType)
    );
  };

  // Helper function to check if user toggled to provider
  const hasToggledToProvider = userType === "provider" && originalUserType !== "provider";
  
  // Helper function to check if profession has changed
  const hasChangedProfession = profileData?.profession && profileData.profession !== originalProfession;

  const handleSave = async () => {
    try {
      // Create the base update payload
      const updatePayload: any = {
        ...profileData,
        experience: profileData?.experience || 0,
        type: userType,
      };

      // Add boolean fields based on user actions
      if (hasToggledToProvider) {
        updatePayload.isProvider = true;
      }
      
      if (hasChangedProfession) {
        updatePayload.changeProfession = true;
      }

      await updateProfile(updatePayload).unwrap();

      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerificationSuccess = () => {
    setIs_verified(true);
    setShowVerificationModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {isLoading ? (
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="text-slate-600">Loading profile...</p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Edit Profile
              </h1>
              <p className="text-slate-600">
                Update your profile information and preferences
              </p>
            </div>

            {/* User Type Toggle */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Label
                      htmlFor="user-type"
                      className="text-base font-medium"
                    >
                      Account Type:
                    </Label>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-sm ${
                          userType === "user"
                            ? "font-semibold text-primary"
                            : "text-slate-500"
                        }`}
                      >
                        User
                      </span>
                      <Switch
                        id="user-type"
                        checked={userType === "provider"}
                        onCheckedChange={(checked) =>
                          setUserType(checked ? "provider" : "user")
                        }
                      />
                      <span
                        className={`text-sm ${
                          userType === "provider"
                            ? "font-semibold text-primary"
                            : "text-slate-500"
                        }`}
                      >
                        Provider
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={userType === "provider" ? "default" : "secondary"}
                    className="capitalize"
                  >
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
                      <Label className="text-base font-medium">
                        Account Verification
                      </Label>
                      <p className="text-sm text-slate-600 mt-1">
                        {is_verified
                          ? "Your account is verified"
                          : "Verify your account to build trust with users"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {is_verified ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowVerificationModal(true)}
                      >
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
                        <AvatarImage
                          src="/professional-plumber-headshot.jpg"
                          alt="Profile"
                        />
                        <AvatarFallback className="text-2xl">
                          {profileData?.fullname
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
                      {is_verified && (
                        <div className="absolute -top-1 -right-1">
                          <CheckCircle className="h-6 w-6 text-green-600 bg-white rounded-full" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">
                        {profileData?.fullname}
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-slate-600">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{profileData?.phone}</span>
                      </div>
                      {userType === "provider" && (
                        <>
                          <div className="flex items-center justify-center gap-2 text-slate-600">
                            <Briefcase className="h-4 w-4" />
                            <span className="text-sm capitalize">
                              {profileData?.profession}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-2 text-slate-600">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm capitalize">{profileData?.city}</span>
                          </div>
                          <Badge variant="outline" className="mt-2">
                            {profileData?.experience}+ Years Experience
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
                          value={profileData?.username}
                          onChange={(e) =>
                            handleInputChange("username", e.target.value)
                          }
                          placeholder="Enter username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fullname">Full Name</Label>
                        <Input
                          id="fullname"
                          value={profileData?.fullname}
                          onChange={(e) =>
                            handleInputChange("fullname", e.target.value)
                          }
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
                            value={profileData?.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
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
                            value={profileData?.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
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
                            <Input
                              value={profileData?.profession}
                              onChange={(e) =>
                                handleInputChange("profession", e.target.value)
                              }
                              id="profession"
                              placeholder="Enter your profession"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="experience">
                              Years of Experience
                            </Label>
                            <Input
                              id="experience"
                              value={profileData?.experience}
                              onChange={(e) =>
                                handleInputChange("experience", e.target.value)
                              }
                              placeholder="Enter years of experience"
                              type="number"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="service-area">Service Area</Label>
                          <Input
                            id="service-area"
                            value={profileData?.serviceArea}
                            onChange={(e) =>
                              handleInputChange("serviceArea", e.target.value)
                            }
                            placeholder="Enter service area"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Professional Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData?.bio}
                            onChange={(e) =>
                              handleInputChange("bio", e.target.value)
                            }
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
                            value={profileData?.city}
                            onChange={(e) =>
                              handleInputChange("city", e.target.value)
                            }
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
                        value={profileData?.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Enter full address"
                        rows={3}
                      />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleSave}
                        className="px-8"
                        disabled={isLoading || isUpdating}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerificationSuccess={handleVerificationSuccess}
        userEmail={profileData?.email as string}
      />
    </div>
  );
}
