# UATF Forms

UATF Forms is a powerful, dynamic form builder and management system designed for university environments. Built with **TanStack Start**, **React 19**, and **Firebase**, it enables administrators to create custom form templates, manage university reference data, and collect responses across multiple academic modules.

## 🚀 Key Features

- **Dynamic Form Builder:** Create and customize form templates with various field types (text, email, select, etc.) and conditional logic.
- **University Module Management:** Specialized support for Student, Teacher, Graduate, and Scholarship modules.
- **Reference Data CRUDs:** Manage academic entities like Faculties, Programs, and Graduation Modalities.
- **Real-time Synchronization:** Leverages Firebase Firestore for instant updates and data persistence.
- **Modern UI/UX:** Built with Tailwind CSS 4, Shadcn UI, and Hugeicons for a polished, responsive experience.
- **File-Based Routing:** Powered by TanStack Router for a robust and type-safe navigation structure.

## 🛠️ Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start)
- **Frontend:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **State & Data:** [TanStack Query](https://tanstack.com/query), [TanStack Form](https://tanstack.com/form)
- **Backend/DB:** [Firebase Firestore](https://firebase.google.com/) & [Authentication](https://firebase.google.com/docs/auth)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Tooling:** [Biome](https://biomejs.dev/) (Linting/Formatting), [Vitest](https://vitest.dev/) (Testing)

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS)
- [pnpm](https://pnpm.io/)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Environment Variables

Create a `.env` file in the root directory and add your Firebase configuration:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📦 Deployment

The project is configured for deployment to **Firebase Hosting**.

```bash
pnpm deploy
```

## 🧪 Testing & Quality

```bash
# Run tests
pnpm test

# Lint & Format
pnpm check
pnpm format
```

## 📂 Project Structure

- `src/app`: Global shell, layout, and providers.
- `src/features`: Domain-driven logic (Auth, Dashboard, Form Builder, etc.).
- `src/routes`: File-based routes (TanStack Router).
- `src/shared`: Reusable components, hooks, and utilities.

For more detailed architectural information, see `docs/feature-architecture.md` and `GEMINI.md`.
