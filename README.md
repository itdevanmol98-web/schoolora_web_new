# Schoolora ERP — React Frontend Foundation

Production-grade, modular frontend foundation for **Schoolora ERP**, engineered with React, TypeScript, Material UI (MUI), Vite, React Router, Redux Toolkit, and Axios.

---

## 1. Architectural Highlights

- **Strict Type Safety**: Full TypeScript strict mode compliance (`noUnusedLocals`, `noFallthroughCasesInSwitch`, zero `any` policy).
- **Design System & Theming**: Centralized design tokens (typography, color palettes, spacing, elevation shadows, shape tokens) supporting seamless Light & Dark mode switching.
- **Centralized API Client**: Axios client configured for standard request timeouts, JSON headers, token interceptors, and error normalization without mock response masking.
- **Predictable State Architecture**: Redux Toolkit store with typed hooks (`useAppDispatch`, `useAppSelector`) and modular feature slices.
- **Validated Routing & Shells**: Declarative React Router setup with distinct `RootLayout`, `AppLayout`, and `AuthLayout` boundaries.
- **Rigorous Automated Testing**: Vitest and React Testing Library setup for theme, routing, shared components, and error handling.

---

## 2. Technology Stack

| Layer | Technology | Version |
| :--- | :--- | :--- |
| **Runtime & Core** | React / React DOM | `^19.2.8` |
| **Language** | TypeScript | `~6.0.2` |
| **Bundler & Tooling** | Vite | `^8.3.0` |
| **Design System** | Material UI (MUI) + Emotion | `^9.5.0` / `^11.14.0` |
| **State Management** | Redux Toolkit & React Redux | `^2.13.0` / `^9.3.0` |
| **Routing** | React Router DOM | `^7.18.4` |
| **HTTP Client** | Axios | `^1.20.0` |
| **Forms & Validation** | React Hook Form & Zod | `^7.89.0` / `^4.6.5` |
| **Code Quality** | ESLint & Prettier | `^10.12.0` / `^3.9.9` |
| **Unit Testing** | Vitest & React Testing Library | `^5.0.3` / `^16.3.3` |

---

## 3. Directory Structure

```text
frontend/
├── src/
│   ├── api/                   # Centralized Axios client and error normalizer
│   │   ├── apiErrors.ts
│   │   └── axiosClient.ts
│   ├── app/                   # Root store, providers, and router config
│   │   ├── providers.tsx
│   │   ├── router.tsx
│   │   └── store.ts
│   ├── components/            # Reusable UI component library
│   │   └── common/
│   │       ├── Button/
│   │       ├── Card/
│   │       ├── EmptyState/
│   │       ├── ErrorState/
│   │       ├── Input/
│   │       └── Loading/
│   ├── config/                # Validated environment configuration (Zod)
│   │   └── env.ts
│   ├── features/              # Modular domain feature slices
│   │   └── auth/              # Auth state foundation & credentials slice
│   ├── hooks/                 # Typed hooks (useAppDispatch, useAppSelector, useThemeMode)
│   ├── layouts/               # Shell layouts (RootLayout, AppLayout, AuthLayout)
│   ├── pages/                 # Route page components (Landing, Dashboard, Login, 404)
│   ├── routes/                # Centralized route paths
│   ├── test/                  # Test setup, utilities, and test suites
│   ├── theme/                 # Centralized tokens, theme builder, ThemeProvider
│   ├── types/                 # Standardized TypeScript type definitions
│   ├── utils/                 # General helpers and formatters
│   ├── main.tsx               # Application bootstrap
│   └── index.css              # Global styles
├── .env                       # Local environment variables
├── .env.example               # Environment template
├── eslint.config.js           # ESLint configuration
├── .prettierrc                # Prettier configuration
├── tsconfig.app.json          # TypeScript application configuration
├── vite.config.ts             # Vite configuration with aliases and Vitest
└── package.json
```

---

## 4. Backend Configuration & Connection

The frontend is pre-configured to communicate with the existing Node.js/Express backend (`D:\ERP_Project\schoolora_backend`):

- **Backend Port**: `4000`
- **Backend API Prefix**: `/api/v1`
- **Frontend Variable**: `VITE_API_BASE_URL=http://localhost:4000/api/v1`

Configuration is loaded and validated at runtime via `src/config/env.ts`.

---

## 5. Development & Verification Commands

From the `frontend` directory:

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Run unit tests
npm run test

# Run ESLint validation
npm run lint

# Format code with Prettier
npm run format

# Production TypeScript check and build
npm run build
```
