from __future__ import annotations

from datetime import date
from pathlib import Path
import re
import textwrap

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image as RLImage,
    KeepTogether,
    ListFlowable,
    ListItem,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.platypus.flowables import Flowable


ROOT = Path(__file__).resolve().parents[1]
SOURCE_MD = Path(r"C:\Users\usuario\Downloads\jana_os_strategic_analysis.md")
BRAND_IMAGE = Path(r"D:\IAMANCHA\OG-Image.png")
OUT_DIR = ROOT / "output" / "pdf"
TMP_DIR = ROOT / "tmp" / "pdfs"
OUT_PDF = OUT_DIR / "ia_mancha_jana_os_dossier.pdf"


PAGE_W, PAGE_H = A4
MARGIN_X = 18 * mm
TOP_MARGIN = 17 * mm
BOTTOM_MARGIN = 16 * mm

INK = colors.HexColor("#151515")
MUTED = colors.HexColor("#6B675F")
GOLD = colors.HexColor("#AFA58A")
GOLD_DARK = colors.HexColor("#8B826C")
GOLD_LIGHT = colors.HexColor("#E8E2D2")
PAPER = colors.HexColor("#FBFAF7")
PANEL = colors.HexColor("#F2EFE7")
CHARCOAL = colors.HexColor("#202020")
SOFT_BLACK = colors.HexColor("#0F0F10")
WHITE = colors.white
RISK = colors.HexColor("#8F3F32")
BLUEGREY = colors.HexColor("#44515A")


def register_fonts() -> dict[str, str]:
    fonts_dir = Path(r"C:\Windows\Fonts")
    candidates = {
        "regular": [fonts_dir / "arial.ttf", fonts_dir / "segoeui.ttf"],
        "bold": [fonts_dir / "arialbd.ttf", fonts_dir / "segoeuib.ttf"],
        "italic": [fonts_dir / "ariali.ttf", fonts_dir / "segoeuii.ttf"],
    }
    names: dict[str, str] = {}
    for key, paths in candidates.items():
        for path in paths:
            if path.exists():
                font_name = f"IAMancha-{key}"
                pdfmetrics.registerFont(TTFont(font_name, str(path)))
                names[key] = font_name
                break
    return {
        "regular": names.get("regular", "Helvetica"),
        "bold": names.get("bold", "Helvetica-Bold"),
        "italic": names.get("italic", "Helvetica-Oblique"),
    }


FONTS = register_fonts()


def clean_text(value: str) -> str:
    value = value.replace("—", "-").replace("–", "-").replace("“", '"').replace("”", '"')
    value = value.replace("’", "'").replace("‘", "'")
    value = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", value)
    value = re.sub(r"\*(.*?)\*", r"<i>\1</i>", value)
    value = re.sub(r"`([^`]*)`", r"<font name='IAMancha-regular'>\1</font>", value)
    return value.strip()


