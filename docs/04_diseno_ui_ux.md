# JANA OS — Sistema de Diseño

## Versión

1.1

---

# Filosofía de Diseño

## Principio Principal

JANA OS no es un ERP.

JANA OS no es un LMS.

JANA OS es el "Backstage" digital donde vive el talento artístico.

La experiencia debe transmitir:

* Escenario
* Creatividad
* Producción
* Evolución
* Inteligencia

---

# Denominación de Dashboards (Backstage)

Los paneles de control o dashboards según el rol se denominan bajo el concepto de "Backstage" (Detrás del escenario):

* **Backstage Aula:** Gestión académica, clases, asistencias y evaluaciones.
* **Backstage Chat:** Comunicación en tiempo real entre alumnos, profesores y dirección.
* **Backstage Brain:** Búsqueda global, analítica e interacción con el motor cognitivo de IA.
* **Backstage Talent Graph:** Visualización interactiva y tabla accesible de evolución de habilidades.
* **Backstage Panel:** Administración general, configuración, finanzas e integraciones de la sede.

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

# Temas (Dark & Light)

El sistema soporta de forma nativa tanto el tema oscuro (Dark) como el tema claro (Light), con opción de alternar entre ambos mediante un control accesible en la interfaz.

* **Tema Dark (Principal):** Emula la atmósfera del teatro a oscuras antes de comenzar la función.
* **Tema Light (Claro):** Emula la iluminación total de los focos sobre el escenario.

---

# Accesibilidad

Objetivo obligatorio:

```text
WCAG 2.2 AA
```

Requisitos:

* Contraste mínimo de 4.5:1 en textos estándar y 3:1 en textos grandes o elementos de interfaz.
* Navegación completa por teclado.
* Compatibilidad total con lectores de pantalla (Screen Readers).
* Soporte para `prefers-reduced-motion`.
* Foco visible y de alto contraste obligatorio (`outline`).

---

# Tipografía

## Primaria

Outfit

Uso:

* Branding / Logotipos
* Títulos y encabezados
* Sidebar / Menú de navegación

---

## Secundaria

Inter

Uso:

* Tablas de datos
* Formularios
* Dashboards y KPIs
* Bloques de texto denso

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

El color primario del sistema es el naranja JANA (`#ec690c`), acompañado de variaciones tonales para estados e interacciones, blanco (`#ffffff`), negro (`#000000`), y los colores auxiliares necesarios para una accesibilidad y contraste perfectos.

## Variables CSS por Tema

### Tema Oscuro (Dark Theme)

```css
:root[class="dark"] {
  --background: #121417;
  --surface: #1A1E24;
  --surface-elevated: #232A33;
  --foreground: #F5F7FA;
  --foreground-muted: #9EADB0;
  
  --jana-primary: #ec690c;
  --jana-primary-hover: #f07e24;
  --jana-primary-active: #d15c0a;
  --jana-primary-accessible: #f28533; /* Contraste optimizado para fondo oscuro */

  --brain: #7C5CFF;
  --talent: #1FBF75;
  --production: #F5B74F;

  --success: #1FBF75;
  --warning: #F5B74F;
  --error: #E5484D;
  --info: #4C8DFF;
  
  --border: rgba(255, 255, 255, 0.08);
}
```

### Tema Claro (Light Theme)

```css
:root[class="light"] {
  --background: #F5F7FA;
  --surface: #FFFFFF;
  --surface-elevated: #EAEFF5;
  --foreground: #121417;
  --foreground-muted: #5C6A79;

  --jana-primary: #ec690c;
  --jana-primary-hover: #d15c0a;
  --jana-primary-active: #b54f08;
  --jana-primary-accessible: #ec690c; /* Contraste optimizado para fondo claro */

  --brain: #643DFF;
  --talent: #189e60;
  --production: #d9992b;

  --success: #189e60;
  --warning: #d9992b;
  --error: #c92a2a;
  --info: #1c7ed6;

  --border: rgba(0, 0, 0, 0.08);
}
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
/* Oscuro */
--shadow-card: 0 4px 12px rgba(0,0,0,0.3);
/* Claro */
--shadow-card: 0 4px 12px rgba(0,0,0,0.06);
```

---

# Glassmorphism

Uso restringido.

Permitido únicamente en:

* Paneles flotantes
* Modales
* Overlays de Backstage Talent Graph
* Paneles IA (Backstage Brain)

Configuración (en tema oscuro):

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

Nunca depender únicamente del color para transmitir estados (usar iconos explicativos).

---

# Sidebar (Navegación del Backstage)

Desktop:

* Persistente
* Colapsable

Mobile:

* Drawer / Bottom Sheet

Elemento activo:

* Barra lateral izquierda con el naranja JANA (`#ec690c`).

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

Producciones, espectáculos y eventos.

---

# Estados IA (Backstage Brain)

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

# Backstage Talent Graph

Animaciones de nodos permitidas:

* Reagrupación
* Clustering
* Expansión

Debe existir:

* Vista Grafo (Visual)
* Vista Tabla (Accesible)

---

# Dark Mode & Light Mode (Alternancia)

El sistema arranca en tema oscuro (`dark`) por defecto, pero respeta el estado del interruptor de tema (`Theme Toggle`) guardando la preferencia del usuario en almacenamiento local (`localStorage`) para futuras sesiones.

---

# Principio Final

Cada pantalla debe responder:

"¿Ayuda esto a desarrollar o comprender mejor el talento artístico?"

Si la respuesta es no, debe eliminarse.
