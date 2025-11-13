"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { guardarEmpaque } from "@/lib/storage/local-storage"
import { getCurrentUser } from "@/lib/firebase/auth"
import { Loader2 } from "lucide-react"
import { mostrarExito, mostrarError, mostrarInfo } from "@/lib/utils/sweet-alerts"

interface CreatePackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => Promise<void>
}

export function CreatePackageDialog({ open, onOpenChange, onSuccess }: CreatePackageDialogProps) {
  const [packageId, setPackageId] = useState("")
  const [materialType, setMaterialType] = useState<"maíz" | "caña" | "otro">("maíz")
  const [manufacturingDate, setManufacturingDate] = useState("")
  const [status, setStatus] = useState<"en producción" | "distribuido" | "reciclado">("en producción")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const user = getCurrentUser()
    if (!user) {
      mostrarError("Debes iniciar sesión")
      return
    }

    if (!packageId || !manufacturingDate) {
      mostrarInfo("Por favor completa todos los campos")
      return
    }

    setLoading(true)

    try {
      const qrCode = `QR-${packageId}-${Date.now()}`

      const [year, month, day] = manufacturingDate.split("-")
      const dateWithoutTimezone = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0)

      await guardarEmpaque({
        packageId,
        materialType,
        manufacturingDate: dateWithoutTimezone,
        status,
        qrCode,
        userId: user.uid,
      })

      await mostrarExito("Empaque creado")

      setPackageId("")
      setMaterialType("maíz")
      setManufacturingDate("")
      setStatus("en producción")

      onOpenChange(false)
      await onSuccess()
    } catch (error: any) {
      console.error("[v0] Error creating package:", error)
      mostrarError(error.message || "Error al crear el empaque")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Empaque</DialogTitle>
          <DialogDescription>Crea un nuevo empaque biodegradable con trazabilidad digital</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="packageId">ID del Empaque</Label>
            <Input
              id="packageId"
              placeholder="ECO-001"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="materialType">Tipo de Material</Label>
            <Select value={materialType} onValueChange={(value: any) => setMaterialType(value)} disabled={loading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maíz">Maíz</SelectItem>
                <SelectItem value="caña">Caña</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manufacturingDate">Fecha de Fabricación</Label>
            <Input
              id="manufacturingDate"
              type="date"
              value={manufacturingDate}
              onChange={(e) => setManufacturingDate(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)} disabled={loading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en producción">En Producción</SelectItem>
                <SelectItem value="distribuido">Distribuido</SelectItem>
                <SelectItem value="reciclado">Reciclado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Empaque"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
