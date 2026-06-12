---
type: "query"
date: "2026-06-12T07:40:02.993094+00:00"
question: "Why does Tabla Embeddings pgvector connect Grafo de Talento & Skills to Estructura Operativa & Sedes?"
contributor: "graphify"
source_nodes: ["docs_02_modelos_de_datos_embeddings_table", "docs_02_modelos_de_datos_jana_talent_graph", "docs_02_modelos_de_datos_sedes_table"]
---

# Q: Why does Tabla Embeddings pgvector connect Grafo de Talento & Skills to Estructura Operativa & Sedes?

## Answer

Cada fragmento de conocimiento indexado (evaluaciones, feedback, producciones, historial artístico) genera embeddings. Sin embargo, en un entorno multi-tenant y multi-sede, estos vectores de talento no son universales: heredan y se asocian de forma estricta con la estructura organizativa (tenant_id, sede_id, visibilidad_rol, propietario_id). De este modo, la tabla vectorial actúa como la extensión semántica que une la inteligencia de talento con la segregación operativa de las sedes.

## Source Nodes

- docs_02_modelos_de_datos_embeddings_table
- docs_02_modelos_de_datos_jana_talent_graph
- docs_02_modelos_de_datos_sedes_table