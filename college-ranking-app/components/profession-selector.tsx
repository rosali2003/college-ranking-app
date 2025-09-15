"use client"

import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfessionSelectorProps {
  professions: string[]
  selectedProfession: string
  onSelect: (profession: string) => void
}

export function ProfessionSelector({ professions, selectedProfession, onSelect }: ProfessionSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground">Select Profession</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {professions.map((profession) => (
          <Button
            key={profession}
            variant={selectedProfession === profession ? "default" : "outline"}
            onClick={() => onSelect(profession)}
            className={cn(
              "transition-all duration-200",
              selectedProfession === profession
                ? "bg-primary text-primary-foreground"
                : "bg-transparent hover:bg-primary/10",
            )}
          >
            {profession}
          </Button>
        ))}
      </div>
    </div>
  )
}
