"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GripVertical, Trophy, Users, DollarSign, TrendingUp } from "lucide-react"
import { mockColleges } from "@/lib/mock-data"
import type { ProfessionRanking } from "@/lib/types"
import Image from "next/image"

interface DragDropRankingProps {
  ranking: ProfessionRanking
  onSubmitRanking: (newOrder: string[]) => void
}

export function DragDropRanking({ ranking, onSubmitRanking }: DragDropRankingProps) {
  const [colleges, setColleges] = useState(ranking.colleges)
  const [hasChanges, setHasChanges] = useState(false)

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(colleges)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setColleges(items)
    setHasChanges(true)
  }

  const handleSubmit = () => {
    const newOrder = colleges.map((college) => college.collegeId)
    onSubmitRanking(newOrder)
    setHasChanges(false)
  }

  const handleReset = () => {
    setColleges(ranking.colleges)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-card-foreground mb-2">
          Rank the Top 20 Colleges for {ranking.profession}
        </h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop colleges to reorder them based on your experience and knowledge. Your ranking will help other
          students make informed decisions.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={handleSubmit} disabled={!hasChanges} className="bg-primary hover:bg-primary/90">
            <Trophy className="w-4 h-4 mr-2" />
            Submit My Ranking
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            Reset to Default
          </Button>
        </div>
      </div>

      {/* Drag and Drop List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="colleges">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-3 ${snapshot.isDraggingOver ? "bg-muted/20 rounded-lg p-2" : ""}`}
            >
              {colleges.map((college, index) => {
                const collegeData = mockColleges.find((c) => c.id === college.collegeId)
                if (!collegeData) return null

                return (
                  <Draggable key={college.collegeId} draggableId={college.collegeId} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`transition-all duration-200 ${
                          snapshot.isDragging ? "shadow-lg rotate-2 bg-card border-primary" : "hover:shadow-md"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="flex items-center gap-2 cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="w-5 h-5 text-muted-foreground" />
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                                {index + 1}
                              </div>
                            </div>

                            {/* College Image */}
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={collegeData.image || "/placeholder.svg"}
                                alt={collegeData.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* College Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-card-foreground truncate">{collegeData.name}</h4>
                                  <p className="text-sm text-muted-foreground">{collegeData.location}</p>
                                </div>
                                <Badge variant="secondary" className="ml-2">
                                  {collegeData.type}
                                </Badge>
                              </div>

                              {/* Stats */}
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4 text-primary" />
                                  <span className="font-medium">{college.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4 text-muted-foreground" />
                                  <span>{college.votes.toLocaleString()} votes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4 text-green-600" />
                                  <span>${college.averageSalary.toLocaleString()}</span>
                                </div>
                                <div className="text-muted-foreground">{college.employmentRate}% employed</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Submit Section */}
      {hasChanges && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-sm text-card-foreground mb-3">
            You have unsaved changes to your ranking. Submit to save your preferences.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
              <Trophy className="w-4 h-4 mr-2" />
              Submit Ranking
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Cancel Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
