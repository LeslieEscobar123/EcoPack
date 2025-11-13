"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { actualizarEmpaque, type Package } from "@/lib/storage/local-storage"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Loader2, QrCode, Calendar, PackageIcon, Leaf } from "lucide-react"
import { mostrarExito, mostrarError } from "@/lib/utils/sweet-alerts"

interface PackageDetailDialogProps {
  package: Package | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

const statusColors = {
  "en producción": "bg-blue-500",
  distribuido: "bg-green-500",
  reciclado: "bg-emerald-600",
}

export function PackageDetailDialog({ package: pkg, open, onOpenChange, onUpdate }: PackageDetailDialogProps) {
  const [editing, setEditing] = useState(false)
  const [materialType, setMaterialType] = useState<"maíz" | "caña" | "otro">("maíz")
  const [manufacturingDate, setManufacturingDate] = useState("")
  const [status, setStatus] = useState<"en producción" | "distribuido" | "reciclado">("en producción")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (pkg) {
      setMaterialType(pkg.materialType)
      const year = pkg.manufacturingDate.getFullYear()
      const month = String(pkg.manufacturingDate.getMonth() + 1).padStart(2, "0")
      const day = String(pkg.manufacturingDate.getDate()).padStart(2, "0")
      setManufacturingDate(`${year}-${month}-${day}`)
      setStatus(pkg.status)
    }
  }, [pkg])

  const handleUpdate = async () => {
    if (!pkg?.id) return

    setLoading(true)

    try {
      const [year, month, day] = manufacturingDate.split("-")
      const dateWithoutTimezone = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0)

      await actualizarEmpaque(pkg.id, {
        materialType,
        manufacturingDate: dateWithoutTimezone,
        status,
      })

      await mostrarExito("Empaque actualizado")

      setEditing(false)
      onUpdate()
    } catch (error: any) {
      console.error("[v0] Error updating package:", error)
      mostrarError(error.message || "Error al actualizar el empaque")
    } finally {
      setLoading(false)
    }
  }

  if (!pkg) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageIcon className="h-5 w-5" />
            Detalles del Empaque
          </DialogTitle>
          <DialogDescription>Información de trazabilidad y gestión del empaque biodegradable</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Package ID and Status */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">{pkg.packageId}</h3>
              <Badge className={`${statusColors[pkg.status]} mt-2`}>{pkg.status}</Badge>
            </div>
            <Button variant="outline" onClick={() => setEditing(!editing)} disabled={loading}>
              {editing ? "Cancelar" : "Editar"}
            </Button>
          </div>

          {/* Traceability Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <QrCode className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Código QR</p>
                <p className="font-mono text-sm mt-1">{pkg.qrCode}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Leaf className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Material</p>
                {editing ? (
                  <Select
                    value={materialType}
                    onValueChange={(value: any) => setMaterialType(value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maíz">Maíz</SelectItem>
                      <SelectItem value="caña">Caña</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="capitalize mt-1">{pkg.materialType}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de Fabricación</p>
                {editing ? (
                  <Input
                    type="date"
                    value={manufacturingDate}
                    onChange={(e) => setManufacturingDate(e.target.value)}
                    disabled={loading}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1">{format(pkg.manufacturingDate, "dd/MM/yyyy", { locale: es })}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PackageIcon className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado Actual</p>
                {editing ? (
                  <Select value={status} onValueChange={(value: any) => setStatus(value)} disabled={loading}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en producción">En Producción</SelectItem>
                      <SelectItem value="distribuido">Distribuido</SelectItem>
                      <SelectItem value="reciclado">Reciclado</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="capitalize mt-1">{pkg.status}</p>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="font-semibold">Trazabilidad</h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <div className="h-full w-0.5 bg-border" />
                </div>
                <div className="pb-4">
                  <p className="font-medium">Fabricación</p>
                  <p className="text-sm text-muted-foreground">
                    {format(pkg.manufacturingDate, "dd 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
              </div>

              {(pkg.status === "distribuido" || pkg.status === "reciclado") && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    {pkg.status === "reciclado" && <div className="h-full w-0.5 bg-border" />}
                  </div>
                  <div className={pkg.status === "reciclado" ? "pb-4" : ""}>
                    <p className="font-medium">Distribución</p>
                    <p className="text-sm text-muted-foreground">Empaque distribuido a su destino</p>
                  </div>
                </div>
              )}

              {pkg.status === "reciclado" && (
                <div className="flex gap-3">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">Reciclaje</p>
                    <p className="text-sm text-muted-foreground">Empaque procesado para reciclaje</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {editing && (
            <Button onClick={handleUpdate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
