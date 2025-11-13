/**
 * SISTEMA DE ALMACENAMIENTO LOCAL (LocalStorage)
 * ================================================
 * Este archivo gestiona el almacenamiento de empaques usando LocalStorage del navegador.
 *
 * NOTA IMPORTANTE: Este es un sistema temporal mientras no esté disponible Firebase.
 * Cuando Firebase esté listo, reemplazar estas funciones con las de lib/firebase/firestore.ts
 *
 * La estructura de datos es idéntica a Firebase para facilitar la migración futura.
 */

// Tipos de datos (idénticos a los de Firebase)
export interface Package {
  id?: string
  packageId: string
  materialType: "maíz" | "caña" | "otro"
  manufacturingDate: Date
  status: "en producción" | "distribuido" | "reciclado"
  qrCode: string
  userId: string
  createdAt?: Date
  updatedAt?: Date
}

// Clave para almacenar los datos en LocalStorage
const STORAGE_KEY = "ecopack_packages"

/**
 * Función auxiliar: Obtener todos los empaques desde LocalStorage
 * Convierte las fechas de string a objetos Date
 */
function obtenerTodosLosEmpaques(): Package[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []

    const packages = JSON.parse(data)
    // Convertir las fechas de string a Date
    return packages.map((pkg: any) => ({
      ...pkg,
      manufacturingDate: new Date(pkg.manufacturingDate),
      createdAt: pkg.createdAt ? new Date(pkg.createdAt) : undefined,
      updatedAt: pkg.updatedAt ? new Date(pkg.updatedAt) : undefined,
    }))
  } catch (error) {
    console.error("[LocalStorage] Error al leer datos:", error)
    return []
  }
}

/**
 * Función auxiliar: Guardar todos los empaques en LocalStorage
 */
function guardarTodosLosEmpaques(packages: Package[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages))
  } catch (error) {
    console.error("[LocalStorage] Error al guardar datos:", error)
    throw new Error("No se pudo guardar en LocalStorage")
  }
}

/**
 * Función auxiliar: Disparar evento de cambio en empaques
 * Esto notifica a otros componentes que los datos han cambiado
 */
function notificarCambioEmpaques(): void {
  if (typeof window === "undefined") return

  const event = new CustomEvent("empaquesActualizados")
  window.dispatchEvent(event)
}

/**
 * CREAR EMPAQUE
 * ============
 * Guarda un nuevo empaque en LocalStorage
 *
 * MIGRACIÓN A FIREBASE:
 * Reemplazar esta función por createPackage de lib/firebase/firestore.ts
 * La estructura de datos es la misma, solo cambiar el destino de almacenamiento
 */