def para(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(clean_text(text), style)


class BrandCover(Flowable):
    def __init__(self, image_path: Path):
        super().__init__()
        self.image_path = str(image_path)

    def wrap(self, avail_width, avail_height):
        return avail_width, avail_height

    def draw(self):
        c = self.canv
        w, h = self.width, self.height
        c.saveState()
        c.setFillColor(PAPER)
        c.rect(0, 0, w, h, fill=1, stroke=0)
        c.setFillColor(SOFT_BLACK)
        c.rect(0, 0, w, 38 * mm, fill=1, stroke=0)
        c.setStrokeColor(GOLD)
        c.setLineWidth(1.2)
        c.line(0, 38 * mm, w, 38 * mm)
        c.setFillColor(GOLD_LIGHT)
        c.setFont(FONTS["regular"], 8)
        c.drawString(20 * mm, 19 * mm, "Dossier estratégico de producto y arquitectura")
        c.setFont(FONTS["bold"], 8)
        c.drawRightString(w - 20 * mm, 19 * mm, "JANA OS")

        img_w = 132 * mm
        img_h = img_w * 630 / 1200
        c.drawImage(self.image_path, (w - img_w) / 2, h - 92 * mm, width=img_w, height=img_h, preserveAspectRatio=True, mask="auto")

        c.setFillColor(INK)
        c.setFont(FONTS["bold"], 30)
        c.drawCentredString(w / 2, h - 118 * mm, "JANA OS")
        c.setFont(FONTS["regular"], 13)
        c.setFillColor(GOLD_DARK)
        c.drawCentredString(w / 2, h - 127 * mm, "Sistema operativo educativo y artistico")

        c.setStrokeColor(GOLD)
        c.setLineWidth(0.8)
        c.line(55 * mm, h - 139 * mm, w - 55 * mm, h - 139 * mm)

        c.setFillColor(CHARCOAL)
        c.setFont(FONTS["bold"], 16)
        c.drawCentredString(w / 2, h - 158 * mm, "Estrategia, arquitectura y hoja de ruta")
        c.setFillColor(MUTED)
        c.setFont(FONTS["regular"], 10)
        c.drawCentredString(w / 2, h - 166 * mm, f"Preparado el {date.today().strftime('%d/%m/%Y')}")

        c.setFillColor(PANEL)
        c.roundRect(25 * mm, 48 * mm, w - 50 * mm, 42 * mm, 4 * mm, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont(FONTS["bold"], 11)
        c.drawString(32 * mm, 75 * mm, "Tesis ejecutiva")
        c.setFont(FONTS["regular"], 9.4)
        c.setFillColor(MUTED)
        summary = (
            "JANA OS no debe competir con el CRM existente. Debe actuar como sistema nervioso digital: "
            "inteligencia academica, comunicacion operativa, seguimiento del talento y copiloto directivo "
            "con seguridad estricta para menores y datos sensibles."
        )
        text = c.beginText(32 * mm, 67 * mm)
        text.setFont(FONTS["regular"], 9.4)
        text.setLeading(13)
        for line in textwrap.wrap(summary, width=92):
            text.textLine(line)
        c.drawText(text)
        c.restoreState()


class SectionDivider(Flowable):
    def __init__(self, label: str, title: str, subtitle: str):
        super().__init__()
        self.label = label
        self.title = title
        self.subtitle = subtitle

    def wrap(self, avail_width, avail_height):
        return avail_width, 78 * mm

    def draw(self):
        c = self.canv
        w = self.width
        h = self.height
        c.saveState()
        c.setFillColor(SOFT_BLACK)
        c.rect(-MARGIN_X, 0, PAGE_W, h, fill=1, stroke=0)
        c.setFillColor(GOLD)
        c.setFont(FONTS["bold"], 9)
        c.drawString(0, h - 20 * mm, self.label.upper())
        c.setFillColor(WHITE)
        c.setFont(FONTS["bold"], 23)
        c.drawString(0, h - 35 * mm, self.title)
        c.setFillColor(GOLD_LIGHT)
        c.setFont(FONTS["regular"], 10)
        for idx, line in enumerate(textwrap.wrap(self.subtitle, 78)):
            c.drawString(0, h - (48 + idx * 6) * mm, line)
        c.setStrokeColor(GOLD)
        c.setLineWidth(1.1)
        c.line(0, 14 * mm, w, 14 * mm)
        c.restoreState()


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "h1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName=FONTS["bold"],
            fontSize=18,
            leading=22,
            textColor=INK,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName=FONTS["bold"],
            fontSize=12.5,
            leading=15,
            textColor=INK,
            spaceBefore=7,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName=FONTS["regular"],
            fontSize=9.2,
            leading=12.4,
            textColor=INK,
            spaceAfter=5,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontName=FONTS["regular"],
            fontSize=7.6,
            leading=9.6,
            textColor=MUTED,
        ),
        "caption": ParagraphStyle(
            "Caption",
            parent=base["BodyText"],
            fontName=FONTS["bold"],
            fontSize=8,
            leading=10,
            textColor=GOLD_DARK,
            alignment=TA_LEFT,
            spaceAfter=3,
        ),
        "quote": ParagraphStyle(
            "Quote",
            parent=base["BodyText"],
            fontName=FONTS["regular"],
            fontSize=10,
            leading=14,
            textColor=INK,
            leftIndent=6,
            rightIndent=6,
            spaceBefore=4,
            spaceAfter=8,
        ),
        "toc": ParagraphStyle(
            "Toc",
            parent=base["BodyText"],
            fontName=FONTS["regular"],
            fontSize=10.5,
            leading=14,
            textColor=INK,
            spaceAfter=6,
        ),
        "center": ParagraphStyle(
            "Center",
            parent=base["BodyText"],
            fontName=FONTS["regular"],
            fontSize=9,
            leading=12,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
    }


S = make_styles()


def page_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setStrokeColor(GOLD_LIGHT)
    canvas.setLineWidth(0.4)
    canvas.line(MARGIN_X, PAGE_H - 12 * mm, PAGE_W - MARGIN_X, PAGE_H - 12 * mm)
    canvas.setFillColor(GOLD_DARK)
    canvas.setFont(FONTS["regular"], 7)
    canvas.drawString(MARGIN_X, PAGE_H - 9 * mm, "IA MANCHA / JANA OS")
    canvas.setFillColor(MUTED)
    canvas.drawRightString(PAGE_W - MARGIN_X, 9 * mm, f"{doc.page}")
    canvas.setStrokeColor(GOLD_LIGHT)
    canvas.line(MARGIN_X, 13 * mm, PAGE_W - MARGIN_X, 13 * mm)
    canvas.restoreState()


def table(data, col_widths, style=None):
    base_style = [
        ("FONTNAME", (0, 0), (-1, 0), FONTS["bold"]),
        ("FONTNAME", (0, 1), (-1, -1), FONTS["regular"]),
        ("FONTSIZE", (0, 0), (-1, -1), 7.7),
        ("LEADING", (0, 0), (-1, -1), 9.5),
        ("BACKGROUND", (0, 0), (-1, 0), SOFT_BLACK),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("TEXTCOLOR", (0, 1), (-1, -1), INK),
        ("GRID", (0, 0), (-1, -1), 0.25, GOLD_LIGHT),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    if style:
        base_style.extend(style)
    return Table(data, colWidths=col_widths, repeatRows=1, style=TableStyle(base_style), hAlign="LEFT")


def bullet_list(items: list[str]) -> ListFlowable:
    return ListFlowable(
        [ListItem(para(item, S["body"]), bulletColor=GOLD_DARK) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=13,
        bulletFontName=FONTS["bold"],
        bulletFontSize=5,
    )


def callout(title: str, body: str, tone=GOLD_LIGHT):
    content = [
        para(title, ParagraphStyle("CalloutTitle", parent=S["caption"], textColor=INK, fontSize=9)),
        para(body, ParagraphStyle("CalloutBody", parent=S["body"], fontSize=8.8, leading=11.6, spaceAfter=0)),
    ]
    t = Table([[content]], colWidths=[PAGE_W - 2 * MARGIN_X], style=TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), tone),
        ("BOX", (0, 0), (-1, -1), 0.45, GOLD),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return t


def add_title(story, title: str, intro: str | None = None):
    story.append(para(title, S["h1"]))
    if intro:
        story.append(para(intro, S["body"]))
    story.append(Spacer(1, 3 * mm))


def p(text: str):
    return para(text, S["body"])


def make_role_table():
    rows = [
        ["Rol", "Necesidad", "Friccion", "Respuesta JANA OS"],
        ["Direccion", "Vista multi-sede en tiempo real.", "Datos fragmentados y reportes tardios.", "Copiloto de Direccion con analisis contextual."],
        ["Administracion", "Conciliacion de incidencias y alertas.", "Sin conexion entre inasistencia y baja.", "Backstage Panel con alertas cruzadas y auditoria CRM."],
        ["Profesorado", "Asistencia y feedback en menos de 60s.", "Carga administrativa despues de cada clase.", "Dictado por voz, plantillas y aprobacion humana."],
        ["Alumnado", "Evolucion artistica motivadora.", "Boletines numericos frios.", "Talent Graph y biblioteca de recursos."],
    ]
    return table([[para(c, S["small"]) for c in row] for row in rows], [29 * mm, 39 * mm, 43 * mm, 51 * mm])


def make_roadmap_table():
    rows = [
        ["Fase", "Foco", "Entregables", "Riesgo controlado"],
        ["MVP 1-3 meses", "Utilidad inmediata", "CRM read-only, Backstage Aula, asistencia, RAG basico.", "Adopcion docente y trazabilidad."],
        ["Escalado 4-6 meses", "Inteligencia y crecimiento", "Talent Graph, Content Engine, Copiloto interactivo.", "Coste IA y calidad de datos."],
        ["Madurez 7-12 meses", "Expansion", "Multi-tenant, churn avanzado, writebacks limitados.", "Complejidad operativa y gobernanza."],
    ]
    return table([[para(c, S["small"]) for c in row] for row in rows], [29 * mm, 36 * mm, 62 * mm, 35 * mm])


def make_risk_table():
    rows = [
        ["Riesgo", "Severidad", "Mitigacion"],
        ["Fuga de informacion de menores", "Critica", "RLS estricto, roles, cifrado y filtros previos al RAG."],
        ["Alucinaciones financieras/asistencia", "Alta", "SQL estructurado primero; el LLM interpreta, no calcula."],
        ["Baja adopcion del profesorado", "Alta", "Dictado por voz y pantallas moviles de tres acciones."],
    ]
    return table(
        [[para(c, S["small"]) for c in row] for row in rows],
        [58 * mm, 25 * mm, 79 * mm],
        [("TEXTCOLOR", (1, 1), (1, -1), RISK), ("FONTNAME", (1, 1), (1, -1), FONTS["bold"])],
    )


def make_sensitivity_table():
    rows = [
        ["Nivel", "Contenido", "Visibilidad"],
        ["PUBLIC", "Landings, blogs, FAQs", "Cualquier usuario"],
        ["INTERNAL", "Temarios, coreografias, recursos", "Profesores, administracion, direccion"],
        ["CONFIDENTIAL", "Finanzas, retencion, KPIs", "Administracion y direccion"],
        ["RESTRICTED", "Feedback de menores, chats privados", "Tutor, profesor directo o direccion academica"],
    ]
    return table([[para(c, S["small"]) for c in row] for row in rows], [34 * mm, 61 * mm, 67 * mm])


def make_architecture_table():
    rows = [
        ["Capa", "Responsabilidad", "Regla de diseno"],
        ["Frontend", "Portal Backstage y landing publica.", "SSR por defecto; cliente solo donde aporta interaccion."],
        ["API Gateway", "Auth, contratos, WebSockets y publicacion de eventos.", "Validacion explicita y side effects aislados."],
        ["Event Bus", "Procesamiento asincrono de IA y contenido.", "No bloquear la experiencia docente."],
        ["Servicios core", "Aula, chat y conector CRM.", "Dominio separado de infraestructura."],
        ["JANA Brain", "LLM, RAG y agentes bajo demanda.", "Orquestacion observable y coste acotado."],
        ["Datos", "PostgreSQL, pgvector, R2 y snapshots CRM.", "CRM como fuente externa comercial/contable."],
    ]
    return table([[para(c, S["small"]) for c in row] for row in rows], [34 * mm, 68 * mm, 60 * mm])


def build_story() -> list:
    story: list = []
    story.append(BrandCover(BRAND_IMAGE))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    add_title(story, "Indice ejecutivo", "Documento de referencia para decidir alcance, arquitectura y prioridades de JANA OS.")
    toc_items = [
        "1. Tesis estrategica y diagnostico",
        "2. Necesidades por rol y pilares funcionales",
        "3. Arquitectura objetivo y CRM read-only",
        "4. Seguridad RAG y gobierno de datos",
        "5. Agentes IA, copiloto y control de costes",
        "6. Riesgos, recortes de alcance y roadmap",
        "7. Ventaja competitiva y decisiones inmediatas",
    ]
    story.append(bullet_list(toc_items))
    story.append(Spacer(1, 5 * mm))
    story.append(callout("Decision estructural", "JANA OS debe evitar duplicar facturacion, Verifactu, pagos recurrentes y pipeline comercial. Ese territorio pertenece al CRM. El producto gana si se concentra en inteligencia academica, comunicacion operativa y seguimiento del talento."))
    story.append(Spacer(1, 6 * mm))
    story.append(make_role_table())
    story.append(PageBreak())

    story.append(SectionDivider("01", "Tesis estrategica", "JANA OS como sistema nervioso digital de una escuela de artes escenicas, no como ERP generalista."))
    story.append(Spacer(1, 6 * mm))
    story.append(p("Las escuelas de artes escenicas operan con dinamicas cualitativas, corporales y presenciales. La digitalizacion generica reduce la experiencia a calendarios, boletines y hojas de calculo, pero no captura la evolucion real del talento."))
    story.append(p("El principal riesgo de arquitectura es construir un monolito que reemplace el CRM existente. Esto desviaria entre el 60% y el 80% del esfuerzo hacia facturacion, fiscalidad, conciliacion y captacion comercial, que no son el diferencial de JANA OS."))
    story.append(callout("Principio operativo", "La tecnologia debe actuar como backstage: facilitar la clase, no imponer burocracia. Cualquier flujo docente debe poder completarse en menos de 60 segundos desde movil."))
    story.append(Spacer(1, 4 * mm))
    story.append(para("Objetivos del sistema", S["h2"]))
    story.append(bullet_list([
        "Unificar senales academicas, comunicativas y administrativas sin sustituir al CRM.",
        "Transformar actividad del aula en inteligencia directiva y pedagogica.",
        "Hacer visible la evolucion artistica mediante un Talent Graph accesible.",
        "Mantener seguridad estricta para menores, datos financieros y conocimiento interno.",
    ]))
    story.append(PageBreak())

    story.append(SectionDivider("02", "Pilares funcionales", "Funciones con retorno claro, orientadas a adopcion real y ventaja pedagogica."))
    story.append(Spacer(1, 5 * mm))
    pillars = [
        ("Comunicacion interna", "Canales contextuales por clase, asignatura o produccion. Confirmaciones de lectura pedagogica y busqueda inteligente sobre sesiones previas."),
        ("Evaluacion asistida", "Dictado por voz y normalizacion IA sobre rubricas JANA. La IA genera borradores, pero nunca publica sin validacion humana."),
        ("Talent Graph", "Mapa visual 2D/3D de habilidades y vista accesible en tabla para WCAG 2.2 AA."),
        ("Biblioteca docente", "Manuales, partituras y recursos indexados en pgvector para preparar clases con RAG controlado."),
        ("Content Engine", "Borradores SEO/GEO/AIO generados desde hitos reales del aula y aprobados por administracion."),
    ]
    rows = [["Pilar", "Valor", "Guardrail"]]
    guardrails = ["No reemplaza WhatsApp personal, crea memoria institucional.", "Human-in-the-loop obligatorio.", "Accesibilidad equivalente a la vista visual.", "RAG con filtros previos por rol y sensibilidad.", "Contenido basado en hechos, no generacion inventada."]
    for (title, body), guardrail in zip(pillars, guardrails):
        rows.append([title, body, guardrail])
    story.append(table([[para(c, S["small"]) for c in row] for row in rows], [38 * mm, 78 * mm, 46 * mm]))
    story.append(Spacer(1, 5 * mm))
    story.append(callout("Adopcion docente", "El producto debe asumir que el profesor es artista en activo. La interfaz de evaluacion no puede parecer un ERP: pocas acciones, voz, plantillas y revision rapida."))
    story.append(PageBreak())

    story.append(SectionDivider("03", "Arquitectura objetivo", "Sistema desacoplado para aislar IA, eventos, datos sensibles y experiencia de usuario."))
    story.append(Spacer(1, 5 * mm))
    story.append(make_architecture_table())
    story.append(Spacer(1, 5 * mm))
    story.append(para("Flujo recomendado", S["h2"]))
    story.append(bullet_list([
        "El frontend consume APIs estables y se suscribe a WebSockets solo donde hay valor operativo.",
        "El Gateway valida identidad, permisos y contratos antes de publicar eventos.",
        "El Event Bus desacopla tareas lentas: agentes, contenido, analisis y enriquecimiento.",
        "Los servicios de negocio mantienen reglas del dominio; JANA Brain no debe contener logica de facturacion ni permisos.",
        "PostgreSQL y pgvector sostienen datos estructurados y busqueda semantica con RLS.",
    ]))
    story.append(Spacer(1, 4 * mm))
    story.append(callout("CRM Connector Read Model", "El CRM externo sigue siendo el sistema comercial y contable. JANA OS importa snapshots, muestra deep links a la ficha original y evita escribir datos financieros salvo writebacks futuros muy controlados."))
    story.append(PageBreak())

    story.append(SectionDivider("04", "Seguridad RAG", "La gobernanza del conocimiento es el nucleo de confianza del sistema."))
    story.append(Spacer(1, 5 * mm))
    story.append(p("El LLM nunca debe consultar directamente la base vectorial. Toda recuperacion pasa por un Knowledge Service que aplica tenant, sede, rol, propietario y sensibilidad antes de cualquier similitud semantica."))
    story.append(make_sensitivity_table())
    story.append(Spacer(1, 5 * mm))
    story.append(callout("Gobernanza de menores", "Los datos RESTRICTED solo pueden entrar en contexto si el usuario es tutor legal, profesor directo o direccion academica autorizada. La seguridad debe vivir en consultas, politicas RLS y contratos, no en el prompt."))
    story.append(para("Controles minimos", S["h2"]))
    story.append(bullet_list([
        "RLS en PostgreSQL para todos los datos academicos sensibles.",
        "Clasificacion documental obligatoria antes de generar embeddings.",
        "Auditoria de consultas RAG: usuario, rol, chunks recuperados y motivo.",
        "Ventanas de contexto acotadas y sin campos internos innecesarios.",
    ]))
    story.append(PageBreak())

    story.append(SectionDivider("05", "Agentes y copiloto", "Automatizacion bajo demanda, con retorno claro y presupuesto controlado."))
    story.append(Spacer(1, 5 * mm))
    agent_rows = [
        ["Agente", "Mision", "Modo"],
        ["Director Copilot", "Analizar salud operativa multi-sede y anomalias academico-financieras.", "Bajo demanda"],
        ["Content Engine", "Generar borradores locales SEO/GEO/AIO desde hitos del aula.", "Asincrono"],
        ["Talent Analyzer", "Actualizar grafo de habilidades desde evaluaciones docentes.", "Batch diario"],
    ]
    story.append(table([[para(c, S["small"]) for c in row] for row in agent_rows], [42 * mm, 82 * mm, 38 * mm]))
    story.append(Spacer(1, 5 * mm))
    story.append(para("Copiloto de Direccion", S["h2"]))
    story.append(p("Su funcion no es gestionar leads. Debe detectar anomalias cruzando asistencia, interaccion, pagos importados del CRM y progreso de habilidades. Cuando el riesgo supera el umbral, genera una accion directiva concreta."))
    story.append(callout("Regla contra alucinaciones", "El copiloto no calcula cifras financieras ni porcentajes de asistencia con lenguaje natural. Primero ejecuta consultas estructuradas; despues redacta la interpretacion y recomendaciones."))
    story.append(para("Agentes descartados", S["h2"]))
    story.append(bullet_list([
        "Negociacion comercial autonoma: riesgo reputacional y poco valor en una escuela fisica.",
        "Soporte tecnico autonomo: coste alto e inestabilidad operativa.",
        "Horarios autonomos por LLM: usar optimizacion clasica, no razonamiento probabilistico.",
    ]))
    story.append(PageBreak())

    story.append(SectionDivider("06", "Costes, riesgos y alcance", "La sostenibilidad depende de limitar IA, duplicidades y superficie operativa."))
    story.append(Spacer(1, 5 * mm))
    story.append(para("Control de costes IA", S["h2"]))
    story.append(bullet_list([
        "Modelos pequenos para normalizacion, feedback, etiquetado y tareas frecuentes.",
        "Modelos grandes solo para analisis estrategico del Copiloto de Direccion.",
        "Embeddings al publicar o modificar documentos, no en cada consulta.",
        "Maximo de 3 chunks RAG por respuesta y JSON relacional compacto.",
    ]))
    story.append(Spacer(1, 4 * mm))
    story.append(make_risk_table())
    story.append(Spacer(1, 5 * mm))
    story.append(callout("Recorte de alcance obligatorio", "Eliminar facturacion nativa, Verifactu, pasarela de pago integrada y pipeline comercial. Construirlos duplicaria complejidad fiscal y sincronizacion contable sin mejorar el producto academico."))
    story.append(PageBreak())

    story.append(SectionDivider("07", "Roadmap y ventaja", "Secuencia incremental para validar valor sin crear deuda estructural."))
    story.append(Spacer(1, 5 * mm))
    story.append(make_roadmap_table())
    story.append(Spacer(1, 6 * mm))
    story.append(para("Ventaja competitiva", S["h2"]))
    story.append(bullet_list([
        "La taxonomia del Talent Graph crea propiedad intelectual pedagogica acumulativa.",
        "La retencion preventiva detecta abandono antes de que aparezca como baja en el CRM.",
        "La biblioteca RAG convierte metodologia interna en asistencia contextual para profesores.",
        "La marca gana contenido local real desde hitos de aula, no desde textos genericos.",
    ]))
    story.append(Spacer(1, 5 * mm))
    story.append(callout("Proximas decisiones", "Definir contrato de integracion CRM, taxonomia inicial del Talent Graph, politica de sensibilidad documental, eventos minimos del aula y metricas de adopcion docente."))
    story.append(PageBreak())

    add_title(story, "Anexo: extracto operativo", "Sintesis accionable para orientar implementacion y gobierno.")
    story.append(para("Principios de implementacion", S["h2"]))
    story.append(bullet_list([
        "Primero contratos y permisos; despues experiencias visuales.",
        "Cada flujo critico debe registrar trazas auditables y permitir diagnostico.",
        "La IA siempre queda encapsulada tras servicios con validacion y presupuesto.",
        "La accesibilidad del Talent Graph no es opcional: la tabla semantica es parte del producto.",
        "Todo writeback futuro hacia CRM requiere ADR, rollback y observabilidad dedicada.",
    ]))
    story.append(Spacer(1, 5 * mm))
    story.append(para("Fuente base", S["caption"]))
    story.append(p(f"Documento estrategico: {SOURCE_MD.name}. Imagen de marca: {BRAND_IMAGE.name}."))
    story.append(Spacer(1, 12 * mm))
    story.append(para("IA MANCHA - Inteligencia con identidad", S["center"]))
    return story


def build_pdf():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)

    # Basic source checks keep generation deterministic and fail loudly.
    source_text = SOURCE_MD.read_text(encoding="utf-8")
    if "JANA OS" not in source_text or "Talent Graph" not in source_text:
        raise RuntimeError("Source analysis does not look like the expected JANA OS dossier input.")
    with Image.open(BRAND_IMAGE) as im:
        if im.width < 800:
            raise RuntimeError("Brand image is too small for a print-quality cover.")

    frame = Frame(MARGIN_X, BOTTOM_MARGIN, PAGE_W - 2 * MARGIN_X, PAGE_H - TOP_MARGIN - BOTTOM_MARGIN, id="body")
    cover_frame = Frame(0, 0, PAGE_W, PAGE_H, id="cover")
    doc = BaseDocTemplate(
        str(OUT_PDF),
        pagesize=A4,
        leftMargin=MARGIN_X,
        rightMargin=MARGIN_X,
        topMargin=TOP_MARGIN,
        bottomMargin=BOTTOM_MARGIN,
        title="IA MANCHA - JANA OS Dossier",
        author="IA MANCHA",
        subject="Dossier estrategico y arquitectura JANA OS",
    )
    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[cover_frame]),
        PageTemplate(id="body", frames=[frame], onPage=page_background),
    ])
    doc.build(build_story())
    return OUT_PDF


if __name__ == "__main__":
    print(build_pdf())
