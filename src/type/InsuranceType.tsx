export interface InsuranceType {
  id: string
  name: string
  logo: string
  description: string
  coverageTypes: string[]
  website?: string
  phone?: string
  acceptsOnline: boolean
}

