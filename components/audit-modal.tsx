"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AuditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuditModal({ open, onOpenChange }: AuditModalProps) {
  const { t } = useLanguage()
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    company: "",
    sector: "",
    message: "",
    loading: false,
    submitted: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formState.name.trim() || !formState.email.trim() || !formState.phone.trim()) {
      return
    }

    setFormState({ ...formState, loading: true })

    try {
      const response = await fetch("/api/audit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          position: formState.position,
          company: formState.company,
          sector: formState.sector,
          message: formState.message || "Technical audit request",
        }),
      })

      if (response.ok) {
        setFormState({
          name: "",
          email: "",
          phone: "",
          position: "",
          company: "",
          sector: "",
          message: "",
          loading: false,
          submitted: true,
        })
        setTimeout(() => {
          onOpenChange(false)
          setFormState({
            name: "",
            email: "",
            phone: "",
            position: "",
            company: "",
            sector: "",
            message: "",
            loading: false,
            submitted: false,
          })
        }, 2000)
      } else {
        setFormState({ ...formState, loading: false })
        alert(t("audit.modal.error"))
      }
    } catch {
      setFormState({ ...formState, loading: false })
      alert(t("audit.modal.error"))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-vanguard-blue">
            {t("audit.modal.title")}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t("audit.modal.description")}
          </DialogDescription>
        </DialogHeader>

        {formState.submitted ? (
          <div className="py-8 text-center">
            <p className="text-lg font-semibold text-green-600">
              {t("audit.modal.success")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audit-name">{t("audit.modal.name")}</Label>
              <Input
                id="audit-name"
                type="text"
                required
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                disabled={formState.loading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audit-email">{t("audit.modal.email")}</Label>
              <Input
                id="audit-email"
                type="email"
                required
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                disabled={formState.loading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audit-phone">{t("audit.modal.phone")}</Label>
              <Input
                id="audit-phone"
                type="tel"
                required
                value={formState.phone}
                onChange={(e) =>
                  setFormState({ ...formState, phone: e.target.value })
                }
                disabled={formState.loading}
                className="w-full"
                placeholder="+34 123 456 789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audit-position">{t("audit.modal.position")}</Label>
              <Input
                id="audit-position"
                type="text"
                value={formState.position}
                onChange={(e) =>
                  setFormState({ ...formState, position: e.target.value })
                }
                disabled={formState.loading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audit-company">{t("audit.modal.company")}</Label>
              <Input
                id="audit-company"
                type="text"
                value={formState.company}
                onChange={(e) =>
                  setFormState({ ...formState, company: e.target.value })
                }
                disabled={formState.loading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audit-sector">{t("audit.modal.sector")}</Label>
              <Input
                id="audit-sector"
                type="text"
                value={formState.sector}
                onChange={(e) =>
                  setFormState({ ...formState, sector: e.target.value })
                }
                disabled={formState.loading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audit-message">{t("audit.modal.message")}</Label>
              <Textarea
                id="audit-message"
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                disabled={formState.loading}
                rows={4}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={formState.loading}
              className="w-full bg-vanguard-blue hover:bg-vanguard-blue/90"
            >
              {formState.loading ? t("audit.modal.sending") : t("audit.modal.submit")}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
