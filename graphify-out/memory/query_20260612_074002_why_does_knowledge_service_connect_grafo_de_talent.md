---
type: "query"
date: "2026-06-12T07:40:02.991977+00:00"
question: "Why does Knowledge Service connect Grafo de Talento & Skills to Orquestación & Agentes de Contenido?"
contributor: "graphify"
source_nodes: ["docs_01_vision_arquitectonica_knowledge_service", "docs_02_modelos_de_datos_jana_talent_graph", "docs_01_vision_arquitectonica_specialized_agents"]
---

# Q: Why does Knowledge Service connect Grafo de Talento & Skills to Orquestación & Agentes de Contenido?

## Answer

El Knowledge Service actúa como traductor e intermediario unificado entre las fuentes de conocimiento (PostgreSQL, JANA Talent Graph, pgvector) y la inteligencia artificial (JANA Brain, Agentes Especializados). Su función centraliza la indexación semántica, recuperación contextual, enriquecimiento de prompts y, críticamente, el filtrado previo de seguridad RAG por roles y niveles de sensibilidad. Por esta razón, todos los flujos de recuperación cognitiva pasan por él, lo que le confiere alta centralidad en el grafo.

## Source Nodes

- docs_01_vision_arquitectonica_knowledge_service
- docs_02_modelos_de_datos_jana_talent_graph
- docs_01_vision_arquitectonica_specialized_agents