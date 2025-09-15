"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star } from "lucide-react"
import type { College, RankingCriteria } from "@/lib/types"

interface RankingModalProps {
  college: College | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (ranking: {
    collegeId: string
    ratings: RankingCriteria
    overall: number
    review?: string
    profession?: string
  }) => void
}

const professions = [
  "Software Engineering",
  "Investment Banking",
  "Medicine",
  "Law",
  "Consulting",
  "Marketing",
  "Education",
  "Research",
  "Other",
]

export function RankingModal({ college, isOpen, onClose, onSubmit }: RankingModalProps) {
  const [ratings, setRatings] = useState<RankingCriteria>({
    academics: 5,
    campusLife: 5,
    careerServices: 5,
    facilities: 5,
    value: 5,
  })
  const [review, setReview] = useState("")
  const [profession, setProfession] = useState("")

  const handleRatingChange = (category: keyof RankingCriteria, value: number[]) => {
    setRatings((prev) => ({ ...prev, [category]: value[0] }))
  }

  const calculateOverall = () => {
    const values = Object.values(ratings)
    return Math.round((values.reduce((sum, val) => sum + val, 0) / values.length) * 10) / 10
  }

  const handleSubmit = () => {
    if (!college) return

    onSubmit({
      collegeId: college.id,
      ratings,
      overall: calculateOverall(),
      review: review.trim() || undefined,
      profession: profession || undefined,
    })

    // Reset form
    setRatings({
      academics: 5,
      campusLife: 5,
      careerServices: 5,
      facilities: 5,
      value: 5,
    })
    setReview("")
    setProfession("")
    onClose()
  }

  if (!college) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-card-foreground">Rank {college.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold text-card-foreground">{calculateOverall()}</span>
            </div>
            <p className="text-sm text-muted-foreground">Overall Rating</p>
          </div>

          <div className="space-y-4">
            {Object.entries(ratings).map(([category, value]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium capitalize text-card-foreground">
                    {category === "campusLife"
                      ? "Campus Life"
                      : category === "careerServices"
                        ? "Career Services"
                        : category}
                  </Label>
                  <span className="text-sm font-semibold text-primary">{value}</span>
                </div>
                <Slider
                  value={[value]}
                  onValueChange={(val) => handleRatingChange(category as keyof RankingCriteria, val)}
                  max={5}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-card-foreground">Your Profession (Optional)</Label>
            <Select value={profession} onValueChange={setProfession}>
              <SelectTrigger>
                <SelectValue placeholder="Select your profession" />
              </SelectTrigger>
              <SelectContent>
                {professions.map((prof) => (
                  <SelectItem key={prof} value={prof}>
                    {prof}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-card-foreground">Review (Optional)</Label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this college..."
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90">
              Submit Ranking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
