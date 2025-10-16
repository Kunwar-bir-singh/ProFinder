"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, X, MapPin, Briefcase, FileText, Tag } from "lucide-react"

interface CreateProfessionModalProps {
  trigger?: React.ReactNode
}

export function CreateProfessionModal({ trigger }: CreateProfessionModalProps) {
  const [open, setOpen] = useState(false)
  const [professionName, setProfessionName] = useState("")
  const [city, setCity] = useState("")
  const [description, setDescription] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("[v0] Creating profession:", {
      professionName,
      city,
      description,
      skills,
    })

    setIsSubmitting(false)
    setOpen(false)

    // Reset form
    setProfessionName("")
    setCity("")
    setDescription("")
    setSkills([])
    setNewSkill("")
  }

  const suggestedSkills = [
    "Installation",
    "Repair",
    "Maintenance",
    "Emergency Service",
    "Consultation",
    "Design",
    "Planning",
    "Quality Assurance",
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Profession
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="h-5 w-5 text-primary" />
            Create New Profession
          </DialogTitle>
          <DialogDescription>Add a new profession to help users find the right service providers</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profession Name */}
          <div className="space-y-2">
            <Label htmlFor="modal-profession-name" className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Profession Name
            </Label>
            <Input
              id="modal-profession-name"
              value={professionName}
              onChange={(e) => setProfessionName(e.target.value)}
              placeholder="e.g., Plumber, Electrician, Carpenter"
              className="h-11"
              required
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="modal-city" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Primary City
            </Label>
            <Input
              id="modal-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., New York, Los Angeles, Chicago"
              className="h-11"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="modal-description" className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </Label>
            <Textarea
              id="modal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this profession involves..."
              className="min-h-[80px] resize-none"
              required
            />
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Common Skills & Services</Label>

            {/* Add Skill Input */}
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill or service"
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
              />
              <Button
                type="button"
                onClick={handleAddSkill}
                variant="outline"
                size="icon"
                className="shrink-0 bg-transparent"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Suggested Skills */}
            {suggestedSkills.length > 0 && skills.length < 3 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">Suggested skills:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills
                    .filter((skill) => !skills.includes(skill))
                    .slice(0, 4)
                    .map((skill) => (
                      <Button
                        key={skill}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSkills([...skills, skill])}
                        className="h-7 text-xs border border-dashed border-slate-300 hover:border-primary hover:bg-primary/5"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {skill}
                      </Button>
                    ))}
                </div>
              </div>
            )}

            {/* Selected Skills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {skill}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 h-auto p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
