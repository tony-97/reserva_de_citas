# Reglas de Proyecto: Hospital App

Este archivo define las directrices y reglas específicas para el desarrollo de la aplicación del Hospital. Cualquier agente OpenCode que trabaje en este directorio se adherirá a estas reglas de forma automática.

## Estilo de Código y Stack
- **Frontend:** React 19, TypeScript, Vite, TailwindCSS (v4).
- **Backend:** Node.js, Express, TypeScript, Prisma (PostgreSQL).
- **Gestión de Estado:** `@tanstack/react-query` para datos del servidor. Evitar el uso de `useEffect` para fetch.
- **Formularios:** `react-hook-form` + `zod` obligatorios para cualquier ingreso de datos.
- **Tipado:** Tipado estricto en TS. Prohibido el uso de `any`. Emplear tipos inferidos de Prisma (`Prisma.ModelCreateInput`, etc.).

## DX y Formato
- **Linter/Formatter:** Biome (`@biomejs/biome`) reemplaza a ESLint/Prettier.
- **Imports:** Uso de Path Aliases obligatorios en Frontend (`@/` mapea a `src/`). Evitar rutas relativas largas como `../../`.

## Seguridad y Backend
- **Logs:** Pino y Pino-HTTP requeridos. No usar `console.log` ni `console.error` en producción.
- **Auth:** JWT con sistema de Refresh Tokens. Endpoints protegidos con Middlewares correspondientes.
- **BBDD:** La base de datos es PostgreSQL. Al modificar esquemas, siempre generar migraciones (`npx prisma migrate dev`). No incluir credenciales en el repositorio.
