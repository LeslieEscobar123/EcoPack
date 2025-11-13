import { RegisterForm } from "@/components/auth/register-form"
import { Package } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">EcoPack+</h1>
          </div>
          <p className="text-muted-foreground text-center">Crea tu cuenta para gestionar empaques sostenibles</p>
        </div>
        <RegisterForm />
        <p className="text-center mt-4 text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
