"use client"

import { useCookies } from "@/contexts/cookie-context"
import { useLanguage } from "@/contexts/language-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { COOKIE_CATEGORIES, type CookieCategory } from "@/lib/cookies"
import { Info } from "lucide-react"

export function CookieSettings() {
  const { showSettings, setShowSettings, preferences, updatePreference, savePreferences } =
    useCookies()
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Cookie Preferences",
      description:
        "Manage your cookie preferences. You can enable or disable different types of cookies below.",
      necessary: "Necessary cookies cannot be disabled as they are essential for the website to function.",
      save: "Save Preferences",
      cancel: "Cancel",
    },
    es: {
      title: "Preferencias de Cookies",
      description:
        "Gestione sus preferencias de cookies. Puede habilitar o deshabilitar diferentes tipos de cookies a continuación.",
      necessary:
        "Las cookies necesarias no se pueden desactivar ya que son esenciales para el funcionamiento del sitio web.",
      save: "Guardar Preferencias",
      cancel: "Cancelar",
    },
  }

  const t = content[language]

  const categories: CookieCategory[] = ["necessary", "analytics", "functional", "marketing"]

  return (
    <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-vanguard-blue">{t.title}</DialogTitle>
          <DialogDescription className="text-gray-600">{t.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {categories.map((category) => {
            const categoryInfo = COOKIE_CATEGORIES[category]
            const isNecessary = category === "necessary"
            const isEnabled = preferences[category]

            return (
              <div
                key={category}
                className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Label
                      htmlFor={category}
                      className="text-base font-semibold text-vanguard-blue cursor-pointer"
                    >
                      {categoryInfo.name[language]}
                    </Label>
                    {isNecessary && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {language === "en" ? "Required" : "Requerida"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {categoryInfo.description[language]}
                  </p>
                  {isNecessary && (
                    <div className="flex items-start gap-2 mt-2 text-xs text-gray-500">
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{t.necessary}</span>
                    </div>
                  )}
                </div>
                <Switch
                  id={category}
                  checked={isEnabled}
                  disabled={isNecessary}
                  onCheckedChange={(checked) => updatePreference(category, checked)}
                  className="flex-shrink-0"
                />
              </div>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => setShowSettings(false)}>
            {t.cancel}
          </Button>
          <Button
            onClick={() => savePreferences(preferences)}
            className="bg-vanguard-blue hover:bg-vanguard-blue/90"
          >
            {t.save}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}



