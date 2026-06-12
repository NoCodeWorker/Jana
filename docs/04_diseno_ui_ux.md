# JANA OS — Sistema de Diseño

## Versión

1.0

---

# Filosofía de Diseño

## Principio Principal

JANA OS no es un ERP.

JANA OS no es un LMS.

JANA OS es el ecosistema digital donde vive el talento artístico.

La experiencia debe transmitir:

* Escenario
* Creatividad
* Producción
* Evolución
* Inteligencia

---

# Mobile First

Todo componente se diseña primero para móvil.

Breakpoints:

```text
Mobile: 0px+
Tablet: 768px+
Desktop: 1280px+
Wide: 1536px+
```

---

# Accesibilidad

Objetivo obligatorio:

```text
WCAG 2.2 AA
```

Requisitos:

* Contraste mínimo 4.5:1
* Navegación completa por teclado
* Compatibilidad Screen Readers
* prefers-reduced-motion
* Focus visible obligatorio

---

# Tipografía

## Primaria

Outfit

Uso:

* Branding
* Títulos
* Sidebar
* Navegación

---

## Secundaria

Inter

Uso:

* Tablas
* Formularios
* Dashboards
* Contenido denso

---

# Escala Tipográfica

| Elemento | Tamaño |
| -------- | ------ |
| H1       | 36px   |
| H2       | 30px   |
| H3       | 24px   |
| H4       | 20px   |
| Body     | 16px   |
| Small    | 14px   |

---

# Sistema de Color

## Background

```css
#121417
```

---

## Surface

```css
#1A1E24
```

---

## Elevated Surface

```css
#232A33
```

---

## JANA Primary

```css
#D56A1C
```

---

## JANA Primary Accessible

```css
#E67A2A
```

---

## Brain

```css
#7C5CFF
```

---

## Talent

```css
#1FBF75
```

---

## Production

```css
#F5B74F
```

---

## Success

```css
#1FBF75
```

---

## Warning

```css
#F5B74F
```

---

## Error

```css
#E5484D
```

---

## Info

```css
#4C8DFF
```

---

# Bordes

## Radio estándar

```css
12px
```

---

## Inputs

```css
10px
```

---

## Cards destacadas

```css
16px
```

---

# Sombras

Muy sutiles.

Evitar aspecto corporativo pesado.

```css
0 4px 12px rgba(0,0,0,0.15)
```

---

# Glassmorphism

Uso restringido.

Permitido únicamente en:

* Paneles flotantes
* Modales
* Talent Graph overlays
* Paneles IA

Configuración:

```css
background: rgba(255,255,255,0.04);
backdrop-filter: blur(16px);
border: 1px solid rgba(255,255,255,0.08);
```

---

# Botones

Altura mínima:

```css
44px
```

Anchura mínima táctil:

```css
44px
```

Estados:

* Default
* Hover
* Focus
* Active
* Disabled
* Loading

---

# Inputs

Siempre incluir:

* Label visible
* Mensaje de ayuda
* Estado error
* Estado éxito

Nunca depender únicamente del color.

---

# Sidebar

Desktop:

* Persistente
* Colapsable

Mobile:

* Drawer

Elemento activo:

* Barra lateral naranja JANA

---

# Cards

Tipos:

## Standard Card

Contenido general.

---

## Insight Card

Información generada por IA.

---

## Talent Card

Alumnos y profesorado.

---

## Production Card

Producciones y eventos.

---

# Estados IA

## Thinking

Animación suave.

Icono obligatorio.

```text
🧠 Analizando...
```

---

## Complete

```text
✓ Completado
```

---

## Review

```text
⚠ Revisión necesaria
```

---

# Motion Design

Framework:

```text
Framer Motion
```

---

# Principios

El movimiento comunica estado.

Nunca decoración.

---

# Duraciones

Micro:

```css
150ms
```

---

Normal:

```css
250ms
```

---

Compleja:

```css
400ms
```

---

# Talent Graph

Animaciones permitidas:

* Reagrupación
* Clustering
* Expansión

Debe existir:

* Vista Grafo
* Vista Tabla

---

# Dark Mode

Modo principal del sistema.

No se implementará Light Mode en MVP.

---

# Principio Final

Cada pantalla debe responder:

"¿Ayuda esto a desarrollar o comprender mejor el talento artístico?"

Si la respuesta es no, debe eliminarse.
