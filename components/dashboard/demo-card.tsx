"use client";

import { LikeButton } from "./like-button";
import { MeetingModal as DemoMeetingModal } from "./meeting-modal";
import { RequestDemoButton } from "./request-demo-button";
import { WaitlistButton } from "./waitlist-button";

import { logActivity } from "@/app/actions/client-activities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDemo } from "@/contexts/demo-context";
import { useToast } from "@/hooks/use-toast";
import type { Demo } from "@/lib/demos/types";
import {
  calculateUsagePercentage,
  formatDaysRemaining,
  getExpirationStatus,
} from "@/lib/demos/utils";
import {
  AlertCircle,
  Calendar,
  Clock,
  Loader2,
  MessageSquare,
  Play,
} from "lucide-react";
import { useState } from "react";
import { DemoModal } from "./demo-modal";

interface DemoCardProps {
  demo: Demo;
}

export function DemoCard({ demo }: DemoCardProps) {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const { toast } = useToast();
  const { openDemo, isLoading, error } = useDemo();

  const expirationStatus = getExpirationStatus(demo.daysRemaining ?? null);
  const usagePercentage =
    demo.usageDays && demo.totalDays
      ? calculateUsagePercentage(demo.usageDays, demo.totalDays)
      : null;

  const statusColors = {
    active: "bg-emerald-500/20 text-emerald-400",
    "in-development": "bg-amber-500/20 text-amber-400",
    available: "bg-blue-500/20 text-blue-400",
    expired: "bg-red-500/20 text-red-400",
  };

  const expirationColors = {
    safe: "text-white/70",
    warning: "text-amber-400",
    critical: "text-red-400",
    expired: "text-red-500",
  };

  return (
    <>
      <article className="group flex flex-col justify-between rounded-3xl border border-white/20 bg-slate-800/60 p-6 shadow-2xl backdrop-blur transition-all hover:-translate-y-1 hover:border-vanguard-blue/40 hover:bg-slate-800/80">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {demo.icon && <span className="text-2xl">{demo.icon}</span>}
                <h2 className="text-xl font-semibold">{demo.name}</h2>
              </div>
              <Badge
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  statusColors[demo.status]
                }`}
              >
                {demo.status === "active"
                  ? "Activa"
                  : demo.status === "in-development"
                  ? "En Desarrollo"
                  : demo.status === "available"
                  ? "Disponible"
                  : demo.status === "expired"
                  ? "Expirada"
                  : demo.status}
              </Badge>
            </div>
          </div>

          {/* Summary */}
          <p className="text-sm text-white/70">{demo.summary}</p>

          {/* Expiration & Usage Info */}
          {demo.status === "active" && demo.daysRemaining !== undefined && (
            <div className="space-y-3 rounded-2xl border border-white/20 bg-slate-800/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <Clock className="h-4 w-4" />
                  <span>Tiempo restante</span>
                </div>
                <span
                  className={`font-medium ${expirationColors[expirationStatus]}`}
                >
                  {formatDaysRemaining(demo.daysRemaining)}
                </span>
              </div>

              {usagePercentage !== null && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>
                      Uso: {demo.usageDays} de {demo.totalDays} días
                    </span>
                    <span>{usagePercentage}%</span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                </div>
              )}

              {expirationStatus === "critical" && (
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 rounded-lg p-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    Tu demo expira pronto. Considera contratar o ampliar.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Progress (for in-development demos) */}
          {demo.status === "in-development" && demo.progress !== undefined && (
            <div className="space-y-3 rounded-2xl border border-white/20 bg-slate-800/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Progreso</span>
                <span className="font-medium text-white">{demo.progress}%</span>
              </div>
              <Progress value={demo.progress} className="h-2" />

              {demo.milestones && (
                <div className="space-y-2 mt-3">
                  {demo.milestones.slice(0, 2).map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          milestone.completed ? "bg-emerald-400" : "bg-white/20"
                        }`}
                      />
                      <span
                        className={
                          milestone.completed
                            ? "text-white/80 line-through"
                            : "text-white/60"
                        }
                      >
                        {milestone.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Detalles Operativos */}
          {demo.description && (
            <div className="space-y-2 rounded-2xl border border-white/20 bg-slate-800/50 p-4">
              <span className="text-xs uppercase tracking-wider text-white/50">
                Detalles operativos
              </span>
              <p className="text-sm text-white/80">{demo.description}</p>
            </div>
          )}

          {/* Stats */}
          {demo.status === "active" && (
            <div className="flex items-center gap-4 text-xs text-white/60">
              {demo.sessionsCount !== undefined && (
                <div className="flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  <span>{demo.sessionsCount} sesiones</span>
                </div>
              )}
              {demo.feedbackCount !== undefined && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{demo.feedbackCount} feedbacks</span>
                </div>
              )}
              {demo.lastUsedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Última prueba:{" "}
                    {new Date(demo.lastUsedAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {demo.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/50"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {/* Demos ACTIVAS: Mostrar "Abrir Demo", "Consultas" y "Reunión" */}
            {demo.status === "active" && (
              <>
                <Button
                  onClick={async () => {
                    if (demo.interactiveUrl) {
                      await openDemo(demo);
                      setShowDemoModal(true);
                    } else {
                      toast({
                        title: "Demo no disponible",
                        description:
                          "Esta demo aún no tiene una URL configurada.",
                        variant: "destructive",
                      });
                    }
                  }}
                  disabled={!demo.interactiveUrl || isLoading}
                  className="h-10 bg-vanguard-blue text-white hover:bg-vanguard-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Play className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  <span className="text-xs font-medium">
                    {isLoading ? "Cargando..." : "Abrir Demo"}
                  </span>
                </Button>

                <Button
                  onClick={async () => {
                    // Registrar actividad
                    await logActivity(
                      "chat-opened",
                      `Abrió consultas sobre "${demo.name}"`,
                      { demoId: demo.id, demoName: demo.name }
                    );

                    // Trigger chatbot con contexto de esta demo
                    const event = new CustomEvent("openChatbot", {
                      detail: {
                        demoName: demo.name,
                        initialMessage: `Tengo dudas sobre la demo "${demo.name}". ¿Puedes ayudarme?`,
                      },
                    });
                    window.dispatchEvent(event);
                  }}
                  variant="outline"
                  className="h-10 border-vanguard-300/40 bg-vanguard-400/10 text-vanguard-300 hover:bg-vanguard-400/20 hover:border-vanguard-300/60 transition-all"
                >
                  <svg
                    className="mr-1.5 h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="4" y="8" width="16" height="12" rx="2" />
                    <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
                    <circle cx="9" cy="13" r="1" fill="currentColor" />
                    <circle cx="15" cy="13" r="1" fill="currentColor" />
                    <path d="M9 17h6" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs font-medium">Consultas</span>
                </Button>

                <Button
                  onClick={async () => {
                    // Registrar actividad
                    await logActivity(
                      "meeting-requested",
                      `Inició solicitud de reunión para "${demo.name}"`,
                      { demoId: demo.id, demoName: demo.name }
                    );
                    setShowMeetingModal(true);
                  }}
                  variant="outline"
                  className="h-10 border-amber-300/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 hover:border-amber-300/60 transition-all"
                >
                  <Calendar className="mr-1.5 h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Reunión</span>
                </Button>
              </>
            )}

            {/* Demos EXPIRADAS: Mostrar "Contratar Servicio", "Consultas" y "Reunión" */}
            {demo.status === "expired" && (
              <>
                <Button
                  onClick={async () => {
                    // Registrar actividad
                    await logActivity(
                      "service-contracted",
                      `Solicitó contratar servicio para "${demo.name}" (demo expirada)`,
                      { demoId: demo.id, demoName: demo.name }
                    );

                    // Aquí podríamos abrir un modal de contratación o redirigir
                    toast({
                      title: "Solicitud de contratación",
                      description:
                        "Te contactaremos pronto para discutir las opciones de contratación.",
                    });
                  }}
                  className="h-10 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <svg
                    className="mr-1.5 h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span className="text-xs font-medium">
                    Contratar Servicio
                  </span>
                </Button>

                <Button
                  onClick={async () => {
                    // Registrar actividad
                    await logActivity(
                      "chat-opened",
                      `Abrió consultas sobre "${demo.name}" (demo expirada)`,
                      { demoId: demo.id, demoName: demo.name }
                    );

                    // Trigger chatbot con contexto de esta demo
                    const event = new CustomEvent("openChatbot", {
                      detail: {
                        demoName: demo.name,
                        initialMessage: `Mi demo "${demo.name}" ha expirado. ¿Qué opciones tengo para continuar?`,
                      },
                    });
                    window.dispatchEvent(event);
                  }}
                  variant="outline"
                  className="h-10 border-vanguard-300/40 bg-vanguard-400/10 text-vanguard-300 hover:bg-vanguard-400/20 hover:border-vanguard-300/60 transition-all"
                >
                  <svg
                    className="mr-1.5 h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="4" y="8" width="16" height="12" rx="2" />
                    <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
                    <circle cx="9" cy="13" r="1" fill="currentColor" />
                    <circle cx="15" cy="13" r="1" fill="currentColor" />
                    <path d="M9 17h6" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs font-medium">Consultas</span>
                </Button>

                <Button
                  onClick={async () => {
                    // Registrar actividad
                    await logActivity(
                      "meeting-requested",
                      `Inició solicitud de reunión para "${demo.name}" (demo expirada)`,
                      { demoId: demo.id, demoName: demo.name }
                    );
                    setShowMeetingModal(true);
                  }}
                  variant="outline"
                  className="h-10 border-amber-300/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 hover:border-amber-300/60 transition-all"
                >
                  <Calendar className="mr-1.5 h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Reunión</span>
                </Button>
              </>
            )}

            {/* Demos EN DESARROLLO */}
            {demo.status === "in-development" && (
              <>
                <WaitlistButton demoId={demo.id} demoName={demo.name} />
                <LikeButton demoId={demo.id} demoName={demo.name} />

                <Button
                  onClick={async () => {
                    // Registrar actividad
                    await logActivity(
                      "chat-opened",
                      `Abrió consultas sobre "${demo.name}" (demo en desarrollo)`,
                      { demoId: demo.id, demoName: demo.name }
                    );

                    // Trigger chatbot con contexto de esta demo
                    const event = new CustomEvent("openChatbot", {
                      detail: {
                        demoName: demo.name,
                        initialMessage: `Tengo preguntas sobre la demo "${demo.name}" que está en desarrollo. ¿Cuándo estará disponible?`,
                      },
                    });
                    window.dispatchEvent(event);
                  }}
                  variant="outline"
                  className="h-10 border-vanguard-300/40 bg-vanguard-400/10 text-vanguard-300 hover:bg-vanguard-400/20 hover:border-vanguard-300/60 transition-all"
                >
                  <svg
                    className="mr-1.5 h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="4" y="8" width="16" height="12" rx="2" />
                    <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
                    <circle cx="9" cy="13" r="1" fill="currentColor" />
                    <circle cx="15" cy="13" r="1" fill="currentColor" />
                    <path d="M9 17h6" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs font-medium">Consultas</span>
                </Button>
              </>
            )}

            {/* Demos DISPONIBLES: Mostrar "Solicitar Demo", "Consultas" y "Reunión" */}
            {demo.status === "available" && (
              <>
                <RequestDemoButton demoId={demo.id} demoName={demo.name} />

                <Button
                  onClick={async () => {
                    // Registrar actividad
                    await logActivity(
                      "chat-opened",
                      `Abrió consultas sobre "${demo.name}" (demo disponible)`,
                      { demoId: demo.id, demoName: demo.name }
                    );

                    // Trigger chatbot con contexto de esta demo
                    const event = new CustomEvent("openChatbot", {
                      detail: {
                        demoName: demo.name,
                        initialMessage: `Tengo preguntas sobre la demo "${demo.name}". ¿Puedes ayudarme?`,
                      },
                    });
                    window.dispatchEvent(event);
                  }}
                  variant="outline"
                  className="h-10 border-vanguard-300/40 bg-vanguard-400/10 text-vanguard-300 hover:bg-vanguard-400/20 hover:border-vanguard-300/60 transition-all"
                >
                  <svg
                    className="mr-1.5 h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="4" y="8" width="16" height="12" rx="2" />
                    <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
                    <circle cx="9" cy="13" r="1" fill="currentColor" />
                    <circle cx="15" cy="13" r="1" fill="currentColor" />
                    <path d="M9 17h6" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs font-medium">Consultas</span>
                </Button>

                <Button
                  onClick={async () => {
                    // Registrar actividad
                    await logActivity(
                      "meeting-requested",
                      `Inició solicitud de reunión para "${demo.name}" (demo disponible)`,
                      { demoId: demo.id, demoName: demo.name }
                    );
                    setShowMeetingModal(true);
                  }}
                  variant="outline"
                  className="h-10 border-amber-300/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 hover:border-amber-300/60 transition-all"
                >
                  <Calendar className="mr-1.5 h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Reunión</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </article>

      {/* Modals */}
      {showDemoModal && demo.interactiveUrl && (
        <DemoModal
          demo={demo}
          open={showDemoModal}
          onOpenChange={setShowDemoModal}
        />
      )}

      {showMeetingModal && (
        <DemoMeetingModal
          demo={demo}
          open={showMeetingModal}
          onOpenChange={setShowMeetingModal}
          requestType="meeting"
        />
      )}
    </>
  );
}
