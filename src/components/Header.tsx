import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { Button } from './ui/button'
import { useLogout } from '#/hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'
import { useProtectedRoute } from '#/hooks/useProtectedRoute'
import { Login01Icon, Logout01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export default function Header() {
  const logoutMutation = useLogout();
  const { isAuthenticated } = useProtectedRoute();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap justify-between items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm text-(--sea-ink) no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            UATF Forms
          </Link>
        </h2>

        <div className="ml-auto flex items-center gap-1.5 sm:ml-0 sm:gap-2">
          <ThemeToggle />
          {isAuthenticated && <Button
            onClick={async () => {
              await logoutMutation.mutateAsync();
              navigate({ to: '/' });
            }}
            disabled={logoutMutation.isPending}
            variant="outline"
            size="sm"
          >
            <HugeiconsIcon icon={Logout01Icon} className="size-4" />
            {logoutMutation.isPending ? 'Cerrando...' : 'Cerrar Sesión'}
          </Button>}
          {!isAuthenticated && <Button
            onClick={() => navigate({ to: '/auth/login' })}
            variant="outline"
            size="sm"
          >
            <HugeiconsIcon icon={Login01Icon} className="size-4" />
            Iniciar Sesión
          </Button>}
        </div>
      </nav>
    </header>
  )
}
