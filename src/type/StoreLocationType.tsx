export interface StoreLocationHours {
    weekdays: string
    saturday: string
    sunday: string
}

export interface StoreLocationCoordinates {
    lat: number
    lng: number
}

export interface StoreLocationType {
    id: string
    name: string
    address: string
    phone: string
    email?: string | null
    imageUrl?: string | null
    hours: StoreLocationHours
    mapUrl: string
    coordinates: StoreLocationCoordinates
    isActive: boolean
    displayOrder: number
    createdAt: Date
    updatedAt: Date
}

