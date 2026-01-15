"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { SectionTitle } from "@/components/section-title"
import FlowingMenu from "@/components/flowing-menu"

interface EventItem {
  id: string
  type: "evento"
  title: string
  content: string
  author: string
  isActive: boolean
  eventDate?: string
  eventLocation?: string
  eventLink?: string
  eventImage?: string
  eventSummary?: string
  eventDetails?: string
  showInShowcase?: boolean
}

export default function EventsPage() {
  const { t, language } = useLanguage()
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      console.log('[Events Page] Fetching events from /api/events...')
      const response = await fetch('/api/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Ensure fresh data on each request
      })

      console.log('[Events Page] Response status:', response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log('[Events Page] Events fetched:', data.length, 'events')
        console.log('[Events Page] Events data:', data)
        setEvents(data)
        console.log('[Events Page] Showcase events:', data.filter((e: EventItem) => e.showInShowcase).length)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('[Events Page] Error fetching events:', response.status, errorData)
        setEvents([]) // Ensure empty array on error
      }
    } catch (error) {
      console.error('[Events Page] Error fetching events:', error)
      if (error instanceof Error) {
        console.error('[Events Page] Error message:', error.message)
        console.error('[Events Page] Error stack:', error.stack)
      }
      setEvents([]) // Ensure empty array on error
    } finally {
      setLoading(false)
    }
  }

  // Eventos para el showcase (FlowingMenu)
  // Require only showInShowcase, provide defaults for missing fields
  const showcaseEvents = events
    .filter(e => e.showInShowcase)
    .map(e => ({
      link: e.eventLink || '#',
      text: e.title,
      image: e.eventImage || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }))

  // Fallback placeholder when no showcase events
  const fallbackShowcaseEvents = showcaseEvents.length === 0 ? [{
    link: '#',
    text: language === "en" ? "No showcase events configured" : "No hay eventos en showcase",
    image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }] : showcaseEvents

  if (loading) {
    return (
      <>
        <section className="relative overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
          <div className="vanguard-container relative z-10 py-24">
            <h1 className="text-3xl text-white md:text-4xl mb-6">Eventos</h1>
            <div className="vanguard-divider"></div>
          </div>
        </section>
        <section className="relative overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
          <div className="relative z-10 vanguard-container py-24">
            <div className="animate-pulse space-y-8">
              <div className="h-48 bg-white/10 rounded-3xl"></div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-64 bg-white/10 rounded-3xl"></div>
                <div className="h-64 bg-white/10 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="vanguard-container relative z-10 py-24">
          <SectionTitle
            text={[
              t("events.title"),
              t("events.subtitle"),
              "Events, Updates, Company"
            ]}
            as="h1"
            className="mb-6 text-3xl text-white md:text-4xl"
            initialDelay={120}
          />
          <div className="vanguard-divider"></div>
        </div>
      </section>

      {/* Events Section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="relative z-10 vanguard-container py-24">
          {events.length === 0 ? (
            <div className="text-center text-slate-100 py-12">
              <h2 className="text-2xl md:text-3xl mb-4">No hay eventos próximos</h2>
              <p className="text-slate-300">Vuelve pronto para ver nuestros próximos eventos</p>
            </div>
          ) : (
            <>
              <div className="mb-12 text-center text-slate-100">
                <SectionTitle
                  text={
                    language === "en"
                      ? "Where to meet us next"
                      : "Dónde encontrarnos"
                  }
                  as="h2"
                  className="text-2xl md:text-3xl text-slate-100"
                  initialDelay={200}
                />
                <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
                  {language === "en"
                    ? "Hover the flowing menu to explore where Vanguard-IA will be sharing vision, demos and partnerships."
                    : "Interactua con el menú interactivo para descubrir dónde Vanguard-IA compartirá servicios, visión y nuevas alianzas."}
                </p>
              </div>

              <div className="relative mx-auto flex max-w-6xl flex-col gap-12">
                {/* FlowingMenu - Always show, with fallback if no showcase events */}
                <FlowingMenu
                  className="w-full rounded-[32px] border border-white/10 bg-white/5 backdrop-blur"
                  items={fallbackShowcaseEvents}
                />

                {/* Tarjetas de eventos */}
                <div className="grid w-full gap-8 text-slate-200 md:grid-cols-2">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_50px_rgba(8,8,14,0.45)] backdrop-blur"
                    >
                      {event.eventDate && (
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
                          {event.eventDate}
                        </span>
                      )}
                      <h3 className="mt-3 text-xl font-semibold text-white md:text-2xl">
                        {event.title}
                      </h3>
                      {event.eventLocation && (
                        <p className="mt-2 text-sm text-slate-400">
                          📍 {event.eventLocation}
                        </p>
                      )}
                      {event.eventSummary && (
                        <p className="mt-4 text-sm leading-relaxed md:text-base">
                          {event.eventSummary}
                        </p>
                      )}
                      {event.eventDetails && (
                        <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
                          {event.eventDetails}
                        </p>
                      )}
                      {event.eventLink && (
                        <a
                          href={event.eventLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center text-sm font-semibold uppercase tracking-wide text-vanguard-blue hover:underline"
                        >
                          {language === "en" ? "Event website" : "Sitio oficial"}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
