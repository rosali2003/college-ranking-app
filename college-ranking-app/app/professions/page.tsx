"use client"

import { useState } from "react"
import { ProfessionSelector } from "@/components/profession-selector"
import { DragDropRanking } from "@/components/drag-drop-ranking"
import { ToastProvider, useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Trophy } from "lucide-react"
import { mockProfessionRankings } from "@/lib/mock-data"
import Link from "next/link"

function ProfessionsPageContent() {
  const [selectedProfession, setSelectedProfession] = useState(mockProfessionRankings[0].profession)
  const { addToast } = useToast()

  const currentRanking = mockProfessionRankings.find((r) => r.profession === selectedProfession)
  const professions = mockProfessionRankings.map((r) => r.profession)

  const handleSubmitRanking = (newOrder: string[]) => {
    console.log("New ranking order:", newOrder)
    addToast({
      type: "success",
      title: "Ranking Submitted!",
      description: `Thank you for ranking colleges for ${selectedProfession}. Your input helps other students!`,
    })
    // In a real app, this would send the ranking to your backend
  }

  if (!currentRanking) return null

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
                  Back to Colleges
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">Rank Colleges by Profession</h1>
                  <p className="text-sm text-muted-foreground">Drag and drop to create your ranking</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-card-foreground">Interactive Rankings</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-card-foreground text-balance">Create Your College Rankings</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Help future students by ranking the top 20 colleges for different professions. Your experience and
              insights matter.
            </p>
          </div>

          {/* Profession Selector */}
          <ProfessionSelector
            professions={professions}
            selectedProfession={selectedProfession}
            onSelect={setSelectedProfession}
          />

          {/* Current Stats */}
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{currentRanking.colleges.length}</div>
                <div className="text-sm text-muted-foreground">Top Colleges</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {currentRanking.colleges.reduce((sum, c) => sum + c.votes, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Votes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  $
                  {Math.round(
                    currentRanking.colleges.reduce((sum, c) => sum + c.averageSalary, 0) /
                      currentRanking.colleges.length,
                  ).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Avg Starting Salary</div>
              </div>
            </div>
          </div>

          {/* Drag and Drop Ranking */}
          <DragDropRanking ranking={currentRanking} onSubmitRanking={handleSubmitRanking} />
        </div>
      </main>
    </div>
  )
}

export default function ProfessionsPage() {
  return (
    <ToastProvider>
      <ProfessionsPageContent />
    </ToastProvider>
  )
}
