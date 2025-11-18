"use client"

import { useEffect, useState } from "react"
import { Newspaper, Calendar, User } from "lucide-react"

interface NewsItem {
  id: string
  type: "noticia" | "evento"
  title: string
  content: string
  author: string
  publishedAt: { seconds: number; nanoseconds: number }
  isActive: boolean
}

export function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news')
      if (response.ok) {
        const data = await response.json()
        // Filtrar solo noticias (no eventos)
        const onlyNews = data.filter((item: NewsItem) => item.type === "noticia")
        setNews(onlyNews.slice(0, 3)) // Mostrar solo las 3 más recientes
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    return new Date(timestamp.seconds * 1000).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-vanguard-red/20 via-white/5 to-vanguard-blue/30 p-8 shadow-2xl backdrop-blur">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Newspaper className="h-6 w-6 text-vanguard-blue" />
            <h2 className="text-2xl font-semibold">Noticias</h2>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-white/10 rounded-lg"></div>
            <div className="h-24 bg-white/10 rounded-lg"></div>
          </div>
        </div>
      </section>
    )
  }

  if (news.length === 0) {
    return (
      <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-vanguard-red/20 via-white/5 to-vanguard-blue/30 p-8 shadow-2xl backdrop-blur">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Newspaper className="h-6 w-6 text-vanguard-blue" />
            <h2 className="text-2xl font-semibold">Noticias</h2>
          </div>
          <p className="text-sm text-white/70">
            No hay noticias disponibles en este momento.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-vanguard-red/20 via-white/5 to-vanguard-blue/30 p-8 shadow-2xl backdrop-blur">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Newspaper className="h-6 w-6 text-vanguard-blue" />
          <h2 className="text-2xl font-semibold">Noticias</h2>
        </div>

        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-white/20"
            >
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-white/70 mb-4 line-clamp-2">{item.content}</p>
              <div className="flex items-center gap-4 text-xs text-white/50">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{item.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(item.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {news.length > 0 && (
          <p className="text-xs text-white/50 text-center">
            Mantente informado sobre las últimas actualizaciones y eventos
          </p>
        )}
      </div>
    </section>
  )
}
