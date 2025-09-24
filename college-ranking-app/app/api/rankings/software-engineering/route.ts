import { NextRequest, NextResponse } from 'next/server'
import { mockProfessionRankings } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    // Find software engineering rankings from mock data
    const softwareEngineeringRankings = mockProfessionRankings.find(
      ranking => ranking.profession === 'Software Engineering'
    )

    if (!softwareEngineeringRankings) {
      return NextResponse.json(
        { error: 'Software Engineering rankings not found' },
        { status: 404 }
      )
    }

    // Get query parameters for filtering/sorting
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const sortBy = searchParams.get('sortBy') || 'rating'
    const order = searchParams.get('order') || 'desc'

    let rankings = [...softwareEngineeringRankings.colleges]

    // Sort the rankings
    rankings.sort((a, b) => {
      let aValue: number
      let bValue: number

      switch (sortBy) {
        case 'rating':
          aValue = a.rating
          bValue = b.rating
          break
        case 'votes':
          aValue = a.votes
          bValue = b.votes
          break
        case 'salary':
          aValue = a.averageSalary
          bValue = b.averageSalary
          break
        case 'employment':
          aValue = a.employmentRate
          bValue = b.employmentRate
          break
        default:
          aValue = a.rating
          bValue = b.rating
      }

      return order === 'desc' ? bValue - aValue : aValue - bValue
    })

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        rankings = rankings.slice(0, limitNum)
      }
    }

    return NextResponse.json({
      profession: 'Software Engineering',
      totalColleges: softwareEngineeringRankings.colleges.length,
      rankings,
      meta: {
        sortBy,
        order,
        limit: limit ? parseInt(limit, 10) : null
      }
    })

  } catch (error) {
    console.error('Error fetching software engineering rankings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { collegeId, rating, votes, averageSalary, employmentRate } = body

    // Validate required fields
    if (!collegeId || !rating || !votes || !averageSalary || !employmentRate) {
      return NextResponse.json(
        { error: 'Missing required fields: collegeId, rating, votes, averageSalary, employmentRate' },
        { status: 400 }
      )
    }

    // In a real app, you would save this to your database here
    // For now, we'll just return a success message
    return NextResponse.json({
      message: 'Ranking updated successfully',
      data: {
        collegeId,
        rating,
        votes,
        averageSalary,
        employmentRate,
        updatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error updating software engineering ranking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
