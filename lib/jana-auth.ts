export type JanaRole = "direccion" | "admin" | "profesor" | "alumno";

export type JanaRoleProfile = {
  role: JanaRole;
  label: string;
  emailEnv: string;
  passEnv: string;
  access: string[];
  defaultStage: string;
};

export const roleProfiles: JanaRoleProfile[] = [
  {
    role: "direccion",
    label: "Direccion",
    emailEnv: "AUTH_DIRECCION_USER",
    passEnv: "AUTH_DIRECCION_PASS",
    access: ["Vision global", "Finanzas", "Sedes", "Talent Graph", "Brain"],
    defaultStage: "Backstage Brain",
  },
  {
    role: "admin",
    label: "Administracion",
    emailEnv: "AUTH_ADMIN_USER",
    passEnv: "AUTH_ADMIN_PASS",
    access: ["Backstage Panel", "Matriculas", "Agenda", "Caja", "Reportes"],
    defaultStage: "Backstage Panel",
  },
  {
    role: "profesor",
    label: "Profesorado",
    emailEnv: "AUTH_PROFESOR_USER",
    passEnv: "AUTH_PROFESOR_PASS",
    access: ["Backstage Aula", "Evaluaciones", "Asistencias", "Producciones"],
    defaultStage: "Backstage Aula",
  },
  {
    role: "alumno",
    label: "Alumnado",
    emailEnv: "AUTH_ALUMNO_USER",
    passEnv: "AUTH_ALUMNO_PASS",
    access: ["Mi progreso", "Ensayos", "Mensajes", "Producciones"],
    defaultStage: "Backstage Talent Graph",
  },
];

export function publicRoles() {
  return roleProfiles.map(({ role, label, access, defaultStage }) => ({
    role,
    label,
    access,
    defaultStage,
    user: process.env[roleProfiles.find((profile) => profile.role === role)?.emailEnv ?? ""] ?? "",
  }));
}

export function validateRoleLogin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  return roleProfiles.find((profile) => {
    const expectedEmail = process.env[profile.emailEnv]?.toLowerCase();
    const expectedPassword = process.env[profile.passEnv];

    return expectedEmail === normalizedEmail && expectedPassword === password;
  });
}
