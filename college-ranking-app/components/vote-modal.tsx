"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ThumbsUp, Star, Briefcase } from "lucide-react"
import { mockColleges } from "@/lib/mock-data"

interface VoteModalProps {
  collegeId: string | null
  profession: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (vote: {
    collegeId: string
    profession: string
    rating: number
    reason?: string
    experience?: string
  }) => void
}

const experienceLevels = [
  { value: "current-student", label: "Current Student" },
  { value: "recent-graduate", label: "Recent Graduate (0-2 years)" },
  { value: "experienced", label: "Experienced Professional (3-10 years)" },
  { value: "senior", label: "Senior Professional (10+ years)" },
]

export function VoteModal({ collegeId, profession, isOpen, onClose, onSubmit }: VoteModalProps) {
  const [rating, setRating] = useState<number>(5)
  const [reason, setReason] = useState("")
  const [experience, setExperience] = useState("")

  const college = collegeId ? mockColleges.find((c) => c.id === collegeId) : null

  const handleSubmit = () => {
    if (!collegeId) return

    onSubmit({
      collegeId,
      profession,
      rating,
      reason: reason.trim() || undefined,
      experience: experience || undefined,
    })

    // Reset form
    setRating(5)
    setReason("")
    setExperience("")
    onClose()
  }

  if (!college) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-card-foreground">
            <ThumbsUp className="w-5 h-5 text-primary" />
            Vote for {college.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="font-semibold text-card-foreground">{profession}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              How would you rate {college.name} for {profession} career preparation?
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-card-foreground">Your Rating</Label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className="transition-all duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-card-foreground">{rating}</span>
              <span className="text-sm text-muted-foreground ml-1">/ 5</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-card-foreground">Your Experience Level</Label>
            <RadioGroup value={experience} onValueChange={setExperience}>
              {experienceLevels.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={level.value} id={level.value} />
                  <Label htmlFor={level.value} className="text-sm text-card-foreground cursor-pointer">
                    {level.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-card-foreground">Why this rating? (Optional)</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Share your experience with career services, job placement, alumni network, etc..."
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90">
              Submit Vote
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
