# Regla del Agente: Diseño de Experiencia de Usuario (UX)

Esta regla define los estándares de Experiencia de Usuario (UX) para **JANA OS**. Su objetivo es guiar la creación de interfaces intuitivas, emocionalmente conectadas con el mundo artístico y optimizadas para reducir la fricción operativa de alumnos, profesores y coordinadores.

---

## 1. Principios de Diseño Visual y Emocional

JANA OS no es un ERP administrativo tradicional ni un LMS corporativo frío; es el **escenario digital de los artistas**. El diseño debe reflejar esta identidad teatral, dramática e inspiradora.

### 1.1 Estética Teatral Oscura (JANA Creative Stage System)
*   **Contraste Elevado:** Utilizar el fondo ultra oscuro de la plataforma (`#121417`) para emular la oscuridad de la sala antes de que comience el espectáculo.
*   **Focos de Luz (Spotlights):** Utilizar los colores de acento (`var(--jana-primary)`, `var(--brain)`, `var(--talent)`) como si fueran focos de iluminación en el escenario. Deben destacar de forma dramática los elementos interactivos activos y los KPIs de talento.
*   **Efectos de Capa y Profundidad:** Utilizar bordes sutiles y efectos de vidrio esmerilado (glassmorphism) sobre las superficies (`#1A1E24` y `#232A33`) para simular la profundidad física de las capas de un escenario de teatro.

---

## 2. Pautas de Arquitectura de Información y Carga Cognitiva

### 2.1 Diseño Mobile-First Estricto
*   **Regla de Oro:** Todo componente visual debe ser utilizable y verse de forma óptima en pantallas de smartphones con un ancho mínimo de **360px** antes de plantear la adaptación a resoluciones de escritorio.
*   **Patrones Táctiles:** Reemplazar los menús desplegables (dropdowns) complejos por paneles inferiores deslizables (bottom sheets) nativos en dispositivos móviles. Los controles críticos deben estar al alcance del pulgar.

### 2.2 Divulgación Progresiva (Progressive Disclosure)
*   **Evitar la Parálisis por Análisis:** No abrumar al usuario con tablas de datos inmensas en el primer nivel de vista.
*   **Patrón:** Mostrar primero tarjetas de resumen con KPIs visuales y sencillos, y permitir al usuario "hacer doble clic" (drill-down) para revelar información detallada u opciones de configuración avanzada de forma secuencial.

---

## 3. Micro-interacciones y Feedback Visual (Motion UX)

Las animaciones en JANA OS deben aportar significado y facilitar la comprensión del estado del sistema, no ser elementos meramente decorativos.

### 3.1 Animaciones con Significado
*   **Estados de Carga de la IA:** Cuando JANA Brain esté procesando una solicitud o analizando habilidades, el estado de carga debe representarse con un pulso de luz suave o una onda de color morado (`var(--brain)`), emulando una "sinapsis" o un proceso mental dinámico.
*   **Evolución en el Talent Graph:** Las mejoras en las habilidades artísticas del alumno deben animarse con barras de progreso fluidas y micro-destellos de color verde (`var(--talent)`) para celebrar visualmente el logro y fomentar el enganche psicológico positivo.

### 3.2 Transiciones de Estado Robustas
*   **Skeleton Loaders:** En lugar de mostrar pantallas en blanco o "spinners" genéricos mientras se cargan los datos asíncronos del backend, se deben utilizar esqueletos con animaciones de parpadeo suave que calquen la estructura final del contenido para reducir la percepción del tiempo de espera.
*   **Comportamiento de los Botones:** Al hacer clic o tap en un botón, este debe contraerse levemente (escala de 98% a 95%) y mostrar inmediatamente un estado "loading" si la acción no es instantánea, evitando doble envío de datos.

---

## 4. Estabilidad Visual (WPO)
*   Prevenir el cambio inesperado de diseño (Cumulative Layout Shift o CLS) reservando dimensiones físicas para imágenes, mapas y gráficos interactivos antes de su renderizado final.
