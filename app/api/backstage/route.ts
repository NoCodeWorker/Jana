import { NextResponse } from "next/server";

const backstageSystems = [
  {
    id: "brain",
    name: "Backstage Brain",
    status: "thinking",
    health: "Operativo",
    signal: "12 decisiones asistidas pendientes de revision.",
  },
  {
    id: "talent",
    name: "Backstage Talent Graph",
    status: "complete",
    health: "Sincronizado",
    signal: "84 perfiles con progresion actualizada.",
  },
  {
    id: "aula",
    name: "Backstage Aula",
    status: "review",
    health: "Atencion",
    signal: "3 grupos requieren confirmacion de asistencia.",
  },
  {
    id: "production",
    name: "Backstage Produccion",
    status: "complete",
    health: "En marcha",
    signal: "Ensayo general preparado para render multimedia.",
  },
];

export async function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    systems: backstageSystems,
  });
}
