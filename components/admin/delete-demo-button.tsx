"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteDemo } from "@/app/actions/demos"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeleteDemoButtonProps {
  demoId: string
  demoName: string
}

export function DeleteDemoButton({ demoId, demoName }: DeleteDemoButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteDemo(demoId)

      if (result.success) {
        toast.success("Demo eliminada", {
          description: `"${demoName}" ha sido eliminada del catálogo.`,
        })
        router.refresh()
      } else {
        toast.error("Error", {
          description: result.error || "No se pudo eliminar la demo",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al eliminar la demo",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white border-2 border-red-400/30 text-slate-900">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl text-slate-900">¿Estás seguro?</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-slate-600">
            Esta acción eliminará la demo <strong className="text-slate-900">"{demoName}"</strong> del catálogo.
            Los clientes con acceso asignado ya no podrán verla.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 my-4">
          <p className="text-xs text-red-700 font-medium">
            ⚠️ Esta acción no se puede deshacer
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-slate-300 text-slate-700 hover:bg-slate-100">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-rose-500 hover:bg-rose-600 text-white"
          >
            {isDeleting ? "Eliminando..." : "Eliminar demo"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
