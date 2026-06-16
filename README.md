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

Create a `.env` file in the root directory and add your Firebase configuration (see `.env.example` for reference):

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_AUTH_PARSE=@2026

# Docker specific (required for deployment)
DOCKERHUB_USERNAME=your_username
IMAGE_TAG=latest # or 'dev' for development
PORT=3000
```

### Database Seeding

To populate your Firestore database with reference data and initial users, follow these steps:

1. **Service Account:** Place your Firebase `serviceAccountKey.json` in the root directory.
2. **Admin Data:** Copy `src/lib/admins.sample.json` to `src/lib/admins.json` and fill it with your admin user data.
3. **Director Data:** Copy `src/lib/lista_directores_2026_con_emails.sample.json` to `src/lib/lista_directores_2026_con_emails.json` and fill it with real director data.
4. **Run Seeders:**

```bash
# Seed reference data (Faculties, Programs, etc.)
pnpm seed

# Seed Users (Admins and Directors)
pnpm seed:admins
```

## 🐳 Docker Deployment

The application is containerized and can be deployed using Docker Compose.

### Local Build

```bash
docker compose build
docker compose up -d
```

### Environment-based Deployment

You can control which environment to deploy using the `IMAGE_TAG` variable in your `.env` file:

- **Production:** Set `IMAGE_TAG=latest`
- **Development:** Set `IMAGE_TAG=dev`

## 🚀 CI/CD & Environments

The project uses GitHub Actions for automated building and publishing.

### Workflow

- **Push to `develop` branch:** Automatically builds and pushes a Docker image tagged `:dev` to Docker Hub, deploying to the **Development** environment.
- **Push to `main` branch:** Automatically builds and pushes a Docker image tagged `:latest` to Docker Hub, deploying to the **Production** environment.
- **Tags (`v*`):** Builds and pushes a Docker image with the specific version tag.

### Required GitHub Secrets

To enable the CI/CD pipeline, configure the following secrets in your repository settings:

- `DOCKERHUB_USERNAME`: Your Docker Hub username.
- `DOCKERHUB_TOKEN`: Your Docker Hub Personal Access Token.
- **Environment Secrets** (for both `development` and `production` environments):
  - `VITE_FIREBASE_*` (all Firebase config keys)
  - `VITE_AUTH_PARSE`

## 📦 Manual Deployment

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


  ### 1. Seeding Specific Director Accounts

  The 3 mock directors are created in Firebase Auth and Firestore with correct custom claims:

  •  director1@uatf.edu.bo  (CI/Password:  1111111@2026 ): 100% completed progress (Steps 1–14).
  •  director2@uatf.edu.bo  (CI/Password:  2222222@2026 ): 50% completed progress (Steps 1–7).
  •  director3@uatf.edu.bo  (CI/Password:  3333333@2026 ): 0% completed progress (no steps).