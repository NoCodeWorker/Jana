"use client";

import { Dispatch, FormEvent, SetStateAction, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Menu, Moon, Newspaper, Search, Sun, ChevronLeft, ChevronRight } from "lucide-react";
import { ContentArticle } from "@/components/mock-data-context";
import { JanaLogo } from "@/components/jana-logo";
import { LoginForm } from "@/components/backstage/login-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { JanaRole } from "@/lib/jana-auth";

/* ── Scroll Reveal Hook ─────────────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Add staggered children
            const children = entry.target.querySelectorAll(".reveal-child");
            children.forEach((child, i) => {
              (child as HTMLElement).style.transitionDelay = `${i * 80}ms`;
              child.classList.add("is-visible");
            });
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Animated Counter Hook ─────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1200, delay = 800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => {
      const startTime = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [started, target, duration, delay]);

  return { count, ref };
}

function AnimatedStat({
  stat,
  index,
}: {
  stat: { value: string; label: string };
  index: number;
}) {
  const numericValue = Number(stat.value.replace(/[^\d]/g, ""));
  const suffix = stat.value.replace(/[\d.,]/g, "");
  const { count, ref } = useCountUp(Number.isFinite(numericValue) ? numericValue : 0, 1200, 250 + index * 120);

  return (
    <motion.div
      ref={ref}
      className="relative space-y-1 pl-4 sm:pl-5"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: index * 0.08 }}
    >
      <span className="absolute left-0 top-1 h-10 w-px bg-gradient-to-b from-jana-primary via-jana-primary/35 to-transparent" />
      <p className="font-heading text-3xl font-black text-jana-primary-accessible tabular-nums">
        {count.toLocaleString("es-ES")}{suffix}
      </p>
      <p className="label-metric text-foreground-muted">{stat.label}</p>
    </motion.div>
  );
}

type LandingPageProps = {
  resolvedTheme: string | undefined;
  setTheme: (theme: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  login: { status: "idle" | "loading" | "success" | "error"; message: string };
  setLogin: Dispatch<SetStateAction<{ status: "idle" | "loading" | "success" | "error"; message: string }>>;
  handleLogin: (event: FormEvent<HTMLFormElement>) => void;
  quickLogin: (role: JanaRole, userEmail: string) => void;
  selectMockUser: (role: JanaRole, userEmail: string) => void;
  demoProfiles: Array<{ role: string; label: string; user: string; tone: string }>;
  articles: ContentArticle[];
  activeSede: string;
  setActiveSede: (sede: string) => void;
};

// SVG Flags for cross-platform visual consistency (Windows fallback fix)
const SpainFlag = () => (
  <span className="inline-flex w-4 h-2.5 rounded-[2px] overflow-hidden shadow-sm border border-border/10 shrink-0 select-none">
    <svg viewBox="0 0 750 500" className="w-full h-full object-cover">
      <rect width="750" height="500" fill="#c03" />
      <rect y="125" width="750" height="250" fill="#fecb00" />
    </svg>
  </span>
);

const MexicoFlag = () => (
  <span className="inline-flex w-4 h-2.5 rounded-[2px] overflow-hidden shadow-sm border border-border/10 shrink-0 select-none">
    <svg viewBox="0 0 300 200" className="w-full h-full object-cover">
      <rect width="100" height="200" fill="#006847" />
      <rect x="100" width="100" height="200" fill="#fff" />
      <rect x="200" width="100" height="200" fill="#c8102e" />
      <circle cx="150" cy="100" r="10" fill="#8b5a2b" opacity="0.85" />
    </svg>
  </span>
);

const content = {
  global: {
    title: "Escuela JANA | Teatro Musical, Canto, Danza e Interpretación",
    description: "Escuela de artes escénicas JANA. Formación integral en canto, danza, interpretación y teatro musical de la mano de profesionales en activo.",
    heroSedes: ["Madrid Sede Central", "Alcalá de Henares", "Majadahonda"],
    heroTitle: "Escuela de artes escénicas para crecer sobre el escenario",
    heroDesc: "Canto, danza, interpretación y teatro musical en una escuela conectada con producciones reales. Formación técnica, seguimiento cercano y experiencias escénicas para niños, jóvenes y adultos.",
    heroCta: "Reservar clase de prueba",
    heroSecCta: "Ver cursos y sedes",
    stats: [
      { value: "15+", label: "años de trayectoria" },
      { value: "3", label: "sedes activas" },
      { value: "400+", label: "alumnos al año" },
      { value: "50+", label: "producciones" },
    ],
    nextStepTitle: "Clase de prueba según edad, nivel y sede",
    nextStepBadge: "Próximo paso",
    studyTitle: "Qué puedes estudiar",
    studyDesc: "Programas para empezar desde cero, mejorar técnica o preparar audiciones con un equipo docente vinculado al escenario.",
    studyPrograms: [
      ["Teatro musical", "Canto, danza e interpretación en un mismo itinerario."],
      ["Interpretación", "Texto, personaje, escucha y presencia escénica."],
      ["Danza", "Base técnica, ritmo, coordinación y expresión corporal."],
      ["Canto", "Respiración, afinación, voz hablada y repertorio."],
      ["Cursos intensivos", "Talleres de verano, audiciones y preparación específica."],
      ["Formación profesional", "Entrenamiento avanzado para perfiles con objetivo escénico."],
    ],
    whyTitle: "Una escuela que no separa la formación del escenario",
    whyDesc: "La diferencia está en estudiar con una metodología artística completa, profesorado en activo y una cultura de escenario real.",
    whyPoints: [
      ["Formación integral", "Cuerpo, voz, texto, música y presencia se trabajan como un mismo lenguaje."],
      ["Profesorado profesional", "Docentes con experiencia en aula, audiciones, montaje y producción."],
      ["Producciones reales", "La escuela convive con una productora teatral con recorrido escénico."],
      ["Metodología propia", "Seguimiento por nivel, objetivos claros y progresión visible para cada alumno."],
      ["Comunidad artística", "Grupos vivos, muestras, ensayos y un entorno que acompaña al alumno."],
      ["Orientación cercana", "Ayuda para elegir disciplina, grupo, ritmo y próximos pasos formativos."],
    ],
    blogTitle: "Recursos para crecer dentro y fuera del aula",
    blogDesc: "Consejos de técnica vocal, interpretación, danza y vida escénica escritos por el profesorado de JANA para alumnos, familias y personas que quieren empezar a formarse.",
    blogTopics: [
      ["Voz", "preparación y cuidado"],
      ["Escena", "presencia y seguridad"],
      ["Familias", "seguimiento del alumno"],
    ],
    pathTitle: "Sedes y programas para cada etapa artística",
    pathDesc: "El primer contacto debe resolver rápido tres preguntas: dónde puedo estudiar, qué disciplina encaja conmigo y cómo pruebo una clase antes de matricularme.",
    pathCards: [
      { title: "Madrid Sede Central", detail: "Formación escénica en el centro de Madrid, cerca de transporte público y con actividad de canto, interpretación y teatro musical.", metric: "Sede" },
      { title: "Alcalá de Henares", detail: "Programas para niños, jóvenes y adultos con grupos por nivel, seguimiento docente y preparación de muestras de fin de curso.", metric: "Sede" },
      { title: "Canto, danza e interpretación", detail: "Itinerarios por disciplina para empezar desde cero, reforzar técnica o prepararse para audiciones y escenarios reales.", metric: "Cursos" },
    ],
    testimonialTitle: "Familias, alumnos y escenario",
    testimonials: [
      { quote: "Mi hija entró con mucha vergüenza y en pocos meses empezó a cantar delante del grupo. La exigencia es alta, pero siempre desde el cuidado.", name: "Carmen Vega", role: "Madre de alumna · Madrid Sede Central", initial: "CV", color: "text-jana-primary-accessible", border: "border-jana-primary/20" },
      { quote: "JANA me ayudó a entender cómo se trabaja una audición: técnica, cuerpo, texto y cabeza. Llegué mucho más preparado.", name: "Alejandro Fuentes", role: "Alumno de teatro musical", initial: "AF", color: "text-brain", border: "border-brain/20" },
      { quote: "Lo mejor es que no parece una academia aislada del escenario. Ensayas con profesores que conocen producción y eso se nota.", name: "Lucía Romero", role: "Alumna de interpretación", initial: "LR", color: "text-talent", border: "border-talent/20" },
    ],
    ctaBadge: "Clase de prueba · Plazas limitadas",
    ctaTitle: "Ven a probar una clase antes de matricularte",
    ctaDesc: "Cuéntanos edad, disciplina y sede preferida. El equipo de JANA te orientará hacia el grupo más adecuado.",
    ctaButton: "Solicitar clase de prueba",
    ctaSecButton: "Ver horarios y sedes",
    ctaBadges: ["Grupos por edad y nivel", "Profesorado en activo", "Seguimiento individual", "Muestras y actuaciones"],
    stepsTitle: "De la primera clase al escenario",
    stepsDesc: "La entrada a JANA está pensada para que cada alumno encuentre grupo, ritmo y disciplina sin perder el vínculo con el escenario.",
    steps: [
      { step: "01", title: "Cuéntanos qué buscas", desc: "Edad, experiencia, sede preferida y disciplina que más te interesa." },
      { step: "02", title: "Prueba una clase", desc: "Te proponemos un grupo real para comprobar nivel, ambiente y metodología." },
      { step: "03", title: "Diseña tu itinerario", desc: "Canto, danza, interpretación o teatro musical según objetivo y disponibilidad." },
      { step: "04", title: "Sube al escenario", desc: "El curso culmina con muestras, ensayos y experiencias conectadas a JANA Producciones." },
    ],
    footerDesc: "Escuela JANA acompaña a niños, jóvenes y adultos en canto, danza, interpretación y teatro musical desde Madrid.",
    footerSedes: ["Madrid Sede Central", "Alcalá de Henares", "Majadahonda"],
    footerBottomCta: "¿Quieres probar una clase en JANA?",
    footerBottomSub: "Te orientamos por edad, nivel, disciplina y sede para que encuentres el grupo adecuado.",
    footerBottomBtn: "Solicitar información",
  },
  mexico: {
    title: "Escuela JANA México | Teatro Musical, Canto, Danza y Actuación en CDMX",
    description: "Aprende artes escénicas en JANA México. Cursos de canto, danza, actuación y teatro musical en Coyoacán, Polanco y Condesa. ¡Agenda tu clase muestra gratis!",
    heroSedes: ["Coyoacán", "Polanco", "Condesa"],
    heroTitle: "Escuela de artes escénicas para crecer sobre el escenario en CDMX",
    heroDesc: "Canto, danza, actuación y teatro musical en una escuela conectada con producciones reales en México. Formación técnica, acompañamiento cercano e itinerarios escénicos para niños, jóvenes y adultos.",
    heroCta: "Reservar clase muestra gratis",
    heroSecCta: "Ver cursos e itinerarios",
    stats: [
      { value: "15+", label: "años de experiencia global" },
      { value: "3", label: "zonas de cobertura (CDMX)" },
      { value: "1,500+", label: "alumnos formados" },
      { value: "120+", label: "becas de talento" },
    ],
    nextStepTitle: "Clase muestra sin costo según edad, nivel y zona",
    nextStepBadge: "Próximo paso",
    studyTitle: "Qué puedes estudiar en JANA México",
    studyDesc: "Programas diseñados para iniciar desde cero, perfeccionar técnica o preparar audiciones profesionales con directores y docentes activos en la escena mexicana.",
    studyPrograms: [
      ["Teatro musical", "Canto, danza y actuación en un mismo itinerario formativo."],
      ["Actuación", "Texto, improvisación, voz y presencia escénica para cine y teatro."],
      ["Danza", "Técnica corporal, jazz, contemporáneo y expresión corporal."],
      ["Canto", "Técnica vocal, afinación, proyección y ensamble vocal."],
      ["Talleres intensivos", "Cursos de verano, preparación de castings y clases muestra."],
      ["Formación profesional", "Entrenamiento de alto rendimiento para quienes buscan el escenario profesional."],
    ],
    whyTitle: "Formación artística integral y escenario real en México",
    whyDesc: "Aprende con una metodología propia comprobada internacionalmente, profesores en activo y oportunidades reales en proyectos escénicos.",
    whyPoints: [
      ["Formación integral", "Cuerpo, voz, actuación y música se integran como herramientas de expresión total."],
      ["Docentes en activo", "Aprende con profesionales vigentes en musicales, teatro y televisión mexicana."],
      ["Producciones y castings", "La escuela se conecta directamente con audiciones y proyectos de JANA Producciones México."],
      ["Metodología global", "Un plan de estudios con objetivos claros y retroalimentación personalizada por trimestre."],
      ["Comunidad creativa", "Muestras de fin de cursos, talleres especiales y un ambiente de colaboración único."],
      ["Asesoría personalizada", "Te ayudamos a elegir la disciplina y grupo que mejor se adapten a tu perfil."],
    ],
    blogTitle: "Blog y Recursos de Artes Escénicas en México",
    blogDesc: "Consejos prácticos de técnica vocal, entrenamiento escénico, tips para castings y preparación artística desarrollados por nuestro claustro docente.",
    blogTopics: [
      ["Voz", "cuidado y afinación"],
      ["Castings", "preparación de audición"],
      ["Acompañamiento", "desarrollo y confianza"],
    ],
    pathTitle: "Zonas JANA y programas en Ciudad de México",
    pathDesc: "Elige la ubicación que más te acomode y ven a conocer nuestras salas de ensayo. Tenemos grupos por edades y niveles.",
    pathCards: [
      { title: "Sede Coyoacán", detail: "Salas equipadas y ambiente artístico en el sur de la CDMX, con cursos anuales de teatro musical, canto y actuación.", metric: "Zona" },
      { title: "Sede Polanco", detail: "Ubicación céntrica con programas ejecutivos y sabatinos para jóvenes y adultos que buscan formación de alto nivel.", metric: "Zona" },
      { title: "Sede Condesa", detail: "Grupos infantiles y talleres intensivos en una de las zonas con mayor dinamismo cultural y artístico de la ciudad.", metric: "Zona" },
    ],
    testimonialTitle: "Nuestra comunidad en CDMX",
    testimonials: [
      { quote: "Mi hija entró con mucha pena y en pocos meses empezó a cantar frente al grupo. La exigencia es alta, pero siempre desde el cuidado.", name: "Sofía Domínguez", role: "Madre de alumna · Coyoacán", initial: "SD", color: "text-jana-primary-accessible", border: "border-jana-primary/20" },
      { quote: "JANA me ayudó a entender cómo se trabaja una audición: técnica, cuerpo, texto y enfoque. Llegué mucho más preparado a mis castings.", name: "Mateo Silva", role: "Alumno de teatro musical · Polanco", initial: "MS", color: "text-brain", border: "border-brain/20" },
      { quote: "Lo mejor es que no parece una academia aislada del medio artístico. Ensayas con directores y productores de la escena en CDMX.", name: "Regina Alarcón", role: "Alumna de actuación · Condesa", initial: "RA", color: "text-talent", border: "border-talent/20" },
    ],
    ctaBadge: "Clase muestra gratis · Plazas limitadas",
    ctaTitle: "¡Inscríbete y ven a probar una clase muestra sin costo!",
    ctaDesc: "Cuéntanos tu edad, disciplina e interés. El equipo de JANA México te recomendará el mejor grupo para ti. Mensualidades desde $1,850 MXN.",
    ctaButton: "Solicitar clase muestra gratis",
    ctaSecButton: "Ver horarios e itinerarios",
    ctaBadges: ["Grupos por edad y nivel", "Docentes en activo en CDMX", "Acompañamiento individual", "Muestras de fin de curso"],
    stepsTitle: "Tu camino al escenario en CDMX",
    stepsDesc: "Nuestra metodología te guía paso a paso desde tu primera clase muestra hasta las producciones en teatros reales.",
    steps: [
      { step: "01", title: "Cuéntanos qué buscas", desc: "Edad, intereses y tu zona preferida en CDMX (Coyoacán, Polanco, Condesa)." },
      { step: "02", title: "Toma tu clase muestra", desc: "Te invitamos a una sesión de prueba sin costo en un grupo real." },
      { step: "03", title: "Elige tu itinerario", desc: "Canto, danza, actuación o teatro musical según tus metas y disponibilidad." },
      { step: "04", title: "¡Sube al escenario!", desc: "El curso concluye con muestras y puestas en escena en teatros de la CDMX." },
    ],
    footerDesc: "Escuela JANA México acompaña a niños, jóvenes y adultos en canto, danza, actuación y teatro musical en la Ciudad de México.",
    footerSedes: ["Coyoacán", "Polanco", "Condesa"],
    footerBottomCta: "¿Quieres probar una clase muestra en JANA México?",
    footerBottomSub: "Te orientamos por edad, nivel, disciplina y zona de la CDMX para que encuentres tu grupo.",
    footerBottomBtn: "Solicitar información",
  },
};

const jsonLdGlobal = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "School",
      "@id": "https://escuelajana.com/#school",
      "name": "Escuela JANA",
      "url": "https://escuelajana.com",
      "logo": "https://escuelajana.com/logo.png",
      "description": "Escuela de artes escénicas especializada en teatro musical, canto, danza e interpretación.",
      "sameAs": [
        "https://www.instagram.com/escuelajana",
        "https://www.youtube.com/user/JanaProducciones"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Calle de Marqués de Urquijo, 47",
        "addressLocality": "Madrid",
        "postalCode": "28008",
        "addressCountry": "ES"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://escuelajana.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Se puede probar una clase antes de matricularse?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, en Escuela JANA ofrecemos una clase de prueba gratuita para que puedas conocer el nivel, el ambiente y a los profesores de tu grupo antes de formalizar la matrícula."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué disciplinas se enseñan en la escuela?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ofrecemos formación en teatro musical, canto moderno y clásico, danza jazz, claqué, expresión corporal, interpretación y actuación frente a la cámara."
          }
        }
      ]
    }
  ]
};

const jsonLdMexico = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://escuelajana.com/mexico/#localbusiness",
      "name": "Escuela JANA México",
      "url": "https://escuelajana.com/mexico",
      "logo": "https://escuelajana.com/logo.png",
      "description": "Escuela de artes escénicas en CDMX. Canto, danza, actuación y teatro musical en Coyoacán, Polanco y Condesa.",
      "telephone": "+525550005262",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. Francisco I. Madero 10, Coyoacán",
        "addressLocality": "Ciudad de México",
        "addressRegion": "CDMX",
        "postalCode": "04000",
        "addressCountry": "MX"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 19.3496,
        "longitude": -99.1623
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "21:00"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://escuelajana.com/mexico/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Tienen clases de prueba sin costo en CDMX?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, puedes reservar una clase muestra 100% gratis en cualquiera de nuestras zonas en la Ciudad de México (Coyoacán, Polanco o Condesa) para conocer nuestra metodología."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuál es el costo de las mensualidades en JANA México?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nuestras mensualidades inician desde los $1,850 MXN, dependiendo de la disciplina (canto, danza, actuación o teatro musical) y la frecuencia de las sesiones semanales."
          }
        }
      ]
    }
  ]
};

export function LandingPage({
  resolvedTheme,
  setTheme,
  email,
  setEmail,
  password,
  setPassword,
  login,
  handleLogin,
  quickLogin,
  selectMockUser,
  demoProfiles,
  articles,
  activeSede,
  setActiveSede,
}: LandingPageProps) {
  const isLight = resolvedTheme === "light";
  const [landingView, setLandingView] = useState<"global" | "mexico">(
    activeSede === "México (CDMX)" ? "mexico" : "global"
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [privateAccessOpen, setPrivateAccessOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const [isNewsArchiveOpen, setIsNewsArchiveOpen] = useState(false);
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<ContentArticle | null>(null);
  const [newsSearchQuery, setNewsSearchQuery] = useState("");
  const [newsSelectedSede, setNewsSelectedSede] = useState("todas");
  const [newsSelectedTopic, setNewsSelectedTopic] = useState("todos");

  // Área 4: Scroll reveal
  useScrollReveal();

  // Área 5: Scroll progress + header scroll-aware
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (scrolled / docH) * 100 : 0);
      setIsHeaderScrolled(scrolled > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Testimonial auto-carousel
  const testimonials = content[landingView].testimonials;
  const nextTestimonial = useCallback(() =>
    setTestimonialIdx(i => (i + 1) % testimonials.length), [testimonials.length]);
  const prevTestimonial = useCallback(() =>
    setTestimonialIdx(i => (i - 1 + testimonials.length) % testimonials.length), [testimonials.length]);

  useEffect(() => {
    const t = setInterval(nextTestimonial, 5000);
    return () => clearInterval(t);
  }, [nextTestimonial]);

  useEffect(() => {
    document.title = content[landingView].title;
  }, [landingView]);

  useEffect(() => {
    if (activeSede === "México (CDMX)") {
      setLandingView("mexico");
    } else {
      setLandingView("global");
    }
  }, [activeSede]);

  const landingArticles = articles.filter(article => article.status === "publicado" && article.showOnLanding);
  const publicArticles = landingArticles.slice(0, 3);

  const newsSedes = ["todas", ...Array.from(new Set(landingArticles.map(a => a.sede)))];
  const newsTopics = ["todos", ...Array.from(new Set(landingArticles.map(a => a.topic)))];

  const filteredArchiveArticles = landingArticles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
      article.body.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
      article.seoKeywords.some(kw => kw.toLowerCase().includes(newsSearchQuery.toLowerCase()));
    
    const matchesSede = newsSelectedSede === "todas" || article.sede === newsSelectedSede || article.geoTargets.includes(newsSelectedSede);
    const matchesTopic = newsSelectedTopic === "todos" || article.topic === newsSelectedTopic;

    return matchesSearch && matchesSede && matchesTopic;
  });

  const contentShell = "mx-auto w-full px-4 md:px-8 lg:w-[75vw] lg:px-0";

  const megaMenu = {
    Formación: ["Cursos Anuales", "Nuestras Sedes", "Colegios", "Campamentos de Verano", "Inscripción Online"],
    Escenario: ["Musicales en Cartel", "Microconciertos JANA", "Compra de Entradas", "Giras Nacionales"],
    Comunidad: ["Profesorado", "Espacios Escénicos", "Agenda de Ensayos", "Noticias JANA"],
    Nosotros: ["Quiénes Somos", "Historia JANA", "Bolsa de Empleo", "Contactar"],
  };

  /* Hero words from H1 */
  const heroTitle = content[landingView].heroTitle;
  const heroWords = heroTitle.split(" ");
  const midPoint = Math.ceil(heroWords.length / 2);
  const heroWordVariants = {
    hidden: { opacity: 0, y: 28, rotateX: -18, filter: "blur(8px)" },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 260, damping: 24, delay: 0.12 + i * 0.045 },
    }),
  };
  const heroBadgeVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.92 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 330, damping: 22, delay: 0.05 + i * 0.08 },
    }),
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* Área 8: Skip link */}
      <a href="#main-content" className="skip-link">Ir al contenido principal</a>

      {/* Área 5: Scroll progress bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso de lectura"
      />

      <title>{content[landingView].title}</title>
      <meta name="description" content={content[landingView].description} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingView === "mexico" ? jsonLdMexico : jsonLdGlobal) }}
      />

      {/* Área 5: Scroll-aware sticky header */}
      <header className={cn(
        "sticky top-0 isolate z-[100] border-b border-border bg-background/80 backdrop-blur-xl px-4 py-4 md:px-8 transition-all duration-300",
        isHeaderScrolled && "header-scrolled"
      )}>
        <div className="flex w-full items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <JanaLogo className="h-10 w-auto" />
            {landingView === "mexico" && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-jana-primary/30 bg-jana-primary/10 px-2 py-0.5 text-[9px] font-black text-jana-primary-accessible">
                MÉXICO <MexicoFlag />
              </span>
            )}
          </div>

          {/* DESKTOP MEGA-MENU */}
          <nav className="hidden lg:flex items-center gap-3 text-sm font-semibold">
            {Object.entries(megaMenu).map(([category, items]) => (
              <div key={category} className="relative group py-3">
                <button type="button" className="flex h-11 items-center gap-2 rounded-xl px-4 text-foreground-muted transition hover:bg-accent/35 hover:text-foreground cursor-pointer">
                  {category}
                  <span className="text-[10px] opacity-65 transition-transform group-hover:rotate-180">▼</span>
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="rounded-2xl border border-border bg-popover p-4 shadow-xl backdrop-blur-md space-y-2">
                    <p className="text-[10px] font-bold text-jana-primary-accessible uppercase tracking-wider px-3 pb-3 border-b border-border/40 mb-2">
                      {category} JANA
                    </p>
                    {items.map((item) => {
                      if (item === "Nuestras Sedes") {
                        return (
                          <div key={item} className="space-y-1.5 py-1">
                            <p className="text-[10px] font-bold text-jana-primary-accessible uppercase tracking-wider px-3 pb-1">
                              Nuestras Sedes
                            </p>
                            <div className="pl-3 border-l border-border/60 space-y-1 ml-3">
                              {[
                                { label: "Madrid Sede Central", flag: <SpainFlag />, view: "global" as const, sede: "Madrid Sede Central" },
                                { label: "Alcalá de Henares", flag: <SpainFlag />, view: "global" as const, sede: "Alcalá de Henares" },
                                { label: "Majadahonda", flag: <SpainFlag />, view: "global" as const, sede: "Majadahonda" },
                                { label: "México (CDMX)", flag: <MexicoFlag />, view: "mexico" as const, sede: "México (CDMX)" },
                              ].map((sedeOpt) => (
                                <a
                                  key={sedeOpt.label}
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setLandingView(sedeOpt.view);
                                    setActiveSede(sedeOpt.sede);
                                  }}
                                  className="flex items-center gap-2 rounded-lg px-2 py-1 text-xs text-foreground-muted hover:text-foreground hover:bg-accent/30 transition"
                                >
                                  {sedeOpt.flag}
                                  <span>{sedeOpt.label}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <a
                          key={item}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (item === "Noticias JANA") {
                              setIsNewsArchiveOpen(true);
                            }
                          }}
                          className="block rounded-xl px-3 py-2.5 text-xs text-foreground-muted hover:text-foreground hover:bg-accent/40 transition"
                        >
                          {item}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="relative z-10 flex items-center gap-3.5">
            {landingView === "mexico" && (
              <button
                type="button"
                onClick={() => {
                  setLandingView("global");
                  setActiveSede("Madrid Sede Central");
                }}
                className="hidden sm:inline-flex h-11 items-center justify-center rounded-xl border border-border bg-surface px-4 text-xs font-bold text-foreground hover:bg-accent/30 transition gap-2"
              >
                <SpainFlag /> Corporativo España
              </button>
            )}

            {/* Theme toggle */}
            <button
              type="button"
              onClick={() => setTheme(isLight ? "dark" : "light")}
              className="flex size-11 items-center justify-center rounded-xl border border-border bg-surface transition hover:bg-accent/30"
              aria-label="Alternar tema claro y oscuro"
              title="Alternar tema"
            >
              {isLight ? (
                <Moon className="size-4 text-foreground-muted" />
              ) : (
                <Sun className="size-4 text-foreground-muted" />
              )}
            </button>

            {/* Área 5+7: Backstage Access with shimmer */}
            <button
              type="button"
              onClick={() => setPrivateAccessOpen(true)}
              className="btn-shimmer inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-jana-primary px-4 text-xs font-semibold text-primary-foreground shadow-md shadow-jana-primary/20 transition-all hover:bg-jana-primary-hover hover:shadow-jana-primary/40 hover:-translate-y-0.5 active:translate-y-0 sm:px-6 sm:text-sm cursor-pointer"
            >
              Área privada
            </button>
            <Dialog open={privateAccessOpen} onOpenChange={setPrivateAccessOpen}>
              <DialogContent className="glass-panel sm:max-w-md text-foreground">
                <DialogHeader>
                  <DialogTitle>Acceso Credenciales .env.local</DialogTitle>
                  <DialogDescription>
                    Acceso interno para alumnado, profesorado y equipo de gestión.
                  </DialogDescription>
                </DialogHeader>
                <LoginForm
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  login={login}
                  handleLogin={handleLogin}
                  quickLogin={quickLogin}
                  selectMockUser={selectMockUser}
                  demoProfiles={demoProfiles}
                />
              </DialogContent>
            </Dialog>

            {/* PUBLIC NEWS ARCHIVE DIALOG */}
            <Dialog open={isNewsArchiveOpen} onOpenChange={(open) => {
              setIsNewsArchiveOpen(open);
              if (!open) {
                setSelectedNewsArticle(null);
                setNewsSearchQuery("");
                setNewsSelectedSede("todas");
                setNewsSelectedTopic("todos");
              }
            }}>
              <DialogContent className="glass-panel sm:max-w-4xl text-foreground max-h-[85vh] overflow-y-auto p-0 flex flex-col rounded-2xl border border-border">
                {selectedNewsArticle ? (
                  <div className="flex flex-col h-full">
                    {/* Header Image/Banner Area */}
                    <div className="relative p-6 md:p-8 bg-gradient-to-r from-jana-primary/20 via-surface-elevated/40 to-brain/20 border-b border-border">
                      <button
                        onClick={() => setSelectedNewsArticle(null)}
                        className="flex items-center gap-2 text-xs font-bold text-jana-primary-accessible hover:underline mb-4 cursor-pointer"
                      >
                        <ArrowLeft className="size-3" />
                        Volver al archivo de noticias
                      </button>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="rounded-md border border-jana-primary/25 bg-jana-primary/10 px-2 py-0.5 text-[9px] font-black text-jana-primary-accessible">
                          {selectedNewsArticle.topic}
                        </span>
                        <span className="rounded-md border border-brain/20 bg-brain/10 px-2 py-0.5 text-[9px] font-semibold text-brain">
                          {selectedNewsArticle.readingMinutes} min lectura
                        </span>
                        <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-[9px] font-semibold text-foreground-muted">
                          Sede: {selectedNewsArticle.sede}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black font-heading leading-tight tracking-tight text-foreground">
                        {selectedNewsArticle.title}
                      </h2>
                      <div className="mt-4 flex items-center gap-3 text-xs text-foreground-muted">
                        <div className="size-8 rounded-full bg-surface-elevated flex items-center justify-center font-bold text-xs text-jana-primary-accessible">
                          {selectedNewsArticle.author.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-bold text-foreground leading-none">{selectedNewsArticle.author}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{selectedNewsArticle.authorRole}</p>
                        </div>
                        {selectedNewsArticle.publishedAt && (
                          <span className="ml-auto text-[10px] text-muted-foreground">
                            Publicado el {selectedNewsArticle.publishedAt}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Article Body */}
                    <div className="p-6 md:p-8 space-y-6">
                      <p className="text-base font-semibold leading-relaxed text-foreground border-l-2 border-jana-primary pl-4 italic">
                        {selectedNewsArticle.excerpt}
                      </p>
                      
                      <div className="text-sm leading-relaxed text-foreground-muted space-y-4 whitespace-pre-wrap">
                        {selectedNewsArticle.body}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-border bg-surface-elevated/40">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-black font-heading flex items-center gap-2">
                            <Newspaper className="size-5 text-jana-primary" />
                            Comunidad JANA &gt; Noticias
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Archivo completo de guías pedagógicas, artículos y novedades de artes escénicas.
                          </p>
                        </div>
                      </div>

                      {/* Filter Controls */}
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Buscar en noticias..."
                            value={newsSearchQuery}
                            onChange={(e) => setNewsSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-foreground-muted outline-none focus:border-jana-primary transition h-9"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase shrink-0">Sede:</span>
                          <select
                            value={newsSelectedSede}
                            onChange={(e) => setNewsSelectedSede(e.target.value)}
                            className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-jana-primary transition h-9 cursor-pointer"
                          >
                            {newsSedes.map(sede => (
                              <option key={sede} value={sede} className="bg-surface-elevated text-foreground capitalize">
                                {sede === "todas" ? "Todas las Sedes / Impactos" : sede}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase shrink-0">Tema:</span>
                          <select
                            value={newsSelectedTopic}
                            onChange={(e) => setNewsSelectedTopic(e.target.value)}
                            className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-jana-primary transition h-9 cursor-pointer"
                          >
                            {newsTopics.map(topic => (
                              <option key={topic} value={topic} className="bg-surface-elevated text-foreground capitalize">
                                {topic === "todos" ? "Todos los Temas" : topic}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Results Grid */}
                    <div className="p-6 overflow-y-auto max-h-[50vh]">
                      {filteredArchiveArticles.length === 0 ? (
                        <div className="py-12 text-center space-y-2">
                          <AlertTriangle className="size-8 text-warning mx-auto animate-bounce" />
                          <p className="text-sm font-bold text-foreground">No se encontraron artículos</p>
                          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                            Prueba ajustando los términos de búsqueda o los filtros de sede y tema.
                          </p>
                        </div>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {filteredArchiveArticles.map((article) => (
                            <div
                              key={article.id}
                              className="group flex flex-col rounded-xl border border-border bg-surface/60 p-4 transition hover:border-jana-primary/40 hover:bg-surface-elevated/40"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="rounded-md border border-brain/20 bg-brain/10 px-2 py-0.5 text-[9px] font-bold text-brain">
                                  {article.readingMinutes} min lectura
                                </span>
                                <span className="rounded-md border border-border bg-background/50 px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                                  {article.sede}
                                </span>
                              </div>
                              <h3 className="mt-3 text-sm font-black leading-snug text-foreground group-hover:text-jana-primary-accessible transition">
                                {article.title}
                              </h3>
                              <p className="mt-2 text-xs leading-relaxed text-foreground-muted line-clamp-3 flex-1">
                                {article.excerpt}
                              </p>
                              <div className="mt-4 pt-3 border-t border-border/60 flex flex-col gap-2">
                                <div>
                                  <p className="text-[10px] font-bold text-foreground leading-none">{article.author}</p>
                                  <p className="text-[9px] text-muted-foreground mt-0.5">{article.authorRole}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setSelectedNewsArticle(article)}
                                  className="w-full text-center py-1.5 rounded-lg border border-border bg-black/15 text-[10px] font-semibold text-jana-primary-accessible hover:bg-jana-primary/10 transition cursor-pointer"
                                >
                                  Leer recurso completo
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* MOBILE NAVIGATION MENU TRIGGER */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex size-11 items-center justify-center rounded-xl border border-border bg-surface hover:bg-accent/30 transition cursor-pointer"
              aria-label="Abrir navegación móvil"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        {/* MOBILE MENU PANEL */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 border-t border-border pt-4 space-y-5">
            <nav className="space-y-5">
              {landingView === "mexico" && (
                <div className="px-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLandingView("global");
                      setActiveSede("Madrid Sede Central");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2.5 rounded-xl border border-border bg-surface text-xs font-bold text-foreground hover:bg-accent/35 transition flex items-center justify-center gap-2"
                  >
                    <SpainFlag /> Volver a España
                  </button>
                </div>
              )}
              {Object.entries(megaMenu).map(([category, items]) => (
                <div key={category} className="space-y-2.5">
                  <p className="text-xs font-bold text-jana-primary-accessible uppercase px-2">{category}</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {items.map((item) => {
                      if (item === "Nuestras Sedes") {
                        return (
                          <div key={item} className="col-span-1 sm:col-span-2 space-y-1.5 p-2 bg-surface/30 rounded-xl border border-border/40">
                            <p className="text-[10px] font-bold text-jana-primary-accessible uppercase tracking-wider px-1">
                              Nuestras Sedes
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2 border-l border-border/60">
                              {[
                                { label: "Madrid Sede Central", flag: <SpainFlag />, view: "global" as const, sede: "Madrid Sede Central" },
                                { label: "Alcalá de Henares", flag: <SpainFlag />, view: "global" as const, sede: "Alcalá de Henares" },
                                { label: "Majadahonda", flag: <SpainFlag />, view: "global" as const, sede: "Majadahonda" },
                                { label: "México (CDMX)", flag: <MexicoFlag />, view: "mexico" as const, sede: "México (CDMX)" },
                              ].map((sedeOpt) => (
                                <a
                                  key={sedeOpt.label}
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setLandingView(sedeOpt.view);
                                    setActiveSede(sedeOpt.sede);
                                    setMobileMenuOpen(false);
                                  }}
                                  className="flex items-center gap-2 rounded-lg bg-surface/50 px-2 py-2 text-xs text-foreground-muted hover:text-foreground hover:bg-accent/30 transition"
                                >
                                  {sedeOpt.flag}
                                  <span>{sedeOpt.label}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <a
                          key={item}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (item === "Noticias JANA") {
                              setIsNewsArchiveOpen(true);
                              setMobileMenuOpen(false);
                            }
                          }}
                          className="block rounded-xl border border-border/50 bg-surface/50 px-3 py-2.5 text-xs text-foreground-muted hover:text-foreground hover:bg-accent/30"
                        >
                          {item}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Área 1: HERO SECTION */}
      <section className="relative flex-1 py-16 md:py-24" id="main-content">
        {/* Área 1: Floating orbs — animated ambient background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="orb-a absolute top-[-80px] left-[10%] h-[500px] w-[500px] rounded-full bg-jana-primary/10 blur-[140px]" />
          <div className="orb-b absolute top-[120px] right-[5%] h-[420px] w-[420px] rounded-full bg-brain/8 blur-[160px]" />
          <div className="orb-c absolute bottom-[-60px] left-[40%] h-[350px] w-[350px] rounded-full bg-talent/6 blur-[120px]" />
        </div>

        <div className={cn(contentShell, "grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]")}>
          <div className="space-y-8">
            {/* Área 1: Staggered sede badges */}
            <div className="flex flex-wrap gap-2">
              {content[landingView].heroSedes.map((sede, i) => (
                <motion.span
                  key={sede}
                  custom={i}
                  variants={heroBadgeVariants}
                  initial="hidden"
                  animate="show"
                  className="inline-flex items-center gap-1.5 rounded-full border border-jana-primary/35 bg-jana-primary/10 px-3.5 py-1.5 text-[11px] font-black text-jana-primary-accessible shadow-[0_0_20px_rgba(236,105,12,0.12)] backdrop-blur-md"
                >
                  <span className="size-1.5 rounded-full bg-jana-primary animate-pulse" />
                  {sede}
                </motion.span>
              ))}
            </div>

            <div className="space-y-6">
              {/* Área 1+3: Word-by-word H1 reveal with color split */}
              <h1 className="text-fluid-hero font-heading font-black text-display" style={{ perspective: "600px" }}>
                {heroWords.slice(0, midPoint).map((word, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={heroWordVariants}
                    initial="hidden"
                    animate="show"
                    className="mr-[0.22em] inline-block will-change-transform"
                  >
                    {word}
                  </motion.span>
                ))}
                {heroWords.slice(midPoint).map((word, i) => (
                  <motion.span
                    key={i + midPoint}
                    custom={i + midPoint}
                    variants={heroWordVariants}
                    initial="hidden"
                    animate="show"
                    className="mr-[0.22em] inline-block text-jana-primary-accessible will-change-transform"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <motion.p
                className="max-w-2xl text-base leading-relaxed text-foreground-muted md:text-lg"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.74 }}
              >
                {content[landingView].heroDesc}
              </motion.p>
            </div>

            {/* Área 5+7: CTAs with shimmer button */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.9 }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.035, y: -2 }} whileTap={{ scale: 0.985 }} transition={{ type: "spring", stiffness: 420, damping: 18 }}>
                    <Button className="btn-shimmer h-13 px-8 bg-jana-primary hover:bg-jana-primary-hover text-white text-sm font-bold rounded-xl shadow-lg shadow-jana-primary/25 transition-all hover:shadow-jana-primary/40 cursor-pointer">
                      {content[landingView].heroCta}
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="glass-panel sm:max-w-md text-foreground">
                  <DialogHeader>
                    <DialogTitle>
                      {landingView === "mexico" ? "Reserva de clase muestra sin costo" : "Reserva de clase de prueba"}
                    </DialogTitle>
                    <DialogDescription>
                      En esta demo usamos el acceso interno para simular la experiencia por rol.
                    </DialogDescription>
                  </DialogHeader>
                  <LoginForm
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    login={login}
                    handleLogin={handleLogin}
                    quickLogin={quickLogin}
                    selectMockUser={selectMockUser}
                    demoProfiles={demoProfiles}
                  />
                </DialogContent>
              </Dialog>

              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.99 }} transition={{ type: "spring", stiffness: 380, damping: 20 }}>
                <Button variant="outline" className="h-13 px-8 border-border text-foreground hover:bg-accent/40 text-sm font-semibold rounded-xl transition-all cursor-pointer">
                  {content[landingView].heroSecCta}
                </Button>
              </motion.div>
            </motion.div>

            {/* Área 1: Animated stat counters */}
            <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-6 sm:grid-cols-4">
              {content[landingView].stats.map((stat, i) => (
                <AnimatedStat key={stat.label} stat={stat} index={i} />
              ))}
            </div>
          </div>

          <motion.div
            className="grid gap-4 sm:grid-cols-[1fr_0.72fr]"
            initial={{ opacity: 0, x: 34, scale: 0.985 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 170, damping: 24, delay: 0.45 }}
          >
            <motion.div
              className="relative min-h-[460px] overflow-hidden rounded-3xl border border-border bg-black/30 shadow-2xl"
              whileHover={{ y: -6, rotate: -0.35 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
            >
              <Image
                src="/escuela_canto.png"
                alt={landingView === "mexico" ? "Alumnos de JANA México en clase de canto" : "Alumnos de Escuela JANA durante una clase de canto"}
                fill
                priority
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover hero-cinematic"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-jana-primary">
                  {landingView === "mexico" ? "Escuela JANA México" : "Escuela JANA"}
                </p>
                <p className="mt-1 text-xl font-black text-white">
                  {landingView === "mexico" ? "Técnica, confianza y presencia escénica en CDMX" : "Técnica, confianza y presencia escénica"}
                </p>
              </div>
            </motion.div>
            <div className="grid gap-4">
              <motion.div
                className="relative min-h-[220px] overflow-hidden rounded-2xl border border-border bg-black/30"
                whileHover={{ y: -4, rotate: 0.45 }}
                transition={{ type: "spring", stiffness: 240, damping: 22 }}
              >
                <Image
                  src="/production_la_bella.png"
                  alt={landingView === "mexico" ? "Producción de musical de JANA en México" : "Producción musical de JANA sobre el escenario"}
                  fill
                  sizes="(min-width: 1024px) 24vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/76 to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-sm font-black text-white">
                  {landingView === "mexico" ? "JANA Producciones México" : "JANA Producciones"}
                </p>
              </motion.div>
              <motion.div
                className="rounded-2xl border border-jana-primary/25 bg-jana-primary/10 p-5"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-jana-primary-accessible">
                  {content[landingView].nextStepBadge}
                </p>
                <p className="mt-3 text-2xl font-black leading-tight">
                  {content[landingView].nextStepTitle}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GRID DE SERVICIOS — Área 4: scroll reveal */}
      <section className={cn(contentShell, "py-16 space-y-12")}>
        <div className="reveal-on-scroll text-center space-y-2">
          <h2 className="text-fluid-h2 font-bold font-heading">{content[landingView].studyTitle}</h2>
          <p className="text-sm text-foreground-muted max-w-xl mx-auto">
            {content[landingView].studyDesc}
          </p>
        </div>

        <div className="reveal-on-scroll grid gap-4 md:grid-cols-3 xl:grid-cols-6 reveal-stagger">
          {content[landingView].studyPrograms.map(([title, detail]) => (
            <div key={title} className="card-premium p-5 group cursor-default">
              <h3 className="text-sm font-black text-foreground group-hover:text-jana-primary-accessible transition-colors">{title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-foreground-muted">{detail}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Card JANA Producciones */}
          <a
            href="#producciones"
            onClick={(e) => e.preventDefault()}
            className="group block overflow-hidden rounded-2xl border border-border bg-surface/50 shadow-md transition hover:border-jana-primary/50"
          >
            <div className="relative overflow-hidden h-64 bg-black/40">
              <Image
                src="/production_la_bella.png"
                alt="JANA Producciones"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover group-hover:scale-102 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="text-[9px] bg-jana-primary text-white font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                  Producciones
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white mt-1">
                  {landingView === "mexico" ? "Musicales y Espectáculos de Clase Mundial" : "Giras y Musicales Nacionales"}
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-2 text-left">
              <p className="text-xs text-foreground-muted leading-relaxed">
                {landingView === "mexico" 
                  ? "Desde grandes clásicos del teatro musical hasta puestas en escena contemporáneas adaptadas para el público mexicano."
                  : "Desde grandes producciones musicales de Broadway en España hasta obras teatrales galardonadas a nivel nacional."}
              </p>
              <span className="text-xs text-jana-primary-accessible font-bold group-hover:underline flex items-center gap-1">
                Conoce las producciones en cartelera →
              </span>
            </div>
          </a>

          {/* Card Escuela JANA */}
          <a
            href="#escuela"
            onClick={(e) => e.preventDefault()}
            className="group block overflow-hidden rounded-2xl border border-border bg-surface/50 shadow-md transition hover:border-jana-primary/50"
          >
            <div className="relative overflow-hidden h-64 bg-black/40">
              <Image
                src="/escuela_canto.png"
                alt="Escuela JANA"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover group-hover:scale-102 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="text-[9px] bg-talent text-white font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                  Escuela JANA
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white mt-1">
                  {landingView === "mexico" ? "Formación Escénica Integral CDMX" : "Formación Artística"}
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-2 text-left">
              <p className="text-xs text-foreground-muted leading-relaxed">
                {landingView === "mexico"
                  ? "Escuela líder especializada en Canto, Danza, Actuación y Teatro Musical para todas las edades."
                  : "Escuela líder especializada en Canto, Danza, Interpretación y Música para niños, jóvenes y adultos."}
              </p>
              <span className="text-xs text-talent font-bold group-hover:underline flex items-center gap-1">
                Descubre nuestros planes formativos →
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* WHY JANA SECTION — Área 4+2 */}
      <section className={cn(contentShell, "py-16")}>
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="reveal-on-scroll space-y-3">
            <p className="label-metric text-jana-primary-accessible">
              {landingView === "mexico" ? "Por qué JANA México" : "Por qué JANA"}
            </p>
            <h2 className="text-fluid-h2 font-heading font-black leading-tight">
              {content[landingView].whyTitle}
            </h2>
            <p className="text-sm leading-relaxed text-foreground-muted">
              {content[landingView].whyDesc}
            </p>
          </div>

          <div className="reveal-on-scroll grid gap-3 sm:grid-cols-2 lg:grid-cols-3 reveal-stagger">
            {content[landingView].whyPoints.map(([title, detail]) => (
              <div key={title} className="card-premium p-5 group cursor-default">
                <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-jana-primary/10">
                  <span className="size-2 rounded-full bg-jana-primary-accessible" />
                </div>
                <h3 className="text-sm font-black text-foreground group-hover:text-jana-primary-accessible transition-colors">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-foreground-muted">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG / NEWSROOM SECTION */}
      <section className="border-y border-border bg-surface/45 px-4 py-16 md:px-8">
        <div className="mx-auto grid w-full gap-8 lg:w-[75vw] lg:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-5">
            <span className="inline-flex rounded-md border border-jana-primary/30 bg-jana-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-jana-primary-accessible">
              {landingView === "mexico" ? "Blog y recursos CDMX" : "Blog y noticias"}
            </span>
            <div className="space-y-3">
              <h2 className="font-heading text-3xl font-black leading-tight md:text-4xl">
                {content[landingView].blogTitle}
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-foreground-muted">
                {content[landingView].blogDesc}
              </p>
            </div>
            <div className="grid max-w-md grid-cols-3 gap-2 text-center text-xs">
              {content[landingView].blogTopics.map(([label, detail]) => (
                <div key={label} className="rounded-lg border border-border bg-black/15 p-3">
                  <p className="font-mono text-lg font-black text-jana-primary-accessible">{label}</p>
                  <p className="text-[10px] leading-tight text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {publicArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => {
                  setSelectedNewsArticle(article);
                  setIsNewsArchiveOpen(true);
                }}
                className="flex min-h-[280px] flex-col rounded-xl border border-border bg-surface p-5 transition hover:border-jana-primary/40 hover:bg-surface-elevated/70 cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md border border-brain/25 bg-brain/10 px-2 py-1 text-[10px] font-bold text-brain">
                    {article.readingMinutes} min
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground">{article.sede}</span>
                </div>
                <h3 className="mt-4 text-base font-black leading-tight text-foreground group-hover:text-jana-primary-accessible transition">{article.title}</h3>
                <p className="mt-3 flex-1 text-xs leading-relaxed text-foreground-muted">{article.excerpt}</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-xs font-bold text-foreground">{article.author}</p>
                  <p className="text-[10px] text-muted-foreground">{article.authorRole}</p>
                  <span className="mt-3 inline-flex rounded-md border border-border bg-black/15 px-2 py-1 text-[10px] font-semibold text-jana-primary-accessible group-hover:bg-jana-primary/10">
                    Leer recurso
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SEDES — Área 4+2: scroll reveal + card-premium */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto w-full space-y-8 lg:w-[75vw]">
          <div className="reveal-on-scroll grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div className="space-y-3">
              <p className="label-metric text-jana-primary-accessible">
                {landingView === "mexico" ? "Encuentra tu campus" : "Encuentra tu camino"}
              </p>
              <h2 className="text-fluid-h2 font-heading font-black leading-tight">
                {content[landingView].pathTitle}
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-foreground-muted">
              {content[landingView].pathDesc}
            </p>
          </div>

          <div className="reveal-on-scroll grid gap-4 md:grid-cols-3 reveal-stagger">
            {content[landingView].pathCards.map((item) => (
              <div key={item.title} className="card-premium card-kpi-glow p-5 cursor-default">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-black text-foreground">{item.title}</h3>
                  <span className="rounded-full border border-jana-primary/25 bg-jana-primary/10 px-2.5 py-1 text-[10px] font-bold text-jana-primary-accessible">
                    {item.metric}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-foreground-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF — Área 4+7: auto-carousel testimonials */}
      <section className={cn(contentShell, "py-20")}>
        <div className="reveal-on-scroll text-center space-y-2 mb-12">
          <p className="label-metric text-foreground-muted">
            {landingView === "mexico" ? "Comunidad JANA México" : "Comunidad JANA"}
          </p>
          <h2 className="text-fluid-h2 font-black font-heading">{content[landingView].testimonialTitle}</h2>
        </div>

        {/* Testimonial Carousel */}
        <div className="reveal-on-scroll relative mb-16">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${testimonialIdx * 100}%)` }}
            >
              {content[landingView].testimonials.map((t) => (
                <div key={t.name} className="w-full flex-shrink-0 px-2">
                  <div className={`card-premium ${t.border} p-8 space-y-5 flex flex-col max-w-2xl mx-auto`}>
                    {/* Stars */}
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="size-4 text-production" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-base text-foreground leading-relaxed flex-1 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className={`size-11 rounded-full bg-surface-elevated flex items-center justify-center text-sm font-black ${t.color} border-2 ${t.border}`}>
                        {t.initial}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{t.name}</p>
                        <p className="text-xs text-foreground-muted">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prevTestimonial}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-surface/70 text-foreground-muted hover:text-foreground hover:bg-accent/40 transition"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="size-4" />
            </button>
            {content[landingView].testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className={cn(
                  "size-2 rounded-full transition-all duration-300",
                  i === testimonialIdx
                    ? "bg-jana-primary w-5"
                    : "bg-border hover:bg-foreground-muted"
                )}
                aria-label={`Testimonio ${i + 1}`}
              />
            ))}
            <button
              onClick={nextTestimonial}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-surface/70 text-foreground-muted hover:text-foreground hover:bg-accent/40 transition"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* CTA BLOCK — Área 1+5+7 */}
        <div className="reveal-on-scroll relative overflow-hidden rounded-3xl border border-jana-primary/30 bg-gradient-to-br from-jana-primary/10 via-surface to-brain/10 p-10 md:p-14 text-center space-y-6">
          {/* Animated glow orbs */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="orb-a absolute top-[-40px] left-[20%] h-48 w-48 rounded-full bg-jana-primary/20 blur-[60px]" />
            <div className="orb-b absolute bottom-[-20px] right-[15%] h-40 w-40 rounded-full bg-brain/15 blur-[50px]" />
          </div>

          <div className="space-y-3">
            <span className="inline-block rounded-full border border-jana-primary/40 bg-jana-primary/10 px-4 py-1.5 label-metric text-jana-primary-accessible">
              {content[landingView].ctaBadge}
            </span>
            <h2 className="text-fluid-h2 font-black font-heading">
              {content[landingView].ctaTitle}
            </h2>
            <p className="text-foreground-muted text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              {content[landingView].ctaDesc}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-shimmer h-13 px-10 bg-jana-primary hover:bg-jana-primary-hover text-white text-sm font-bold rounded-xl shadow-lg shadow-jana-primary/30 hover:shadow-jana-primary/50 transition-all hover:-translate-y-0.5 cursor-pointer">
                  {content[landingView].ctaButton}
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-panel sm:max-w-md text-foreground">
                <DialogHeader>
                  <DialogTitle>
                    {landingView === "mexico" ? "Solicitud de clase muestra gratis" : "Solicitud de clase de prueba"}
                  </DialogTitle>
                  <DialogDescription>
                    En esta demo usamos el acceso interno para enseñar la experiencia completa por rol.
                  </DialogDescription>
                </DialogHeader>
                <LoginForm
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  login={login}
                  handleLogin={handleLogin}
                  quickLogin={quickLogin}
                  selectMockUser={selectMockUser}
                  demoProfiles={demoProfiles}
                />
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="h-13 px-8 border-border text-foreground hover:bg-accent/40 text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer">
              {content[landingView].ctaSecButton}
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {content[landingView].ctaBadges.map(b => (
              <span key={b} className="flex items-center gap-1.5 rounded-full border border-border bg-surface/50 px-3 py-1 text-[11px] font-semibold text-foreground-muted">
                <span className="size-1.5 rounded-full bg-success" />{b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ADMISSIONS JOURNEY — Área 4+2 */}
      <section className={cn(contentShell, "py-16 space-y-10")}>
        <div className="reveal-on-scroll text-center space-y-3">
          <span className="inline-block rounded-full border border-brain/40 bg-brain/10 px-4 py-1.5 label-metric text-brain">
            {landingView === "mexico" ? "Proceso CDMX" : "Cómo empezar"}
          </span>
          <h2 className="text-fluid-h2 font-black font-heading">
            {content[landingView].stepsTitle}
          </h2>
          <p className="text-sm text-foreground-muted max-w-xl mx-auto">
            {content[landingView].stepsDesc}
          </p>
        </div>

        <div className="reveal-on-scroll grid gap-4 md:grid-cols-4 reveal-stagger">
          {content[landingView].steps.map((item) => (
            <div key={item.step} className="card-premium card-kpi-glow p-5 relative overflow-hidden cursor-default">
              {/* Step number watermark */}
              <span className="absolute -right-2 -top-3 font-black text-[4rem] text-jana-primary/5 leading-none select-none pointer-events-none">
                {item.step}
              </span>
              <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-jana-primary/12 font-mono text-sm font-black text-jana-primary-accessible border border-jana-primary/20">
                {item.step}
              </div>
              <h3 className="text-sm font-black text-foreground">{item.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-foreground-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PUBLIC FOOTER */}
      <footer className="border-t border-border bg-[#07090b] px-4 py-14 md:px-8">
        <div className="mx-auto w-full space-y-10 lg:w-[75vw]">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1.35fr] lg:items-start">
            <div className="space-y-6">
              <JanaLogo className="h-12 w-auto" />
              <div className="space-y-3">
                <h2 className="max-w-lg font-heading text-2xl font-black leading-tight text-foreground md:text-3xl">
                  {landingView === "mexico" ? "Formación escénica, comunidad artística y castings reales en México." : "Formación escénica, comunidad artística y producciones vivas."}
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-foreground-muted">
                  {content[landingView].footerDesc}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-jana-primary-accessible">
                {content[landingView].footerSedes.map((sede) => (
                  <span key={sede} className="rounded-full border border-jana-primary/25 bg-jana-primary/10 px-3 py-1">
                    {sede}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Formación", "Cursos anuales", "Nuestras sedes", "Campamentos", "Inscripción online"],
                ["Producciones", "Musicales", "Microconciertos", "Entradas", "Giras"],
                ["Contacto", "Clase de prueba", "Profesorado", "Noticias JANA", "Legal"],
              ].map(([title, ...links]) => (
                <div key={title} className="rounded-2xl border border-border bg-surface/45 p-5">
                  <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-foreground">{title}</p>
                  <nav className="space-y-3 text-xs" aria-label={title}>
                    {links.map((link) => {
                      if (link === "Nuestras sedes") {
                        return (
                          <div key={link} className="space-y-1.5 pt-0.5">
                            <span className="block text-foreground font-semibold text-[11px] uppercase tracking-wider">Nuestras sedes</span>
                            <div className="pl-2 border-l border-border/60 space-y-1.5">
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setLandingView("global");
                                  setActiveSede("Madrid Sede Central");
                                }}
                                className="flex items-center gap-2 text-foreground-muted hover:text-jana-primary-accessible transition text-[11px]"
                              >
                                <SpainFlag />
                                <span>España (Sedes Madrid)</span>
                              </a>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setLandingView("mexico");
                                  setActiveSede("México (CDMX)");
                                }}
                                className="flex items-center gap-2 text-foreground-muted hover:text-jana-primary-accessible transition text-[11px]"
                              >
                                <MexicoFlag />
                                <span>México (CDMX)</span>
                              </a>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <a
                          key={link}
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();
                            if (link === "Noticias JANA") {
                              setIsNewsArchiveOpen(true);
                            }
                          }}
                          className="block text-foreground-muted transition hover:text-jana-primary-accessible"
                        >
                          {link}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-jana-primary/25 bg-jana-primary/10 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black text-foreground">{content[landingView].footerBottomCta}</p>
                <p className="mt-1 text-xs leading-relaxed text-foreground-muted">
                  {content[landingView].footerBottomSub}
                </p>
              </div>
              <Button className="h-11 rounded-xl bg-jana-primary px-6 font-semibold text-primary-foreground hover:bg-jana-primary-hover">
                {content[landingView].footerBottomBtn}
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex flex-col gap-3 text-[11px] text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 JANA Producciones &amp; Escuela JANA. Todos los derechos reservados.</p>
              <p>
                Desarrollado por{" "}
                <a
                  href="https://iamancha.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-foreground transition hover:text-jana-primary-accessible"
                >
                  iamancha.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
