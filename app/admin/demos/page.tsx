import { PlusCircle, Wand2, Pencil, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DemoEditor } from "@/components/admin/demo-editor"
import { DeleteDemoButton } from "@/components/admin/delete-demo-button"
import { getAllDemos } from "@/lib/demos/catalog"
import { getDeletedDemos } from "@/app/actions/demos"
import { getAllDemoLikes } from "@/app/actions/demo-likes"
import type { Demo } from "@/lib/demos/types"

const STATUS_LABELS: Record<string, string> = {
  "available": "📘 Disponible",
  "in-development": "🔨 En Desarrollo",
}

function groupByStatus(demos: Demo[]) {
  return demos.reduce<Record<string, Demo[]>>((acc, demo) => {
    if (!acc[demo.status]) {
      acc[demo.status] = []
    }
    acc[demo.status].push(demo)
    return acc
  }, {})
}

export default async function AdminDemosPage() {
  const allDemos = await getAllDemos()
  const deletedDemoIds = await getDeletedDemos()
  const likesStats = await getAllDemoLikes()

  // Filtrar demos eliminadas
  const demos = allDemos.filter(demo => !deletedDemoIds.includes(demo.id))
  const grouped = groupByStatus(demos)

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Catálogo de demos</h2>
          <p className="text-sm text-white/60">
            Crea, edita y controla la disponibilidad de las demos que ven los clientes dentro del portal.
          </p>
        </div>
        <DemoEditor
          mode="create"
          trigger={
            <Button className="bg-vanguard-400 text-white hover:bg-vanguard-500 shadow-lg shadow-vanguard-400/20">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva demo
            </Button>
          }
        />
      </header>

      <section className="grid gap-6 lg:grid-cols-4">
        {Object.entries(grouped).map(([status, collection]) => (
          <Card key={status} className="border-white/10 bg-white/5 text-white backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center justify-between text-base font-semibold text-white">
                <span>{STATUS_LABELS[status] ?? status}</span>
                <Badge variant="secondary" className="bg-white/10 text-white">
                  {collection.length}
                </Badge>
              </CardTitle>
              <p className="text-xs text-white/50">
                {status === "in-development" && "Aparecen en 'En Desarrollo' de todos los clientes"}
                {status === "available" && "Aparecen en 'Catálogo' de todos los clientes"}
              </p>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="space-y-6">
        {demos.map((demo) => (
          <Card key={demo.id} className="border-white/10 bg-slate-900/40 text-white shadow-lg shadow-black/10">
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-xl font-semibold text-white">{demo.name}</CardTitle>
                  <Badge variant="secondary" className="bg-white/10 text-white">
                    {STATUS_LABELS[demo.status] ?? demo.status}
                  </Badge>
                  <Badge variant="outline" className="border-vanguard-400/50 bg-vanguard-400/10 text-vanguard-300">
                    {demo.demoType}
                  </Badge>
                  {demo.status === "in-development" && likesStats[demo.id] > 0 && (
                    <Badge className="bg-vanguard-blue/20 text-vanguard-blue border-vanguard-blue/30">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {likesStats[demo.id]} {likesStats[demo.id] === 1 ? 'like' : 'likes'}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/60">{demo.summary}</p>
                <div className="flex flex-wrap gap-2 text-xs text-white/50">
                  {demo.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <DemoEditor
                  demo={demo}
                  trigger={
                    <Button
                      variant="outline"
                      className="border-vanguard-300/40 bg-vanguard-400/10 text-vanguard-300 hover:bg-vanguard-400/20 hover:border-vanguard-300/60 transition-all"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  }
                />
                <DeleteDemoButton demoId={demo.id} demoName={demo.name} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/70">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Wand2 className="h-4 w-4 text-vanguard-300" />
                    Detalles operativos
                  </h4>
                  <p>{demo.description}</p>
                  {demo.nextStep ? (
                    <p className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/60">
                      <span className="font-semibold text-white">Siguiente paso:</span> {demo.nextStep}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">CTA principal</p>
                    <p className="text-sm text-white">{demo.cta ?? "Sin CTA definido"}</p>
                    {demo.interactiveUrl ? (
                      <p className="text-xs text-vanguard-300">URL: {demo.interactiveUrl}</p>
                    ) : null}
                  </div>
                  {demo.status === "in-development" ? (
                    <>
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100">
                        <p className="font-semibold">Progreso: {demo.progress ?? 0}%</p>
                        {demo.estimatedDelivery ? <p>Entrega estimada: {demo.estimatedDelivery}</p> : null}
                      </div>
                      <div className="rounded-lg border border-vanguard-blue/30 bg-vanguard-blue/10 p-3">
                        <div className="flex items-center gap-2 text-xs">
                          <ThumbsUp className="h-4 w-4 text-vanguard-blue" />
                          <span className="text-white font-semibold">
                            Engagement: {likesStats[demo.id] || 0} {(likesStats[demo.id] || 0) === 1 ? 'cliente' : 'clientes'} interesados
                          </span>
                        </div>
                        {(likesStats[demo.id] || 0) > 0 && (
                          <p className="text-xs text-white/70 mt-1">
                            Esta demo está generando interés entre los clientes
                          </p>
                        )}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
