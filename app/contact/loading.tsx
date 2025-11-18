export default function Loading() {
  return (
    <>
      {/* Hero Section Fallback - matches final layout */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))] -z-0" />
        <div className="vanguard-container relative z-10 py-24">
          <div className="h-10 w-64 animate-pulse rounded-full bg-slate-800/70" />
          <div className="vanguard-divider mt-6"></div>
        </div>
      </section>

      {/* Contact Form Section Fallback */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))] -z-0" />
        <div className="vanguard-container relative z-10 py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="relative">
              <div className="absolute inset-0 -z-10 blur-3xl opacity-70 [background:radial-gradient(circle_at_top,_rgba(14,165,233,0.35),_rgba(15,23,42,0))]" />
              <div className="relative z-10 rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/65 to-slate-950/90 p-[1px] shadow-[0_35px_65px_rgba(2,6,23,0.6)] backdrop-blur">
                <div className="space-y-6 rounded-[26px] border border-white/10 bg-slate-950/80 p-8">
                  <div className="h-5 w-40 animate-pulse rounded-full bg-slate-800/70" />
                  <div className="h-8 w-56 animate-pulse rounded-full bg-slate-800/70" />
                  <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-800/50" />
                  <div className="h-12 w-full animate-pulse rounded-xl bg-slate-800/50" />
                  <div className="h-12 w-full animate-pulse rounded-xl bg-slate-800/50" />
                  <div className="h-36 w-full animate-pulse rounded-2xl bg-slate-800/50" />
                  <div className="h-12 w-full animate-pulse rounded-xl bg-slate-800/50" />
                </div>
              </div>
            </div>
            <div className="space-y-12 text-white">
              <div className="space-y-6 rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/90 p-10 shadow-[0_30px_60px_rgba(15,23,42,0.5)] backdrop-blur">
                <div className="h-6 w-48 animate-pulse rounded-full bg-slate-800/70" />
                <div className="grid gap-4">
                  <div className="h-16 w-full animate-pulse rounded-2xl bg-slate-800/50" />
                  <div className="h-16 w-full animate-pulse rounded-2xl bg-slate-800/50" />
                  <div className="h-16 w-full animate-pulse rounded-2xl bg-slate-800/50" />
                </div>
              </div>
              <div className="space-y-4 rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/90 p-10 shadow-[0_30px_60px_rgba(15,23,42,0.5)] backdrop-blur">
                <div className="h-6 w-40 animate-pulse rounded-full bg-slate-800/70" />
                <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-800/50" />
                <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-800/50" />
                <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-800/50" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}



