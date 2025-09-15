"use client"

import { useState } from "react"
import { UserRankingCard } from "@/components/user-ranking-card"
import { DashboardStats } from "@/components/dashboard-stats"
import { RankingModal } from "@/components/ranking-modal"
import { ToastProvider, useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Plus, Filter } from "lucide-react"
import { mockUserRankings, mockColleges } from "@/lib/mock-data"
import type { UserRanking, College } from "@/lib/types"
import Link from "next/link"

function DashboardPageContent() {
  const [rankings, setRankings] = useState<UserRanking[]>(mockUserRankings)
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false)
  const [editingRanking, setEditingRanking] = useState<UserRanking | null>(null)
  const [filterBy, setFilterBy] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")
  const { addToast } = useToast()

  const handleEditRanking = (ranking: UserRanking) => {
    const college = mockColleges.find((c) => c.id === ranking.collegeId)
    if (college) {
      setSelectedCollege(college)
      setEditingRanking(ranking)
      setIsRankingModalOpen(true)
    }
  }

  const handleDeleteRanking = (rankingId: string) => {
    setRankings((prev) => prev.filter((r) => r.userId + r.collegeId !== rankingId))
    addToast({
      type: "success",
      title: "Ranking Deleted",
      description: "Your college ranking has been removed.",
    })
  }

  const handleSubmitRanking = (ranking: any) => {
    if (editingRanking) {
      // Update existing ranking
      setRankings((prev) =>
        prev.map((r) =>
          r.userId + r.collegeId === editingRanking.userId + editingRanking.collegeId ? { ...r, ...ranking } : r,
        ),
      )
      addToast({
        type: "success",
        title: "Ranking Updated",
        description: "Your college ranking has been updated successfully.",
      })
    } else {
      // Add new ranking
      const newRanking: UserRanking = {
        userId: "user1", // In a real app, this would come from auth
        ...ranking,
      }
      setRankings((prev) => [...prev, newRanking])
      addToast({
        type: "success",
        title: "Ranking Added",
        description: "Your new college ranking has been saved.",
      })
    }
    setEditingRanking(null)
  }

  const handleAddNewRanking = () => {
    // For demo purposes, we'll just open the modal with the first college
    setSelectedCollege(mockColleges[0])
    setEditingRanking(null)
    setIsRankingModalOpen(true)
  }

  const filteredRankings = rankings.filter((ranking) => {
    if (filterBy === "all") return true
    if (filterBy === "with-profession") return ranking.profession
    if (filterBy === "with-review") return ranking.review
    return ranking.profession === filterBy
  })

  const sortedRankings = [...filteredRankings].sort((a, b) => {
    switch (sortBy) {
      case "rating-high":
        return b.overall - a.overall
      case "rating-low":
        return a.overall - b.overall
      case "college-name":
        const collegeA = mockColleges.find((c) => c.id === a.collegeId)?.name || ""
        const collegeB = mockColleges.find((c) => c.id === b.collegeId)?.name || ""
        return collegeA.localeCompare(collegeB)
      default:
        return 0 // recent - would use actual dates in real app
    }
  })

  const professions = Array.from(new Set(rankings.filter((r) => r.profession).map((r) => r.profession)))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">My Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Manage your college rankings and reviews</p>
                </div>
              </div>
            </div>
            <Button onClick={handleAddNewRanking} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Ranking
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats Overview */}
          <DashboardStats rankings={rankings} />

          {/* Content Tabs */}
          <Tabs defaultValue="rankings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="rankings">My Rankings ({rankings.length})</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="rankings" className="space-y-6">
              {/* Filters and Sort */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter rankings" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Rankings</SelectItem>
                        <SelectItem value="with-profession">With Profession</SelectItem>
                        <SelectItem value="with-review">With Review</SelectItem>
                        {professions.map((profession) => (
                          <SelectItem key={profession} value={profession}>
                            {profession}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="rating-high">Highest Rating</SelectItem>
                    <SelectItem value="rating-low">Lowest Rating</SelectItem>
                    <SelectItem value="college-name">College Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rankings Grid */}
              {sortedRankings.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {sortedRankings.map((ranking) => (
                    <UserRankingCard
                      key={ranking.userId + ranking.collegeId}
                      ranking={ranking}
                      onEdit={handleEditRanking}
                      onDelete={handleDeleteRanking}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">No rankings found</h3>
                  <p className="text-muted-foreground mb-4">
                    {filterBy === "all"
                      ? "You haven't ranked any colleges yet."
                      : "No rankings match your current filter."}
                  </p>
                  <Button onClick={handleAddNewRanking} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Ranking
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <div className="text-center py-12">
                <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Activity Feed Coming Soon</h3>
                <p className="text-muted-foreground">
                  Track your ranking history, votes, and community interactions here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Ranking Modal */}
      <RankingModal
        college={selectedCollege}
        isOpen={isRankingModalOpen}
        onClose={() => {
          setIsRankingModalOpen(false)
          setEditingRanking(null)
        }}
        onSubmit={handleSubmitRanking}
      />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ToastProvider>
      <DashboardPageContent />
    </ToastProvider>
  )
}
