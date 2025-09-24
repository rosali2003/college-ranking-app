import { NextRequest, NextResponse } from 'next/server'
import { mockProfessionRankings } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profession = searchParams.get('profession')

    if (profession) {
      // Get specific profession rankings
      const professionRankings = mockProfessionRankings.find(
        ranking => ranking.profession.toLowerCase() === profession.toLowerCase()
      )

      if (!professionRankings) {
        return NextResponse.json(
          { error: `Profession '${profession}' not found` },
          { status: 404 }
        )
      }

      return NextResponse.json(professionRankings)
    }

    // Return all available professions
    const availableProfessions = mockProfessionRankings.map(ranking => ({
      profession: ranking.profession,
      collegeCount: ranking.colleges.length
    }))

    return NextResponse.json({
      professions: availableProfessions,
      totalProfessions: availableProfessions.length
    })

  } catch (error) {
    console.error('Error fetching rankings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
