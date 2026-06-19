# Convenciones del proyecto — Spybee Technical Test

> Este documento recoge las convenciones, estándares y reglas que siguen los agentes/LLMs al trabajar en este proyecto. Es la fuente de verdad para mantener consistencia en nombres, estructura de carpetas, estilo y patrones de código.

---

## 1. Stack y herramientas

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 6
- **Gestor de paquetes:** pnpm
- **Lint / Format:** Biome 2.4
- **Estilos:** SCSS Modules + CSS layers (`@layer`)
- **Base de datos:** PostgreSQL + Drizzle ORM + `drizzle-kit`
- **Auth:** Supabase SSR (`@supabase/ssr`)
  - *Nota:* `better-auth` está instalado pero **no se usa**. No añadas código relacionado con Better Auth; se eliminará más adelante.
- **Estado cliente:** Zustand
- **Estado servidor:** TanStack Query (React Query)
- **Formularios:** React Hook Form + Zod
- **UI base:** `@base-ui/react` (primitivas headless)
- **Iconos:** `lucide-react`
- **Alias de importación:** `~/*` → `./src/*`

---

## 2. Arquitectura de carpetas

```
src/
├── app/              # Rutas de Next.js App Router
│   ├── (auth)/       # Grupo de rutas: autenticación
│   ├── (dashboard)/  # Grupo de rutas: aplicación protegida
│   │   ├── _components/   # Componentes locales del grupo
│   │   ├── incidentes/
│   │   ├── mapa/
│   │   └── layout.tsx
│   ├── layout.tsx
│   └── favicon.ico
├── contexts/         # Bounded contexts: entidades y lógica de dominio
│   └── building/
│       └── incidents/
│           └── domain/
│               └── incident.ts
├── core/             # Infraestructura compartida
│   ├── auth/         # Clientes de Supabase (browser/server) + helpers
│   ├── data-access/  # Verificación de sesión/guest
│   ├── db/           # Cliente, schema, tipos y migraciones de Drizzle
│   ├── env.ts        # Variables de entorno validadas con @t3-oss/env-nextjs
│   ├── lib/          # Utilidades transversales (ej. cn.ts)
│   ├── query/        # Cliente y provider de TanStack Query
│   └── ui/           # Sistema de diseño: componentes primitivos
├── features/         # Módulos por feature (UI y lógica de aplicación)
│   ├── incidents/   # actions, queries, mutations, mapper, storage...
│   ├── incident-creation/
│   ├── incident-detail/
│   ├── map/
│   └── toolbar/
├── proxy.ts          # Middleware (renombrado desde middleware.ts)
└── styles/
    └── globals.scss  # Estilos globales, capas y temas
```

### Principios de ubicación

- **App Router:** solo pages, layouts, route handlers y componentes locales (`_components/`).
- **Contexts:** bounded contexts con la lógica de dominio. Cada contexto agrupa sus entidades, value objects, commands y factories en `contexts/<context>/<entity>/domain/`.
- **Core:** todo lo compartido entre features y contexts (UI primitiva, DB, auth, env, lib, query client).
- **Features:** cada feature agrupa sus componentes, hooks, stores, actions, schemas, types y queries. Consume entidades de dominio desde `contexts/`.
- **Colocation:** los estilos SCSS viven junto al componente (`[name].module.scss`).

---

## 3. Convenciones de nombres

### Directorios y archivos

| Tipo | Convención | Ejemplo |
|---|---|---|
| Directorios | `kebab-case` | `incident-creation/`, `core/ui/button/` |
| Páginas/layouts Next.js | archivos reservados | `page.tsx`, `layout.tsx`, `route.ts` |
| Componentes locales en app | `kebab-case` | `sidebar.tsx`, `magic-link-form.tsx` |
| Componentes de feature | `kebab-case` | `create-incident-form.tsx` |
| Hooks | prefijo `use-` + `kebab-case` | `use-mapbox.ts`, `use-create-incident-form.ts` |
| Stores Zustand | `use-[name]-store.ts` | `use-building-selection-store.ts` |
| Lógica de dominio | `kebab-case` | `actions.ts`, `schemas.ts`, `types.ts`, `mapper.ts`, `storage.ts` |
| Utilidades | `kebab-case` | `cn.ts`, `verify-session.ts` |
| Componentes core UI | carpeta `kebab-case` + `index.ts` | `core/ui/button/`, `core/ui/dialog/` |
| Estilos | `[name].module.scss` | `page.module.scss`, `dialog.module.scss` |

