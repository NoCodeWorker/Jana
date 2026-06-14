---
name: shadcn-init
description: "Initializes a project with shadcn/ui and installs components based on the framework template. Facilitates running 'npx shadcn@latest init -t [framework]' and adding components."
---

# shadcn-init Skill

Use this skill to initialize shadcn/ui in a frontend project (Next.js, Vite, etc.) and add components programmatically.

## Usage

### 1. Initialization (Init)

To initialize shadcn/ui in the current directory:

```bash
# Non-interactive initialization using defaults (Next.js by default)
npx shadcn@latest init -y

# Specify a framework template (e.g., next, vite)
npx shadcn@latest init -t next -y
npx shadcn@latest init -t vite -y
```

#### Templates Available:
- `next`: Next.js (App Router or Pages Router)
- `vite`: Vite (React)
- `start`: TanStack Start
- `react-router`: React Router
- `laravel`: Laravel
- `astro`: Astro

### 2. Adding Components (Add)

To add components to the project:

```bash
# Add a single component (e.g., button)
npx shadcn@latest add button -y

# Add multiple components
npx shadcn@latest add input drawer accordion -y
```

### 3. Verification & Troubleshooting

- **Tailwind CSS v4 compatibility:** Ensure `@import "tailwindcss";` is present in the CSS file.
- **Component paths:** By default, components are placed under `components/ui/` or `src/components/ui/` based on `components.json` settings.
