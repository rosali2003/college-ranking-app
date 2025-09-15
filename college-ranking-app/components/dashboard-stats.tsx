"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, TrendingUp, Users, Award } from "lucide-react"
import type { UserRanking } from "@/lib/types"

interface DashboardStatsProps {
  rankings: UserRanking[]
}

export function DashboardStats({ rankings }: DashboardStatsProps) {
  const totalRankings = rankings.length
  const averageRating = rankings.length > 0 ? rankings.reduce((sum, r) => sum + r.overall, 0) / rankings.length : 0
  const uniqueProfessions = new Set(rankings.filter((r) => r.profession).map((r) => r.profession)).size
  const highestRated = rankings.length > 0 ? Math.max(...rankings.map((r) => r.overall)) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">Total Rankings</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{totalRankings}</div>
          <p className="text-xs text-muted-foreground">Colleges you've ranked</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">Avg Rating</CardTitle>
          <Star className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{averageRating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">Your average score</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">Professions</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{uniqueProfessions}</div>
          <p className="text-xs text-muted-foreground">Career paths covered</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">Highest Rating</CardTitle>
          <Award className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{highestRated.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">Best college score</p>
        </CardContent>
      </Card>
    </div>
  )
}
