# UATF Forms - Project Overview

UATF Forms is a dynamic form builder and management system built with **TanStack Start**, **React 19**, and **Firebase**. It allows administrators to create custom form templates, manage reference data (faculties, programs, modalities), and collect/analyze responses across different university modules.

## Architecture & Frameworks

- **Frontend Framework:** [TanStack Start](https://tanstack.com/start) (Full-stack React with TanStack Router).
- **State Management:** [TanStack Query](https://tanstack.com/query) for server state and data fetching.
- **Form Management:** [TanStack Form](https://tanstack.com/form) and a custom dynamic form builder.
- **Database & Auth:** [Firebase Firestore](https://firebase.google.com/docs/firestore) and [Firebase Authentication](https://firebase.google.com/docs/auth).
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/) components.
- **Linting & Formatting:** [Biome](https://biomejs.dev/).
- **Testing:** [Vitest](https://vitest.dev/).
- **Icons:** [Hugeicons](https://hugeicons.com/) and [Lucide React](https://lucide.dev/).

## Directory Structure

Following the `docs/feature-architecture.md` guidelines:

- `src/app/`: Global shell, layout (Sidebar, ThemeToggle), and application-wide providers (Query, Auth).
- `src/features/`: Domain-specific logic, grouped by feature:
  - `auth/`: Login, authentication hooks, and `AuthProvider`.
  - `dashboard/`: Dashboard screens, including the Form Builder, Admin Panel, and CRUDs for reference data.
  - `dynamic-form/`: The engine for rendering and building forms, including utilities and specialized components.
  - `reference-data/`: Hooks for university-specific data (Faculties, Programs, etc.).
  - `reports/`: Logic and screens for visualizing form responses.
- `src/routes/`: File-based routing using TanStack Router. These files primarily import and render components from `src/features`.
- `src/shared/`: Reusable UI components (Shadcn), generic hooks, shared types, and infra utilities (Firebase, Utils).

## Building and Running

### Development

```bash
pnpm install
pnpm dev
```

Runs the development server on `http://localhost:3000`.

### Building for Production

```bash
pnpm build
```

Builds both the client application and the Express server entry point.

### Testing

```bash
pnpm test
```

### Linting & Formatting

```bash
pnpm lint
pnpm format
pnpm check
```

### Database Seeding

```bash
pnpm seed
```

## Development Conventions

- **Feature-Driven Development:** Logic belongs to a feature module in `src/features` first. Only move to `src/shared` if used by multiple features.
- **File-Based Routing:** Define routes in `src/routes/` but keep business logic out of them.
- **Type Safety:** Use Zod for schema validation and TypeScript for all components and utilities.
- **Firebase:** Access Firestore and Auth through `src/shared/lib/firebase.ts`.
- **UI Components:** Use and extend the components in `src/shared/ui/` (Shadcn-based).

## Key Technology Notes

- **TanStack Start:** This project leverages SSR and server functions.
- **Firebase Firestore:** Real-time listeners (`onSnapshot`) are used in several hooks (e.g., `useFormTemplates`) to keep the UI in sync with the database.
- **Dynamic Forms:** Forms are defined by `FormTemplateDef` and rendered using the `DynamicForm` component.
