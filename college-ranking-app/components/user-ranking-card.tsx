"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Edit, Trash2, Calendar } from "lucide-react"
import type { UserRanking } from "@/lib/types"
import { mockColleges } from "@/lib/mock-data"

interface UserRankingCardProps {
  ranking: UserRanking
  onEdit?: (ranking: UserRanking) => void
  onDelete?: (rankingId: string) => void
}

export function UserRankingCard({ ranking, onEdit, onDelete }: UserRankingCardProps) {
  const college = mockColleges.find((c) => c.id === ranking.collegeId)

  if (!college) return null

  const criteriaLabels = {
    academics: "Academics",
    campusLife: "Campus Life",
    careerServices: "Career Services",
    facilities: "Facilities",
    value: "Value",
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-card-foreground mb-1">{college.name}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-card-foreground">{ranking.overall}</span>
              </div>
              {ranking.profession && (
                <Badge variant="secondary" className="text-xs">
                  {ranking.profession}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit?.(ranking)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete?.(ranking.userId + ranking.collegeId)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {Object.entries(ranking.ratings).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-muted-foreground">{criteriaLabels[key as keyof typeof criteriaLabels]}:</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-card-foreground">{value}</span>
              </div>
            </div>
          ))}
        </div>

        {ranking.review && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-card-foreground">Your Review</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{ranking.review}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Reviewed recently</span>
          </div>
          <span>Overall: {ranking.overall}/5.0</span>
        </div>
      </CardContent>
    </Card>
  )
}
