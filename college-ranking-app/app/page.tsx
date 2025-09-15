"use client"
import { ToastProvider } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { TrendingUp, User, MapPin, DollarSign, BarChart3, Users } from "lucide-react"
import { mockColleges } from "@/lib/mock-data"
import Link from "next/link"

function HomePageContent() {
  const rankedColleges = [...mockColleges].sort((a, b) => b.firstChoiceVotes - a.firstChoiceVotes)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">RankHub</h1>
                <p className="text-sm text-muted-foreground">Institution Rankings</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  My Dashboard
                </Button>
              </Link>
              <Link href="/professions">
                <Button>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Profession Rankings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-card-foreground mb-2">Top College Rankings</h2>
            <p className="text-muted-foreground">
              Colleges ranked by number of people who chose them as #1 for their profession
            </p>
          </div>

          <div className="space-y-4">
            {rankedColleges.map((college, index) => (
              <div
                key={college.id}
                className="flex items-center gap-4 p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
              >
                {/* Rank number */}
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">#{index + 1}</span>
                </div>

                {/* College image */}
                <div className="flex-shrink-0">
                  <img
                    src={college.image || "/placeholder.svg"}
                    alt={college.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>

                {/* College info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-card-foreground mb-1">{college.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {college.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />${college.tuition.toLocaleString()}/year
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <div className="text-2xl font-bold text-primary">{college.firstChoiceVotes.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    people chose as #1
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <ToastProvider>
      <HomePageContent />
    </ToastProvider>
  )
}
