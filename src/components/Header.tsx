import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

export default function Header() {
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
        </div>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            About
          </Link>
          <a
            href="https://tanstack.com/start/latest/docs/framework/react/overview"
            className="nav-link"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </a>
          <details className="relative w-full sm:w-auto">
            <summary className="nav-link list-none cursor-pointer">
              Demos
            </summary>
            <div className="mt-2 min-w-56 rounded-xl border border-(--line) bg-background p-2 shadow-lg sm:absolute sm:right-0">
              <a
                href="/demo/form/simple"
                className="block rounded-lg px-3 py-2 text-sm text-(--sea-ink-soft) no-underline transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
              >
                Simple Form
              </a>
              <a
                href="/demo/form/address"
                className="block rounded-lg px-3 py-2 text-sm text-(--sea-ink-soft) no-underline transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
              >
                Address Form
              </a>
              <a
                href="/demo/table"
                className="block rounded-lg px-3 py-2 text-sm text-(--sea-ink-soft) no-underline transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
              >
                TanStack Table
              </a>
              <a
                href="/demo/tanstack-query"
                className="block rounded-lg px-3 py-2 text-sm text-(--sea-ink-soft) no-underline transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
              >
                TanStack Query
              </a>
              <a
                href="/demo/storybook"
                className="block rounded-lg px-3 py-2 text-sm text-(--sea-ink-soft) no-underline transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
              >
                Storybook
              </a>
              <a
                href="/schedule"
                className="block rounded-lg px-3 py-2 text-sm text-(--sea-ink-soft) no-underline transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
              >
                Schedule
              </a>
              <a
                href="/speakers"
                className="block rounded-lg px-3 py-2 text-sm text-(--sea-ink-soft) no-underline transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
              >
                Speakers
              </a>
              <a
                href="/talks"
                className="block rounded-lg px-3 py-2 text-sm text-(--sea-ink-soft) no-underline transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
              >
                Sessions
              </a>
            </div>
          </details>
        </div>
      </nav>
    </header>
  )
}
