/**
 * UTILIDAD DE ALERTAS CON SWEETALERT2
 * ====================================
 * Alertas personalizadas con el tema verde eco-friendly de EcoPack+
 * Reemplaza las alertas nativas de JavaScript por modales más atractivos
 */

import Swal from "sweetalert2"

// Configuración base con el tema verde de EcoPack+
const baseConfig = {
  confirmButtonColor: "#16a34a", // green-600
  cancelButtonColor: "#6b7280", // gray-500
  background: "#ffffff",
  color: "#1f2937", // gray-800
}

/**
 * ALERTA DE ÉXITO
 * Muestra un mensaje de éxito con icono verde
 */
export function mostrarExito(mensaje: string) {
  return Swal.fire({
    title: "¡Éxito!",
    text: mensaje,
    icon: "success",
    ...baseConfig,
    timer: 2000,
    showConfirmButton: false,
  })
}

/**
 * ALERTA DE ERROR
 * Muestra un mensaje de error con icono rojo
 */
export function mostrarError(mensaje: string) {
  return Swal.fire({
    title: "Error",
    text: mensaje,
    icon: "error",
    ...baseConfig,
    confirmButtonText: "Entendido",
  })
}

/**
 * CONFIRMACIÓN
 * Muestra un diálogo de confirmación con botones Sí/No
 * Retorna true si el usuario confirma, false si cancela
 */
export async function confirmar(mensaje: string): Promise<boolean> {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: mensaje,
    icon: "warning",
    ...baseConfig,
    showCancelButton: true,
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  })

  return result.isConfirmed
}

/**
 * ALERTA DE INFORMACIÓN
 * Muestra un mensaje informativo
 */
export function mostrarInfo(mensaje: string) {
  return Swal.fire({
    title: "Información",
    text: mensaje,
    icon: "info",
    ...baseConfig,
    confirmButtonText: "Entendido",
  })
}
