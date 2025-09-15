"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Star, DollarSign, TrendingUp, Users, ThumbsUp } from "lucide-react"
import type { ProfessionRanking } from "@/lib/types"

interface ProfessionRankingCardProps {
  ranking: ProfessionRanking["colleges"][0]
  rank: number
  onVote?: (collegeId: string, profession: string) => void
  profession: string
}

export function ProfessionRankingCard({ ranking, rank, onVote, profession }: ProfessionRankingCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500 text-white"
    if (rank === 2) return "bg-gray-400 text-white"
    if (rank === 3) return "bg-amber-600 text-white"
    return "bg-primary text-primary-foreground"
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Badge className={getRankBadgeColor(rank)}>#{rank}</Badge>
            <div>
              <CardTitle className="text-lg font-bold text-card-foreground">{ranking.collegeName}</CardTitle>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-card-foreground">{ranking.rating}</span>
                <span className="text-sm text-muted-foreground">({ranking.votes} votes)</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVote?.(ranking.collegeId, profession)}
            className="flex items-center gap-1"
          >
            <ThumbsUp className="w-4 h-4" />
            Vote
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-card-foreground">Avg Salary</span>
            </div>
            <div className="text-lg font-bold text-card-foreground">{formatCurrency(ranking.averageSalary)}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-card-foreground">Employment Rate</span>
            </div>
            <div className="text-lg font-bold text-card-foreground">{ranking.employmentRate}%</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Rating Progress</span>
            <span className="text-card-foreground">{ranking.rating}/5.0</span>
          </div>
          <Progress value={(ranking.rating / 5) * 100} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{ranking.votes} total votes</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{ranking.employmentRate}% employed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
