# Regla del Agente: Accesibilidad Avanzada WCAG 2.2 (AA)

Esta regla define el estándar obligatorio de accesibilidad web para **JANA OS**. Todo código HTML, React, CSS y TypeScript debe alinearse estrictamente con los criterios de éxito de la norma **WCAG 2.2 AA** (publicada en octubre de 2023) para garantizar un sistema de diseño sin barreras cognitivas, motoras o visuales.

---

## 1. Nuevos Criterios de WCAG 2.2 AA (Implementación Obligatoria)

### 1.1 Tamaño del Objetivo de Pulsación / Target Size (Mínimo) [Criterio 2.5.8 - AA]
*   **Regla:** Todos los elementos interactivos (botones, enlaces, selectores) deben tener un área mínima de **24x24 CSS píxeles**.
*   **Regla de Oro en JANA OS:** Para botones principales y navegación táctil en móviles, el área táctil mínima recomendada sigue siendo **44x44 CSS píxeles** (WCAG 2.1 / Apple HIG / Android). Si se usan tamaños más pequeños (entre 24px y 44px), debe haber suficiente espaciado visual (padding/margin) alrededor del elemento de modo que el centro del objetivo esté a un mínimo de 24px de cualquier otro elemento interactivo.
*   *Excepción:* Elementos en un párrafo de texto o controles equivalentes en la misma página.

### 1.2 Apariencia del Foco / Focus Appearance [Criterio 2.4.13 - AA]
*   **Regla:** El indicador de foco de teclado (al navegar con la tecla `TAB`) debe ser altamente visible y cumplir con:
    *   **Área mínima:** Debe rodear completamente el control o tener un grosor y longitud definidos.
    *   **Contraste mínimo:** Un ratio de contraste de al menos **3:1** entre el color del indicador de foco y los colores adyacentes del componente en estado no enfocado.
*   **Código Prohibido:** `outline: none` o `outline: 0` sin un reemplazo visual explícito.
*   **Implementación en Tailwind:**
    ```html
    <button class="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jana-primary-accessible">
      Acceder
    </button>
    ```

### 1.3 Foco No Obstruido / Focus Not Obscured (Mínimo/Mejorado) [Criterios 2.4.11 - A & 2.4.12 - AA]
*   **Regla:** Cuando un elemento recibe el foco de teclado, **no debe quedar oculto** por elementos creados por el autor (como headers pegajosos/sticky, banners de cookies o ventanas emergentes).
*   **Implementación:** Usar la propiedad CSS `scroll-margin-top` o `scroll-margin-bottom` en secciones navegables para evitar que el scroll automático las posicione detrás del header persistente.
    ```css
    section {
      scroll-margin-top: 5rem; /* Ajustado al tamaño del header sticky */
    }
    ```

### 1.4 Alternativa a Movimientos de Arrastre / Dragging Movements [Criterio 2.5.7 - AA]
*   **Regla:** Si una funcionalidad requiere arrastrar elementos (por ejemplo, reordenar la cola de reproducción de audios, mover tarjetas en un tablero Kanban de producciones, o cambiar el rango de un deslizador), se debe proveer una alternativa mediante pulsaciones de puntero simple (clic, tap) o teclado.
*   **Implementación:** Incluir botones de "Subir" / "Bajar" o un menú de opciones contextuales junto a la zona de arrastre.

### 1.5 Autenticación Accesible / Accessible Authentication (Mínimo) [Criterio 3.3.8 - A]
*   **Regla:** Los flujos de login no deben obligar al usuario a resolver pruebas cognitivas (por ejemplo, memorizar contraseñas complejas sin permitir copiar/pegar, resolver puzles matemáticos o transcribir códigos Captcha visuales).
*   **Soluciones Obligatorias:**
    *   Habilitar y dar soporte completo a administradores de contraseñas (uso correcto del atributo `autocomplete` en inputs).
    *   Habilitar flujos de WebAuthn / Passkeys.
    *   Permitir copiar y pegar contraseñas en los campos de login.

### 1.6 Entrada Redundante / Redundant Entry [Criterio 3.3.7 - A]
*   **Regla:** Evitar que el usuario tenga que introducir la misma información varias veces en un mismo flujo.
*   **Soluciones:**
    *   Auto-completar la información ya ingresada (ej. marcar un checkbox de "Usar misma dirección de facturación").
    *   Permitir seleccionar información ya guardada.

---

## 2. Pautas Generales y Semántica HTML

### 2.1 Alternativas Accesibles para Visualizaciones Complejas
*   **JANA Talent Graph (Tres.js / React Three Fiber):** Dado que los lectores de pantalla no pueden interpretar un lienzo 3D dinámico, se debe incluir un botón accesible que despliegue una **vista alternativa en formato de tabla de datos semántica (`<table>`)**.
*   Esta tabla debe listar de forma estructurada los nodos (alumnos, profesores, producciones, skills), sus niveles y las relaciones que los unen.

### 2.2 Regiones ARIA y Etiquetas Dinámicas
*   Todo formulario debe enlazar el input con su `<label>` mediante la propiedad `htmlFor` (en React) e `id`.
*   Uso de `aria-live="polite"` para actualizaciones dinámicas en tiempo real (por ejemplo, notificaciones del sistema de chat o confirmaciones de la IA).

### 2.3 Respeto a Preferencias del Usuario: Animaciones Reducidas
*   Es obligatorio desactivar o simplificar todas las animaciones y transiciones no esenciales si el usuario prefiere movimiento reducido en su sistema operativo.
*   **Implementación CSS (Tailwind):**
    ```css
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-delay: -1ms !important;
        animation-duration: 1ms !important;
        animation-iteration-count: 1 !important;
        background-attachment: initial !important;
        scroll-behavior: auto !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    }
    ```
