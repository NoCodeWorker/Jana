import { NextResponse } from "next/server";
import { publicRoles, validateRoleLogin } from "@/lib/jana-auth";

export async function GET() {
  return NextResponse.json({
    roles: publicRoles(),
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: unknown; password?: unknown }
    | null;

  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json(
      { ok: false, message: "Credenciales incompletas." },
      { status: 400 }
    );
  }

  const profile = validateRoleLogin(body.email, body.password);

  if (!profile) {
    return NextResponse.json(
      { ok: false, message: "Usuario o contrasena no validos." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    session: {
      role: profile.role,
      label: profile.label,
      defaultStage: profile.defaultStage,
      access: profile.access,
    },
  });
}
