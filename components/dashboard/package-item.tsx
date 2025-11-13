"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2, Loader2 } from "lucide-react"
import { type Package, eliminarEmpaque } from "@/lib/storage/local-storage"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { mostrarExito, mostrarError, confirmar } from "@/lib/utils/sweet-alerts"

interface PackageItemProps {
  package: Package
  onView: () => void
  onUpdate: () => void
}

const statusColors = {
  "en producción": "bg-blue-500",
  distribuido: "bg-green-500",
  reciclado: "bg-emerald-600",
}

export function PackageItem({ package: pkg, onView, onUpdate }: PackageItemProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmado = await confirmar("¿Estás seguro de eliminar este empaque?")
    if (!confirmado) return

    setDeleting(true)

    try {
      await eliminarEmpaque(pkg.id!)

      await mostrarExito("Empaque eliminado")

      onUpdate()
    } catch (error: any) {
      console.error("[v0] Error deleting package:", error)
      mostrarError(error.message || "Error al eliminar el empaque")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{pkg.packageId}</h3>
          <Badge className={statusColors[pkg.status]}>{pkg.status}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="capitalize">{pkg.materialType}</span> • Fabricado:{" "}
          {format(pkg.manufacturingDate, "dd/MM/yyyy", { locale: es })}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onView} disabled={deleting}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleDelete} disabled={deleting}>
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
