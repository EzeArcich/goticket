export const eventCategories = [
  'Música',
  'Teatro',
  'Deportes',
  'Festivales',
  'Conferencias',
] as const
export type EventCategory = (typeof eventCategories)[number]

export interface Organizer {
  id: string
  name: string
  status: 'approved' | 'pending' | 'suspended'
  active: boolean
}

export interface Event {
  id: string
  title: string
  description: string
  category: EventCategory
  /** ISO 8601 con zona horaria explícita. */
  date: string
  city: string
  location: string
  organizer: Organizer
  /** Precio mínimo en ARS. */
  price: number
  featured: boolean
  imageUrl?: string
  heroImageUrl?: string
  status: 'published' | 'draft' | 'cancelled'
  availableTickets: number
}
