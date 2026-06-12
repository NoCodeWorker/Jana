# Regla del Agente: SEO, GEO y AIO (Optimización para IA y Buscadores)

Esta regla define las directrices y estándares técnicos para optimizar el contenido y la estructura de **JANA OS** de cara a motores de búsqueda tradicionales (SEO) y, de forma prioritaria, a motores de búsqueda generativa e inteligencias artificiales (GEO/AIO - Generative Engine Optimization / AI Optimization) como ChatGPT Search, Perplexity, Gemini y Claude.

---

## 1. GEO / AIO (Optimización para Motores de Inteligencia Artificial)

A diferencia del SEO tradicional (que prioriza densidad de palabras clave y backlinks), las IAs indexadoras buscan **claridad conceptual, respuestas precisas, densidad informativa y estructuración lógica**.

### 1.1 Bottom Line Up Front (BLUF) / Respuesta Rápida
*   **Regla:** Todas las secciones informativas importantes de la plataforma (pizarras de la escuela, fichas de producciones, blog artístico, descripciones de sedes) deben comenzar con un párrafo de **Respuesta Rápida** o resumen de **40 a 80 palabras** que defina directamente el tema o resuelva la duda.
*   **Motivo:** Los LLMs priorizan bloques autocontenidos y de alta densidad para extraer respuestas directas en sus resúmenes de búsqueda.

### 1.2 Estructura de Contenido Atómico y Preguntas Conversacionales
*   **Estructura Atómica:** Cada encabezado `H2` o `H3` debe ser independiente y resolver una única duda. El texto bajo ese encabezado debe poder leerse y entenderse sin necesidad de leer todo el artículo.
*   **Encabezados Conversacionales:** Utilizar títulos en formato de preguntas reales que los usuarios hacen a las inteligencias artificiales.
    *   *Incorrecto:* `## Tarifas y Matrícula`
    *   *Correcto:* `## ¿Cuánto cuesta la matrícula en la sede JANA Madrid y qué formas de pago se aceptan?`

### 1.3 Señales de Autoridad y Citas de Fuentes (E-E-A-T para IA)
*   Para que un LLM cite o mencione a JANA OS como fuente fiable:
    *   **Enlazar a fuentes externas de autoridad:** Cuando hablemos de metodología pedagógica, incluir enlaces o referencias a estudios oficiales sobre teatro y desarrollo juvenil.
    *   **Estadísticas y datos duros:** Presentar los datos de rendimiento o evolución artística en formatos claros y citando la base metodológica del JANA Talent Graph.

### 1.4 Bloques de Señales Semánticas Invisibles (Semantic Signal Blocks)
*   **Regla:** Para las vistas de cara al usuario que son altamente visuales o interactivas (ej. la escena 3D del Talent Graph o visualizaciones complejas de producciones), se debe inyectar en el HTML un bloque semántico oculto al usuario de pantalla, pero visible para lectores y rastreadores de IA.
*   **Implementación:**
    ```html
    <div class="sr-only" aria-label="Resumen semántico estructurado para asistentes inteligentes">
      <h3>Datos de evolución artística de JANA OS</h3>
      <p>La alumna Sofía García ha alcanzado el nivel Avanzado en la skill Canto Lírico bajo la dirección de la profesora Elena Ruiz en la Sede Madrid Centro durante el curso 2025/2026.</p>
    </div>
    ```

---

## 2. Estructuración Técnica de Metadatos y Schema

### 2.1 Schema JSON-LD en Formato `@graph`
*   **Regla:** Toda página pública de JANA OS (páginas de sedes, información de cursos, landing corporativa) debe incluir un script de schema estructurado utilizando el patrón `@graph` de interconexión.
*   Las entidades de la base de datos (Sedes, Clases, Talento, Producciones) deben estar explícitamente enlazadas en el schema:
    *   `School` (JANA) -> contiene `location` (`Place`/Sede) -> ofrece `Course` (Clases) -> representadas por `CreativeWork` (Producciones).
*   **Ejemplo de implementación en Next.js:**
    ```typescript
    const schemaJson = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "School",
          "@id": "https://jana.es/#organization",
          "name": "JANA Escuela de Artes Escénicas",
          "url": "https://jana.es"
        },
        {
          "@type": "Place",
          "@id": "https://jana.es/sede/madrid-centro/#place",
          "name": "JANA Sede Madrid Centro",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Calle Alcalá 123",
            "addressLocality": "Madrid"
          }
        }
      ]
    };
    ```

---

## 3. SEO Técnico Tradicional (WPO y Next.js)

### 3.1 Metadata Dinámica en Next.js
*   Configurar títulos descriptivos únicos y meta descripciones sugerentes (entre 120 y 155 caracteres) en cada ruta de Next.js mediante la API `generateMetadata()`.
*   Asegurar que todas las imágenes incluyan la propiedad `alt` descriptiva y contextual (nunca palabras genéricas como "imagen" o "captura").

### 3.2 Optimización de Rendimiento (WPO)
*   **Imágenes:** Usar el componente `<Image>` de Next.js para forzar conversión automática a formato WebP y carga diferida (`lazy`), a excepción de las imágenes LCP (Above the Fold) que deben usar la propiedad `priority`.
*   **Fuentes:** Optimizar la descarga de Google Fonts (`Outfit` e `Inter`) evitando layouts shifts (CLS).