### Identificadores

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componentes React | `PascalCase` | `Sidebar`, `CreateIncidentForm`, `Button` |
| Hooks | `camelCase` con prefijo `use` | `useMapbox`, `useCreateIncidentForm` |
| Stores | `camelCase` con prefijo `use` y sufijo `Store` | `useBuildingSelectionStore` |
| Tipos e interfaces | `PascalCase` | `Incident`, `CreateIncidentFormValues` |
| Props de componente | `PascalCase` + `Props` | `ButtonProps`, `DialogPopupProps` |
| Server Actions | `camelCase` + sufijo `Action` | `createIncidentAction`, `getIncidentsAction` |
| Funciones utilitarias | `camelCase` descriptivo | `mapIncidentToDomain`, `verifySession` |
| Variables | `camelCase` | `selectedBuilding`, `uploadedFiles` |
| Constantes / valores mágicos | `UPPER_SNAKE_CASE` | `INCIDENTS_TAG`, `BUCKET_NAME` |
| Schemas de entidad de dominio | `PascalCase` + `Schema` | `IncidentSchema`, `CoordinatesSchema` |
| Schemas de comando de dominio | `PascalCase` + `Schema` | `CreateIncidentSchema`, `UpdateIncidentSchema` |
| Comandos de dominio | `PascalCase` + `Command` | `CreateIncidentCommand`, `UpdateIncidentCommand` |
| Factories de dominio | `camelCase` descriptivo | `createIncident`, `updateIncident` |
| Tablas en DB | `snake_case` en PostgreSQL | `incidents`, `incident_files` |
| Columnas en DB | `snake_case` en PostgreSQL | `building_id`, `due_date` |
| Variables de tabla Drizzle | `camelCase` | `incidents`, `incidentFiles` |
| Relaciones Drizzle | `camelCase` | `incidentsRelations` |

### Compound components

Los componentes complejos del design system se exponen como namespace:

```tsx
<Card.Root>
  <Card.Header>
    <Card.Title>Título</Card.Title>
  </Card.Header>
  <Card.Panel>Contenido</Card.Panel>
  <Card.Footer>Acciones</Card.Footer>
</Card.Root>
```

- Las partes internas se nombran `DialogRoot`, `DialogPopup`, etc.
- Se re-exportan vía `index.parts.ts` como `Root`, `Popup`, etc.
- El `index.ts` expone `export * as Dialog from './index.parts'`.

---

## 3.5 Entidades de dominio

Las entidades de dominio viven en `contexts/<context>/<entity>/domain/<entity>.ts`. El archivo es monolítico y sigue el orden del fragmento de referencia:

1. **Constants & enums:** valores posibles de la entidad.
2. **Validation schemas:** schemas de Zod para la entidad, value objects y tipos primitivos del dominio.
3. **Type definitions:** tipos inferidos de los schemas.
4. **DTOs / commands:** schemas y tipos para operaciones de creación y actualización.
5. **Factories:** funciones puras que materializan la entidad a partir de un command.

### Ejemplo de estructura

```ts
export const INCIDENT_STATUS = {
  Open: 'open',
  InProgress: 'in_progress',
} as const;

export const IncidentStatusSchema = z.enum(INCIDENT_STATUS);
export const CoordinatesSchema = z.tuple([z.number(), z.number()]);

export const IncidentSchema = z.object({
  id: UuidV7Schema,
  status: IncidentStatusSchema,
  coordinates: CoordinatesSchema,
  // ...
});

export type Incident = z.infer<typeof IncidentSchema>;

export const CreateIncidentSchema = IncidentSchema.omit({
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateIncidentCommand = z.infer<typeof CreateIncidentSchema>;

export function createIncident(command: CreateIncidentCommand): Incident {
  const now = new Date();
  return IncidentSchema.parse({
    ...command,
    status: INCIDENT_STATUS.Open,
    createdAt: now,
    updatedAt: now,
  });
}
```

### Reglas

- Los tipos se derivan **siempre** de Zod (`z.infer<typeof ...Schema>`).
- Los **commands** representan la entrada para mutar una entidad; el formulario debe usarlos como schema de validación.
- Las **factories** son funciones puras: reciben un command validado y retornan la entidad completa.
- Los IDs generados por el cliente (por ejemplo UUID v7) se validan en el schema de dominio, nunca se generan en Server Actions.
- No incluyas lógica de infraestructura (DB, storage, eventos) en la capa de dominio.

---

## 4. Estilo y formato

Biome es la fuente de verdad. No discutas su configuración; solo respétala.

