# ADR-001 - Modularizacion incremental del Backstage

## Status

Accepted

## Context

`components/jana-stage.tsx` concentra la orquestacion de la app, vistas de dashboard, landing, login, chat, aula, contenido, Remotion y Talent Graph en un unico archivo de mas de 7.000 lineas. Esto aumenta el coste de mantenimiento, dificulta validar cambios visuales y eleva el riesgo de regresiones al iterar rapido la demo.

## Decision

La modularizacion se ejecutara de forma incremental por fronteras funcionales estables dentro de `components/backstage/`.

Primer corte aceptado:

- Extraer `AlumnoHomeView`.
- Extraer `BrandBlock` y `LoginForm`.
- Extraer utilidades compartidas del Talent Graph a `talent-graph-utils.ts`.

No se moveran vistas grandes sin separar primero sus utilidades compartidas y validar TypeScript/lint en cada corte.

## Alternatives considered

- Reescritura masiva de `jana-stage.tsx` en una sola operacion.
- Mantener el God File hasta terminar la demo.
- Mover todo el archivo a un unico modulo `backstage-shell.tsx`.

## Tradeoffs

La modularizacion incremental es mas lenta que una particion automatica completa, pero reduce el riesgo de romper una demo activa y permite revisar dependencias reales antes de extraer cada vista.

## Consequences

- `jana-stage.tsx` sigue siendo el controlador principal hasta que todas las vistas se hayan extraido.
- Cada nuevo corte debe compilar y pasar lint antes de continuar.
- Las utilidades compartidas deben vivir fuera de las vistas para evitar duplicacion entre direccion, profesorado y alumnado.
