# Graph Report - .  (2026-06-12)

## Corpus Check
- Corpus is ~4,051 words - fits in a single context window. You may not need a graph.

## Summary
- 33 nodes · 34 edges · 7 communities (5 shown, 2 thin omitted)
- Extraction: 79% EXTRACTED · 21% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Estructura Operativa & Sedes|Estructura Operativa & Sedes]]
- [[_COMMUNITY_FastAPI Backend & Comunicación|FastAPI Backend & Comunicación]]
- [[_COMMUNITY_Configuración de Herramientas & Reglas del Agente|Configuración de Herramientas & Reglas del Agente]]
- [[_COMMUNITY_Orquestación & Agentes de Contenido|Orquestación & Agentes de Contenido]]
- [[_COMMUNITY_Grafo de Talento & Skills|Grafo de Talento & Skills]]
- [[_COMMUNITY_pgvector & Seguridad RAG|pgvector & Seguridad RAG]]
- [[_COMMUNITY_Landing Corporativa|Landing Corporativa]]

## God Nodes (most connected - your core abstractions)
1. `Knowledge Service` - 6 edges
2. `Tabla Sedes` - 5 edges
3. `Event Bus` - 4 edges
4. `Tabla Usuarios` - 4 edges
5. `Especificación Sistema de Diseño` - 4 edges
6. `Graphify Knowledge Graph Rule` - 3 edges
7. `FastAPI Backend Gateway` - 3 edges
8. `PostgreSQL Database` - 3 edges
9. `JANA Orchestrator` - 3 edges
10. `Tabla Clases` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Codex PreToolUse Hook` --references--> `Graphify Codex Integration`  [INFERRED]
  D:/JANA/.codex/hooks.json → D:/JANA/AGENTS.md
- `index.css (Tema Tailwind v4)` --implements--> `Especificación Sistema de Diseño`  [INFERRED]
  index.css → docs/04_diseno_ui_ux.md
- `Graphify Knowledge Graph Rule` --semantically_similar_to--> `Graphify Codex Integration`  [INFERRED] [semantically similar]
  D:/JANA/.agents/rules/graphify.md → D:/JANA/AGENTS.md
- `Tabla Sedes` --implements--> `Landings GEO por Sede`  [INFERRED]
  docs/02_modelos_de_datos.md → docs/01_vision_arquitectonica.md
- `Tabla Embeddings pgvector` --implements--> `Knowledge Service`  [INFERRED]
  docs/02_modelos_de_datos.md → docs/01_vision_arquitectonica.md

## Import Cycles
- None detected.

## Communities (7 total, 2 thin omitted)

### Community 0 - "Estructura Operativa & Sedes"
Cohesion: 0.43
Nodes (7): Landings GEO por Sede, Tabla Clases, Tabla Evaluaciones, Tabla Eventos Financieros, Tabla Sedes, Tabla Usuarios, Adaptador Verifactu

### Community 1 - "FastAPI Backend & Comunicación"
Cohesion: 0.29
Nodes (7): JANA Orchestrator, Knowledge Service, pgvector, Agentes Especializados IA, Tabla Embeddings pgvector, Seguridad y Privacidad RAG, Flujo RAG Seguro

### Community 2 - "Configuración de Herramientas & Reglas del Agente"
Cohesion: 0.33
Nodes (6): Better Auth, Event Bus, FastAPI Backend Gateway, WebSockets Gateway, Flujo JANA Chat, Flujo JANA Content Engine

### Community 3 - "Orquestación & Agentes de Contenido"
Cohesion: 0.33
Nodes (6): Next.js Frontend, PostgreSQL Database, JANA Talent Graph, Taxonomía de Skills, Especificación Sistema de Diseño, index.css (Tema Tailwind v4)

### Community 4 - "Grafo de Talento & Skills"
Cohesion: 0.40
Nodes (5): Graphify Codex Integration, Codex PreToolUse Hook, Graphify Knowledge Graph Rule, Graphify Update Rule, Graphify Workflow

## Knowledge Gaps
- **15 isolated node(s):** `Codex PreToolUse Hook`, `Graphify Update Rule`, `Graphify Workflow`, `Landing Corporativa`, `Landings GEO por Sede` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Knowledge Service` connect `FastAPI Backend & Comunicación` to `Orquestación & Agentes de Contenido`?**
  _High betweenness centrality (0.370) - this node is a cross-community bridge._
- **Why does `Tabla Embeddings pgvector` connect `FastAPI Backend & Comunicación` to `Estructura Operativa & Sedes`?**
  _High betweenness centrality (0.254) - this node is a cross-community bridge._
- **Why does `Tabla Sedes` connect `Estructura Operativa & Sedes` to `FastAPI Backend & Comunicación`?**
  _High betweenness centrality (0.242) - this node is a cross-community bridge._
- **What connects `Codex PreToolUse Hook`, `Graphify Update Rule`, `Graphify Workflow` to the rest of the system?**
  _16 weakly-connected nodes found - possible documentation gaps or missing edges._