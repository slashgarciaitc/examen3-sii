"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pedir } from "@/lib/pedir";
import { campo, boton, etiqueta } from "@/lib/estilos";
import PantallaAcceso from "@/components/PantallaAcceso";

export default function AdminLoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setError("");
    if (!usuario.trim() || !password) {
      setError("Escribe usuario y contraseña");
      return;
    }
    setCargando(true);
    const { ok, datos } = await pedir("/api/admin/login", { method: "POST", body: { usuario, password } });
    if (!ok) {
      setError(datos.error);
      setCargando(false);
      return;
    }
    router.replace("/admin");
  }

  return (
    <PantallaAcceso
      lema="Administración de tutorías."
      detalle="Revisa a los alumnos que se ofrecen como asesores y da seguimiento a las solicitudes."
    >
      <form onSubmit={entrar} className="w-full max-w-sm" noValidate>
        <h1 className="font-display text-3xl font-bold">Entra al panel</h1>
        <p className="mt-2 text-gris">Usa tu usuario y contraseña de administrador.</p>

        <div className="mt-8 space-y-5">
          <div>
            <label className={etiqueta} htmlFor="usuario">
              Usuario
            </label>
            <input
              id="usuario"
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
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
