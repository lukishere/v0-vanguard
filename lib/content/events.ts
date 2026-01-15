/**
 * Eventos estáticos de Vanguard-IA
 *
 * Este archivo contiene los eventos que se muestran en la página de eventos.
 * Cuando los eventos sean más recurrentes, se migrará a un sistema dinámico.
 */

export interface StaticEvent {
  id: string;
  type: "evento";
  title: string;
  content: string;
  author: string;
  eventDate?: string;
  eventLocation?: string;
  eventLink?: string;
  eventImage?: string;
  eventSummary?: string;
  eventDetails?: string;
  showInShowcase?: boolean;
  isActive: boolean;
  publishedAt: {
    seconds: number;
    nanoseconds: number;
  };
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
}

/**
 * Lista de eventos estáticos
 *
 * Para agregar un nuevo evento, simplemente agrega un objeto a este array.
 * Los eventos se mostrarán automáticamente en la página de eventos.
 */
export const staticEvents: StaticEvent[] = [
  {
    id: "event_phygital_2025",
    type: "evento",
    title: "Games of the Future 2025 • Abu Dhabi, UAE",
    content: "Evento insignia de Phygital International que combina esports con competencia física",
    author: "Vanguard-IA Team",
    eventDate: "Noviembre 2025",
    eventLocation: "Abu Dhabi, EAU",
    eventLink: "https://phygitalinternational.com/",
    eventImage: "linear-gradient(135deg, #f97316 0%, #fb7185 100%)",
    eventSummary: "Estaremos presentes para vivir el torneo insignia de Phygital International, que combina duelos de esports con competencia física.",
    eventDetails: "El evento promete nuevas disciplinas phygital y miles de atletas cuando los Games of the Future lleguen a los Emiratos Árabes Unidos en noviembre.",
    showInShowcase: true,
    isActive: true,
    publishedAt: {
      seconds: 1763114826,
      nanoseconds: 25000000,
    },
    createdAt: {
      seconds: 1763114826,
      nanoseconds: 25000000,
    },
    updatedAt: {
      seconds: 1763114826,
      nanoseconds: 25000000,
    },
  },
  {
    id: "event_pitch_ice_2026",
    type: "evento",
    title: "Pitch ICE 2026 • Barcelona, España",
    content: "Participación en ICE Barcelona para conectar con innovadores del gaming y apuestas",
    author: "Vanguard-IA Team",
    eventDate: "19–21 de enero de 2026",
    eventLocation: "Barcelona, España",
    eventLink: "https://www.icegaming.com/es/features/pitch-ice",
    eventImage: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
    eventSummary: "Participaremos en el escenario Pitch ICE dentro de ICE Barcelona para conectar con innovadores globales del gaming y las apuestas.",
    eventDetails: "El showcase reúne presentaciones de startups, pitches en vivo y encuentros con inversores en la arena de esports de Fira Barcelona.",
    showInShowcase: true,
    isActive: true,
    publishedAt: {
      seconds: 1763114826,
      nanoseconds: 25000000,
    },
    createdAt: {
      seconds: 1763114826,
      nanoseconds: 25000000,
    },
    updatedAt: {
      seconds: 1763114826,
      nanoseconds: 25000000,
    },
  },
  {
    id: "event_ise_2026",
    type: "evento",
    title: "Integrated Systems Europe 2026 • Barcelona, España",
    content: "Participación en ISE, el mayor evento de integración de sistemas audiovisuales",
    author: "Vanguard-IA Team",
    eventDate: "2026",
    eventLocation: "Fira Barcelona Gran Via",
    eventLink: "https://www.iseurope.org/?tid=TIDP9495943X61E5D95797904333A6B721DE6F84B6E4YI5&utm_blocknumber=617",
    eventImage: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
    eventSummary: "Nos reuniremos con la comunidad profesional AV y de integración de sistemas en el mayor escaparate ISE del mundo.",
    eventDetails: "La edición 2026 presentará experiencias inmersivas de audio, iluminación, broadcast y señalización digital en el recinto Gran Via.",
    showInShowcase: true,
    isActive: true,
    publishedAt: {
      seconds: 1763114826,
      nanoseconds: 25000000,
    },
    createdAt: {
      seconds: 1763114826,
      nanoseconds: 25000000,
    },
    updatedAt: {
      seconds: 1763114826,
      nanoseconds: 25000000,
    },
  },
  {
    id: "event_talent_arena_2026",
    type: "evento",
    title: "Talent Arena 2026 • Barcelona, España",
    content: "Evento dedicado al talento digital organizado por Mobile World Capital Barcelona",
    author: "Vanguard-IA Team",
    eventDate: "2–4 de marzo de 2026",
    eventLocation: "Pabellón 8, Fira de Montjuïc, Barcelona",
    eventLink: "https://mobileworldcapital.com/",
    eventImage: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    eventSummary: "Descubre el futuro del talento digital en Barcelona. Talent Arena celebra su segunda edición coincidiendo con MWC26 y 4YFN.",
    eventDetails: "El evento reunirá a referentes tecnológicos como Tim Berners-Lee, Kate Darling, Tim Serewicz, Steve Aoki y otros líderes del ecosistema digital para explorar las últimas tendencias en talento digital, formación y desarrollo profesional.",
    showInShowcase: true,
    isActive: true,
    publishedAt: {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    },
    createdAt: {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    },
    updatedAt: {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    },
  },
  {
    id: "event_oracle_ai_world_tour_2026",
    type: "evento",
    title: "Oracle AI World Tour Madrid 2026",
    content: "Evento sobre inteligencia artificial organizado por Oracle",
    author: "Vanguard-IA Team",
    eventDate: "10 de febrero de 2026",
    eventLocation: "IFEMA MADRID",
    eventLink: "https://www.oracle.com/es/ai-world-tour/",
    eventImage: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    eventSummary: "Aprende, conecta y descubre innovaciones de IA para resolver tus desafíos empresariales más complejos.",
    eventDetails: "Explora los últimos avances en IA diseñados para resolver desafíos únicos de tu empresa. Descubre cómo las nuevas capacidades de IA de Oracle están transformando la forma de hacer negocios en todos los sectores. Conecta con expertos de Oracle, descubre estrategias de empresas de tu área y haz networking con otros profesionales.",
    showInShowcase: true,
    isActive: true,
    publishedAt: {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    },
    createdAt: {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    },
    updatedAt: {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    },
  },
];

/**
 * Obtiene todos los eventos activos
 *
 * @returns Array de eventos activos
 */
export function getActiveEvents(): StaticEvent[] {
  return staticEvents.filter((event) => event.isActive);
}

/**
 * Obtiene eventos para el showcase
 *
 * @returns Array de eventos marcados para showcase
 */
export function getShowcaseEvents(): StaticEvent[] {
  return staticEvents.filter((event) => event.isActive && event.showInShowcase);
}
