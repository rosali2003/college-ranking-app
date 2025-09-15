"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, DollarSign, TrendingUp } from "lucide-react"
import type { College } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CollegeCardProps {
  college: College
  onRank?: (collegeId: string) => void
  showRankButton?: boolean
  rank?: number
}

export function CollegeCard({ college, onRank, showRankButton = true, rank }: CollegeCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card
      className={cn("transition-all duration-300 hover:shadow-lg border-border bg-card", isHovered && "scale-[1.02]")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {rank && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  #{rank}
                </Badge>
              )}
              <Badge variant={college.type === "private" ? "default" : "secondary"}>{college.type}</Badge>
              <Badge variant="outline">{college.size}</Badge>
            </div>
            <CardTitle className="text-xl font-bold text-card-foreground mb-1">{college.name}</CardTitle>
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {college.location}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-card-foreground">{college.overallRating}</span>
            </div>
            <div className="text-xs text-muted-foreground">{college.totalVotes.toLocaleString()} votes</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{college.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium text-card-foreground">Tuition</div>
              <div className="text-muted-foreground">{formatCurrency(college.tuition)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium text-card-foreground">Acceptance</div>
              <div className="text-muted-foreground">{college.acceptanceRate}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium text-card-foreground">Avg GPA</div>
              <div className="text-muted-foreground">{college.averageGPA}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium text-card-foreground">Avg SAT</div>
              <div className="text-muted-foreground">{college.averageSAT}</div>
            </div>
          </div>
        </div>

        <div>
          <div className="font-medium text-card-foreground mb-2 text-sm">Popular Majors</div>
          <div className="flex flex-wrap gap-1">
            {college.majors.slice(0, 3).map((major) => (
              <Badge key={major} variant="outline" className="text-xs">
                {major}
              </Badge>
            ))}
            {college.majors.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{college.majors.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {showRankButton && (
          <Button
            onClick={() => onRank?.(college.id)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Rank This College
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
