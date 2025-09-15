export interface College {
  id: string
  name: string
  location: string
  type: "public" | "private"
  size: "small" | "medium" | "large"
  tuition: number
  acceptanceRate: number
  averageGPA: number
  averageSAT: number
  image: string
  description: string
  majors: string[]
  overallRating: number
  totalVotes: number
  firstChoiceVotes: number // Added firstChoiceVotes to track #1 rankings
}

export interface ProfessionRanking {
  profession: string
  colleges: {
    collegeId: string
    collegeName: string
    rating: number
    votes: number
    averageSalary: number
    employmentRate: number
  }[]
}

export interface UserRanking {
  userId: string
  collegeId: string
  ratings: {
    academics: number
    campusLife: number
    careerServices: number
    facilities: number
    value: number
  }
  overall: number
  review?: string
  profession?: string
}

export interface RankingCriteria {
  academics: number
  campusLife: number
  careerServices: number
  facilities: number
  value: number
}