export async function guardarEmpaque(packageData: Omit<Package, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    // Obtener todos los empaques existentes
    const allPackages = obtenerTodosLosEmpaques()

    // Verificar si el ID del empaque ya existe
    const existeId = allPackages.some((pkg) => pkg.packageId === packageData.packageId)
    if (existeId) {
      throw new Error(`El ID "${packageData.packageId}" ya existe. Por favor usa otro ID.`)
    }

    // Generar un ID único para el empaque (simula el ID de Firebase)
    const newId = `pkg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Crear el nuevo empaque con timestamps
    const newPackage: Package = {
      ...packageData,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Agregar el nuevo empaque al array
    allPackages.push(newPackage)

    // Guardar en LocalStorage
    guardarTodosLosEmpaques(allPackages)

    notificarCambioEmpaques()

    console.log("[LocalStorage] Empaque creado exitosamente:", newId)
    return newId
  } catch (error) {
    console.error("[LocalStorage] Error al crear empaque:", error)
    throw error
  }
}

/**
 * CARGAR EMPAQUES
 * ==============
 * Obtiene todos los empaques de un usuario desde LocalStorage
 * Ordenados por fecha de creación (más reciente primero)
 *
 * MIGRACIÓN A FIREBASE:
 * Reemplazar por getPackages de lib/firebase/firestore.ts
 */
export async function cargarEmpaques(userId: string): Promise<Package[]> {
  try {
    // Obtener todos los empaques
    const allPackages = obtenerTodosLosEmpaques()

    // Filtrar por usuario y ordenar por fecha de creación
    const userPackages = allPackages
      .filter((pkg) => pkg.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt?.getTime() || 0
        const dateB = b.createdAt?.getTime() || 0
        return dateB - dateA // Más reciente primero
      })

    console.log("[LocalStorage] Empaques cargados:", userPackages.length)
    return userPackages
  } catch (error) {
    console.error("[LocalStorage] Error al cargar empaques:", error)
    return []
  }
}

/**
 * ACTUALIZAR EMPAQUE
 * =================
 * Actualiza los datos de un empaque existente en LocalStorage
 *
 * MIGRACIÓN A FIREBASE:
 * Reemplazar por updatePackage de lib/firebase/firestore.ts
 */
export async function actualizarEmpaque(id: string, packageData: Partial<Package>): Promise<void> {
  try {
    // Obtener todos los empaques
    const allPackages = obtenerTodosLosEmpaques()

    // Buscar el índice del empaque a actualizar
    const index = allPackages.findIndex((pkg) => pkg.id === id)

    if (index === -1) {
      throw new Error("Empaque no encontrado")
    }

    // Actualizar el empaque con los nuevos datos
    allPackages[index] = {
      ...allPackages[index],
      ...packageData,
      id, // Mantener el ID original
      updatedAt: new Date(), // Actualizar timestamp
    }

    // Guardar en LocalStorage
    guardarTodosLosEmpaques(allPackages)

    notificarCambioEmpaques()

    console.log("[LocalStorage] Empaque actualizado exitosamente:", id)
  } catch (error) {
    console.error("[LocalStorage] Error al actualizar empaque:", error)
    throw error
  }
}

/**
 * ELIMINAR EMPAQUE
 * ===============
 * Elimina un empaque de LocalStorage
 *
 * MIGRACIÓN A FIREBASE:
 * Reemplazar por deletePackage de lib/firebase/firestore.ts
 */
export async function eliminarEmpaque(id: string): Promise<void> {
  try {
    // Obtener todos los empaques
    const allPackages = obtenerTodosLosEmpaques()

    // Filtrar para remover el empaque con el ID especificado
    const filteredPackages = allPackages.filter((pkg) => pkg.id !== id)

    // Verificar si se eliminó algo
    if (filteredPackages.length === allPackages.length) {
      throw new Error("Empaque no encontrado")
    }

    // Guardar en LocalStorage
    guardarTodosLosEmpaques(filteredPackages)

    notificarCambioEmpaques()

    console.log("[LocalStorage] Empaque eliminado exitosamente:", id)
  } catch (error) {
    console.error("[LocalStorage] Error al eliminar empaque:", error)
    throw error
  }
}

/**
 * BUSCAR EMPAQUES
 * ==============
 * Busca empaques por término de búsqueda (ID, material, estado, QR)
 *
 * MIGRACIÓN A FIREBASE:
 * Reemplazar por searchPackages de lib/firebase/firestore.ts
 */
export async function buscarEmpaques(userId: string, searchTerm: string): Promise<Package[]> {
  try {
    // Cargar todos los empaques del usuario
    const packages = await cargarEmpaques(userId)

    // Si no hay término de búsqueda, devolver todos
    if (!searchTerm) return packages

    // Buscar en todos los campos relevantes
    const term = searchTerm.toLowerCase()
    const results = packages.filter(
      (pkg) =>
        pkg.packageId.toLowerCase().includes(term) ||
        pkg.materialType.toLowerCase().includes(term) ||
        pkg.status.toLowerCase().includes(term) ||
        pkg.qrCode.toLowerCase().includes(term),
    )

    console.log("[LocalStorage] Búsqueda completada. Resultados:", results.length)
    return results
  } catch (error) {
    console.error("[LocalStorage] Error al buscar empaques:", error)
    return []
  }
}
