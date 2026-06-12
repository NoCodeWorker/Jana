# Regla del Agente: Optimización de la Tasa de Conversión Ética (CRO Ético)

Esta regla define los estándares para optimizar las tasas de conversión (inscripciones, reservas de audiciones, suscripciones a cursos) en **JANA OS** de forma **ética y centrada en el usuario**. Se prohíbe explícitamente el uso de "patrones oscuros" (dark patterns) y se prioriza la transparencia y la eliminación de fricción.

---

## 1. Principios del CRO Ético

El objetivo principal de optimizar la conversión en JANA OS es **ayudar al alumno y a la escuela a conectarse de forma natural**, alineando las motivaciones del usuario con los objetivos de negocio sin manipular su comportamiento.

### 1.1 Transparencia Total sobre Costes y Condiciones
*   **Regla:** El precio total (matrícula, mensualidades, impuestos, coste de materiales si los hubiera) debe ser visible desde el primer paso del flujo de contratación.
*   **Prohibición:** Está estrictamente prohibido añadir cargos adicionales ocultos en el último paso del checkout (por ejemplo, "tasas de gestión" imprevistas).
*   **Opciones Preseleccionadas:** No utilizar casillas pre-marcadas para servicios complementarios (seguros, talleres opcionales, merchandising). El usuario debe optar activamente por añadirlos (Opt-in).

### 1.2 Respeto a la Autonomía del Usuario (No Guilt-Tripping)
*   **Regla:** Las opciones para rechazar ofertas o cerrar diálogos emergentes deben ser tan claras y fáciles de pulsar como las opciones de confirmación.
*   **Prohibición:** Se prohíbe el uso de lenguaje persuasivo manipulador o que genere culpa en los botones de cancelación (ej. *"No, no me interesa desarrollar mi talento"* en lugar de un simple *"Cerrar"* o *"Ahora no"*).

---

## 2. Alternativas Éticas a los Patrones Persuasivos Agresivos

| Táctica Agresiva (Evitar) | Alternativa Ética (Implementar) |
| :--- | :--- |
| **Falsa Urgencia / FOMO:** Contadores de tiempo falsos que se reinician al refrescar la página. | **Urgencia Real Basada en Datos:** Mostrar plazos reales de inscripción o el número exacto de plazas físicas disponibles en la sede para ese curso (sincronizado con la base de datos). |
| **Registro Forzado Inicial:** Bloquear toda la navegación o impedir ver las asignaturas sin crear una cuenta. | **Prueba de Valor sin Fricción:** Permitir explorar el catálogo de clases, sedes y la metodología de forma abierta. Solicitar el registro únicamente al iniciar el proceso de matrícula. |
| **Cancelación Compleja:** Obligar a llamar por teléfono o enviar correos de soporte para darse de baja de una clase. | **Cancelación Simétrica ("1-Click"):** Si un usuario puede matricularse online, debe poder solicitar la baja o congelación de su matrícula desde su panel de control con la misma facilidad. |

---

## 3. Reducción Práctica de Fricción en Formularios y Checkout

### 3.1 Formularios Simplificados y Guardado Automático
*   **Regla:** Solicitar únicamente los datos estrictamente necesarios para el paso actual.
*   **Asistencia al Usuario:** Habilitar el autocompletado en el navegador para nombres, emails y teléfonos. Utilizar validaciones en tiempo real que expliquen claramente el error en lugar de esperar a que el usuario envíe el formulario.
*   **Prevenir Pérdida de Datos:** Si el usuario abandona temporalmente el flujo de inscripción por un problema de conexión o para comprobar un dato, el sistema debe retener de forma segura el borrador del formulario para que no tenga que empezar desde cero (respetando la regla WCAG 2.2 de Entrada Redundante).

### 3.2 Pasarela de Pago Transparente y Rápida
*   Integrar métodos de pago modernos de baja fricción (Apple Pay, Google Pay, Bizum) junto a la tarjeta de crédito.
*   Mostrar de forma clara y accesible las políticas de reembolso y cancelación justo debajo de la pasarela de pago.
