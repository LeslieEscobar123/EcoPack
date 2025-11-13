"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import { cargarEmpaques, buscarEmpaques, type Package } from "@/lib/storage/local-storage"
import { getCurrentUser } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"
import { PackageItem } from "./package-item"
import { CreatePackageDialog } from "./create-package-dialog"
import { PackageDetailDialog } from "./package-detail-dialog"
import { useToast } from "@/hooks/use-toast"

export function PackageList() {
  const [packages, setPackages] = useState<Package[]>([])
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const loadPackages = async () => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    try {
      const data = await cargarEmpaques(user.uid)
      setPackages(data)
      setFilteredPackages(data)
    } catch (error: any) {
      console.error("Error loading packages:", error)
      toast({
        title: "Error",
        description: error.message || "Error al cargar los empaques",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPackages()
  }, [router])

  useEffect(() => {
    const performSearch = async () => {
      const user = getCurrentUser()
      if (!user) return

      if (!searchTerm) {
        setFilteredPackages(packages)
        return
      }

      try {
        const results = await buscarEmpaques(user.uid, searchTerm)
        setFilteredPackages(results)
      } catch (error: any) {
        console.error("Error searching packages:", error)
      }
    }

    performSearch()
  }, [searchTerm, packages])

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Gestión de Empaques</CardTitle>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Empaque
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, material, estado o código QR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Cargando empaques...</p>
          ) : filteredPackages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {searchTerm ? "No se encontraron empaques" : "No hay empaques registrados"}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredPackages.map((pkg) => (
                <PackageItem
                  key={pkg.id}
                  package={pkg}
                  onView={() => setSelectedPackage(pkg)}
                  onUpdate={loadPackages}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreatePackageDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSuccess={loadPackages} />

      <PackageDetailDialog
        package={selectedPackage}
        open={!!selectedPackage}
        onOpenChange={(open) => !open && setSelectedPackage(null)}
        onUpdate={loadPackages}
      />
    </>
  )
}