- **Indentación:** tabs
- **Ancho de línea:** 90 caracteres
- **Comillas:** simples en JS/TS/JSX/CSS
- **Trailing commas:** siempre
- **Import type:** usa `import type { ... }` para importaciones de tipo
- **Organización de imports:** deja que Biome la gestione (`source.organizeImports.biome`)

### Scripts útiles

```bash
pnpm lint      # biome check
pnpm format    # biome format --write
pnpm doctor    # npx react-doctor@latest
```

---

## 5. Imports y exports

### Alias

Usa `~/` para **todas** las importaciones cross-module. Usa importaciones relativas (`./`, `../`) solo dentro de la misma carpeta o feature cercana.

```tsx
// Bien
import { Button } from '~/core/ui/button';
import { useBuildingSelectionStore } from '~/features/map/stores/use-building-selection-store';

// Mal
import { Button } from '../../../core/ui/button';
```

### Orden de imports

Biome organiza los imports en este orden. No lo fuerces manualmente:

1. `:NODE:` — módulos nativos de Node
2. `:PACKAGE:` — dependencias de terceros
3. `:ALIAS:` — alias del proyecto (`~/`)
4. `:PATH:` — importaciones relativas
5. `{ type: true }` — importaciones solo de tipo (al final)

Ejemplo:

```tsx
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { Button } from '~/core/ui/button';
import { useBuildingSelectionStore } from '~/features/map/stores/use-building-selection-store';

import styles from './toolbar.module.scss';
import { useCreateIncidentForm } from '../hooks/use-create-incident-form';
```

### Exports

- **Preferir named exports** para componentes, hooks, utilidades y tipos.
- **Default exports** solo donde Next.js lo exija: `page.tsx`, `layout.tsx`, `route.ts`.
- Los componentes del design system usan barrel files (`index.ts`, `index.parts.ts`).

---

## 6. Componentes

### Ubicación

- **UI primitivos:** `core/ui/<component>/`
- **Componentes de feature:** `features/<feature>/components/`
- **Componentes locales de ruta:** `app/<route>/_components/`

### Directivas

- `'use client'` solo en componentes que necesitan estado, efectos o eventos del cliente.
- Las páginas y layouts del App Router son Server Components por defecto.

### Estilos

- Usa SCSS Modules: `import styles from './[name].module.scss'`.
- Usa `data-slot` como hook de estilo/test cuando sea necesario.
- En componentes base de `core/ui` que expongan una `className` para ser sobrescritos, envuelve el selector base en `:where(...)` para mantener la especificidad baja y evitar que el orden de inyección de chunks CSS en navegaciones cliente determine el estilo final.
- No uses CSS-in-JS ni styled-components.

### Props

- Tipa las props con `interface` y nómbrala `Props` en caso de que se tenga que hacer referencia a ella entonces se debe tener un mejor nombre basado en el contexto del componente junto con el sufijo `Props`.
- Usa `PropsWithChildren` de React cuando aplique.

```tsx
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', children, ...props }: Props) { ... }
```

### Tipos
- Evita usar la referencia global `React`, en su lugar importa los tipos necesarios desde 'react' y úsalos directamente.
- 
```tsx
import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}
```

---

## 7. Server Actions

- Ubicación: `features/<feature>/actions.ts`
- Directiva obligatoria: `'use server'` al inicio del archivo.
- **Siempre verifica la sesión al inicio** con `verifySession()` (o `verifyGuestSession()` si aplica).
- Valida los inputs con Zod antes de mutar.
- Nombra las funciones con sufijo `Action`.

```ts
'use server';

import { verifySession } from '~/core/data-access/verify-session';

export async function createIncidentAction(...) {
  const { user } = await verifySession();
  // validar, mutar
}
```

### Invalidación de caché

- Si la feature usa **TanStack Query** para el estado del cliente (caso actual del proyecto), invalida las queries con `queryClient.invalidateQueries` desde el hook de mutación. No uses `updateTag`, `revalidateTag` ni `revalidatePath` si no hay datos cacheados explícitamente por Next.js.
- Usa `updateTag` solo en Server Actions y solo cuando existan datos cacheados con `cacheTag` (directiva `'use cache'`). Asegúrate de que hay una entrada de caché real asociada al tag; de lo contrario es código muerto.
- Usa `revalidateTag(tag, 'max')` cuando quieras stale-while-revalidate desde Server Actions o Route Handlers.
- Usa `revalidatePath(path)` cuando necesites invalidar una ruta específica cacheada por Next.js.
- No dejes llamadas a `updateTag` "por si acaso". Si no hay `fetch` con `next.tags`, `unstable_cache` con `tags` o `'use cache'` + `cacheTag`, la llamada no tiene efecto.

