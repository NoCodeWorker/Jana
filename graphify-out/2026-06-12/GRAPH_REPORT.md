# Graph Report - .  (2026-06-12)

## Corpus Check
- Corpus is ~4,392 words - fits in a single context window. You may not need a graph.

## Summary
- 32 nodes · 33 edges · 7 communities (5 shown, 2 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.93)
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
6. `FastAPI Backend Gateway` - 3 edges
7. `PostgreSQL Database` - 3 edges
8. `JANA Orchestrator` - 3 edges
9. `Tabla Clases` - 3 edges
10. `Tabla Eventos Financieros` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Codex PreToolUse Hook` --references--> `Graphify Codex Integration`  [INFERRED]
  D:/JANA/.codex/hooks.json → D:/JANA/AGENTS.md
- `Tabla Embeddings pgvector` --implements--> `Knowledge Service`  [INFERRED]
  docs/02_modelos_de_datos.md → docs/01_vision_arquitectonica.md
- `app/globals.css (Tema Tailwind v4)` --implements--> `Especificación Sistema de Diseño`  [INFERRED]
  app/globals.css → docs/04_diseno_ui_ux.md
- `Graphify Knowledge Graph Rule` --semantically_similar_to--> `Graphify Codex Integration`  [INFERRED] [semantically similar]
  D:/JANA/.agents/rules/graphify.md → D:/JANA/AGENTS.md
- `Tabla Sedes` --implements--> `Landings GEO por Sede`  [INFERRED]
  docs/02_modelos_de_datos.md → docs/01_vision_arquitectonica.md

## Import Cycles
- None detected.

## Communities (7 total, 2 thin omitted)

### Community 0 - "Estructura Operativa & Sedes"
Cohesion: 0.25
Nodes (9): JANA Orchestrator, Knowledge Service, pgvector, PostgreSQL Database, Agentes Especializados IA, JANA Talent Graph, Seguridad y Privacidad RAG, Taxonomía de Skills (+1 more)

### Community 1 - "FastAPI Backend & Comunicación"
Cohesion: 0.36
Nodes (8): Landings GEO por Sede, Tabla Clases, Tabla Embeddings pgvector, Tabla Evaluaciones, Tabla Eventos Financieros, Tabla Sedes, Tabla Usuarios, Adaptador Verifactu

### Community 2 - "Configuración de Herramientas & Reglas del Agente"
Cohesion: 0.33
Nodes (6): Better Auth, Event Bus, FastAPI Backend Gateway, WebSockets Gateway, Flujo JANA Chat, Flujo JANA Content Engine

### Community 3 - "Orquestación & Agentes de Contenido"
Cohesion: 0.50
Nodes (4): Graphify Codex Integration, Codex PreToolUse Hook, Graphify Knowledge Graph Rule, Graphify Update Rule

### Community 4 - "Grafo de Talento & Skills"
Cohesion: 0.67
Nodes (3): app/globals.css (Tema Tailwind v4), Next.js Frontend, Especificación Sistema de Diseño

## Knowledge Gaps
- **14 isolated node(s):** `Codex PreToolUse Hook`, `Graphify Update Rule`, `Landing Corporativa`, `Landings GEO por Sede`, `Next.js Frontend` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Knowledge Service` connect `Estructura Operativa & Sedes` to `FastAPI Backend & Comunicación`?**
  _High betweenness centrality (0.395) - this node is a cross-community bridge._
- **Why does `Tabla Embeddings pgvector` connect `FastAPI Backend & Comunicación` to `Estructura Operativa & Sedes`?**
  _High betweenness centrality (0.271) - this node is a cross-community bridge._
- **What connects `Codex PreToolUse Hook`, `Graphify Update Rule`, `Landing Corporativa` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._