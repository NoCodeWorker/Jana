# Graph Report - JANA  (2026-06-12)

## Corpus Check
- 71 files · ~97,724 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 541 nodes · 625 edges · 49 communities (38 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `82acfba5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Estructura Operativa & Sedes|Estructura Operativa & Sedes]]
- [[_COMMUNITY_FastAPI Backend & Comunicación|FastAPI Backend & Comunicación]]
- [[_COMMUNITY_Configuración de Herramientas & Reglas del Agente|Configuración de Herramientas & Reglas del Agente]]
- [[_COMMUNITY_Orquestación & Agentes de Contenido|Orquestación & Agentes de Contenido]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_pgvector & Seguridad RAG|pgvector & Seguridad RAG]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Next.js Frontend|Next.js Frontend]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 53 edges
2. `compilerOptions` - 16 edges
3. `/graphify` - 11 edges
4. `What You Must Do When Invoked` - 11 edges
5. `What You Must Do When Invoked` - 11 edges
6. `/graphify` - 10 edges
7. `useMockData()` - 8 edges
8. `scripts` - 7 edges
9. `1. Nuevos Criterios de WCAG 2.2 AA (Implementación Obligatoria)` - 7 edges
10. `graphify reference: extra exports and benchmark` - 7 edges

## Surprising Connections (you probably didn't know these)
- `CustomDropdown()` --calls--> `cn()`  [EXTRACTED]
  components/jana-stage.tsx → lib/utils.ts
- `TalentGraphView()` --calls--> `cn()`  [EXTRACTED]
  components/jana-stage.tsx → lib/utils.ts
- `LoginForm()` --calls--> `cn()`  [EXTRACTED]
  components/jana-stage.tsx → lib/utils.ts
- `StudioView()` --calls--> `cn()`  [EXTRACTED]
  components/jana-stage.tsx → lib/utils.ts
- `LandingPage()` --calls--> `cn()`  [EXTRACTED]
  components/jana-stage.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (49 total, 11 thin omitted)

### Community 0 - "Estructura Operativa & Sedes"
Cohesion: 0.05
Nodes (41): Accesibilidad, Backstage Talent Graph, Bordes, Botones, Cards, Cards destacadas, Complete, Dark Mode & Light Mode (Alternancia) (+33 more)

### Community 1 - "FastAPI Backend & Comunicación"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 2 - "Configuración de Herramientas & Reglas del Agente"
Cohesion: 0.05
Nodes (33): 1. Búsqueda Global Segura (pgvector + RAG), 2.1 Detalle del Flujo de Trabajo, 2. Generación de Contenido Automática (JANA Content Engine), 3. Mensajería en Tiempo Real (JANA Chat), 4. Adaptador Verifactu y Finanzas, JANA OS - Especificación de Requisitos Funcionales y Procesos de IA, 1. Tono y Voz de JANA OS, 2.1 Enfoque en Beneficios y Transformación (+25 more)

### Community 3 - "Orquestación & Agentes de Contenido"
Cohesion: 0.08
Nodes (25): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+17 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (64): JanaLogo(), JanaLogoProps, allowedTabsByRole, AulaView(), BrainView(), ChatView(), ContentView(), CustomDropdown() (+56 more)

### Community 5 - "pgvector & Seguridad RAG"
Cohesion: 0.06
Nodes (33): 1. Principios Fundamentales, 2.1 Variables CSS del Tema (Tailwind CSS v4), 2. Paleta de Colores y Tokens CSS, 3. Tipografía y Escala, 4.1 Áreas Táctiles y Controles, 4.2 Lectores de Pantalla y Accesibilidad Web, 4.3 Motion Design (Movimiento con Significado), 4. Pautas de Accesibilidad e Interacción (+25 more)

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (7): metadata, AppProviders(), MockDataProvider(), Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger()

### Community 7 - "Next.js Frontend"
Cohesion: 0.24
Nodes (8): 1. Inicializar repositorio git si no existe, 2. Agregar archivos actuales y realizar commit inicial, 3. Instalar los ganchos de post-commit de Graphify, graphify, 1. Inicialización del Repositorio de Control de Cambios, 2. El Ciclo de Desarrollo Guiado por Grafo (Workflow Loop), 3. Comandos de Emergencia y Mantenimiento, Contrato de Flujo de Trabajo: Iteración Dinámica del Grafo

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, eslint-config-next, @eslint/js, globals, @next/eslint-plugin-next, tailwindcss, @tailwindcss/postcss (+5 more)

### Community 9 - "Community 9"
Cohesion: 0.17
Nodes (11): 1. Estructura de Capas del Sistema (Arquitectura Desacoplada), 2.1 Frontend, 2.2 Backend y Mensajería, 2.3 Capa de Datos y Almacenamiento, 2. Stack Tecnológico, 3.1 JANA Orchestrator, 3.2 JANA Brain y Agentes Especializados, 3.3 Knowledge Service (+3 more)

### Community 10 - "Community 10"
Cohesion: 0.17
Nodes (11): 1.1 Sedes y Usuarios, 1.2 Clases y Evaluaciones, 1.3 Finanzas y Verifactu, 1. Esquema Relacional (PostgreSQL), 2.1 Metadatos de las Relaciones, 2.2 Taxonomía de Skills, 2. Grafo Vivo (JANA TALENT GRAPH), 3.1 Estructura de la Tabla de Embeddings (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (6): 1. Initialization (Init), 2. Adding Components (Add), 3. Verification & Troubleshooting, shadcn-init Skill, Templates Available:, Usage

### Community 13 - "Community 13"
Cohesion: 0.25
Nodes (7): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (7): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 16 - "Community 16"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 17 - "Community 17"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 18 - "Community 18"
Cohesion: 0.50
Nodes (3): For /graphify explain, For /graphify path, graphify reference: query, path, explain

### Community 19 - "Community 19"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 20 - "Community 20"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 21 - "Community 21"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 22 - "Community 22"
Cohesion: 0.50
Nodes (3): For /graphify explain, For /graphify path, graphify reference: query, path, explain

### Community 23 - "Community 23"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 24 - "Community 24"
Cohesion: 0.50
Nodes (3): Answer, Q: Why does Knowledge Service connect Grafo de Talento & Skills to Orquestación & Agentes de Contenido?, Source Nodes

### Community 25 - "Community 25"
Cohesion: 0.50
Nodes (3): Answer, Q: Why does Tabla Embeddings pgvector connect Grafo de Talento & Skills to Estructura Operativa & Sedes?, Source Nodes

### Community 26 - "Community 26"
Cohesion: 0.50
Nodes (3): Answer, Q: Why does Tabla Sedes connect Estructura Operativa & Sedes to Grafo de Talento & Skills?, Source Nodes

### Community 31 - "Community 31"
Cohesion: 0.50
Nodes (3): graphify, remotion-skills, shadcn-init

### Community 32 - "Community 32"
Cohesion: 0.50
Nodes (3): graphify, remotion-skills, shadcn-init

### Community 33 - "Community 33"
Cohesion: 0.50
Nodes (3): graphify, remotion-skills, shadcn-init

### Community 36 - "Community 36"
Cohesion: 0.29
Nodes (6): 1. Initialization (Init), 2. Adding Components (Add), 3. Verification & Troubleshooting, shadcn-init Skill, Templates Available:, Usage

### Community 37 - "Community 37"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 38 - "Community 38"
Cohesion: 0.50
Nodes (3): Explanation of Flags:, remotion-skills Skill, Usage

### Community 39 - "Community 39"
Cohesion: 0.50
Nodes (3): Explanation of Flags:, remotion-skills Skill, Usage

### Community 40 - "Community 40"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 41 - "Community 41"
Cohesion: 0.07
Nodes (26): dependencies, class-variance-authority, clsx, framer-motion, lucide-react, next, next-themes, radix-ui (+18 more)

### Community 42 - "Community 42"
Cohesion: 0.07
Nodes (29): GET(), POST(), ChatMessage, ContentArticle, ContentArticleStatus, ContentNotification, CRMInvoice, generateInitialStudents() (+21 more)

### Community 45 - "Community 45"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 46 - "Community 46"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **306 isolated node(s):** `backstageSystems`, `metadata`, `$schema`, `style`, `rsc` (+301 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `JANA OS - Especificación del Sistema de Diseño (UI/UX)` connect `pgvector & Seguridad RAG` to `Estructura Operativa & Sedes`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 4` to `Community 6`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `backstageSystems`, `metadata`, `$schema` to the rest of the system?**
  _306 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Estructura Operativa & Sedes` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Should `FastAPI Backend & Comunicación` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Configuración de Herramientas & Reglas del Agente` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `Orquestación & Agentes de Contenido` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._