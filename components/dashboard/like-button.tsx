"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"
import { toggleDemoLike, getDemoLikeStats } from "@/app/actions/demo-likes"
import { logActivity } from "@/app/actions/client-activities"
import { useToast } from "@/hooks/use-toast"

interface LikeButtonProps {
  demoId: string
  demoName: string
}

export function LikeButton({ demoId, demoName }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Cargar estado inicial
  useEffect(() => {
    const loadLikeStatus = async () => {
      try {
        const stats = await getDemoLikeStats(demoId)
        setIsLiked(stats.likedByCurrentUser)
        setLikeCount(stats.totalLikes)
      } catch (error) {
        console.error("Error al cargar likes:", error)
      }
    }

    loadLikeStatus()
  }, [demoId])

  const handleLike = async () => {
    setIsLoading(true)
    try {
      const result = await toggleDemoLike(demoId)

      if (result.success) {
        const newLikedState = result.liked!
        setIsLiked(newLikedState)
        setLikeCount(prev => newLikedState ? prev + 1 : prev - 1)

        // Registrar actividad
        if (newLikedState) {
          await logActivity(
            "demo-liked",
            `Mostró interés en "${demoName}"`,
            { demoId, demoName }
          )
        } else {
          await logActivity(
            "demo-unliked",
            `Quitó interés de "${demoName}"`,
            { demoId, demoName }
          )
        }

        toast({
          title: newLikedState ? "¡Te gusta esta demo!" : "Like removido",
          description: newLikedState 
            ? `Mostraste interés en "${demoName}". El equipo tomará nota.`
            : `Removiste tu like de "${demoName}".`,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo registrar tu like",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLike}
      disabled={isLoading}
      variant={isLiked ? "default" : "outline"}
      className={
        isLiked
          ? "bg-vanguard-blue text-white hover:bg-vanguard-blue/90"
          : "border-white/30 bg-slate-800/50 text-white hover:bg-slate-800/70"
      }
    >
      <ThumbsUp className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
      {likeCount > 0 && <span className="mr-1">{likeCount}</span>}
      {isLiked ? "Te gusta" : "Me interesa"}
    </Button>
  )
}
