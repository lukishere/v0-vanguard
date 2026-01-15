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
