
import type { Event, Organizer, TicketType } from '../types/event'

const organizer: Organizer = {
  id: 'org-001',
  name: 'Sur Producciones',
  status: 'approved',
  active: true,
}

const ticket = (
  id: string,
  name: string,
  price: number,
  availableTickets: number,
  description?: string,
): TicketType => ({
  id,
  name,
  price,
  availableTickets,
  ...(description ? { description } : {}),
})

const createEvent = (
  data: Omit<Event, 'price' | 'availableTickets'>,
): Event => ({
  ...data,
  price: Math.min(...data.ticketTypes.map((type) => type.price)),
  availableTickets: data.ticketTypes.reduce(
    (total, type) => total + type.availableTickets,
    0,
  ),
})

export const events: Event[] = [
  createEvent({
    id: 'evt-001',
    title: 'Festival de Rock',
    description: 'Una noche de rock en Buenos Aires',
    category: 'Música',
    date: '2027-01-15T21:00:00-03:00',
    city: 'Buenos Aires',
    location: 'Estadio del Sur',
    organizer,
    status: 'published',
    featured: true,
    imageUrl: '/events/rock.jpg',
    ticketTypes: [
      ticket('rock-general', 'General', 35000, 100, 'Acceso general al festival.'),
      ticket('rock-vip', 'VIP', 65000, 50, 'Sector preferencial con servicios exclusivos.'),
      ticket('rock-meet', 'Meet & Greet', 95000, 0, 'Experiencia exclusiva con artistas.'),
    ],
  }),

  createEvent({
    id: 'evt-002',
    title: 'Noche de Teatro en Córdoba',
    description: 'Una comedia para disfrutar del teatro en Córdoba',
    category: 'Teatro',
    date: '2027-02-06T20:30:00-03:00',
    city: 'Córdoba',
    location: 'Teatro del Centro',
    organizer: {
      ...organizer,
      id: 'org-002',
      name: 'Escena Federal',
    },
    status: 'published',
    featured: false,
    imageUrl: '/events/theater.jpeg',
    ticketTypes: [
      ticket('teatro-platea', 'Platea', 18000, 22, 'Butacas en sector central.'),
      ticket('teatro-preferencial', 'Platea preferencial', 28000, 12, 'Ubicación cercana al escenario.'),
      ticket('teatro-palco', 'Palco', 38000, 8, 'Ubicación en palco lateral.'),
    ],
  }),

  createEvent({
    id: 'evt-003',
    title: 'Copa de Básquet en Rosario',
    description: 'Una jornada deportiva con equipos de básquet de la región',
    category: 'Deportes',
    date: '2027-02-20T18:00:00-03:00',
    city: 'Rosario',
    location: 'Club del Paraná',
    organizer: {
      ...organizer,
      id: 'org-003',
      name: 'Deporte Litoral',
    },
    status: 'published',
    featured: true,
    imageUrl: '/events/basquet.jpeg',
    ticketTypes: [
      ticket('basket-general', 'Tribuna general', 12000, 0),
      ticket('basket-central', 'Platea central', 22000, 0),
      ticket('basket-vip', 'Sector VIP', 35000, 0),
    ],
  }),

  createEvent({
    id: 'evt-004',
    title: 'Jazz al atardecer',
    description: 'Un encuentro íntimo con bandas mendocinas y jazz en vivo.',
    category: 'Música',
    date: '2027-01-22T19:30:00-03:00',
    city: 'Mendoza',
    location: 'Espacio del Vino',
    organizer,
    status: 'published',
    featured: false,
    imageUrl: '/events/rock.jpg',
    ticketTypes: [
      ticket('jazz-general', 'Entrada general', 16000, 65),
      ticket('jazz-mesa', 'Mesa preferencial', 26000, 15, 'Mesa cercana al escenario.'),
    ],
  }),

  createEvent({
    id: 'evt-005',
    title: 'Festival de sabores del norte',
    description: 'Gastronomía regional y espectáculos para compartir en Salta.',
    category: 'Festivales',
    date: '2027-03-12T17:00:00-03:00',
    city: 'Salta',
    location: 'Paseo del Norte',
    organizer,
    status: 'published',
    featured: false,
    imageUrl: '/images/categories/festivals.jpg',
    ticketTypes: [
      ticket('sabores-general', 'Entrada general', 9500, 200),
      ticket('sabores-premium', 'Experiencia gastronómica', 24500, 40),
    ],
  }),

  createEvent({
    id: 'evt-006',
    title: 'Encuentro de tecnología y creatividad: ideas para transformar nuestras ciudades',
    description: 'Charlas con proyectos locales de tecnología, diseño y cultura.',
    category: 'Conferencias',
    date: '2027-03-18T09:00:00-03:00',
    city: 'Buenos Aires',
    location: 'Centro de Innovación Sur',
    organizer,
    status: 'published',
    featured: false,
    imageUrl: undefined,
    ticketTypes: [
      ticket('tech-general', 'Acceso general', 22000, 90),
      ticket('tech-full', 'Full Experience', 45000, 25),
      ticket('tech-workshop', 'Workshops exclusivos', 65000, 0),
    ],
  }),

  createEvent({
    id: 'evt-007',
    title: 'Cine y música en el puerto',
    description: 'Proyecciones y bandas sonoras en vivo junto al mar.',
    category: 'Festivales',
    date: '2027-04-10T18:00:00-03:00',
    city: 'Mar del Plata',
    location: 'Galpón del Puerto',
    organizer,
    status: 'published',
    featured: false,
    imageUrl: '/images/categories/festivals.jpg',
    ticketTypes: [
      ticket('cine-general', 'Entrada general', 11000, 75),
      ticket('cine-preferencial', 'Sector preferencial', 19000, 20),
    ],
  }),

  createEvent({
    id: 'evt-008',
    title: 'Voces de la Patagonia',
    description: 'Artistas patagónicos presentan nuevas canciones junto al lago.',
    category: 'Música',
    date: '2027-05-08T20:00:00-03:00',
    city: 'Bariloche',
    location: 'Auditorio del Lago',
    organizer,
    status: 'published',
    featured: false,
    imageUrl: undefined,
    ticketTypes: [
      ticket('patagonia-general', 'Entrada general', 14000, 0),
      ticket('patagonia-premium', 'Sector premium', 26000, 0),
    ],
  }),

  createEvent({
    id: 'evt-009',
    title: 'Encuentro deportivo del litoral',
    description: 'Una tarde de básquet y encuentros de clubes del litoral.',
    category: 'Deportes',
    date: '2027-06-05T15:00:00-03:00',
    city: 'Rosario',
    location: 'Club del Paraná',
    organizer: {
      ...organizer,
      id: 'org-003',
      name: 'Deporte Litoral',
    },
    status: 'published',
    featured: false,
    imageUrl: '/events/basquet.jpeg',
    ticketTypes: [
      ticket('litoral-general', 'Tribuna general', 12000, 60),
      ticket('litoral-platea', 'Platea', 24000, 20),
    ],
  }),

  // Casos que NO deben aparecer en el catálogo público.

  createEvent({
    id: 'evt-past',
    title: 'Edición pasada',
    description: 'Evento finalizado.',
    category: 'Música',
    date: '2020-01-01T20:00:00-03:00',
    city: 'Buenos Aires',
    location: 'Estadio del Sur',
    organizer,
    status: 'published',
    featured: false,
    imageUrl: '/events/rock.jpg',
    ticketTypes: [
      ticket('past-general', 'General', 35000, 0),
    ],
  }),

  createEvent({
    id: 'evt-draft',
    title: 'Borrador privado',
    description: 'Evento todavía no publicado.',
    category: 'Música',
    date: '2027-01-15T21:00:00-03:00',
    city: 'Buenos Aires',
    location: 'Estadio del Sur',
    organizer,
    status: 'draft',
    featured: false,
    imageUrl: '/events/rock.jpg',
    ticketTypes: [
      ticket('draft-general', 'General', 35000, 100),
    ],
  }),

  createEvent({
    id: 'evt-cancelled',
    title: 'Evento cancelado',
    description: 'Evento que fue cancelado.',
    category: 'Música',
    date: '2027-01-15T21:00:00-03:00',
    city: 'Buenos Aires',
    location: 'Estadio del Sur',
    organizer,
    status: 'cancelled',
    featured: false,
    imageUrl: '/events/rock.jpg',
    ticketTypes: [
      ticket('cancelled-general', 'General', 35000, 100),
    ],
  }),

  createEvent({
    id: 'evt-pending',
    title: 'Organización pendiente',
    description: 'Evento de una organización pendiente de aprobación.',
    category: 'Música',
    date: '2027-01-15T21:00:00-03:00',
    city: 'Buenos Aires',
    location: 'Estadio del Sur',
    organizer: {
      ...organizer,
      status: 'pending',
    },
    status: 'published',
    featured: false,
    imageUrl: '/events/rock.jpg',
    ticketTypes: [
      ticket('pending-general', 'General', 35000, 100),
    ],
  }),

  createEvent({
    id: 'evt-suspended',
    title: 'Organización suspendida',
    description: 'Evento de una organización suspendida.',
    category: 'Música',
    date: '2027-01-15T21:00:00-03:00',
    city: 'Buenos Aires',
    location: 'Estadio del Sur',
    organizer: {
      ...organizer,
      status: 'suspended',
    },
    status: 'published',
    featured: false,
    imageUrl: '/events/rock.jpg',
    ticketTypes: [
      ticket('suspended-general', 'General', 35000, 100),
    ],
  }),

  createEvent({
    id: 'evt-inactive',
    title: 'Organización inactiva',
    description: 'Evento de una organización inactiva.',
    category: 'Música',
    date: '2027-01-15T21:00:00-03:00',
    city: 'Buenos Aires',
    location: 'Estadio del Sur',
    organizer: {
      ...organizer,
      active: false,
    },
    status: 'published',
    featured: false,
    imageUrl: '/events/rock.jpg',
    ticketTypes: [
      ticket('inactive-general', 'General', 35000, 100),
    ],
  }),
]
