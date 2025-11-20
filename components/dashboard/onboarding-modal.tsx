"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

interface CompanyProfile {
  companyName: string;
  industry: string;
  companySize: string;
  position: string;
  phone: string;
  interests: string;
}

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CompanyProfile>({
    companyName: "",
    industry: "",
    companySize: "",
    position: "",
    phone: "",
    interests: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el perfil");
      }

      toast.success("¡Perfil completado exitosamente!");
      onComplete();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error al guardar el perfil. Por favor, intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CompanyProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    formData.companyName.trim() !== "" &&
    formData.industry !== "" &&
    formData.companySize !== "" &&
    formData.position.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-6 w-6 text-vanguard-blue" />
            <DialogTitle className="text-2xl">
              Completa tu Perfil Empresarial
            </DialogTitle>
          </div>
          <DialogDescription>
            Para brindarte una mejor experiencia, necesitamos conocer un poco
            más sobre tu empresa. Esta información nos ayudará a personalizar
            las demos y servicios según tus necesidades.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm font-medium">
              Nombre de la Empresa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              placeholder="Ej: Vanguard-IA"
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-sm font-medium">
              Industria <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => handleChange("industry", value)}
              disabled={isSubmitting}
              required
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Selecciona tu industria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Tecnología</SelectItem>
                <SelectItem value="finance">Finanzas</SelectItem>
                <SelectItem value="healthcare">Salud</SelectItem>
                <SelectItem value="retail">Retail / Comercio</SelectItem>
                <SelectItem value="manufacturing">Manufactura</SelectItem>
                <SelectItem value="education">Educación</SelectItem>
                <SelectItem value="consulting">Consultoría</SelectItem>
                <SelectItem value="real-estate">Bienes Raíces</SelectItem>
                <SelectItem value="logistics">Logística</SelectItem>
                <SelectItem value="other">Otra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Company Size */}
          <div className="space-y-2">
            <Label htmlFor="companySize" className="text-sm font-medium">
              Tamaño de la Empresa <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.companySize}
              onValueChange={(value) => handleChange("companySize", value)}
              disabled={isSubmitting}
              required
            >
              <SelectTrigger id="companySize">
                <SelectValue placeholder="Selecciona el tamaño" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 empleados</SelectItem>
                <SelectItem value="11-50">11-50 empleados</SelectItem>
                <SelectItem value="51-200">51-200 empleados</SelectItem>
                <SelectItem value="201-500">201-500 empleados</SelectItem>
                <SelectItem value="501-1000">501-1000 empleados</SelectItem>
                <SelectItem value="1000+">1000+ empleados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position" className="text-sm font-medium">
              Tu Cargo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="position"
              placeholder="Ej: Director de Tecnología"
              value={formData.position}
              onChange={(e) => handleChange("position", e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Phone (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Teléfono (Opcional)
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Ej: +56 9 1234 5678"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Interests (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="interests" className="text-sm font-medium">
              Áreas de Interés (Opcional)
            </Label>
            <Textarea
              id="interests"
              placeholder="Ej: Automatización de procesos, análisis de datos, chatbots..."
              value={formData.interests}
              onChange={(e) => handleChange("interests", e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="bg-vanguard-blue hover:bg-vanguard-blue/90 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Perfil"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
