import { LoginForm } from "@/components/login-form"
import { OrdocLogo } from "@/components/ordoc-logo"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center">
          <OrdocLogo size={40} />
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Ordoc-AI
          </span>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
