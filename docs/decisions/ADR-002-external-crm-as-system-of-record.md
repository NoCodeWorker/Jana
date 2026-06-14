# ADR-002: CRM externo como sistema de registro

## Status

Accepted

## Context

La escuela ya utiliza un CRM y no quiere migrar su gestión comercial, financiera ni fiscal a JANA OS. El valor diferencial de JANA OS debe estar en cruzar datos del CRM con la vida académica de la escuela: Aula, Talent Graph, asistencia, comunicación, contenidos, sedes y capacidad docente.

## Decision

JANA OS tratará el CRM existente como sistema de registro para leads, matrículas, cobros, facturación, estados fiscales y seguimiento comercial. En el MVP, JANA OS operará en modo lectura y auditoría: importará snapshots normalizados, generará señales de dirección y permitirá abrir tareas o revisiones, pero no emitirá facturas ni modificará estados contables.

## Alternatives considered

1. Migrar el CRM a JANA OS.
2. Construir un módulo financiero/fiscal propio.
3. Integrar el CRM existente como fuente externa y usar sus datos para inteligencia directiva.

## Tradeoffs

La integración read-only reduce alcance, riesgo legal y coste de adopción, pero limita la capacidad de automatizar correcciones desde JANA OS. La automatización futura se podrá añadir mediante writebacks explícitos, permisos granulares y trazabilidad.

## Consequences

El Backstage Dirección y el Consultor de Dirección priorizarán análisis cruzado, alertas y oportunidades accionables. El Backstage Panel mostrará estado de sincronización, registros importados e incidencias, dejando cualquier corrección financiera en el CRM de origen. La documentación y la UI no deben presentar JANA OS como ERP, CRM ni sistema de facturación.
