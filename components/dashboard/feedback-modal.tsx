"use client"

import { useState } from "react"
import type { Demo } from "@/lib/demos/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FeedbackModalProps {
  demo: Demo
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackModal({ demo, open, onOpenChange }: FeedbackModalProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [suggestions, setSuggestions] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Selecciona una calificación",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Implement API call to save feedback
      // await fetch('/api/feedback', { method: 'POST', body: JSON.stringify({ demoId: demo.id, rating, comment, suggestions }) })
      
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast({
        title: "Feedback enviado",
        description: "Gracias por tu opinión. La revisaremos pronto.",
      })
      
      setRating(0)
      setComment("")
      setSuggestions("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el feedback. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Compartir Feedback</DialogTitle>
          <DialogDescription className="text-white/70">
            Demo: {demo.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-white">¿Qué te pareció?</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`transition-all ${
                    rating >= value
                      ? "text-yellow-400 scale-110"
                      : "text-white/30 hover:text-white/50"
                  }`}
                >
                  <Star className="h-8 w-8 fill-current" />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-white/70">
                  {rating === 1 && "Muy malo"}
                  {rating === 2 && "Malo"}
                  {rating === 3 && "Regular"}
                  {rating === 4 && "Bueno"}
                  {rating === 5 && "Excelente"}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-white">
              Comentarios
            </Label>
            <Textarea
              id="comment"
              placeholder="¿Qué te gustó? ¿Qué mejorarías?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
            />
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            <Label htmlFor="suggestions" className="text-white">
              Sugerencias de mejora (opcional)
            </Label>
            <Textarea
              id="suggestions"
              placeholder="¿Qué funcionalidades te gustaría ver?"
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px]"
            />
          </div>

          {/* Feedback History Placeholder */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-white/50 mb-2">
              Historial de feedbacks
            </p>
            <p className="text-sm text-white/70">
              Aún no has enviado feedbacks para esta demo.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="bg-vanguard-blue text-white hover:bg-vanguard-blue/90"
          >
            {isSubmitting ? "Enviando..." : "Enviar Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

