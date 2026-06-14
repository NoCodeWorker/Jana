"use client";

import { FormEvent } from "react";
import { JanaLogo } from "@/components/jana-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { JanaRole } from "@/lib/jana-auth";

type DemoProfile = {
  role: string;
  label: string;
  user: string;
  tone: string;
};

type LoginState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
};

export function BrandBlock() {
  return (
    <div className="flex items-center justify-start py-1">
      <JanaLogo className="h-9 w-auto" />
    </div>
  );
}

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  login,
  handleLogin,
  quickLogin,
  selectMockUser,
  demoProfiles,
}: {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  login: LoginState;
  handleLogin: (event: FormEvent<HTMLFormElement>) => void;
  quickLogin: (role: JanaRole, userEmail: string) => void;
  selectMockUser: (role: JanaRole, userEmail: string) => void;
  demoProfiles: DemoProfile[];
}) {
  return (
    <form className="space-y-5 text-left" onSubmit={handleLogin}>
      <Button
        type="button"
        className="h-12 w-full rounded-xl bg-jana-primary hover:bg-jana-primary-hover font-semibold"
        disabled={login.status === "loading"}
        onClick={() => quickLogin("direccion", "direccion@jana.os")}
      >
        Entrar como Dirección
      </Button>

      <div className="relative flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">o usar credenciales</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-2.5">
        <label className="text-sm font-medium" htmlFor="login-email">
          Usuario
        </label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 rounded-xl"
        />
      </div>
      <div className="space-y-2.5">
        <label className="text-sm font-medium" htmlFor="login-password">
          Contraseña
        </label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 rounded-xl"
        />
      </div>
      <Button type="submit" variant="outline" className="h-12 w-full rounded-xl border-border font-semibold hover:bg-accent/40" disabled={login.status === "loading"}>
        {login.status === "loading" ? "Validando..." : "Iniciar Sesión"}
      </Button>
      <p
        className={cn(
          "rounded-xl border px-4 py-3 text-sm transition-all",
          login.status === "success" && "border-success/50 text-success bg-success/10",
          login.status === "error" && "border-error/50 text-error bg-error/10",
          login.status !== "success" &&
            login.status !== "error" &&
            "border-border text-muted-foreground"
        )}
        role="status"
      >
        {login.message}
      </p>

      <div className="border-t border-border pt-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3">Perfiles de demo</p>
        <div className="grid grid-cols-2 gap-2.5">
          {demoProfiles.map((profile) => (
            <button
              key={profile.role}
              type="button"
              onClick={() => selectMockUser(profile.role as JanaRole, profile.user)}
              className="text-left text-xs p-3 rounded-xl border border-border hover:border-jana-primary bg-surface/50 cursor-pointer transition"
            >
              <span className="font-semibold block">{profile.label}</span>
              <span className="text-muted-foreground block text-[10px] truncate">{profile.user}</span>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
