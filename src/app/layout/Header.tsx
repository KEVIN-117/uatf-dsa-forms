import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { Button } from '#/shared/ui/button'
import { useLogout } from '#/features/auth/hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '#/features/auth/providers/AuthProvider'
import { Logout01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useDirectorProfile } from '#/features/director-profile/providers/DirectorProfileProvider'

export default function Header() {
  const logoutMutation = useLogout();
  const { isAuthenticated, isLoading } = useAuth();
  const { clearProfile, profile } = useDirectorProfile();
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
          {isAuthenticated && !isLoading && <Button className='bg-red-600 hover:bg-red-700 text-white'
            onClick={async () => {
              await logoutMutation.mutateAsync();
              navigate({ to: '/' });
            }}
            disabled={logoutMutation.isPending}
            variant="default"
            size="sm"
          >
            <HugeiconsIcon icon={Logout01Icon} className="size-4" />
            {logoutMutation.isPending ? 'Cerrando...' : 'Cerrar Sesión'}
          </Button>}
          {profile && <Button className='bg-red-600 hover:bg-red-700 text-white'
            onClick={async () => {
              clearProfile();
              navigate({ to: '/' });
            }}
            variant="default"
            size="sm"
          >
            <HugeiconsIcon icon={Logout01Icon} className="size-4" />
            Cerrar Sesión
          </Button>}
        </div>
      </nav>
    </header>
  )
}

