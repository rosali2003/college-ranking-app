"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Star } from "lucide-react"
import type { ProfessionRanking } from "@/lib/types"

interface RankingStatsProps {
  ranking: ProfessionRanking
}

export function RankingStats({ ranking }: RankingStatsProps) {
  const totalVotes = ranking.colleges.reduce((sum, college) => sum + college.votes, 0)
  const averageRating = ranking.colleges.reduce((sum, college) => sum + college.rating, 0) / ranking.colleges.length
  const averageSalary =
    ranking.colleges.reduce((sum, college) => sum + college.averageSalary, 0) / ranking.colleges.length
  const averageEmployment =
    ranking.colleges.reduce((sum, college) => sum + college.employmentRate, 0) / ranking.colleges.length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">Total Votes</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{totalVotes.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Across all colleges</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">Avg Rating</CardTitle>
          <Star className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{averageRating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">Out of 5.0</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">Avg Salary</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{formatCurrency(averageSalary)}</div>
          <p className="text-xs text-muted-foreground">Starting salary</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">Employment</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-card-foreground">{averageEmployment.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Average rate</p>
        </CardContent>
      </Card>
    </div>
  )
}
