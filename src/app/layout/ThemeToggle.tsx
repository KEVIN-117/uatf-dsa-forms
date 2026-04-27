import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '#/shared/ui/button'

type ThemeMode = 'light' | 'dark' | 'auto'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }

  return 'auto'
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }

  document.documentElement.style.colorScheme = resolved
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  useEffect(() => {
    if (mode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function toggleMode() {
    // Si estaba en 'auto' o 'light', lo pasa a 'dark', de lo contrario a 'light'
    const nextMode: ThemeMode = mode === 'light' ? 'dark' : 'light'
    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
  }

  const label =
    mode === 'dark'
      ? 'Modo oscuro activado. Haz clic para cambiar al modo claro.'
      : `Modo ${mode} activado. Haz clic para cambiar de modo.`

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      // Reemplazamos los estilos custom por las clases semánticas del tema educativo
      className="relative rounded-full h-9 w-9 border-border bg-background text-foreground hover:bg-muted focus-academic transition-colors"
    >
      {/* Icono de Sol: Se oculta y gira cuando es dark */}
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${mode === 'dark' ? 'scale-0 -rotate-90' : 'scale-100 rotate-0'
          }`}
      />
      {/* Icono de Luna: Aparece y gira cuando es dark */}
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${mode === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
          }`}
      />
    </Button>
  )
}