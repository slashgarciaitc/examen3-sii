"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { campo, boton, etiqueta } from "@/lib/estilos";
import PantallaAcceso from "@/components/PantallaAcceso";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Escribe tu correo y tu contraseña");
      return;
    }

    setCargando(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const datos = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(datos.error || "No se pudo iniciar sesión");
        setCargando(false);
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("No hay conexión con el servidor");
      setCargando(false);
    }
  }

  return (
    <PantallaAcceso
      lema="Calificaciones, kardex y horario en un solo lugar."
      detalle="Consulta tu información del SII y encuentra compañeros que te asesoren en las materias que se te complican."
    >
      <form onSubmit={entrar} className="w-full max-w-sm" noValidate>
        <h1 className="font-display text-3xl font-bold">Entra con tu cuenta del SII</h1>
        <p className="mt-2 text-gris">Usa tu correo institucional y la contraseña de siempre.</p>

        <div className="mt-8 space-y-5">
          <div>
            <label className={etiqueta} htmlFor="email">
              Correo institucional
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="L00000000@celaya.tecnm.mx"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={campo}
            />
          </div>
          <div>
            <label className={etiqueta} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={campo}
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-5 text-sm text-bajo">
            {error}
          </p>
        )}

        <button type="submit" disabled={cargando} className={`${boton} mt-6 w-full`}>
          {cargando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </PantallaAcceso>
  );
}
