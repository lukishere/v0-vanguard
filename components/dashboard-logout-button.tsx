"use client"

import { useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function DashboardLogoutButton() {
  const { signOut } = useClerk()

  const handleSignOut = () => {
    signOut({ redirectUrl: "/clientes/" })
  }

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
      className="border-red-500/40 bg-red-600/30 text-white hover:bg-red-600/50 hover:text-white hover:border-red-500/60 cursor-pointer"
      type="button"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Cerrar sesión
    </Button>
  )
}
