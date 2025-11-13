"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, Recycle, Truck } from "lucide-react"
import { cargarEmpaques } from "@/lib/storage/local-storage"
import { getCurrentUser } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"

export function PackageStats() {
  const [stats, setStats] = useState({
    total: 0,
    production: 0,
    distributed: 0,
    recycled: 0,
  })
  const router = useRouter()

  const loadStats = async () => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    try {
      const packages = await cargarEmpaques(user.uid)
      setStats({
        total: packages.length,
        production: packages.filter((p) => p.status === "en producción").length,
        distributed: packages.filter((p) => p.status === "distribuido").length,
        recycled: packages.filter((p) => p.status === "reciclado").length,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  useEffect(() => {
    // Cargar estadísticas al montar el componente
    loadStats()

    const handlePackagesUpdate = () => {
      loadStats()
    }

    window.addEventListener("empaquesActualizados", handlePackagesUpdate)

    // Limpiar el evento al desmontar
    return () => {
      window.removeEventListener("empaquesActualizados", handlePackagesUpdate)
    }
  }, [router])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total de Empaques</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">En Producción</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.production}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Distribuidos</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.distributed}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Reciclados</CardTitle>
          <Recycle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recycled}</div>
        </CardContent>
      </Card>
    </div>
  )
}
