import { Video, FileText, BookOpen, LinkIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ResourceEditor } from "@/components/admin/resource-editor"
import { resourcesData } from "@/lib/content/resources"

const TYPE_CONFIG = {
  video: { label: "Videos", icon: Video, accent: "text-sky-300" },
  document: { label: "Documentos", icon: FileText, accent: "text-emerald-300" },
  guide: { label: "Guías", icon: BookOpen, accent: "text-amber-300" },
} as const

export default async function AdminResourcesPage() {
  const categories = resourcesData

  const totals = categories.reduce(
    (acc, category) => {
      category.resources.forEach((resource) => {
        acc.count += 1
        acc.byType[resource.type] = (acc.byType[resource.type] ?? 0) + 1
      })
      return acc
    },
    { count: 0, byType: {} as Record<string, number> }
  )

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Recursos y tutoriales</h2>
          <p className="text-sm text-white/60">
            Administra el contenido educativo disponible en el portal del cliente: videos, documentación y guías.
          </p>
        </div>
        <ResourceEditor
          mode="create"
          trigger={
            <Button className="bg-vanguard-blue text-white hover:bg-vanguard-blue/90">
              Crear recurso global
            </Button>
          }
        />
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <Card className="border-white/10 bg-white/5 text-white backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-white">Total de recursos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totals.count}</p>
            <p className="text-xs text-white/50">Incluye videos, documentos y guías disponibles para clientes.</p>
          </CardContent>
        </Card>
        {Object.entries(TYPE_CONFIG).map(([type, config]) => (
          <Card key={type} className="border-white/10 bg-white/5 text-white backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-white">{config.label}</CardTitle>
              <config.icon className={`h-5 w-5 ${config.accent}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{totals.byType[type] ?? 0}</p>
              <p className="text-xs text-white/50">Recursos clasificados como {config.label.toLowerCase()}.</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-6">
        {categories.map((category) => (
          <Card key={category.id} className="border-white/10 bg-slate-900/40 text-white shadow-lg shadow-black/10">
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-white">{category.name}</CardTitle>
                <p className="text-sm text-white/60">{category.description}</p>
              </div>
              <ResourceEditor
                mode="create"
                categoryId={category.id}
                trigger={
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Añadir recurso
                  </Button>
                }
              />
            </CardHeader>
            <CardContent className="space-y-4">
              {category.resources.map((resource) => (
                <div
                  key={resource.id}
                  className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-[2fr_1fr]"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{resource.title}</h3>
                      <Badge variant="secondary" className="bg-white/10 text-white">
                        {TYPE_CONFIG[resource.type].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60">{resource.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-white/50">
                      {resource.duration ? <Badge variant="outline">Duración: {resource.duration}</Badge> : null}
                      {resource.fileSize ? <Badge variant="outline">Tamaño: {resource.fileSize}</Badge> : null}
                      {resource.category ? (
                        <Badge variant="outline" className="border-vanguard-blue/40 text-vanguard-blue">
                          {resource.category}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button asChild variant="ghost" className="text-vanguard-blue hover:bg-vanguard-blue/10">
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Abrir recurso
                        </a>
                      </Button>
                      <ResourceEditor
                        resource={resource}
                        trigger={
                          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Editar
                          </Button>
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-3 rounded-xl border border-white/10 bg-slate-900/50 p-4 text-xs text-white/60">
                    <p className="text-white/40 uppercase tracking-[0.3em]">Metadatos</p>
                    <div className="space-y-1">
                      <p>
                        <span className="font-semibold text-white">ID:</span> {resource.id}
                      </p>
                      <p>
                        <span className="font-semibold text-white">Servicio:</span>{" "}
                        {resource.serviceId ?? "No asociado"}
                      </p>
                      <p>
                        <span className="font-semibold text-white">Categoría:</span> {resource.category}
                      </p>
                    </div>
                    {resource.thumbnail ? (
                      <div>
                        <p className="mb-1 text-white/50">Thumbnail:</p>
                        <a
                          href={resource.thumbnail}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-vanguard-blue hover:underline"
                        >
                          {resource.thumbnail}
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}



