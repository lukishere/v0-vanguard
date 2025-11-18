import type { Metadata } from "next"
import { ClientSignIn } from "@/components/client-sign-in"

export const metadata: Metadata = {
  title: "Acceso Clientes | Vanguard-IA",
  description: "Portal seguro para clientes de Vanguard-IA con autenticación Clerk.",
}

export default function ClientPortalPage() {
  return (
    <section className="relative min-h-[70vh] bg-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(31,99,220,0.45),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(239,68,68,0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-24 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-6">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium uppercase tracking-wide text-white/80">
            Portal de Clientes
          </span>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Accede a demos exclusivas y recursos personalizados
          </h1>
          <p className="text-lg text-white/70">
            Inicia sesión con tu cuenta para explorar las experiencias guiadas que preparamos para tu equipo. Desde este
            dashboard podrás probar prototipos, revisar avances y colaborar con nuestro equipo en tiempo real.
          </p>
          <ul className="space-y-3 text-white/70">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-vanguard-red" />
              <span>Visión centralizada de tus demos y entregables.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-vanguard-blue" />
              <span>Actualizaciones en tiempo real y feedback colaborativo.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
              <span>Acceso seguro respaldado por Clerk y mejores prácticas.</span>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <ClientSignIn
            appearance={{
              elements: {
                card: "shadow-none bg-transparent border-0",
                headerTitle: "text-white",
                headerSubtitle: "text-white/70",
                socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 text-white",
                formFieldInput:
                  "bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-vanguard-blue focus:ring-vanguard-blue/40",
                formFieldLabel: "text-white/70",
                footerActionLink: "text-vanguard-blue hover:text-vanguard-blue/80",
                footer: "text-white/60",
              },
            }}
          />
        </div>
      </div>
    </section>
  )
}