---

## 8. Hooks y stores

### Hooks personalizados

- Ubicación: `features/<feature>/hooks/` o `features/<feature>/queries/hooks.ts`
- Nombre: `use[Nombre]` en camelCase.
- Los hooks de TanStack Query usan el patrón `use[Nombre]` (query) o `use[Nombre]Mutation` (mutación).

### TanStack Query

- Define las query keys centralizadas en `features/<feature>/queries/keys.ts`.

```ts
export const incidentKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentKeys.all, 'list'] as const,
  detail: (id: string) => [...incidentKeys.all, 'detail', id] as const,
};
```

### Stores Zustand

- Ubicación: `features/<feature>/stores/use-[name]-store.ts`
- Separa `State` y `Actions` en interfaces y combínalas al crear el store.

```ts
interface State {
  selectedBuilding: SelectedBuilding | null;
}

interface Actions {
  selectBuilding: (building: SelectedBuilding) => void;
  clearSelection: () => void;
}

export const useBuildingSelectionStore = create<State & Actions>((set) => ({
  selectedBuilding: null,
  selectBuilding: (building) => set({ selectedBuilding: building }),
  clearSelection: () => set({ selectedBuilding: null }),
}));
```

---

## 9. Base de datos (Drizzle ORM)

### Schema

- Ubicación: `src/core/db/schema.ts`
- Usa `pgTable` para definir tablas.
- Las columnas se nombran en `camelCase` en TypeScript; Drizzle las mapea a `snake_case` en PostgreSQL.
- Define índices explícitos con nombres descriptivos.

```ts
export const incidents = pgTable(
  'incidents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    buildingId: bigint('building_id', { mode: 'number' }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    // ...
  },
  (table) => [
    index('incidents_building_id_idx').on(table.buildingId),
  ],
);
```

### Tipos

- Ubicación: `src/core/db/types.ts`
- Deriva los tipos del schema:

```ts
export type Incident = typeof incidents.$inferSelect;
export type NewIncident = typeof incidents.$inferInsert;
```

### Migraciones

- Salida configurada en `drizzle.config.ts`: `./src/core/db/migrations`
- Ignorado por Biome: `"!src/core/db/migrations"`.

---

## 10. Autenticación (Supabase SSR)

- **Solo se usa Supabase SSR.** No añadas ni uses `better-auth`.
- Cliente de navegador: `core/auth/browser/client.ts`
- Cliente de servidor: `core/auth/server/client.ts`
- Actualización de sesión: `core/auth/server/update-session.ts`
- Verificación de sesión: `core/data-access/verify-session.ts` y `verify-guest-session.ts`
- El middleware de entrada es `src/proxy.ts` (no `middleware.ts`).

---

## 11. Variables de entorno

- Usa `src/core/env.ts` con `@t3-oss/env-nextjs` y Zod.
- No accedas directamente a `process.env` desde el código de aplicación.
- Las variables públicas empiezan con `NEXT_PUBLIC_`.

```ts
import { env } from '~/core/env';

const apiUrl = env.NEXT_PUBLIC_BASE_URL;
```

---

## 12. Formularios

- Usa React Hook Form + Zod.
- Define los schemas en `features/<feature>/schemas.ts`.
- Deriva los tipos de formulario desde Zod.

```ts
export const createIncidentSchema = z.object({ ... });
export type CreateIncidentFormValues = z.infer<typeof createIncidentSchema>;
```

---

## 13. Recomendaciones generales

- Mantén las páginas del App Router delgadas: verificación de sesión + composición de features.
- No crees efectos para derivar estado que pueda calcularse durante el render.
- Prefere Suspense y composición de componentes async para evitar waterfalls en servidor.
- No uses estado mutable a nivel de módulo para datos de request.
- Ejecuta `pnpm lint` y `pnpm doctor` antes de considerar una tarea terminada.
- No añadas dependencias sin consultar previamente.
- No escribas tests a menos que el usuario lo solicite explícitamente (actualmente no hay suite de tests).

---

## 14. Qué NO hacer

- No uses `better-auth` para nada.
- No crees archivos de test `.test.ts` / `.spec.ts` sin autorización.
- No uses CSS-in-JS.
- No uses default exports fuera de pages/layouts/route handlers.
- No uses importaciones relativas profundas (`../../../`) para código cross-module.
- No modifiques `biome.json`, `tsconfig.json`, `next.config.ts` ni `drizzle.config.ts` sin consultar.
