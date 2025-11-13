import { LoginForm } from "@/components/auth/login-form"
import { Package } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">EcoPack+</h1>
          </div>
          <p className="text-muted-foreground text-center">
            Gestión de empaques biodegradables con trazabilidad digital
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
