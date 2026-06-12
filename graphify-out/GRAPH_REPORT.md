# Graph Report - JANA  (2026-06-12)

## Corpus Check
- 16 files · ~7,595 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 150 nodes · 136 edges · 20 communities (16 shown, 4 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `201e266a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Estructura Operativa & Sedes|Estructura Operativa & Sedes]]
- [[_COMMUNITY_FastAPI Backend & Comunicación|FastAPI Backend & Comunicación]]
- [[_COMMUNITY_Configuración de Herramientas & Reglas del Agente|Configuración de Herramientas & Reglas del Agente]]
- [[_COMMUNITY_Orquestación & Agentes de Contenido|Orquestación & Agentes de Contenido]]
- [[_COMMUNITY_Grafo de Talento & Skills|Grafo de Talento & Skills]]
- [[_COMMUNITY_pgvector & Seguridad RAG|pgvector & Seguridad RAG]]
- [[_COMMUNITY_Landing Corporativa|Landing Corporativa]]
- [[_COMMUNITY_Next.js Frontend|Next.js Frontend]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]

## God Nodes (most connected - your core abstractions)
1. `1. Nuevos Criterios de WCAG 2.2 AA (Implementación Obligatoria)` - 7 edges
2. `JANA OS - Especificación del Sistema de Diseño (UI/UX)` - 6 edges
3. `Knowledge Service` - 6 edges
4. `1. GEO / AIO (Optimización para Motores de Inteligencia Artificial)` - 5 edges
5. `Regla del Agente: Diseño de Experiencia de Usuario (UX)` - 5 edges
6. `JANA OS - Especificación de Visión Arquitectónica` - 5 edges
7. `JANA OS - Especificación de Requisitos Funcionales y Procesos de IA` - 5 edges
8. `Tabla Sedes` - 5 edges
9. `Regla del Agente: Redacción Persuasiva y Accesible (Copywriting)` - 4 edges
10. `Regla del Agente: Optimización de la Tasa de Conversión Ética (CRO Ético)` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Codex PreToolUse Hook` --references--> `Graphify Codex Integration`  [INFERRED]
  .codex/hooks.json → AGENTS.md
- `Graphify Knowledge Graph Rule` --semantically_similar_to--> `Graphify Codex Integration`  [INFERRED] [semantically similar]
  .agents/rules/graphify.md → AGENTS.md
- `Tabla Embeddings pgvector` --implements--> `Knowledge Service`  [INFERRED]
  docs/02_modelos_de_datos.md → docs/01_vision_arquitectonica.md
- `app/globals.css (Tema Tailwind v4)` --implements--> `Especificación Sistema de Diseño`  [INFERRED]
  app/globals.css → docs/04_diseno_ui_ux.md
- `Tabla Sedes` --implements--> `Landings GEO por Sede`  [INFERRED]
  docs/02_modelos_de_datos.md → docs/01_vision_arquitectonica.md

## Import Cycles
- None detected.

## Communities (20 total, 4 thin omitted)

### Community 0 - "Estructura Operativa & Sedes"
Cohesion: 0.12
Nodes (18): app/globals.css (Tema Tailwind v4), Better Auth, Event Bus, FastAPI Backend Gateway, JANA Orchestrator, Knowledge Service, Next.js Frontend, pgvector (+10 more)

### Community 1 - "FastAPI Backend & Comunicación"
Cohesion: 0.36
Nodes (8): Landings GEO por Sede, Tabla Clases, Tabla Embeddings pgvector, Tabla Evaluaciones, Tabla Eventos Financieros, Tabla Sedes, Tabla Usuarios, Adaptador Verifactu

### Community 2 - "Configuración de Herramientas & Reglas del Agente"
Cohesion: 0.15
Nodes (12): 1.1 Tamaño del Objetivo de Pulsación / Target Size (Mínimo) [Criterio 2.5.8 - AA], 1.2 Apariencia del Foco / Focus Appearance [Criterio 2.4.13 - AA], 1.3 Foco No Obstruido / Focus Not Obscured (Mínimo/Mejorado) [Criterios 2.4.11 - A & 2.4.12 - AA], 1.4 Alternativa a Movimientos de Arrastre / Dragging Movements [Criterio 2.5.7 - AA], 1.5 Autenticación Accesible / Accessible Authentication (Mínimo) [Criterio 3.3.8 - A], 1.6 Entrada Redundante / Redundant Entry [Criterio 3.3.7 - A], 1. Nuevos Criterios de WCAG 2.2 AA (Implementación Obligatoria), 2.1 Alternativas Accesibles para Visualizaciones Complejas (+4 more)

### Community 3 - "Orquestación & Agentes de Contenido"
Cohesion: 0.50
Nodes (4): Graphify Codex Integration, Codex PreToolUse Hook, Graphify Knowledge Graph Rule, Graphify Update Rule

### Community 4 - "Grafo de Talento & Skills"
Cohesion: 0.17
Nodes (11): 1. Estructura de Capas del Sistema (Arquitectura Desacoplada), 2.1 Frontend, 2.2 Backend y Mensajería, 2.3 Capa de Datos y Almacenamiento, 2. Stack Tecnológico, 3.1 JANA Orchestrator, 3.2 JANA Brain y Agentes Especializados, 3.3 Knowledge Service (+3 more)

### Community 7 - "Next.js Frontend"
Cohesion: 0.17
Nodes (11): 1.1 Sedes y Usuarios, 1.2 Clases y Evaluaciones, 1.3 Finanzas y Verifactu, 1. Esquema Relacional (PostgreSQL), 2.1 Metadatos de las Relaciones, 2.2 Taxonomía de Skills, 2. Grafo Vivo (JANA TALENT GRAPH), 3.1 Estructura de la Tabla de Embeddings (+3 more)

### Community 8 - "Community 8"
Cohesion: 0.17
Nodes (11): 1. Principios Fundamentales, 2.1 Variables CSS del Tema (Tailwind CSS v4), 2. Paleta de Colores y Tokens CSS, 3. Tipografía y Escala, 4.1 Áreas Táctiles y Controles, 4.2 Lectores de Pantalla y Accesibilidad Web, 4.3 Motion Design (Movimiento con Significado), 4. Pautas de Accesibilidad e Interacción (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.17
Nodes (11): 1.1 Bottom Line Up Front (BLUF) / Respuesta Rápida, 1.2 Estructura de Contenido Atómico y Preguntas Conversacionales, 1.3 Señales de Autoridad y Citas de Fuentes (E-E-A-T para IA), 1.4 Bloques de Señales Semánticas Invisibles (Semantic Signal Blocks), 1. GEO / AIO (Optimización para Motores de Inteligencia Artificial), 2.1 Schema JSON-LD en Formato `@graph`, 2. Estructuración Técnica de Metadatos y Schema, 3.1 Metadata Dinámica en Next.js (+3 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (10): 1.1 Estética Teatral Oscura (JANA Creative Stage System), 1. Principios de Diseño Visual y Emocional, 2.1 Diseño Mobile-First Estricto, 2.2 Divulgación Progresiva (Progressive Disclosure), 2. Pautas de Arquitectura de Información y Carga Cognitiva, 3.1 Animaciones con Significado, 3.2 Transiciones de Estado Robustas, 3. Micro-interacciones y Feedback Visual (Motion UX) (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (8): 1. Tono y Voz de JANA OS, 2.1 Enfoque en Beneficios y Transformación, 2.2 Frameworks de Conversión Clásicos, 2. Principios y Frameworks de Redacción, 3.1 Claridad sobre Ingenio (Clarity Over Cleverness), 3.2 Enlaces Descriptivos (Prohibición de "Haz Clic Aquí"), 3. Copywriting Accesible (Inclusive & Plain Language), Regla del Agente: Redacción Persuasiva y Accesible (Copywriting)

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (8): 1.1 Transparencia Total sobre Costes y Condiciones, 1.2 Respeto a la Autonomía del Usuario (No Guilt-Tripping), 1. Principios del CRO Ético, 2. Alternativas Éticas a los Patrones Persuasivos Agresivos, 3.1 Formularios Simplificados y Guardado Automático, 3.2 Pasarela de Pago Transparente y Rápida, 3. Reducción Práctica de Fricción en Formularios y Checkout, Regla del Agente: Optimización de la Tasa de Conversión Ética (CRO Ético)

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (6): 1. Búsqueda Global Segura (pgvector + RAG), 2.1 Detalle del Flujo de Trabajo, 2. Generación de Contenido Automática (JANA Content Engine), 3. Mensajería en Tiempo Real (JANA Chat), 4. Adaptador Verifactu y Finanzas, JANA OS - Especificación de Requisitos Funcionales y Procesos de IA

### Community 14 - "Community 14"
Cohesion: 0.40
Nodes (4): 1. Inicialización del Repositorio de Control de Cambios, 2. El Ciclo de Desarrollo Guiado por Grafo (Workflow Loop), 3. Comandos de Emergencia y Mantenimiento, Contrato de Flujo de Trabajo: Iteración Dinámica del Grafo

### Community 15 - "Community 15"
Cohesion: 0.50
Nodes (3): Answer, Q: Why does Knowledge Service connect Grafo de Talento & Skills to Orquestación & Agentes de Contenido?, Source Nodes

### Community 16 - "Community 16"
Cohesion: 0.50
Nodes (3): Answer, Q: Why does Tabla Embeddings pgvector connect Grafo de Talento & Skills to Estructura Operativa & Sedes?, Source Nodes

### Community 17 - "Community 17"
Cohesion: 0.50
Nodes (3): Answer, Q: Why does Tabla Sedes connect Estructura Operativa & Sedes to Grafo de Talento & Skills?, Source Nodes

## Knowledge Gaps
- **83 isolated node(s):** `1. Tono y Voz de JANA OS`, `2.1 Enfoque en Beneficios y Transformación`, `2.2 Frameworks de Conversión Clásicos`, `3.1 Claridad sobre Ingenio (Clarity Over Cleverness)`, `3.2 Enlaces Descriptivos (Prohibición de "Haz Clic Aquí")` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Knowledge Service` connect `Estructura Operativa & Sedes` to `FastAPI Backend & Comunicación`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `Tabla Embeddings pgvector` connect `FastAPI Backend & Comunicación` to `Estructura Operativa & Sedes`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `1. Tono y Voz de JANA OS`, `2.1 Enfoque en Beneficios y Transformación`, `2.2 Frameworks de Conversión Clásicos` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Estructura Operativa & Sedes` be split into smaller, more focused modules?**
  _Cohesion score 0.12418300653594772 - nodes in this community are weakly interconnected._