"use client"

import { useState } from "react"
import type { Demo } from "@/lib/demos/types"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DemoCard } from "./demo-card"
import { ActivityTimeline } from "./activity-timeline"
import { Target, Clock, BookOpen, Activity } from "lucide-react"

interface DemoTabsProps {
  activeDemos: Demo[]
  inDevelopmentDemos: Demo[]
  availableDemos: Demo[]
  activities?: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
}

export function DemoTabs({
  activeDemos,
  inDevelopmentDemos,
  availableDemos,
  activities = [],
}: DemoTabsProps) {
  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-slate-800/60 border border-white/20 p-2 rounded-xl h-auto">
        <TabsTrigger
          value="active"
          className="data-[state=active]:bg-white/15 data-[state=active]:text-white text-white/70 flex items-center gap-2 py-3 px-4 text-sm font-medium"
        >
          <Target className="h-5 w-5" />
          <span className="hidden sm:inline">Activas</span>
          {activeDemos.length > 0 && (
            <span className="ml-1 px-2.5 py-1 text-xs rounded-full bg-vanguard-blue/30 text-vanguard-blue font-semibold">
              {activeDemos.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="development"
          className="data-[state=active]:bg-white/15 data-[state=active]:text-white text-white/70 flex items-center gap-2 py-3 px-4 text-sm font-medium"
        >
          <Clock className="h-5 w-5" />
          <span className="hidden sm:inline">En Desarrollo</span>
          {inDevelopmentDemos.length > 0 && (
            <span className="ml-1 px-2.5 py-1 text-xs rounded-full bg-amber-500/30 text-amber-400 font-semibold">
              {inDevelopmentDemos.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="catalog"
          className="data-[state=active]:bg-white/15 data-[state=active]:text-white text-white/70 flex items-center gap-2 py-3 px-4 text-sm font-medium"
        >
          <BookOpen className="h-5 w-5" />
          <span className="hidden sm:inline">Disponibles</span>
          {availableDemos.length > 0 && (
            <span className="ml-1 px-2.5 py-1 text-xs rounded-full bg-blue-500/30 text-blue-400 font-semibold">
              {availableDemos.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="activity"
          className="data-[state=active]:bg-white/15 data-[state=active]:text-white text-white/70 flex items-center gap-2 py-3 px-4 text-sm font-medium"
        >
          <Activity className="h-5 w-5" />
          <span className="hidden sm:inline">Actividad</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="mt-6">
        {activeDemos.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {activeDemos.map((demo) => (
              <DemoCard key={demo.id} demo={demo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl border border-white/20 bg-slate-800/60">
            <p className="text-white/70">No tienes demos activas actualmente.</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="development" className="mt-6">
        {inDevelopmentDemos.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {inDevelopmentDemos.map((demo) => (
              <DemoCard key={demo.id} demo={demo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl border border-white/20 bg-slate-800/60">
            <p className="text-white/70">No hay demos en desarrollo actualmente.</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="catalog" className="mt-6">
        {availableDemos.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {availableDemos.map((demo) => (
              <DemoCard key={demo.id} demo={demo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl border border-white/20 bg-slate-800/60">
            <p className="text-white/70">No hay demos disponibles actualmente.</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="activity" className="mt-6">
        <ActivityTimeline activities={activities} />
      </TabsContent>
    </Tabs>
  )
}
